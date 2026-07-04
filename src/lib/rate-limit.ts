/**
 * Generic in-memory rate limiter — per-bucket buckets keyed by IP (or
 * any string identity). Cheap, no Redis dependency, scoped to a warm
 * Vercel invocation; cold-start clears state, which is the right
 * trade-off for spam/abuse protection on a small site.
 *
 * Each named bucket has its own window and limit, so we can be lenient
 * for chat (where a real conversation needs many requests) and strict
 * for login (where 10 attempts/minute already smells like brute force).
 */

const STATE = new Map<string, { count: number; resetAt: number }>();

const BUCKETS = {
  /** Product chat assistant — 10 req/IP/min */
  chat: { window: 60_000, limit: 10 },
  /** Lead form submissions — 5 req/IP/min */
  leads: { window: 60_000, limit: 5 },
  /** /apply clinic applications — 3 req/IP/min (lower bar) */
  apply: { window: 60_000, limit: 3 },
  /** Admin login attempts — 5 req/IP/5min (brute-force defense) */
  adminLogin: { window: 5 * 60_000, limit: 5 },
  /** Social ingest endpoint — 60 req/IP/min (n8n bursts) */
  socialIngest: { window: 60_000, limit: 60 },
} as const;

export type BucketName = keyof typeof BUCKETS;

/** Returns { ok: true } when the caller is within budget; { ok: false,
 *  retryInMs } when over budget. The first parameter selects the bucket,
 *  the second is the per-identity key (typically the IP). */
export function rateLimited(
  bucket: BucketName,
  identity: string
): { ok: boolean; retryInMs?: number } {
  const cfg = BUCKETS[bucket];
  const now = Date.now();
  const key = `${bucket}:${identity}`;
  const cur = STATE.get(key);
  if (!cur || cur.resetAt <= now) {
    STATE.set(key, { count: 1, resetAt: now + cfg.window });
    return { ok: true };
  }
  if (cur.count >= cfg.limit) {
    return { ok: false, retryInMs: cur.resetAt - now };
  }
  cur.count++;
  return { ok: true };
}

/** Extract a best-effort client IP from a Request. Prefers the
 *  x-forwarded-for left-most entry (Vercel sets this), then x-real-ip,
 *  then falls back to the literal string "unknown" so we still rate-limit
 *  the aggregate. */
export function clientIp(req: Request): string {
  // Prefer platform-controlled headers over the raw client-supplied
  // X-Forwarded-For, whose left-most entry a caller can forge to land in
  // a fresh rate-limit bucket every request. Vercel sets
  // x-vercel-forwarded-for / x-real-ip from the true edge connection.
  const trusted =
    req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-real-ip');
  if (trusted) return trusted.split(',')[0]?.trim() || 'unknown';
  // Fallback (non-Vercel / local): use the RIGHT-most XFF entry — the hop
  // the nearest proxy appended, not the spoofable left-most one.
  const parts = (req.headers.get('x-forwarded-for') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
}
