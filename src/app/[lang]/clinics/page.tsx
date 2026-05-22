import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import {
  SITE_URL,
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
} from '@/lib/seo';
import { readDoctors } from '@/lib/doctors-store';
import JsonLd from '@/components/Seo/JsonLd';
import ClinicsPage from '@/components/Clinics/ClinicsPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'clinics' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/clinics'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/clinics'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function ClinicsRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const doctors = (await readDoctors()).filter((d) => d.isPublished);

  // ItemList of LocalBusiness — Google understands this as a directory.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: doctors.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/clinics#${d.id}`,
        name: d.name,
        image: d.photo ? `${SITE_URL}${d.photo}` : undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: d.city,
          addressRegion: d.area,
          addressCountry: 'IL',
        },
        ...(d.instagram ? { sameAs: [d.instagram] } : {}),
      },
    })),
  };

  return (
    <>
      <ClinicsPage doctors={doctors} />
      {doctors.length > 0 && (
        <JsonLd id="ld-clinics" data={itemListLd} />
      )}
    </>
  );
}
