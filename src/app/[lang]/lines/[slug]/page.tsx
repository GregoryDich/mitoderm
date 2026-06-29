import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { getLine, lines, getCatalogItems } from '@/products';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import LinePage from '@/components/Lines/LinePage';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.flatMap((lang) => lines.map((l) => ({ lang, slug: l.slug })));
}

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}): Promise<Metadata> {
  const line = getLine(slug);
  if (!line) return { title: SITE_NAME };
  const c = line.content[lang];
  const path = `/lines/${slug}`;
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: c.name,
    eyebrow: c.eyebrow,
    tagline: c.tagline,
    accent: line.accent,
    locale: lang,
  });
  return {
    title: `${c.name} | ${SITE_NAME}`,
    description: c.shortDescription,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title: `${c.name} | ${SITE_NAME}`,
      description: c.shortDescription,
      url: absUrl(lang, path),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.name} | ${SITE_NAME}`,
      description: c.shortDescription,
      images: img.twitter,
    },
  };
}

export default async function LineRoute({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}) {
  unstable_setRequestLocale(lang);
  const line = getLine(slug);
  if (!line) notFound();

  const catalog = getCatalogItems(lang);
  const items = line.products
    .map((s) => catalog.find((c) => c.slug === s))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const t = await getTranslations({ locale: lang, namespace: 'linePage' });

  // Coming-soon lines render an inline email waitlist instead of the
  // contact CTA. The `source` value is whitelisted on the /api/leads
  // route (RELAXED_SOURCES) so name + message aren't required.
  const waitlist =
    line.status === 'coming-soon'
      ? {
          source: `${line.slug}-waitlist`,
          title: t('waitlistTitle'),
          text: t('waitlistText'),
          ctaLabel: t('waitlistCta'),
          emailPlaceholder: t('waitlistEmailPlaceholder'),
          successTitle: t('waitlistSuccessTitle'),
          successText: t('waitlistSuccessText'),
          errorText: t('waitlistError'),
        }
      : undefined;

  return (
    <LinePage
      line={line}
      items={items}
      locale={lang}
      strings={{
        productsTitle: t('productsTitle'),
        ingredientsTitle: t('ingredientsTitle'),
        protocolFallback: t('protocolFallback'),
        indicationsTitle: t('indicationsTitle'),
        backToHome: t('backToHome'),
        contactCta: t('contactCta'),
      }}
      waitlist={waitlist}
    />
  );
}
