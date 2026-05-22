import productsData from '@/data/products.json';
import { LocaleType } from './types';

export type ProductCategory =
  | 'exosome'
  | 'serum'
  | 'mask'
  | 'gel'
  | 'peel'
  | 'hair'
  | 'bio-spicules';
export type ProductStatus = 'available' | 'coming-soon';
export type ProductAccent = 'teal' | 'gold' | 'rose';

export interface BenefitItem {
  title: string;
  text: string;
}

export interface StepItem {
  num: string;
  title: string;
  text: string;
}

export interface PackItem {
  qty: string;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ProductContent {
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  /** 3-5 declarative bullets shown at the top of the product page — written
   *  to be cite-able by AI Overviews and to surface the most important facts
   *  to a clinical reader in one glance. */
  keyFacts?: string[];
  stats: StatItem[];
  benefits: BenefitItem[];
  ingredientsIntro: string;
  ingredients: string[];
  stepsTitle?: string;
  steps?: StepItem[];
  packTitle?: string;
  pack?: PackItem[];
  /** Application protocol — concrete volumes, timing, technique. */
  protocol?: { title: string; items: string[] };
  /** After-care recommendations between sessions. */
  aftercare?: { title: string; items: string[] };
  /** Contraindications / safety notes. */
  contraindications?: { title: string; items: string[] };
  /** Clinical / study-style result metrics. Rendered as a strip of
   *  "value + label + source" cards. Optional — block hides when empty. */
  clinicalResults?: {
    title: string;
    intro?: string;
    items: { value: string; label: string; source?: string }[];
  };
  /** "Shop the protocol" structural slot — a curated bundle of the
   *  partner products that complete a session. Each item references
   *  another product slug, with an optional role label (e.g. "Step 1
   *  — Cleanse"). Rendered only when populated. */
  bundle?: {
    title: string;
    intro?: string;
    items: { slug: string; role?: string }[];
  };
  /** Per-region logistics transparency block — lead time, cold chain,
   *  shipping notes for each of IL / EU / Worldwide. Owner-written
   *  facts, rendered as a small 3-up strip. */
  logistics?: {
    title: string;
    intro?: string;
    items: { region: string; leadTime: string; notes?: string }[];
  };
  /** Neutral comparison block — Mitoderm vs other brands across a few
   *  rows. Owner controls the headers, rows and cells. Rendered as a
   *  simple semantic table; column 0 is the row label. */
  comparison?: {
    title: string;
    intro?: string;
    /** Column headers — first must be the row-label column. */
    columns: string[];
    rows: { label: string; cells: string[] }[];
  };
  chipsTitle: string;
  chips: string[];
  ctaTitle: string;
  ctaText: string;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  status: ProductStatus;
  accent: ProductAccent;
  /** Path under /public, e.g. /products/exocell-mask/hero.png. Falls back to a branded placeholder when missing. */
  image?: string;
  /** Additional product photos shown in the gallery section. */
  gallery?: string[];
  content: Record<LocaleType, ProductContent>;
}

// Canonical product list — authored in src/data/products.json and edited
// through the /admin UI. The JSON is the single source of truth; this file
// just types it and exposes helpers.
export const products: Product[] = productsData as Product[];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export interface CatalogItem {
  slug: string;
  href: string;
  category: ProductCategory;
  status: ProductStatus;
  accent: ProductAccent;
  image?: string;
  name: string;
  shortDescription: string;
}

export const getCatalogItems = (locale: LocaleType): CatalogItem[] =>
  products.map((p) => ({
    slug: p.slug,
    href: `/products/${p.slug}`,
    category: p.category,
    status: p.status,
    accent: p.accent,
    image: p.image,
    name: p.content[locale].name,
    shortDescription: p.content[locale].shortDescription,
  }));
