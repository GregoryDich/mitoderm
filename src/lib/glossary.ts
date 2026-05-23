import type { LocaleType } from '@/types';

/** Match an ingredient string against the glossary. The match is
 *  case-insensitive and looks for any term being a substring of the
 *  ingredient line — so "Niacinamide (vitamin B3)" matches the
 *  "niacinamide" key. Returns null if no entry is found.
 *
 *  Owner edits the dictionary in messages/{en,ru,he}.json under the
 *  `glossary` namespace; the structure is { term: definition }. */
export function lookupGlossary(
  ingredient: string,
  glossary: Record<string, string>
): { term: string; def: string } | null {
  const hay = ingredient.toLowerCase();
  for (const [term, def] of Object.entries(glossary)) {
    if (!term || !def) continue;
    if (hay.includes(term.toLowerCase())) {
      return { term, def };
    }
  }
  return null;
}

/** Get a flat dictionary of glossary entries from next-intl messages. */
export function dictFromMessages(
  messages: Record<string, unknown> | undefined
): Record<string, string> {
  const g = (messages?.glossary ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(g)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

// Re-export for usage clarity at call sites.
export type { LocaleType };
