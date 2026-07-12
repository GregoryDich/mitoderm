import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { concerns, getConcern } from '@/concerns';
import { getLineSummaries, getCatalogItems } from '@/products';
import { getPostSummaries } from '@/posts';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import ConcernPage from '@/components/Concerns/ConcernPage';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.flatMap((lang) =>
    concerns.map((c) => ({ lang, slug: c.slug }))
  );
}

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}): Promise<Metadata> {
  const concern = getConcern(slug);
  if (!concern) return { title: SITE_NAME };
  const t = await getTranslations({ locale: lang, namespace: 'concerns' });
  const title = t(`${slug}.title`);
  const eyebrow = t(`${slug}.eyebrow`);
  const text = t(`${slug}.text`);
  const path = `/concerns/${slug}`;
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title,
    eyebrow,
    tagline: text,
    accent: concern.accent,
    locale: lang,
  });
  return {
    title: `${title} | ${SITE_NAME}`,
    description: text,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: text,
      url: absUrl(lang, path),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description: text,
      images: img.twitter,
    },
  };
}

export default async function ConcernRoute({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}) {
  unstable_setRequestLocale(lang);
  const concern = getConcern(slug);
  if (!concern) notFound();

  // Resolve lines and products at request time on the server — the slim
  // catalog rows are fine to inline; the heavy product copy stays out of
  // the client bundle (the CatalogIndexProvider lesson from §4).
  const lineSummaries = getLineSummaries(lang).filter((l) =>
    concern.lines.includes(l.slug)
  );
  const catalog = getCatalogItems(lang);
  const products = concern.productSlugs
    .map((s) => catalog.find((c) => c.slug === s))
    .filter((x): x is NonNullable<typeof x> => !!x);

  const tagSet = new Set(concern.postTags);
  const posts = getPostSummaries(lang)
    .filter((p) => p.tags.some((t) => tagSet.has(t)))
    .slice(0, 4);

  const t = await getTranslations({ locale: lang, namespace: 'concerns' });
  const tp = await getTranslations({
    locale: lang,
    namespace: 'concernPage',
  });

  return (
    <ConcernPage
      slug={slug}
      accent={concern.accent}
      locale={lang}
      lineSummaries={lineSummaries}
      products={products}
      posts={posts}
      strings={{
        eyebrow: t(`${slug}.eyebrow`),
        title: t(`${slug}.title`),
        lead: t(`${slug}.text`),
        explainer: t(`${slug}.explainer`),
        linesTitle: tp('linesTitle'),
        productsTitle: tp('productsTitle'),
        postsTitle: tp('postsTitle'),
        backToHome: tp('backToHome'),
        contactCta: tp('contactCta'),
        openLine: tp('openLine'),
        checklistTitle: tp('checklistTitle'),
        checklist: (t.raw(`${slug}.checklist`) as string[]) ?? [],
      }}
    />
  );
}
