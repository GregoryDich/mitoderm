import { NextResponse } from 'next/server';
import { timingSafeEqual, createHmac } from 'node:crypto';
import { createSocial, isInstagramUrl, readSocial, type SocialKind } from '@/lib/social-store';
import { writeAsset } from '@/lib/admin-store';
import { logAudit, requestMeta } from '@/lib/audit-log';
import { clientIp, rateLimited } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Maximum age of a signed ingest request, in milliseconds. n8n sends
 *  the timestamp from its own clock so we keep this wide enough for
 *  modest skew between the runner and Vercel, narrow enough to defeat
 *  a stolen signature being replayed days later. */
const SIGNATURE_MAX_AGE_MS = 5 * 60 * 1000;

/** Bearer auth — strict, constant-time.
 *  Set SOCIAL_INGEST_TOKEN in env; n8n sends Authorization: Bearer <token>.
 *  Optionally set SOCIAL_INGEST_SECRET to require an HMAC-SHA256 body
 *  signature in X-Mitoderm-Signature (format "sha256=<hex>"). When the
 *  secret is set, the request must also include X-Mitoderm-Timestamp
 *  (unix millis) and the signed string is `<ts>\n<raw_body>`. Requests
 *  older than SIGNATURE_MAX_AGE_MS or missing the timestamp are
 *  rejected — this is the replay defence. */
function authorized(req: Request, raw: string, opts?: { skipHmac?: boolean }): boolean {
  const token = process.env.SOCIAL_INGEST_TOKEN;
  if (!token) return false;
  const header = req.headers.get('authorization') ?? '';
  const m = /^Bearer\s+(.+)$/i.exec(header);
  if (!m) return false;
  const sent = Buffer.from(m[1]);
  const expected = Buffer.from(token);
  if (sent.length !== expected.length) return false;
  if (!timingSafeEqual(sent, expected)) return false;

  if (opts?.skipHmac) return true;
  const secret = process.env.SOCIAL_INGEST_SECRET;
  if (secret) {
    const tsHeader = req.headers.get('x-mitoderm-timestamp');
    const ts = Number(tsHeader);
    if (!tsHeader || !Number.isFinite(ts)) return false;
    if (Math.abs(Date.now() - ts) > SIGNATURE_MAX_AGE_MS) return false;

    const sig = req.headers.get('x-mitoderm-signature') ?? '';
    const signedString = `${tsHeader}\n${raw}`;
    const expectedSig =
      'sha256=' + createHmac('sha256', secret).update(signedString).digest('hex');
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  }

  return true;
}

interface IngestBody {
  /** Required — public instagram.com URL (reel / p / tv). Used as the
   *  natural dedup key. */
  url: string;
  /** Optional explicit override; defaults to a heuristic on caption + mediaType. */
  kind?: SocialKind;
  /** IG Graph API media_type — VIDEO / IMAGE / CAROUSEL_ALBUM. */
  mediaType?: string;
  /** Image URL to download as the poster. For Reels use IG's thumbnail_url;
   *  for IMAGE posts use media_url. Server downloads → public/social/. */
  thumbnailUrl?: string;
  /** Already-hosted poster path (skip the download). */
  poster?: string;
  caption?: string;
  /** ISO timestamp or yyyy-mm-dd. */
  postedAt?: string;
  /** Force-publish on ingest (default false — drafts only). */
  isPublished?: boolean;
}

const SEMINAR_RE = /\b(семинар|семінар|seminar|workshop|event|мастер[-\s]?класс|כנס|סדנה|אירוע)\b/i;
const DATE_RE_ISO = /\b(\d{4}-\d{2}-\d{2})\b/;
const DATE_RE_EU = /\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/;

function heuristicKind(b: IngestBody): SocialKind {
  if (b.caption && SEMINAR_RE.test(b.caption)) return 'seminar';
  if (b.mediaType === 'VIDEO') return 'reel';
  return 'post';
}

function parseDate(b: IngestBody): string | undefined {
  if (b.postedAt) {
    // Accept either ISO yyyy-mm-dd or a full timestamp.
    const m = DATE_RE_ISO.exec(b.postedAt);
    if (m) return m[1];
    const d = new Date(b.postedAt);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  if (b.caption) {
    const iso = DATE_RE_ISO.exec(b.caption);
    if (iso) return iso[1];
    const eu = DATE_RE_EU.exec(b.caption);
    if (eu) {
      let [, d, mo, y] = eu;
      if (y.length === 2) y = '20' + y;
      const dd = d.padStart(2, '0');
      const mm = mo.padStart(2, '0');
      const cand = `${y}-${mm}-${dd}`;
      if (!Number.isNaN(new Date(cand).getTime())) return cand;
    }
  }
  return undefined;
}

function inferExt(contentType: string | null, url: string): string {
  if (contentType?.includes('jpeg')) return '.jpg';
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  const m = /\.(jpg|jpeg|png|webp|avif)(?:[?#]|$)/i.exec(url);
  if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  return '.jpg';
}

/** SSRF defense: only allow https poster URLs on known IG/FB CDN hosts.
 *  The Bearer token already gates this endpoint, but the URL is attacker-
 *  controlled and we don't want a stolen token to translate into a
 *  fetch primitive against internal network ranges. Whitelist > deny-
 *  list because the hostname space is small (IG content lives on a
 *  handful of cdninstagram / fbcdn hostnames). */
const POSTER_HOST_RE = /^([a-z0-9-]+\.)*(cdninstagram\.com|fbcdn\.net|instagram\.com)$/i;

function isSafePosterUrl(raw: string): boolean {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== 'https:') return false;
  if (!POSTER_HOST_RE.test(u.hostname)) return false;
  // Block literal private IPs (defence in depth — DNS could still resolve
  // an allowed host to a private IP, but Vercel Functions don't have
  // intranet access anyway).
  if (/^(10\.|127\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(u.hostname)) {
    return false;
  }
  return true;
}

async function downloadPoster(url: string, id: string): Promise<string | undefined> {
  if (!isSafePosterUrl(url)) return undefined;
  try {
    // Hard 8s timeout — IG CDN replies in < 1s normally.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8_000);
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    // Cap at 6 MB — IG thumbnails are well under this.
    if (buf.length > 6 * 1024 * 1024) return undefined;
    const ext = inferExt(res.headers.get('content-type'), url);
    const rel = `social/${id}/poster${ext}`;
    const { url: stored } = await writeAsset(
      rel,
      buf,
      `chore(ingest): social poster ${id}`
    );
    return stored;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  // Per-IP rate limit even though endpoint is Bearer-auth'd — stops
  // a leaked token from being weaponised for unlimited writes.
  const rl = rateLimited('socialIngest', clientIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryInMs: rl.retryInMs },
      { status: 429 }
    );
  }

  const raw = await req.text();
  if (!authorized(req, raw)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body: IngestBody;
  try {
    body = JSON.parse(raw) as IngestBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!body.url || !isInstagramUrl(body.url)) {
    return NextResponse.json({ error: 'invalid_url' }, { status: 400 });
  }

  // Dedup by URL — re-runs from n8n shouldn't pile up duplicates.
  const all = await readSocial();
  const existing = all.find((p) => p.url === body.url);
  if (existing) {
    return NextResponse.json({
      ok: true,
      action: 'skipped_duplicate',
      id: existing.id,
    });
  }

  const kind = body.kind ?? heuristicKind(body);
  const date = parseDate(body);

  // Create the record first so we have an id for the poster filename,
  // then re-update with the poster URL once the download finishes.
  const draft = await createSocial({
    url: body.url,
    kind,
    caption: body.caption?.slice(0, 140),
    date,
    poster: body.poster, // may be undefined; filled below if thumbnailUrl was sent
    isPublished: !!body.isPublished,
  });

  let posterUrl = body.poster;
  if (!posterUrl && body.thumbnailUrl) {
    const stored = await downloadPoster(body.thumbnailUrl, draft.id);
    if (stored) {
      posterUrl = stored;
      // Patch the record with the freshly stored URL.
      const fresh = await readSocial();
      const idx = fresh.findIndex((p) => p.id === draft.id);
      if (idx !== -1) {
        fresh[idx] = { ...fresh[idx], poster: stored, updatedAt: new Date().toISOString() };
        // Re-persist via createSocial isn't appropriate; reach back into the
        // store helper instead. Simplest: use updateSocial.
        const { updateSocial } = await import('@/lib/social-store');
        await updateSocial(draft.id, { poster: stored });
      }
    }
  }

  await logAudit({
    at: new Date().toISOString(),
    action: 'social.create',
    target: draft.id,
    ...requestMeta(req),
    meta: {
      via: 'ingest',
      kind,
      hasPoster: !!posterUrl,
      hasDate: !!date,
    },
  });

  return NextResponse.json({
    ok: true,
    action: 'created',
    id: draft.id,
    kind,
    date,
    posterUrl,
    reviewUrl: `/admin/social/${draft.id}/edit`,
  });
}

/** GET — health probe for n8n's "Wait for webhook" pattern.
 *  Returns 401 if the token is missing/wrong so n8n's first run surfaces
 *  the auth issue immediately. */
export async function GET(req: Request) {
  if (!authorized(req, '', { skipHmac: true })) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, ready: true });
}
