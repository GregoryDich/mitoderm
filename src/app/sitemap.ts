import type { MetadataRoute } from 'next';
import { products } from '@/products';
import { LOCALES, DEFAULT_LOCALE, absUrl } from '@/lib/seo';

const STATIC_PATHS = ['', '/catalog', '/about', '/form', '/accessibility'] as const;

function alternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of LOCALES) {
    const tag = l === 'he' ? 'he-IL' : l;
    map[tag] = absUrl(l, path);
  }
  map['x-default'] = absUrl(DEFAULT_LOCALE, path);
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const allPaths = [
    ...STATIC_PATHS,
    ...products.map((p) => `/products/${p.slug}`),
  ];

  for (const path of allPaths) {
    for (const locale of LOCALES) {
      const isHome = path === '';
      const isProduct = path.startsWith('/products/');
      entries.push({
        url: absUrl(locale, path),
        lastModified: now,
        changeFrequency: isHome
          ? 'weekly'
          : isProduct
          ? 'monthly'
          : 'monthly',
        priority: isHome ? 1 : isProduct ? 0.8 : 0.7,
        alternates: { languages: alternates(path) },
      });
    }
  }
  return entries;
}
