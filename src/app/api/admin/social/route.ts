import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  createSocial,
  isInstagramUrl,
  readSocial,
  type SocialKind,
} from '@/lib/social-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const KINDS: SocialKind[] = ['reel', 'post', 'seminar'];

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function GET() {
  if (!isAdmin()) return bad('unauthorized', 401);
  const posts = await readSocial();
  posts.sort((a, b) => a.order - b.order);
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad('invalid_json');
  }
  const url = String(body.url ?? '').trim();
  const kind = String(body.kind ?? '');
  const poster = body.poster
    ? String(body.poster).trim() || undefined
    : undefined;
  const caption = body.caption
    ? String(body.caption).trim().slice(0, 140) || undefined
    : undefined;
  const date = body.date ? String(body.date).trim() || undefined : undefined;
  const isPublished = Boolean(body.isPublished);
  const order = typeof body.order === 'number' ? body.order : undefined;

  if (!isInstagramUrl(url)) return bad('invalid_url');
  if (!KINDS.includes(kind as SocialKind)) return bad('invalid_kind');

  const post = await createSocial({
    url,
    kind: kind as SocialKind,
    poster,
    caption,
    date,
    isPublished,
    order,
  });
  await logAudit({
    at: new Date().toISOString(),
    action: 'social.create',
    target: post.id,
    ...requestMeta(req),
    meta: { kind, url },
  });
  return NextResponse.json({ ok: true, post });
}
