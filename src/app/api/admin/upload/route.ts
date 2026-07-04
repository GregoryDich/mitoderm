import { NextResponse } from 'next/server';
import path from 'node:path';
import { isAdmin } from '@/lib/admin-auth';
import { writeAsset } from '@/lib/admin-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

// No SVG: an uploaded SVG is served same-origin as a top-level document
// and can carry inline <script> (stored XSS under the current CSP).
// Raster formats cover all product media.
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

// Next API body limit is ~4.5MB by default; we cap conservatively per kind.
// Video clips for hover-loops should be short (4-10s muted) — 12MB is
// already generous for an H.264 1080p 8s clip.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_VIDEO_BYTES = 12 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

function sanitizeName(input: string, fallbackExt: string): string {
  const lower = (input || '').toLowerCase();
  const base = path.basename(lower).replace(/\?.*$/, '');
  const cleaned = base.replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-');
  const trimmed = cleaned.replace(/^[-.]+|[-.]+$/g, '');
  if (!trimmed) return `image${fallbackExt}`;
  // Force one of the allowed extensions if there isn't one already.
  if (!/\.[a-z0-9]+$/.test(trimmed)) return `${trimmed}${fallbackExt}`;
  return trimmed;
}

function extFromType(t: string): string {
  if (t === 'image/jpeg') return '.jpg';
  if (t === 'image/png') return '.png';
  if (t === 'image/webp') return '.webp';
  if (t === 'image/avif') return '.avif';
  if (t === 'image/svg+xml') return '.svg';
  if (t === 'video/mp4') return '.mp4';
  if (t === 'video/webm') return '.webm';
  return '.bin';
}

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  const slug = String(form.get('slug') ?? '').trim();
  const file = form.get('file');
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 });
  }
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'no_file' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'bad_type', type: file.type },
      { status: 415 }
    );
  }
  const isVideo = VIDEO_TYPES.includes(file.type);
  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    return NextResponse.json(
      { error: 'too_large', size: file.size, max, kind: isVideo ? 'video' : 'image' },
      { status: 413 }
    );
  }

  const ext = extFromType(file.type);
  // `File.name` exists when the Blob came from a multipart upload.
  const original = (file as File).name || `image${ext}`;
  const filename = sanitizeName(original, ext);
  const rel = `products/${slug}/${filename}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  try {
    const { url, persisted } = await writeAsset(
      rel,
      bytes,
      `chore(admin): upload ${rel}`
    );
    await logAudit({
      at: new Date().toISOString(),
      action: 'asset.upload',
      target: rel,
      ...requestMeta(req),
      meta: { persisted, bytes: bytes.length, type: file.type },
    });
    return NextResponse.json({ ok: true, url, persisted, bytes: bytes.length });
  } catch (e) {
    return NextResponse.json(
      { error: 'write_failed', message: (e as Error).message },
      { status: 500 }
    );
  }
}
