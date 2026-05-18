import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import ProductPage from '@/components/Product/ProductPage';
import { getProduct, products } from '@/products';
import { LocaleType } from '@/types';

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
  if (!product) return { title: 'MitoDerm' };
  const c = product.content[lang];
  return {
    title: `${c.name} | MitoDerm`,
    description: c.shortDescription,
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
  return (
    <main>
      <ProductPage product={product} locale={lang} />
    </main>
  );
}
