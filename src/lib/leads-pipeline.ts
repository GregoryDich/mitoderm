import { reportError } from './report-error';

/** Side-effect pipeline that runs after a lead is appended to the
 *  store. Each step is independent and best-effort: a failure in one
 *  never blocks the others or the API response.
 *
 *  Split out of `/api/leads/route.ts` so:
 *  - each step can be unit-tested in isolation
 *  - new sinks (HubSpot, Klaviyo, Slack…) get added here, not in the
 *    route handler that's already busy with parsing + validation
 *  - the route's POST stays under one screen.
 */

/** Minimal lead shape the pipeline operates on. Both the full Lead
 *  record and the route's transient fallback satisfy it; extra keys
 *  are ignored. The optional fields are listed so callers passing the
 *  full Lead type don't trip excess-property checks. */
export interface PipelineLead {
  name: string;
  email: string;
  phone: string;
  clinic: string;
  message: string;
  source?: string;
  ts?: string;
  id?: string;
  status?: string;
  utm?: unknown;
  classification?: unknown;
}

interface NotifyInput {
  lead: PipelineLead;
}

/** Internal team notification via Resend. Returns silently when the
 *  required env vars are not set — both dev and unconfigured prod stay
 *  functional. */
export async function notifyLead({ lead }: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  // Team inbox for new leads. Defaults to the business address so the
  // recipient is correct out of the box; override with LEADS_TO_EMAIL.
  // Delivery still requires RESEND_API_KEY (+ a verified LEADS_FROM_EMAIL).
  const to = process.env.LEADS_TO_EMAIL || 'mitoderm@gmail.com';
  if (!apiKey) return;

  const from = process.env.LEADS_FROM_EMAIL || '[email protected]';
  const subject = lead.source
    ? `New ${lead.source} — ${lead.name || lead.email}`
    : `New Mitoderm lead — ${lead.name || lead.email}`;
  const text = [
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.phone && `Phone:   ${lead.phone}`,
    lead.clinic && `Clinic:  ${lead.clinic}`,
    lead.source && `Source:  ${lead.source}`,
    '',
    lead.message,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
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

interface ForwardInput {
  /** Anything Lead-shaped — we serialize the whole object to JSON for
   *  the downstream system. */
  lead: PipelineLead;
}

/** Outbound webhook fan-out (HubSpot / Pipedrive / Make / n8n / Zapier).
 *  Set LEADS_WEBHOOK_URL to enable; LEADS_WEBHOOK_SECRET adds an
 *  HMAC-SHA256 signature in `x-mitoderm-signature`. */
export async function forwardLeadWebhook({
  lead,
}: ForwardInput): Promise<void> {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return;

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
