import vTechSerum from '@/data/journeys/v-tech-serum.json';

/** One scroll "chapter" of a Product Journey — the cinematic, scroll-driven
 *  alternate top of a PDP. The chapter's *content* is derived from the
 *  product's existing localized data (benefits, steps, results, …); this
 *  config only carries the per-chapter background media and ordering, so a
 *  new product gets a Journey by dropping in a `journeys/<slug>.json` plus
 *  keyframe images — no code change. See `docs/product-funnel.md`. */
export interface JourneyChapterConfig {
  /** Stable chapter id — maps to a fixed content builder in ProductJourney
   *  and to the `productJourney.ch{n}*` i18n labels. */
  id: 'arrival' | 'plateau' | 'mechanism' | 'product' | 'proof' | 'partner';
  /** Public path to the chapter's keyframe/background image. Placeholder
   *  today (product hero); real keyframes drop in per the doc's §5 table. */
  media: string;
}

export interface JourneyConfig {
  slug: string;
  chapters: JourneyChapterConfig[];
}

/** Registry of products that opt into the Journey experience. Everything
 *  not listed here renders the classic PDP untouched. */
const registry: Record<string, JourneyConfig> = {
  'v-tech-serum': vTechSerum as JourneyConfig,
};

export const getJourney = (slug: string): JourneyConfig | undefined =>
  registry[slug];

export const hasJourney = (slug: string): boolean =>
  Object.prototype.hasOwnProperty.call(registry, slug);
