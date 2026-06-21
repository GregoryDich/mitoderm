import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import HomePage from '@/components/Home/HomePage';
import { readSocial } from '@/lib/social-store';
import { readPress } from '@/lib/press-store';
import { readStories, isLive } from '@/lib/stories-store';
import { getLineSummaries } from '@/products';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImage,
} from '@/lib/seo';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'home' });
  const og = openGraphLocaleFor(lang);
  const image = ogImage({
    title: t('title'),
    eyebrow: t('eyebrow'),
    tagline: t('tagline'),
    accent: 'gold',
    locale: lang,
  });
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
      images: [{ url: image, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('tagline'),
      images: [image],
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
  const press = (await readPress())
    .filter((p) => p.isPublished)
    .sort((a, b) => a.order - b.order);
  const stories = (await readStories())
    .filter((s) => isLive(s))
    .sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
  const lineSummaries = getLineSummaries(lang);
  return (
    <HomePage
      locale={lang}
      social={social}
      press={press}
      stories={stories}
      lines={lineSummaries}
    />
  );
}
