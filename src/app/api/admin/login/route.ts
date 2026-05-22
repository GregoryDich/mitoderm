import { NextResponse } from 'next/server';
import { createSession, SESSION_COOKIE, verifyPassword } from '@/lib/admin-auth';
import { logAudit, requestMeta } from '@/lib/audit-log';

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const pw = (body.password || '').trim();
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }
  if (!verifyPassword(pw)) {
    await logAudit({
      at: new Date().toISOString(),
      action: 'auth.login',
      ...requestMeta(req),
      meta: { ok: false },
    });
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 });
  }
  const session = createSession();
  await logAudit({
    at: new Date().toISOString(),
    action: 'auth.login',
    ...requestMeta(req),
    meta: { ok: true },
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: session.maxAge,
  });
  return res;
}
