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
  const t = await getTranslations({ locale: lang, namespace: 'cookies' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('intro'),
    alternates: alternatesFor(lang, '/cookies'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('intro'),
      url: absUrl(lang, '/cookies'),
      siteName: SITE_NAME,
      type: 'article',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function CookiesRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'cookies' });
  const messages = (await getMessages({ locale: lang })) as Record<
    string,
    unknown
  >;
  const ns = messages.cookies as {
    sections?: LegalSection[];
    tableColumns?: string[];
    tableRows?: string[][];
  };
  const sections: LegalSection[] = Array.isArray(ns.sections) ? ns.sections : [];
  const tableColumns = Array.isArray(ns.tableColumns) ? ns.tableColumns : [];
  const tableRows = Array.isArray(ns.tableRows) ? ns.tableRows : [];

  return (
    <LegalPage
      eyebrow={t('eyebrow')}
      title={t('title')}
      updated={t('updated')}
      intro={t('intro')}
      sections={sections}
      tableTitle={t('tableTitle')}
      tableColumns={tableColumns}
      tableRows={tableRows}
      contactHeading={t('contactHeading')}
      contactText={t('contactText')}
    />
  );
}
