import postsData from '@/data/posts.json';
import type { LocaleType } from '@/types';
import type { ProductAccent } from '@/products';

export type PostSection =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string; author?: string };

export interface PostContent {
  title: string;
  eyebrow: string;
  excerpt: string;
  readTime: string;
  body: PostSection[];
}

export interface Post {
  slug: string;
  date: string;
  accent: ProductAccent;
  image?: string;
  tags: string[];
  content: Record<LocaleType, PostContent>;
}

export const posts: Post[] = (postsData as unknown as Post[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug);

export interface PostSummary {
  slug: string;
  href: string;
  date: string;
  accent: ProductAccent;
  image?: string;
  tags: string[];
  title: string;
  eyebrow: string;
  excerpt: string;
  readTime: string;
}

export const getPostSummaries = (locale: LocaleType): PostSummary[] =>
  posts.map((p) => ({
    slug: p.slug,
    href: `/blog/${p.slug}`,
    date: p.date,
    accent: p.accent,
    image: p.image,
    tags: p.tags,
    title: p.content[locale].title,
    eyebrow: p.content[locale].eyebrow,
    excerpt: p.content[locale].excerpt,
    readTime: p.content[locale].readTime,
  }));

/** Find up to `limit` related posts for a given slug, ranked by tag
 *  overlap. Falls back to the most recent other posts if there are no
 *  tag hits. Excludes the current post. */
export const getRelatedPosts = (
  slug: string,
  locale: LocaleType,
  limit = 2
): PostSummary[] => {
  const current = getPost(slug);
  if (!current) return [];
  const tagSet = new Set(current.tags);
  const candidates = posts.filter((p) => p.slug !== slug);
  const scored = candidates.map((p) => ({
    p,
    score: p.tags.reduce((n, t) => (tagSet.has(t) ? n + 1 : n), 0),
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.p.date < b.p.date ? 1 : -1;
  });
  return scored.slice(0, limit).map(({ p }) => ({
    slug: p.slug,
    href: `/blog/${p.slug}`,
    date: p.date,
    accent: p.accent,
    image: p.image,
    tags: p.tags,
    title: p.content[locale].title,
    eyebrow: p.content[locale].eyebrow,
    excerpt: p.content[locale].excerpt,
    readTime: p.content[locale].readTime,
  }));
};

/** Tag → relevant product slugs. Edits stay local: add a tag here and
 *  every post carrying it will surface those products in the
 *  "Featured products" strip. Likewise, every product whose slug
 *  appears here can find the related posts via getPostsForProduct.
 *  Exported so a unit test can assert every slug resolves to a real
 *  product — this is the cross-link integrity guard. */
export const TAG_PRODUCTS: Record<string, string[]> = {
  exosomes: ['v-tech-serum', 'v-tech-gel-mask', 'exotech-gel'],
  'v-tech': ['v-tech-serum', 'v-tech-gel-mask', 'exotech-gel'],
  nad: ['exo-nad'],
  peeling: ['exo-nad'],
  hair: ['exosignal-hair', 'exosignal-hair-spray'],
  microneedling: ['mitopen'],
  mitopen: ['mitopen'],
  mitoscan: ['mitoscan'],
  diagnostic: ['mitoscan'],
};

export const getProductsForPost = (slug: string): string[] => {
  const post = getPost(slug);
  if (!post) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of post.tags) {
    const slugs = TAG_PRODUCTS[tag];
    if (!slugs) continue;
    for (const s of slugs) {
      if (seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
  }
  return out;
};

export const getPostsForProduct = (
  productSlug: string,
  locale: LocaleType,
  limit = 2
): PostSummary[] => {
  const matchingTags = new Set<string>();
  for (const [tag, slugs] of Object.entries(TAG_PRODUCTS)) {
    if (slugs.includes(productSlug)) matchingTags.add(tag);
  }
  if (matchingTags.size === 0) return [];
  const scored = posts.map((p) => ({
    p,
    score: p.tags.reduce((n, t) => (matchingTags.has(t) ? n + 1 : n), 0),
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.p.date < b.p.date ? 1 : -1;
  });
  return scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map(({ p }) => ({
      slug: p.slug,
      href: `/blog/${p.slug}`,
      date: p.date,
      accent: p.accent,
      image: p.image,
      tags: p.tags,
      title: p.content[locale].title,
      eyebrow: p.content[locale].eyebrow,
      excerpt: p.content[locale].excerpt,
      readTime: p.content[locale].readTime,
    }));
};
