import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

interface LeadBody {
  name?: string;
  email?: string;
  phone?: string;
  clinic?: string;
  message?: string;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clip(s: unknown, max: number): string {
  return typeof s === 'string' ? s.trim().slice(0, max) : '';
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const clinic = clip(body.clinic, 160);
  const message = clip(body.message, 4000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!emailRe.test(email)) errors.email = 'invalid';
  if (!message) errors.message = 'required';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const lead = {
    ts: new Date().toISOString(),
    name,
    email,
    phone,
    clinic,
    message,
  };

  // Best-effort local persistence for dev; safe to fail in serverless.
  // Production: replace with a real sink — DB, CRM, or an email transport
  // configured via env (SMTP/Resend/SendGrid).
  try {
    const dir = path.join(process.cwd(), 'data');
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(
      path.join(dir, 'leads.jsonl'),
      JSON.stringify(lead) + '\n',
      'utf8'
    );
  } catch {
    // ignore — fall back to console only
  }
  // Always log so the operator sees the lead in dev/server logs.
  // eslint-disable-next-line no-console
  console.log('[lead]', lead);

  return NextResponse.json({ ok: true });
}
