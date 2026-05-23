/**
 * Lightweight A/B experiment harness.
 *
 * Each experiment has an id and a list of variants. On first visit the
 * middleware sticks a random variant assignment in a cookie, then the
 * cookie is read by server components / route handlers and the assigned
 * variant drives whatever conditional code we want to test.
 *
 * Experiments are declared in EXPERIMENTS below. To run an experiment:
 *   1. Add it to the list.
 *   2. Optionally rotate the seed (changes nothing meaningful — purely
 *      ceremonial since cookies are sticky per visitor).
 *   3. Read the assignment in your component via getVariant(id).
 *   4. Surface conversions via analytics with the variant tag.
 *
 * No external dependency, no analytics integration assumed — that's
 * intentional. PostHog / Plausible / GA4 reading the cookie attribute
 * gives full reporting at zero in-app cost.
 */

export interface Experiment {
  id: string;
  /** Weighted variant list — weights are relative integers, default 1. */
  variants: { id: string; weight?: number }[];
  /** When false, assignments aren't issued (kill switch). */
  enabled: boolean;
}

export const EXPERIMENTS: Experiment[] = [
  // Example experiment — owner can add real ones as needed.
  // {
  //   id: 'hero-cta-copy',
  //   enabled: true,
  //   variants: [
  //     { id: 'control' },
  //     { id: 'urgent' },
  //   ],
  // },
];

export const ASSIGNMENT_COOKIE = 'mitoderm_ab';

/** Parse the assignment cookie into a {id: variant} map. */
export function parseAssignments(
  cookieValue: string | undefined | null
): Record<string, string> {
  if (!cookieValue) return {};
  try {
    const parsed = JSON.parse(
      Buffer.from(cookieValue, 'base64url').toString('utf8')
    );
    if (parsed && typeof parsed === 'object') {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') out[k] = v;
      }
      return out;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function serializeAssignments(map: Record<string, string>): string {
  return Buffer.from(JSON.stringify(map), 'utf8').toString('base64url');
}

/** Pick a variant for an experiment using a uniform weighted draw. */
export function pickVariant(exp: Experiment): string {
  if (!exp.enabled || exp.variants.length === 0) return 'control';
  const total = exp.variants.reduce((s, v) => s + (v.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const v of exp.variants) {
    r -= v.weight ?? 1;
    if (r <= 0) return v.id;
  }
  return exp.variants[exp.variants.length - 1].id;
}

/** Server-component helper — read the visitor's variant for a given
 *  experiment id. Returns 'control' when the experiment isn't running. */
export async function getVariant(experimentId: string): Promise<string> {
  if (typeof window !== 'undefined') return 'control';
  // Dynamic import so this module remains pure for client bundles.
  const { cookies } = await import('next/headers');
  const value = cookies().get(ASSIGNMENT_COOKIE)?.value;
  const map = parseAssignments(value);
  return map[experimentId] ?? 'control';
}

/** Compute the assignments map a fresh visitor should receive. Stable
 *  across pages because the middleware writes the cookie after the
 *  first decision. */
export function assignAll(
  existing: Record<string, string>
): Record<string, string> {
  let next = existing;
  let mutated = false;
  for (const exp of EXPERIMENTS) {
    if (!exp.enabled) continue;
    if (!(exp.id in next)) {
      if (!mutated) next = { ...existing };
      next[exp.id] = pickVariant(exp);
      mutated = true;
    }
  }
  return mutated ? next : existing;
}
