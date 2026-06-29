import { describe, it, expect } from 'vitest';
import { getProductsForTerm, getProduct, products } from './products';

describe('getProductsForTerm (glossary funnel)', () => {
  it('returns slim chips whose slugs all resolve to real products', () => {
    // "exosome" appears in the ingredient lists of the core face line.
    const chips = getProductsForTerm('exosome', 'en');
    expect(chips.length).toBeGreaterThan(0);
    for (const chip of chips) {
      const p = getProduct(chip.slug);
      expect(p, `chip slug ${chip.slug} must resolve`).toBeTruthy();
      expect(chip.href).toBe(`/products/${chip.slug}`);
      expect(['teal', 'gold', 'rose']).toContain(chip.accent);
      expect(chip.name.length).toBeGreaterThan(0);
    }
  });

  it('never returns coming-soon products', () => {
    const comingSoon = new Set(
      products.filter((p) => p.status === 'coming-soon').map((p) => p.slug)
    );
    // Probe a handful of common terms.
    for (const term of ['exosome', 'peptide', 'hyaluronic', 'niacinamide']) {
      for (const chip of getProductsForTerm(term, 'en')) {
        expect(comingSoon.has(chip.slug)).toBe(false);
      }
    }
  });

  it('returns an empty array for an unmatched term', () => {
    expect(getProductsForTerm('definitely-not-an-ingredient-xyz', 'en')).toEqual(
      []
    );
    expect(getProductsForTerm('', 'en')).toEqual([]);
  });

  it('matches case-insensitively', () => {
    const lower = getProductsForTerm('exosome', 'en').map((c) => c.slug).sort();
    const upper = getProductsForTerm('EXOSOME', 'en').map((c) => c.slug).sort();
    expect(upper).toEqual(lower);
  });
});
