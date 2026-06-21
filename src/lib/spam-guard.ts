/** Cheap, zero-config spam defences for public form POSTs.
 *  Layered with the per-IP rate limiter, this kills the bulk of
 *  automated submissions without inconveniencing a real visitor.
 *
 *  Layer 1 — Origin / Referer check. Browsers send one or both for
 *  cross-origin POSTs from forms; bots that forge JSON requests with
 *  scripts often skip them or use a wrong host. We trust localhost
 *  and the configured SITE_URL.
 *
 *  Layer 2 — Honeypot field. The lead form renders a hidden input
 *  named `website` that real users never see (and never fill). Any
 *  body with a non-empty `website` is auto-rejected.
 *
 *  Both layers return *silently* on rejection — we never tell the
 *  caller exactly why. Logging is fine for ourselves; surface in
 *  audit/logs, not in the API response.
 */

import { SITE_URL } from './seo';

const ALLOWED_HOSTS = new Set<string>(['localhost', 'localhost:3000']);
try {
  ALLOWED_HOSTS.add(new URL(SITE_URL).host);
} catch {
  // SITE_URL is a constant in our codebase; this catch is paranoia.
}

/** True when the request appears to come from our own origin. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  // Allow requests with no Origin/Referer (some legitimate clients
  // strip them) when in non-production environments only. In prod
  // we expect at least one to be present.
  if (!origin && !referer) {
    return process.env.NODE_ENV !== 'production';
  }
  const candidates = [origin, referer].filter(Boolean) as string[];
  for (const c of candidates) {
    try {
      const u = new URL(c);
      if (ALLOWED_HOSTS.has(u.host)) return true;
    } catch {
      // Malformed header — treat as mismatch.
    }
  }
  return false;
}

/** True when the honeypot field is empty (or undefined). Real
 *  visitors never fill the hidden `website` input. */
export function honeypotClean(body: { website?: unknown }): boolean {
  return !body.website || (typeof body.website === 'string' && body.website.trim() === '');
}

/** Combined check — call once at the top of a public form route. */
export function spamGuard(
  req: Request,
  body: { website?: unknown }
): { ok: true } | { ok: false; reason: 'origin' | 'honeypot' } {
  if (!isSameOrigin(req)) return { ok: false, reason: 'origin' };
  if (!honeypotClean(body)) return { ok: false, reason: 'honeypot' };
  return { ok: true };
}
