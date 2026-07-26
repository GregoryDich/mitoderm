import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import ProductPage from '@/components/Product/ProductPage';
import ProductJourney, {
  JourneyStrings,
} from '@/components/Product/ProductJourney/ProductJourney';
import JsonLd from '@/components/Seo/JsonLd';
import { getProduct, products } from '@/products';
import { getJourney } from '@/lib/journey';
import { getPostsForProduct } from '@/posts';
import { LocaleType } from '@/types';
import { readDoctors } from '@/lib/doctors-store';
import { productInquiryMessage, whatsappHref } from '@/lib/whatsapp';
import {
  SITE_URL,
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImage,
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
      images: [
        {
          url: ogImage({
            title: c.name,
            eyebrow: c.eyebrow,
            tagline: c.tagline || c.shortDescription,
            accent: product.accent,
            locale: lang,
          }),
          width: 1200,
          height: 630,
          alt: c.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.name} | ${SITE_NAME}`,
      description: c.shortDescription,
      images: [
        ogImage({
          title: c.name,
          eyebrow: c.eyebrow,
          tagline: c.tagline || c.shortDescription,
          accent: product.accent,
          locale: lang,
        }),
      ],
    },
  };
}

export default async function Page({
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
  const doctors = await readDoctors();

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
    ...(c.keyFacts && c.keyFacts.length > 0
      ? {
          additionalProperty: c.keyFacts.map((value, i) => ({
            '@type': 'PropertyValue',
            name: `Key fact ${i + 1}`,
            value,
          })),
        }
      : {}),
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

  const medicalProcedureLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: c.name,
    description: c.description,
    url: absUrl(lang, path),
    procedureType: 'https://schema.org/TherapeuticProcedure',
    bodyLocation:
      product.category === 'hair' ? 'Scalp and hair' : 'Skin (face / body)',
    preparation: c.protocol?.items.join(' ') ?? undefined,
    followup: c.aftercare?.items.join(' ') ?? undefined,
    contraindication: c.contraindications?.items.join(', ') ?? undefined,
    provider: { '@id': `${SITE_URL}#medicalbusiness` },
  } as const;

  const relatedPosts = getPostsForProduct(slug, lang, 2);

  // Journey — the cinematic, scroll-driven top of the PDP for opted-in
  // products (docs/product-funnel.md). Renders above the classic page,
  // whose hero is suppressed so the two don't duplicate the hook.
  const journey = getJourney(slug);
  const waHref = whatsappHref(productInquiryMessage(c.name, lang));
  let journeyStrings: JourneyStrings | null = null;
  if (journey) {
    const tj = await getTranslations({
      locale: lang,
      namespace: 'productJourney',
    });
    const tp = await getTranslations({ locale: lang, namespace: 'product' });
    journeyStrings = {
      scrollHint: tj('scrollHint'),
      ctaContact: waHref ? tp('contactViaWhatsApp') : tp('contactForPrice'),
      chapters: {
        arrival: { kicker: tj('ch1Kicker'), title: tj('ch1Title') },
        plateau: { kicker: tj('ch2Kicker'), title: tj('ch2Title') },
        mechanism: { kicker: tj('ch3Kicker'), title: tj('ch3Title') },
        product: { kicker: tj('ch4Kicker'), title: tj('ch4Title') },
        proof: { kicker: tj('ch5Kicker'), title: tj('ch5Title') },
        partner: { kicker: tj('ch6Kicker'), title: tj('ch6Title') },
      },
    };
  }

  return (
    <main>
      <ProductPage
        product={product}
        locale={lang}
        trustedBy={doctors}
        relatedPosts={relatedPosts}
        journeySlot={
          journey && journeyStrings ? (
            <ProductJourney
              product={product}
              locale={lang}
              config={journey}
              strings={journeyStrings}
              waHref={waHref || undefined}
            />
          ) : undefined
        }
      />
      <JsonLd id="ld-product" data={productLd} />
      <JsonLd id="ld-breadcrumb" data={breadcrumbsLd} />
      <JsonLd id="ld-medical-procedure" data={medicalProcedureLd} />
    </main>
  );
}
