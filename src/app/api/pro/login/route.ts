import { NextResponse } from 'next/server';
import {
  findByToken,
  touchLastLogin,
} from '@/lib/clinics-store';
import { createProSession, PRO_SESSION_COOKIE } from '@/lib/pro-auth';

/** GET /api/pro/login?token=... — redeems a magic-link token, sets the
 *  pro session cookie and redirects to /<lang>/pro.
 *
 *  Why GET (and not POST): the magic link arrives via email/WhatsApp;
 *  it must be one-click. The cookie is HttpOnly + signed so the token
 *  in the URL only buys cookie issuance — not a long-lived credential. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';
  const lang = (url.searchParams.get('lang') ?? 'en').replace(/[^a-z]/g, '').slice(0, 4) || 'en';

  if (!token) {
    return NextResponse.redirect(new URL(`/${lang}/pro/login?error=missing`, req.url));
  }

  const clinic = await findByToken(token);
  if (!clinic) {
    return NextResponse.redirect(new URL(`/${lang}/pro/login?error=invalid`, req.url));
  }

  const session = createProSession({ id: clinic.id, name: clinic.clinic });
  await touchLastLogin(clinic.id);

  const res = NextResponse.redirect(new URL(`/${lang}/pro`, req.url));
  res.cookies.set(PRO_SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: session.maxAge,
  });
  return res;
}
