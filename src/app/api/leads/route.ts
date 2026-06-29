import { NextResponse } from 'next/server';
import { appendLead, type LeadUtm } from '@/lib/leads-store';
import { classifyLead } from '@/lib/lead-classifier';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { spamGuard } from '@/lib/spam-guard';
import { sendAutoReply } from '@/lib/leads-mailer';
import { notifyLead, forwardLeadWebhook } from '@/lib/leads-pipeline';

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
  /** Optional UTM attribution captured client-side at first visit. */
  utm?: Partial<LeadUtm>;
  /** Locale of the page where the form was submitted (`en` / `ru` / `he`).
   *  Used to pick the auto-reply template language. */
  locale?: 'en' | 'ru' | 'he';
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

  // Capture UTM + landing attribution from the client body, falling
  // back to the Referer header for landing when the client didn't
  // stash one. All fields are clipped to keep stray bytes out of the
  // store.
  const clientUtm = (body.utm ?? {}) as Partial<LeadUtm>;
  const utm: LeadUtm = {
    source: clip(clientUtm.source, 200) || undefined,
    medium: clip(clientUtm.medium, 200) || undefined,
    campaign: clip(clientUtm.campaign, 200) || undefined,
    term: clip(clientUtm.term, 200) || undefined,
    content: clip(clientUtm.content, 200) || undefined,
    landing: clip(clientUtm.landing, 200) || undefined,
    referrer: clip(req.headers.get('referer'), 200) || undefined,
  };
  const hasUtm = Object.values(utm).some(Boolean);

  const locale: 'en' | 'ru' | 'he' =
    body.locale === 'ru' || body.locale === 'he' ? body.locale : 'en';

  // Best-effort local persistence for dev; safe to fail in serverless.
  // Production: replace with a real sink — DB, CRM, or an email transport
  // configured via env (SMTP/Resend/SendGrid).
  let lead;
  try {
    lead = await appendLead({
      name,
      email,
      phone,
      clinic,
      message,
      classification,
      source: source || undefined,
      utm: hasUtm ? utm : undefined,
    });
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

  // Post-persistence side effects. Each is best-effort: a failure in
  // one never affects the response or the other steps.
  void sendAutoReply({ to: email, name, locale });
  await notifyLead({ lead });
  await forwardLeadWebhook({ lead });

  return NextResponse.json({ ok: true, source: source || undefined });
}
