import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { createPress, readPress } from '@/lib/press-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function GET() {
  if (!isAdmin()) return bad('unauthorized', 401);
  const items = await readPress();
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
  const name = String(body.name ?? '').trim();
  const logo = String(body.logo ?? '').trim();
  const url = body.url ? String(body.url).trim() || undefined : undefined;
  const isPublished = Boolean(body.isPublished);
  const order = typeof body.order === 'number' ? body.order : undefined;

  if (!name) return bad('name_required');
  if (!logo) return bad('logo_required');

  const item = await createPress({ name, logo, url, isPublished, order });
  await logAudit({
    at: new Date().toISOString(),
    action: 'press.create',
    target: item.id,
    ...requestMeta(req),
    meta: { name },
  });
  return NextResponse.json({ ok: true, item });
}
