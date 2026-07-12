import { Metadata } from 'next';
import { Suspense } from 'react';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import Catalog from '@/components/Catalog/Catalog';
import { getCatalogItems, getLineSummaries } from '@/products';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'he' }, { lang: 'ru' }];
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'catalog' });
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: t('title'),
    eyebrow: t('eyebrow'),
    tagline: t('subtitle'),
    accent: 'teal',
    locale: lang,
  });
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/catalog'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/catalog'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      images: img.twitter,
    },
  };
}

export default function CatalogPage({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const items = getCatalogItems(lang);
  const lines = getLineSummaries(lang);
  return (
    <main>
      <Suspense fallback={null}>
        <Catalog items={items} lines={lines} />
      </Suspense>
    </main>
  );
}
