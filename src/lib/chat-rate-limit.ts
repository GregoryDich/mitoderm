/** Tiny in-memory rate limiter — 10 requests / IP / minute on the
 *  product chat. Resets cleanly per process; good enough for cost
 *  protection without bringing in Redis. On Vercel each invocation
 *  shares memory only within the warm instance, which is exactly
 *  what we want — a cold start clears the bucket. */
const BUCKET = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 10;

export function rateLimited(ip: string): { ok: boolean; retryInMs?: number } {
  const now = Date.now();
  const cur = BUCKET.get(ip);
  if (!cur || cur.resetAt <= now) {
    BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (cur.count >= LIMIT) {
    return { ok: false, retryInMs: cur.resetAt - now };
  }
  cur.count++;
  return { ok: true };
}
