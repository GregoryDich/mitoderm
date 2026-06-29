import { describe, it, expect } from 'vitest';
import { dictFromMessages, lookupGlossary } from './glossary';

const en = {
  exosomes: 'Nano-sized vesicles released by cells.',
  niacinamide: 'Vitamin B3 — barrier and tone.',
  polynucleotide: 'Long nucleotide chains.',
};

describe('lookupGlossary', () => {
  it('matches the exact term', () => {
    const hit = lookupGlossary('exosomes', en);
    expect(hit?.term).toBe('exosomes');
  });

  it('matches when the term is a substring of the ingredient line', () => {
    const hit = lookupGlossary('Niacinamide (vitamin B3)', en);
    expect(hit?.term).toBe('niacinamide');
  });

  it('is case-insensitive', () => {
    const hit = lookupGlossary('POLYNUCLEOTIDE — low molecular', en);
    expect(hit?.term).toBe('polynucleotide');
  });

  it('returns null when no entry matches', () => {
    const hit = lookupGlossary('Squalane', en);
    expect(hit).toBeNull();
  });

  it('returns the first match in insertion order', () => {
    const dict = { aaa: 'first', bbb: 'second' };
    const hit = lookupGlossary('aaabbb', dict);
    expect(hit?.term).toBe('aaa');
  });
});

describe('dictFromMessages', () => {
  it('lifts the glossary namespace', () => {
    const out = dictFromMessages({ glossary: en });
    expect(out.exosomes).toContain('Nano-sized');
  });

  it('returns an empty dict when glossary is absent', () => {
    expect(dictFromMessages({})).toEqual({});
    expect(dictFromMessages(undefined)).toEqual({});
  });

  it('skips non-string entries', () => {
    const out = dictFromMessages({
      glossary: { good: 'ok', bad: { nested: 'value' } as unknown },
    });
    expect(out.good).toBe('ok');
    expect(out.bad).toBeUndefined();
  });
});
