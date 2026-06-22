import productsData from '@/data/products.json';
import linesData from '@/data/lines.json';
import { LocaleType } from './types';

export type ProductCategory =
  | 'exosome'
  | 'serum'
  | 'mask'
  | 'gel'
  | 'peel'
  | 'hair'
  | 'bio-spicules'
  | 'device';
export type ProductStatus = 'available' | 'coming-soon';
export type ProductAccent = 'teal' | 'gold' | 'rose';
export type ProductLineSlug =
  | 'exosomes'
  | 'exosignal-hair'
  | 'peeling'
  | 'bio-spicules'
  | 'devices';

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
  /** Per-clinic economics — cost per session, suggested patient
   *  charge, gross margin, total sessions per kit. Owner-authored
   *  figures (currency, format, anything). Rendered as a clean
   *  numbers strip with a small disclaimer line. */
  economics?: {
    title: string;
    intro?: string;
    items: { label: string; value: string; sub?: string }[];
    disclaimer?: string;
  };
  /** Before/after image pairs from real clinical sessions. Each pair
   *  has a "before" and "after" public path; optional indication and
   *  weeksAfter for the corner label. Rendered as a tap-to-compare
   *  slider; empty stays invisible. */
  beforeAfter?: {
    title: string;
    intro?: string;
    pairs: {
      before: string;
      after: string;
      indication?: string;
      weeksAfter?: string;
    }[];
  };
  /** Product-specific FAQ surfaced as a chat-style assistant on the
   *  PDP. Each item has a short question and a canned answer; the
   *  widget also offers a free-text input that escalates to WhatsApp
   *  with the typed question pre-filled. */
  faq?: {
    title: string;
    intro?: string;
    items: { q: string; a: string }[];
  };
  /** Practitioner training resources — short videos (YouTube /
   *  self-hosted), protocol PDFs, certification info. Rendered as a
   *  resource grid; items with a 'video' kind embed lazily on click. */
  training?: {
    title: string;
    intro?: string;
    items: {
      kind: 'video' | 'pdf' | 'cert' | 'link';
      title: string;
      /** YouTube URL, PDF path under /public, or external link. */
      href: string;
      duration?: string;
      description?: string;
    }[];
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
  /** Short muted autoplay loop (mp4 / webm) used as a hover-to-play
   *  preview on catalog and featured cards. Must be owner-uploaded
   *  content — no third-party clips. Typical length 4–10s, ≤ 12 MB. */
  cardVideo?: string;
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
  cardVideo?: string;
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
    cardVideo: p.cardVideo,
    name: p.content[locale].name,
    shortDescription: p.content[locale].shortDescription,
  }));

/** Slim product reference used by the glossary funnel — just enough to
 *  render a linked chip. */
export interface ProductChip {
  slug: string;
  href: string;
  name: string;
  accent: ProductAccent;
}

/** Reverse of `lookupGlossary`: given a glossary term, find the products
 *  whose ingredient list mentions it (case-insensitive substring, the
 *  same matching rule the tooltip uses). Returns slim chips so the full
 *  products dataset never has to cross into a client bundle — call this
 *  on the server (e.g. in the glossary route) and pass the result down.
 *
 *  Coming-soon products are skipped — there's nothing to link to yet. */
export const getProductsForTerm = (
  term: string,
  locale: LocaleType
): ProductChip[] => {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];
  return products
    .filter((p) => p.status !== 'coming-soon')
    .filter((p) =>
      p.content[locale].ingredients.some((ing) =>
        ing.toLowerCase().includes(needle)
      )
    )
    .map((p) => ({
      slug: p.slug,
      href: `/products/${p.slug}`,
      name: p.content[locale].name,
      accent: p.accent,
    }));
};

/** Product line — the "by-system" view of the catalog. A line groups
 *  several products (e.g. V-Tech Serum + Gel Mask + Exotech Gel make up
 *  the Exosomes face system) and carries its own brand story, clinical
 *  protocol and indications. Rendered on the homepage as a row of large
 *  cards, with one dedicated landing page per line at /lines/<slug>. */
export interface LineContent {
  name: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  story: string;
  indications: string[];
  ingredientsLead: string;
  protocolTitle: string;
  protocolItems: string[];
  ctaTitle: string;
  ctaText: string;
}

export interface ProductLine {
  slug: ProductLineSlug;
  accent: ProductAccent;
  image: string;
  /** Product slugs that belong to this line, in display order. May be
   *  empty when the line is coming-soon. */
  products: string[];
  status: ProductStatus;
  order: number;
  content: Record<LocaleType, LineContent>;
}

export const lines: ProductLine[] = (linesData as unknown as ProductLine[])
  .slice()
  .sort((a, b) => a.order - b.order);

export const getLine = (slug: string): ProductLine | undefined =>
  lines.find((l) => l.slug === slug);

export interface LineSummary {
  slug: ProductLineSlug;
  href: string;
  accent: ProductAccent;
  image: string;
  status: ProductStatus;
  /** Resolved product CatalogItems for this line in the requested locale. */
  items: CatalogItem[];
  name: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
}

export const getLineSummaries = (locale: LocaleType): LineSummary[] => {
  const catalog = getCatalogItems(locale);
  return lines.map((l) => ({
    slug: l.slug,
    href: `/lines/${l.slug}`,
    accent: l.accent,
    image: l.image,
    status: l.status,
    items: l.products
      .map((s) => catalog.find((c) => c.slug === s))
      .filter((x): x is CatalogItem => !!x),
    name: l.content[locale].name,
    eyebrow: l.content[locale].eyebrow,
    tagline: l.content[locale].tagline,
    shortDescription: l.content[locale].shortDescription,
  }));
};
