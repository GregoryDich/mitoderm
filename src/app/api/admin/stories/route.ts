import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  createStory,
  readStories,
  type StorySlide,
} from '@/lib/stories-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function GET() {
  if (!isAdmin()) return bad('unauthorized', 401);
  const items = await readStories();
  items.sort((a, b) => a.order - b.order);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad('invalid_json');
  }
  const title = String(body.title ?? '').trim();
  const cover = String(body.cover ?? '').trim();
  const slidesRaw = Array.isArray(body.slides) ? (body.slides as unknown[]) : [];
  const slides: StorySlide[] = [];
  for (const s of slidesRaw) {
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

  const publishAt = body.publishAt
    ? String(body.publishAt).trim() || undefined
    : undefined;
  const expireAt = body.expireAt
    ? String(body.expireAt).trim() || undefined
    : undefined;
  const isPublished = Boolean(body.isPublished);
  const order = typeof body.order === 'number' ? body.order : undefined;

  if (!title) return bad('title_required');
  if (!cover) return bad('cover_required');
  if (slides.length === 0) return bad('slides_required');

  const story = await createStory({
    title,
    cover,
    slides,
    publishAt,
    expireAt,
    isPublished,
    order,
  });
  await logAudit({
    at: new Date().toISOString(),
    action: 'story.create',
    target: story.id,
    ...requestMeta(req),
    meta: { title, slides: slides.length },
  });
  return NextResponse.json({ ok: true, story });
}
