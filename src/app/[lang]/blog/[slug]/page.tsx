import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { LocaleType } from '@/types';
import { getPost, getRelatedPosts, posts } from '@/posts';
import {
  SITE_NAME,
  SITE_URL,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import JsonLd from '@/components/Seo/JsonLd';
import BlogPost from '@/components/Blog/BlogPost';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.flatMap((lang) => posts.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}): Promise<Metadata> {
  const post = getPost(slug);
  if (!post) return { title: SITE_NAME };
  const c = post.content[lang];
  const path = `/blog/${slug}`;
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: c.title,
    eyebrow: c.eyebrow,
    tagline: c.excerpt,
    accent: post.accent,
    locale: lang,
  });
  return {
    title: `${c.title} | ${SITE_NAME}`,
    description: c.excerpt,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title: `${c.title} | ${SITE_NAME}`,
      description: c.excerpt,
      url: absUrl(lang, path),
      siteName: SITE_NAME,
      type: 'article',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.title} | ${SITE_NAME}`,
      description: c.excerpt,
      images: img.twitter,
    },
  };
}

export default async function BlogPostRoute({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}) {
  unstable_setRequestLocale(lang);
  const post = getPost(slug);
  if (!post) notFound();

  const c = post.content[lang];
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: lang,
    mainEntityOfPage: absUrl(lang, `/blog/${slug}`),
    image: post.image ? `${SITE_URL}${post.image}` : undefined,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };

  const related = getRelatedPosts(slug, lang, 2);

  return (
    <>
      <BlogPost post={post} locale={lang} related={related} />
      <JsonLd id={`ld-article-${slug}`} data={articleLd} />
    </>
  );
}
