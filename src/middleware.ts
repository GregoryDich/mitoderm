import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import {
  ASSIGNMENT_COOKIE,
  assignAll,
  EXPERIMENTS,
  parseAssignments,
  serializeAssignments,
} from './lib/experiments';

const intlMiddleware = createMiddleware(routing);

/** Hardened response headers applied to every route.
 *  - HSTS: force HTTPS, include subdomains, eligible for preload.
 *  - X-Frame-Options + frame-ancestors: block embedding in iframes.
 *  - X-Content-Type-Options: stop MIME sniffing.
 *  - Referrer-Policy: send origin only on cross-site.
 *  - Permissions-Policy: opt out of features we don't use.
 *  - CSP: lets us host GA + reCAPTCHA + Resend webhooks but blocks
 *    arbitrary script origins. Inline scripts allowed because Next's
 *    runtime injects them; tighten with a nonce later if needed.
 */
function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      // Note: anthropic.com is only contacted server-to-server (from the
      // /api/chat/product route), never directly from the browser, so it
      // doesn't need to be in connect-src.
      "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
    ].join('; ')
  );
  return res;
}

/** A/B experiment cookie issuance — runs on public page navigations.
 *  Only writes a new cookie when the visitor is missing an assignment for
 *  at least one active experiment. Empty when EXPERIMENTS is empty, which
 *  it is by default — turning the harness off without code changes. */
function applyAbCookie(req: NextRequest, res: NextResponse): NextResponse {
  if (EXPERIMENTS.length === 0) return res;
  const existing = parseAssignments(req.cookies.get(ASSIGNMENT_COOKIE)?.value);
  const next = assignAll(existing);
  if (next !== existing) {
    res.cookies.set(ASSIGNMENT_COOKIE, serializeAssignments(next), {
      httpOnly: false, // analytics scripts may read it client-side
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 180, // 6 months
    });
  }
  return res;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Bypass locale routing for API, Next internals and any file-like path
  // (sitemap.xml, robots.txt, /brand/logo.svg, /products/.../hero.jpg, …).
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    /\.[^/]+$/.test(pathname)
  ) {
    return applySecurityHeaders(NextResponse.next());
  }
  return applySecurityHeaders(
    applyAbCookie(req, intlMiddleware(req) as NextResponse)
  );
}

export const config = {
  matcher: '/:path*',
};
