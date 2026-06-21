import concernsData from '@/data/concerns.json';
import type { ProductAccent } from '@/products';

export interface Concern {
  slug: string;
  accent: ProductAccent;
  /** Line slugs this concern routes to (most have one, devices has one). */
  lines: string[];
  /** Product slugs this concern features in the landing strip. */
  productSlugs: string[];
  /** Tag set used to filter `posts.json` for the "from the journal"
   *  block on the landing. Reuses the same tag vocabulary that
   *  `TAG_PRODUCTS` and the existing post-side cross-link rely on. */
  postTags: string[];
}

export const concerns: Concern[] = concernsData as Concern[];

export const getConcern = (slug: string): Concern | undefined =>
  concerns.find((c) => c.slug === slug);

export const concernSlugs: string[] = concerns.map((c) => c.slug);
