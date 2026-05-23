import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import HomePage from '@/components/Home/HomePage';
import { readSocial } from '@/lib/social-store';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'home' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('tagline'),
    alternates: alternatesFor(lang, ''),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('tagline'),
      url: absUrl(lang, ''),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const social = (await readSocial())
    .filter((p) => p.isPublished)
    .sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
  return <HomePage locale={lang} social={social} />;
}
