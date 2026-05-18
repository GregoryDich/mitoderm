import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import Catalog from '@/components/Catalog/Catalog';
import { getCatalogItems } from '@/products';
import { LocaleType } from '@/types';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'he' }, { lang: 'ru' }];
}

export const metadata: Metadata = {
  title: 'Catalog | MitoDerm',
  description:
    'Professional exosome-based solutions — masks, peels and bio-spicules for clinics and aesthetic practitioners.',
};

export default function CatalogPage({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const items = getCatalogItems(lang);
  return (
    <main>
      <Catalog items={items} />
    </main>
  );
}
