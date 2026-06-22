import type { MetadataRoute } from 'next';
import { products, lines } from '@/products';
import { posts } from '@/posts';
import { concerns } from '@/concerns';
import { LOCALES, DEFAULT_LOCALE, absUrl } from '@/lib/seo';

const STATIC_PATHS = ['', '/catalog', '/about', '/form', '/accessibility', '/clinics', '/protocols', '/regimen', '/seminars', '/apply', '/blog', '/science', '/glossary', '/privacy', '/terms'] as const;

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
    ...lines.map((l) => `/lines/${l.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
    ...concerns.map((c) => `/concerns/${c.slug}`),
  ];

  for (const path of allPaths) {
    for (const locale of LOCALES) {
      const isHome = path === '';
      const isProduct = path.startsWith('/products/');
      const isPost = path.startsWith('/blog/');
      entries.push({
        url: absUrl(locale, path),
        lastModified: now,
        changeFrequency: isHome
          ? 'weekly'
          : isProduct
          ? 'monthly'
          : isPost
          ? 'monthly'
          : 'monthly',
        priority: isHome ? 1 : isProduct ? 0.8 : isPost ? 0.6 : 0.7,
        alternates: { languages: alternates(path) },
      });
    }
  }
  return entries;
}
