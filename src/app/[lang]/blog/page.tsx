import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { getPostSummaries } from '@/posts';
import { SITE_NAME, absUrl, alternatesFor, openGraphLocaleFor } from '@/lib/seo';
import BlogIndex from '@/components/Blog/BlogIndex';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'blog' });
  const path = '/blog';
  const og = openGraphLocaleFor(lang);
  const title = `${t('title')} | ${SITE_NAME}`;
  return {
    title,
    description: t('subtitle'),
    alternates: alternatesFor(lang, path),
    openGraph: {
      title,
      description: t('subtitle'),
      url: absUrl(lang, path),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function BlogIndexRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const posts = getPostSummaries(lang);
  return <BlogIndex posts={posts} />;
}
