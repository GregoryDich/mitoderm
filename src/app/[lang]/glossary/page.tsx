import { Metadata } from 'next';
import {
  unstable_setRequestLocale,
  getTranslations,
  getMessages,
} from 'next-intl/server';
import { LocaleType } from '@/types';
import { dictFromMessages, glossaryAnchorId } from '@/lib/glossary';
import { getProductsForTerm } from '@/products';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import GlossaryPage, {
  type GlossaryEntry,
} from '@/components/Glossary/GlossaryPage';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.map((lang) => ({ lang }));
}

async function entriesFor(lang: LocaleType): Promise<GlossaryEntry[]> {
  const messages = await getMessages({ locale: lang });
  const dict = dictFromMessages(messages as Record<string, unknown>);
  return Object.entries(dict)
    .map(([term, def]) => ({
      term,
      def,
      // Shared id helper so the PDP KeyActives can deep-link to the
      // exact anchor in any locale.
      id: glossaryAnchorId(term),
      // Reverse-map the term to products that list it as an ingredient.
      // Computed server-side so the products dataset stays out of the
      // client bundle; empty for terms with no product (downtime, AHA…).
      products: getProductsForTerm(term, lang),
    }))
    .sort((a, b) => a.term.localeCompare(b.term, lang));
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'glossaryPage' });
  const path = '/glossary';
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: t('title'),
    eyebrow: t('eyebrow'),
    tagline: t('subtitle'),
    accent: 'gold',
    locale: lang,
  });
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, path),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, path),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      images: img.twitter,
    },
  };
}

export default async function GlossaryRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const entries = await entriesFor(lang);
  return <GlossaryPage entries={entries} />;
}
