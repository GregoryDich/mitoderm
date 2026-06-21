import { describe, it, expect } from 'vitest';
import { concerns, getConcern } from './concerns';
import { getProduct, lines } from './products';

describe('concerns data', () => {
  it('exposes a non-empty list', () => {
    expect(concerns.length).toBeGreaterThan(0);
  });

  it('every slug is unique', () => {
    const slugs = concerns.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('concerns integrity', () => {
  it('every mapped line slug resolves to a real line', () => {
    const lineSlugs = new Set<string>(lines.map((l) => l.slug));
    const bad: string[] = [];
    for (const c of concerns) {
      for (const slug of c.lines) {
        if (!lineSlugs.has(slug)) bad.push(`${c.slug}→line:${slug}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every mapped product slug resolves to a real product', () => {
    const bad: string[] = [];
    for (const c of concerns) {
      for (const slug of c.productSlugs) {
        if (!getProduct(slug)) bad.push(`${c.slug}→product:${slug}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('getConcern', () => {
  it('returns the concern for a known slug', () => {
    expect(getConcern('density')?.slug).toBe('density');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getConcern('does-not-exist')).toBeUndefined();
  });
});
