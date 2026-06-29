import { Metadata } from 'next';
import {
  unstable_setRequestLocale,
  getTranslations,
  getMessages,
} from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';
import LegalPage, { type LegalSection } from '@/components/Legal/LegalPage';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'privacy' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('intro'),
    alternates: alternatesFor(lang, '/privacy'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('intro'),
      url: absUrl(lang, '/privacy'),
      siteName: SITE_NAME,
      type: 'article',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function PrivacyRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'privacy' });
  const messages = (await getMessages({ locale: lang })) as Record<
    string,
    unknown
  >;
  const sectionsRaw = (messages.privacy as { sections?: LegalSection[] })
    .sections;
  const sections: LegalSection[] = Array.isArray(sectionsRaw)
    ? sectionsRaw
    : [];

  return (
    <LegalPage
      eyebrow={t('eyebrow')}
      title={t('title')}
      updated={t('updated')}
      intro={t('intro')}
      sections={sections}
      contactHeading={t('contactHeading')}
      contactText={t('contactText')}
    />
  );
}
