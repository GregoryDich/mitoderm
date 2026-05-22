import type { Metadata } from 'next';
import { LocaleType } from '@/types';

export const SITE_URL = 'https://mitoderm.com';
export const SITE_NAME = 'Mitoderm';
export const LOCALES: LocaleType[] = ['en', 'ru', 'he'];
export const DEFAULT_LOCALE: LocaleType = 'en';

const HREFLANG_MAP: Record<LocaleType, string> = {
  en: 'en',
  ru: 'ru',
  he: 'he-IL',
};

/** Absolute URL for a given locale + path (e.g. "/catalog"). */
export const absUrl = (locale: LocaleType, path = ''): string =>
  `${SITE_URL}/${locale}${path}`;

/** Builds Next `alternates` for a given path (without the locale prefix). */
export function alternatesFor(
  currentLocale: LocaleType,
  path = ''
): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[HREFLANG_MAP[l]] = absUrl(l, path);
  }
  languages['x-default'] = absUrl(DEFAULT_LOCALE, path);
  return {
    canonical: absUrl(currentLocale, path),
    languages,
  };
}

/** OpenGraph locale block matching our locales. */
export function openGraphLocaleFor(currentLocale: LocaleType) {
  const ogLocale =
    currentLocale === 'en'
      ? 'en_US'
      : currentLocale === 'ru'
      ? 'ru_RU'
      : 'he_IL';
  const alt = LOCALES.filter((l) => l !== currentLocale).map((l) =>
    l === 'en' ? 'en_US' : l === 'ru' ? 'ru_RU' : 'he_IL'
  );
  return { locale: ogLocale, alternateLocale: alt };
}

/** Site-wide Organization JSON-LD. */
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.svg`,
    description:
      'Professional exosome-based skincare for clinics and aesthetic practitioners.',
    sameAs: [],
  };
}

/** Site-wide WebSite JSON-LD with language alternates. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: LOCALES.map((l) => HREFLANG_MAP[l]),
    publisher: { '@id': `${SITE_URL}#organization` },
  };
}
