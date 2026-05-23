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
import { readSocial } from '@/lib/social-store';
import JsonLd from '@/components/Seo/JsonLd';
import SeminarsPage from '@/components/Seminars/SeminarsPage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'seminars' });
  const og = openGraphLocaleFor(lang);
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/seminars'),
    openGraph: {
      title: `${t('title')} | ${SITE_NAME}`,
      description: t('subtitle'),
      url: absUrl(lang, '/seminars'),
      siteName: SITE_NAME,
      type: 'website',
      locale: og.locale,
      alternateLocale: og.alternateLocale,
    },
  };
}

export default async function SeminarsRoute({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const all = (await readSocial())
    .filter((p) => p.isPublished && p.kind === 'seminar')
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = all.filter((p) => !p.date || p.date >= today);
  const past = all.filter((p) => p.date && p.date < today);

  // Schema.org Event entries — gives Google rich-result eligibility.
  const eventsLd =
    upcoming.length > 0
      ? upcoming.map((p) => ({
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: p.caption ?? 'Mitoderm seminar',
          startDate: p.date,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          image: p.poster ? `${SITE_URL}${p.poster}` : undefined,
          url: p.url,
          organizer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          location: {
            '@type': 'Place',
            name: 'Israel',
            address: { '@type': 'PostalAddress', addressCountry: 'IL' },
          },
        }))
      : [];

  return (
    <>
      <SeminarsPage upcoming={upcoming} past={past} />
      {eventsLd.map((d, i) => (
        <JsonLd key={i} id={`ld-event-${i}`} data={d} />
      ))}
    </>
  );
}
