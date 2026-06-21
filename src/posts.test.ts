import { describe, it, expect } from 'vitest';
import {
  getRelatedPosts,
  getProductsForPost,
  getPostsForProduct,
  posts,
  getPost,
} from './posts';

describe('posts data', () => {
  it('exposes a non-empty sorted post list', () => {
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });

  it('every post has all three locales', () => {
    for (const p of posts) {
      for (const loc of ['en', 'ru', 'he'] as const) {
        expect(p.content[loc].title).toBeTruthy();
        expect(p.content[loc].excerpt).toBeTruthy();
        expect(p.content[loc].body.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getRelatedPosts', () => {
  it('returns the requested number of posts (or fewer)', () => {
    const first = posts[0];
    const r = getRelatedPosts(first.slug, 'en', 2);
    expect(r.length).toBeLessThanOrEqual(2);
  });

  it('never includes the current post', () => {
    const slug = posts[0].slug;
    const r = getRelatedPosts(slug, 'en', 10);
    expect(r.find((x) => x.slug === slug)).toBeUndefined();
  });

  it('returns [] for an unknown slug', () => {
    expect(getRelatedPosts('does-not-exist', 'en', 2)).toEqual([]);
  });
});

describe('getProductsForPost', () => {
  it('maps the exosomes-tagged post to V-Tech SKUs', () => {
    const post = posts.find((p) => p.tags.includes('exosomes'));
    if (!post) return; // dataset may evolve
    const slugs = getProductsForPost(post.slug);
    expect(slugs).toEqual(expect.arrayContaining(['v-tech-serum']));
  });

  it('returns [] for an unknown slug', () => {
    expect(getProductsForPost('does-not-exist')).toEqual([]);
  });

  it('deduplicates product slugs across overlapping tags', () => {
    const post = posts.find((p) => p.tags.length >= 2);
    if (!post) return;
    const slugs = getProductsForPost(post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getPostsForProduct', () => {
  it('finds the exosomes post from v-tech-serum', () => {
    const out = getPostsForProduct('v-tech-serum', 'en', 5);
    const slugs = out.map((p) => p.slug);
    expect(slugs).toContain('what-are-exosomes-in-skin-care');
  });

  it('returns [] for a product slug with no tag mapping', () => {
    expect(getPostsForProduct('unknown-sku', 'en', 5)).toEqual([]);
  });
});

describe('getPost', () => {
  it('returns the post object for a known slug', () => {
    const slug = posts[0].slug;
    expect(getPost(slug)?.slug).toBe(slug);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getPost('does-not-exist')).toBeUndefined();
  });
});
