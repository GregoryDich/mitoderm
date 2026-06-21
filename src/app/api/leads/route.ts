import { NextResponse } from 'next/server';
import { appendLead } from '@/lib/leads-store';
import { classifyLead } from '@/lib/lead-classifier';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { spamGuard } from '@/lib/spam-guard';
import { reportError } from '@/lib/report-error';

interface LeadBody {
  name?: string;
  email?: string;
  phone?: string;
  clinic?: string;
  message?: string;
  /** Honeypot field — must be empty for the body to be accepted. */
  website?: string;
  /** Origin tag, e.g. "contact-form", "bio-spicules-waitlist". The route
   *  whitelists the values it accepts; unknown sources fall back to the
   *  full contact-form validation (name + email + message required). */
  source?: string;
}

/** Sources whose default validation is relaxed (e.g. waitlists where
 *  email alone is enough). Add a new entry here to enable a fresh
 *  waitlist origin without a full route refactor. */
const RELAXED_SOURCES: Record<string, { defaultMessage: string }> = {
  'bio-spicules-waitlist': {
    defaultMessage: 'Notify me when the Bio-Spicules line launches.',
  },
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  // Per-IP rate limit — 5 leads/IP/min. Spam-bots and accidentally-spammy
  // form scripts get a 429; legitimate users won't notice.
  const rl = rateLimited('leads', clientIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', retryInMs: rl.retryInMs },
      { status: 429 }
    );
  }

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Origin check + honeypot. We respond with a generic 200 so bots
  // can't probe which layer caught them, but we still drop the
  // request and never persist or fan out. Real users never trip this.
  const guard = spamGuard(req, body);
  if (!guard.ok) {
    // eslint-disable-next-line no-console
    console.warn('[lead] dropped by spam guard', guard.reason);
    return NextResponse.json({ ok: true });
  }

  const source = clip(body.source, 80);
  const relaxed = source ? RELAXED_SOURCES[source] : undefined;

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const clinic = clip(body.clinic, 160);
  // For waitlist sources we accept an empty message and substitute the
  // default — the visitor opted in by clicking, not by writing copy.
  const message = clip(body.message, 4000) || (relaxed?.defaultMessage ?? '');

  const errors: Record<string, string> = {};
  if (!relaxed && !name) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!emailRe.test(email)) errors.email = 'invalid';
  if (!message) errors.message = 'required';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const classification = classifyLead({ message, clinic, email });

  // Best-effort local persistence for dev; safe to fail in serverless.
  // Production: replace with a real sink — DB, CRM, or an email transport
  // configured via env (SMTP/Resend/SendGrid).
  let lead;
  try {
    lead = await appendLead({ name, email, phone, clinic, message, classification, source: source || undefined });
  } catch {
    // ignore — fall back to a transient record so email + log still fire
    lead = {
      ts: new Date().toISOString(),
      name,
      email,
      phone,
      clinic,
      message,
      classification,
    };
  }
  // Always log so the operator sees the lead in dev/server logs.
  // eslint-disable-next-line no-console
  console.log('[lead]', lead);

  // Optional email delivery via Resend (https://resend.com).
  // Set RESEND_API_KEY + LEADS_TO_EMAIL (and optionally LEADS_FROM_EMAIL)
  // to enable. The lead response never fails because of email errors.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  if (apiKey && to) {
    try {
      const from = process.env.LEADS_FROM_EMAIL || '[email protected]';
      const subject = `New Mitoderm lead — ${name}`;
      const text = [
        `Name:    ${name}`,
        `Email:   ${email}`,
        phone && `Phone:   ${phone}`,
        clinic && `Clinic:  ${clinic}`,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n');
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject,
          text,
        }),
      });
      if (!res.ok) {
        reportError(new Error(`resend HTTP ${res.status}`), {
          where: 'leads.email',
          meta: { status: res.status },
        });
      }
    } catch (err) {
      reportError(err, { where: 'leads.email' });
    }
  }

  // Optional CRM webhook fan-out. Set LEADS_WEBHOOK_URL to forward
  // every successful lead (HubSpot, Pipedrive, Make, n8n, Zapier — any
  // endpoint that accepts JSON). Failures are logged and swallowed so
  // a downstream outage never blocks lead capture. Optionally signs
  // the body with HMAC-SHA256 when LEADS_WEBHOOK_SECRET is set.
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const payload = JSON.stringify({
        source: 'exoskin.co.il',
        receivedAt: new Date().toISOString(),
        lead,
      });
      const headers: Record<string, string> = {
        'content-type': 'application/json',
      };
      const secret = process.env.LEADS_WEBHOOK_SECRET;
      if (secret) {
        const { createHmac } = await import('node:crypto');
        const sig = createHmac('sha256', secret).update(payload).digest('hex');
        headers['x-mitoderm-signature'] = `sha256=${sig}`;
      }
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: payload,
      });
      if (!res.ok) {
        reportError(new Error(`webhook HTTP ${res.status}`), {
          where: 'leads.webhook',
          meta: { status: res.status },
        });
      }
    } catch (err) {
      reportError(err, { where: 'leads.webhook' });
    }
  }

  return NextResponse.json({ ok: true, source: source || undefined });
}
