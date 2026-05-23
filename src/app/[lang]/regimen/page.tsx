import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';
import { getCatalogItems } from '@/products';
import RegimenQuiz from '@/components/Regimen/RegimenQuiz';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'regimen' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/regimen'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/regimen'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function RegimenRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  return <RegimenQuiz catalog={getCatalogItems(lang)} />;
}
