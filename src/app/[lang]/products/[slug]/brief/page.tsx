import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { getProduct } from '@/products';
import { SITE_NAME, absUrl, alternatesFor } from '@/lib/seo';
import ProductBrief from '@/components/Product/ProductBrief';

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}): Promise<Metadata> {
  const product = getProduct(slug);
  if (!product) return {};
  const c = product.content[lang];
  return {
    title: `${c.name} — Brief | ${SITE_NAME}`,
    description: c.tagline,
    alternates: alternatesFor(lang, `/products/${slug}/brief`),
    robots: { index: false, follow: true },
    openGraph: {
      title: `${c.name} — Brief | ${SITE_NAME}`,
      description: c.tagline,
      url: absUrl(lang, `/products/${slug}/brief`),
      siteName: SITE_NAME,
      type: 'article',
    },
  };
}

export default async function ProductBriefRoute({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}) {
  unstable_setRequestLocale(lang);
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations({ locale: lang, namespace: 'brief' });

  return (
    <ProductBrief
      product={product}
      locale={lang}
      strings={{
        download: t('download'),
        backToProduct: t('backToProduct'),
        keyFacts: t('keyFacts'),
        benefits: t('benefits'),
        ingredients: t('ingredients'),
        protocol: t('protocol'),
        aftercare: t('aftercare'),
        safety: t('safety'),
        indications: t('indications'),
        professionalOnly: t('professionalOnly'),
        version: t('version'),
      }}
    />
  );
}
