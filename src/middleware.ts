import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

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
      "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "object-src 'none'",
    ].join('; ')
  );
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
  return applySecurityHeaders(intlMiddleware(req) as NextResponse);
}

export const config = {
  matcher: '/:path*',
};
