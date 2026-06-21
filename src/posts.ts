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
