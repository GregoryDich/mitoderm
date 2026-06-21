import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.scss';
import { Rubik } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Footer from '@/components/Layout/Footer/Footer';
import ScrollToTop from '@/components/Layout/ScrollToTop/ScrollToTop';
import JsonLd from '@/components/Seo/JsonLd';
import { orgJsonLd, siteJsonLd } from '@/lib/seo';
import { GoogleAnalytics } from '@next/third-parties/google';
import WebVitals from '@/components/Analytics/WebVitals';

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
          className={rubik.className}
          dir={params.lang === 'he' ? 'rtl' : 'ltr'}
        >
          <CatalogIndexProvider items={catalogIndex}>
          <InterestListProvider>
          <RecentlyViewedProvider>
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
            {children}
            <Footer />
            <ScrollToTop />
            <A11yWidget />
            <InterestDrawer />
            <JsonLd id="ld-organization" data={orgJsonLd()} />
            <JsonLd id="ld-website" data={siteJsonLd()} />
          </RecentlyViewedProvider>
          </InterestListProvider>
          </CatalogIndexProvider>
        </body>
      </NextIntlClientProvider>
      {process.env.NEXT_PUBLIC_GOOGLE_ID ? (
        <>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
          <WebVitals />
        </>
      ) : null}
    </html>
  );
}
