import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  deleteStory,
  updateStory,
  type Story,
  type StorySlide,
} from '@/lib/stories-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

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
  const patch: Partial<Omit<Story, 'id' | 'createdAt'>> = {};
  if (typeof body.title === 'string') patch.title = body.title.trim();
  if (typeof body.cover === 'string') patch.cover = body.cover.trim();
  if (Array.isArray(body.slides)) {
    const slides: StorySlide[] = [];
    for (const s of body.slides as unknown[]) {
      const o = s as Record<string, unknown>;
      const image = String(o.image ?? '').trim();
      if (!image) continue;
      const slide: StorySlide = { image };
      if (o.caption) {
        const c = String(o.caption).slice(0, 140);
        if (c) slide.caption = c;
      }
      if (o.link) {
        const l = String(o.link).trim();
        if (l) slide.link = l;
      }
      slides.push(slide);
    }
    if (slides.length === 0) return bad('slides_required');
    patch.slides = slides;
  }
  if (typeof body.publishAt === 'string') {
    patch.publishAt = body.publishAt.trim() || undefined;
  }
  if (typeof body.expireAt === 'string') {
    patch.expireAt = body.expireAt.trim() || undefined;
  }
  if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;
  if (typeof body.order === 'number') patch.order = body.order;

  const story = await updateStory(params.id, patch);
  if (!story) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'story.update',
    target: params.id,
    ...requestMeta(req),
    meta: { keys: Object.keys(patch) },
  });
  return NextResponse.json({ ok: true, story });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const ok = await deleteStory(params.id);
  if (!ok) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'story.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
