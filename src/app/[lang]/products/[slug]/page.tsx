import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import ProductPage from '@/components/Product/ProductPage';
import JsonLd from '@/components/Seo/JsonLd';
import { getProduct, products } from '@/products';
import { LocaleType } from '@/types';
import {
  SITE_URL,
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';

export function generateStaticParams() {
  const langs: LocaleType[] = ['en', 'he', 'ru'];
  return langs.flatMap((lang) =>
    products.map((p) => ({ lang, slug: p.slug }))
  );
}

export function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}): Metadata {
  const product = getProduct(slug);
  if (!product) return { title: SITE_NAME };
  const c = product.content[lang];
  const path = `/products/${slug}`;
  const og = openGraphLocaleFor(lang);
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
      images: product.image ? [{ url: `${SITE_URL}${product.image}` }] : [],
    },
  };
}

export default function Page({
  params: { lang, slug },
}: {
  params: { lang: LocaleType; slug: string };
}) {
  unstable_setRequestLocale(lang);
  const product = getProduct(slug);
  if (!product) notFound();
  const c = product.content[lang];
  const path = `/products/${slug}`;
  const images = [product.image, ...(product.gallery ?? [])]
    .filter((x): x is string => !!x)
    .map((p) => `${SITE_URL}${p}`);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: c.name,
    description: c.description,
    url: absUrl(lang, path),
    sku: product.slug,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: product.category,
    image: images,
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Medical professionals and aesthetic clinics',
    },
    offers: {
      '@type': 'Offer',
      url: absUrl(lang, '/form'),
      availability:
        product.status === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      priceCurrency: 'USD',
      price: '0',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        valueAddedTaxIncluded: false,
      },
      seller: { '@id': `${SITE_URL}#organization` },
    },
  } as const;

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: absUrl(lang) },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catalog',
        item: absUrl(lang, '/catalog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: c.name,
        item: absUrl(lang, path),
      },
    ],
  } as const;

  return (
    <main>
      <ProductPage product={product} locale={lang} />
      <JsonLd id="ld-product" data={productLd} />
      <JsonLd id="ld-breadcrumb" data={breadcrumbsLd} />
    </main>
  );
}
