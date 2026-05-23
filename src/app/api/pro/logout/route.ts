import { NextResponse } from 'next/server';
import { PRO_SESSION_COOKIE } from '@/lib/pro-auth';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const lang = (url.searchParams.get('lang') ?? 'en').replace(/[^a-z]/g, '').slice(0, 4) || 'en';
  const res = NextResponse.redirect(new URL(`/${lang}`, req.url), 303);
  res.cookies.set(PRO_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
