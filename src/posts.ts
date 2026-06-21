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
