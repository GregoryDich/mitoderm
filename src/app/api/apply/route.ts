import { NextResponse } from 'next/server';
import { applyClinic } from '@/lib/clinics-store';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { spamGuard } from '@/lib/spam-guard';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  // Stricter than /api/leads — a clinic application is a deliberate
  // action; 3/IP/min is plenty for any human.
  const rl = rateLimited('apply', clientIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited', retryInMs: rl.retryInMs },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  // Origin + honeypot. Same silent-200 pattern as /api/leads — a real
  // applicant never sees this; a script gets a no-op.
  const guard = spamGuard(req, body as { website?: unknown });
  if (!guard.ok) {
    // eslint-disable-next-line no-console
    console.warn('[apply] dropped by spam guard', guard.reason);
    return NextResponse.json({ ok: true, dropped: true });
  }

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const clinic = clip(body.clinic, 160);
  const license = clip(body.license, 80);
  const city = clip(body.city, 80);
  const instagram = clip(body.instagram, 120);
  const message = clip(body.message, 2000);
  const referralCode = clip(body.referralCode, 80);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!emailRe.test(email)) errors.email = 'invalid';
  if (!clinic) errors.clinic = 'required';
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const result = await applyClinic({
    name,
    email,
    phone,
    clinic,
    license,
    city,
    instagram,
    message,
    referralCode: referralCode || undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.error === 'duplicate_email' ? 409 : 400 }
    );
  }

  // Optional notification email to the owner via Resend
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  if (apiKey && to) {
    try {
      const from = process.env.LEADS_FROM_EMAIL || '[email protected]';
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New /pro application — ${clinic}`,
          text: [
            `Name:     ${name}`,
            `Clinic:   ${clinic}`,
            `Email:    ${email}`,
            phone && `Phone:    ${phone}`,
            license && `License:  ${license}`,
            city && `City:     ${city}`,
            instagram && `Instagram: ${instagram}`,
            '',
            message,
          ].filter(Boolean).join('\n'),
        }),
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[apply] resend send error', err);
    }
  }

  return NextResponse.json({ ok: true, id: result.clinic.id });
}
