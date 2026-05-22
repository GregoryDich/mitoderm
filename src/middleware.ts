import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

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
    return NextResponse.next();
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: '/:path*',
};
