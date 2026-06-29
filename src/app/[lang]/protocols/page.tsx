import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';
import { products } from '@/products';
import ProtocolsPage from '@/components/Protocols/ProtocolsPage';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'protocols' });
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
    alternates: alternatesFor(lang, '/protocols'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/protocols'),
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

export default async function ProtocolsRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);

  // Pull every product whose locale-specific content has a populated
  // bundle slot. Each becomes a protocol card; the bundle items are
  // resolved against the catalog at render time inside the component.
  const protocols = products
    .filter((p) => {
      const c = p.content[lang];
      return c.bundle && c.bundle.items && c.bundle.items.length > 0;
    })
    .map((p) => ({
      anchor: p,
      bundle: p.content[lang].bundle!,
      headline: p.content[lang].name,
    }));

  return <ProtocolsPage protocols={protocols} />;
}
