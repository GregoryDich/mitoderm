import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import ApplyForm from '@/components/Pro/ApplyForm';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'apply' });
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: t('title'),
    eyebrow: t('eyebrow'),
    tagline: t('subtitle'),
    accent: 'gold',
    locale: lang,
  });
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/apply'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/apply'),
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

export default function ApplyRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  return <ApplyForm />;
}
