import { NextResponse } from 'next/server';
import { timingSafeEqual, createHmac } from 'node:crypto';
import { createSocial, isInstagramUrl, readSocial, type SocialKind } from '@/lib/social-store';
import { writeAsset } from '@/lib/admin-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Bearer auth — strict, constant-time.
 *  Set SOCIAL_INGEST_TOKEN in env; n8n sends Authorization: Bearer <token>.
 *  Optionally set SOCIAL_INGEST_SECRET for an HMAC-SHA256 body signature
 *  in the X-Mitoderm-Signature header (format "sha256=<hex>"). */
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
    const sig = req.headers.get('x-mitoderm-signature') ?? '';
    const expectedSig =
      'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
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

async function downloadPoster(url: string, id: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
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
