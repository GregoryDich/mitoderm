import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';
import AccessibilityPage from '@/components/Accessibility/AccessibilityPage';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'accessibility' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('websites'),
    alternates: alternatesFor(lang, '/accessibility'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('websites'),
      url: absUrl(lang, '/accessibility'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function AccessibilityRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  return <AccessibilityPage />;
}
