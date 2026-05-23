import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  deleteSocial,
  isInstagramUrl,
  updateSocial,
  type SocialKind,
  type SocialPost,
} from '@/lib/social-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

const KINDS: SocialKind[] = ['reel', 'post', 'seminar'];

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad('invalid_json');
  }
  const patch: Partial<Omit<SocialPost, 'id' | 'createdAt'>> = {};
  if (typeof body.url === 'string') {
    if (!isInstagramUrl(body.url)) return bad('invalid_url');
    patch.url = body.url.trim();
  }
  if (typeof body.kind === 'string') {
    if (!KINDS.includes(body.kind as SocialKind)) return bad('invalid_kind');
    patch.kind = body.kind as SocialKind;
  }
  if (typeof body.poster === 'string') {
    patch.poster = body.poster.trim() || undefined;
  }
  if (typeof body.caption === 'string') {
    patch.caption = body.caption.slice(0, 140) || undefined;
  }
  if (typeof body.date === 'string') {
    patch.date = body.date.trim() || undefined;
  }
  if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;
  if (typeof body.order === 'number') patch.order = body.order;

  const post = await updateSocial(params.id, patch);
  if (!post) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'social.update',
    target: params.id,
    ...requestMeta(req),
    meta: { keys: Object.keys(patch) },
  });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const ok = await deleteSocial(params.id);
  if (!ok) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'social.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
