import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.scss';
import { Rubik, Fraunces } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import ScrollToTop from '@/components/Layout/ScrollToTop/ScrollToTop';
import JsonLd from '@/components/Seo/JsonLd';
import { orgJsonLd, siteJsonLd } from '@/lib/seo';
import ConsentedAnalytics from '@/components/Analytics/ConsentedAnalytics';
import UtmCapture from '@/components/Analytics/UtmCapture';
import { ConsentProvider } from '@/components/Consent/ConsentProvider';
import CookieConsent from '@/components/Consent/CookieConsent';

const Header = dynamic(() => import('@/components/Layout/Header/Header'), {
  ssr: false,
});

const Modal = dynamic(() => import('@/components/Layout/Modal/Modal'), {
  ssr: false,
});

const A11yWidget = dynamic(
  () => import('@/components/Layout/A11yWidget/A11yWidget'),
  { ssr: false }
);

const InterestDrawer = dynamic(
  () => import('@/components/InterestList/InterestDrawer'),
  { ssr: false }
);

import { InterestListProvider } from '@/components/InterestList/InterestListProvider';
import { RecentlyViewedProvider } from '@/components/RecentlyViewed/RecentlyViewedProvider';
import { CatalogIndexProvider } from '@/components/Catalog/CatalogIndexProvider';
import { getCatalogItems } from '@/products';
import type { LocaleType } from '@/types';
import PromoBar from '@/components/Layout/PromoBar/PromoBar';
import { nextUpcomingSeminar } from '@/lib/promo';

const rubik = Rubik({
  weight: ['300', '400', '500', '900'],
  style: 'normal',
  display: 'swap',
  variable: '--font-Rubik',
  subsets: ['latin', 'cyrillic', 'hebrew'],
});

/** Display serif applied behind NEXT_PUBLIC_DISPLAY_SERIF=1.
 *  next/font requires every font loader to be called unconditionally
 *  at module scope, so Fraunces is always *declared* here. The flag
 *  only controls whether its variable is *applied* to <body> — when
 *  off, no CSS rule references it and the browser never requests it.
 */
const fraunces = Fraunces({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
  subsets: ['latin'],
});
const FLAG_DISPLAY_SERIF = process.env.NEXT_PUBLIC_DISPLAY_SERIF === '1';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'he' }, { lang: 'ru' }];
}

export const metadata: Metadata = {
  metadataBase: new URL('https://exoskin.co.il'),
  title: {
    default: 'Mitoderm — Professional Exosome Skincare',
    template: '%s | Mitoderm',
  },
  description:
    'Professional exosome-based solutions for clinics and aesthetic practitioners — advanced masks, longevity peels and bio-spicules. Where science meets beauty.',
  keywords: [
    'Mitoderm',
    'exosomes',
    'professional skincare',
    'EXOCELL Mask',
    'EXO-NAD',
    'aesthetic medicine',
  ],
  openGraph: {
    title: 'Mitoderm — Professional Exosome Skincare',
    description:
      'Professional exosome-based solutions for clinics and aesthetic practitioners. Where science meets beauty.',
    url: 'https://exoskin.co.il',
    siteName: 'Mitoderm',
    type: 'website',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon/favicon.ico',
      sizes: 'auto',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicon/android-chrome-512x512.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/android-chrome-192x192.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const messages = await getMessages();

  if (!routing.locales.includes(params.lang as any)) {
    notFound();
  }

  unstable_setRequestLocale(params.lang);

  const upcoming = await nextUpcomingSeminar();
  // Slim catalog index computed server-side and passed to client
  // components via context — keeps the full products.json out of the
  // client bundle (see CatalogIndexProvider).
  const catalogIndex = getCatalogItems(params.lang as LocaleType);

  return (
    <html lang={params.lang}>
      <NextIntlClientProvider messages={messages}>
        <body
          className={`${rubik.className} ${
            FLAG_DISPLAY_SERIF ? fraunces.variable : ''
          }`}
          data-display-serif={FLAG_DISPLAY_SERIF ? '1' : undefined}
          dir={params.lang === 'he' ? 'rtl' : 'ltr'}
        >
          <ConsentProvider>
          <CatalogIndexProvider items={catalogIndex}>
          <InterestListProvider>
          <RecentlyViewedProvider>
            {/* Skip-to-content for keyboard users — first focusable
                element in the body, only visible when focused. */}
            <a href="#main" className="skipLink">
              {params.lang === 'ru'
                ? 'Перейти к содержанию'
                : params.lang === 'he'
                ? 'דילוג לתוכן'
                : 'Skip to content'}
            </a>
            {upcoming && (
              <PromoBar
                id={`seminar-${upcoming.id}`}
                text={upcoming.caption || 'Mitoderm seminar'}
                date={upcoming.date}
                href={`/${params.lang}/seminars`}
              />
            )}
            <Header />
            <Modal />
            {/* Each page renders its own <Footer/> inside its
                .pageScroll container. A layout-level footer here paints
                at the top of the viewport because .pageScroll is
                position:absolute (so #main collapses to 0 height) —
                which caused the footer-over-hero overlap. */}
            <div id="main">{children}</div>
            <ScrollToTop />
            <A11yWidget />
            <InterestDrawer />
            <CookieConsent />
            <UtmCapture />
            <JsonLd id="ld-organization" data={orgJsonLd()} />
            <JsonLd id="ld-website" data={siteJsonLd()} />
          </RecentlyViewedProvider>
          </InterestListProvider>
          </CatalogIndexProvider>
          <ConsentedAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
          </ConsentProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
