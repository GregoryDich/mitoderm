import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import AboutPage from '@/components/About/AboutPage';
import JsonLd from '@/components/Seo/JsonLd';
import { LocaleType } from '@/types';
import {
  SITE_URL,
  SITE_NAME,
  absUrl,
  alternatesFor,
  openGraphLocaleFor,
  ogImageMeta,
} from '@/lib/seo';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'about' });
  const og = openGraphLocaleFor(lang);
  const img = ogImageMeta({
    title: t('title'),
    eyebrow: t('eyebrow'),
    tagline: t('tagline'),
    accent: 'gold',
    locale: lang,
  });
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('tagline'),
    alternates: alternatesFor(lang, '/about'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('tagline'),
      url: absUrl(lang, '/about'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      images: img.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('tagline'),
      images: img.twitter,
    },
  };
}

export default async function AboutRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);

  const tFaq = await getTranslations({ locale: lang, namespace: 'faq' });
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3].map((i) => ({
      '@type': 'Question',
      name: tFaq(`item${i}.title`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: tFaq(`item${i}.text`),
      },
    })),
  };

  const medicalBusinessLd = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}#medicalbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    image: `${SITE_URL}/brand/logo.svg`,
    description:
      'Mitoderm brings clinical-grade exosome technology to aesthetic practitioners — products, protocols and training for professional skincare.',
    areaServed: ['IL', 'EU', 'Worldwide'],
    parentOrganization: { '@id': `${SITE_URL}#organization` },
  };

  return (
    <>
      <AboutPage />
      <JsonLd id="ld-medical-business" data={medicalBusinessLd} />
      <JsonLd id="ld-faq" data={faqLd} />
    </>
  );
}
