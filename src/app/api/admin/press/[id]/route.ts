import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { deletePress, updatePress, type PressItem } from '@/lib/press-store';
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
  const patch: Partial<Omit<PressItem, 'id' | 'createdAt'>> = {};
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.logo === 'string') patch.logo = body.logo.trim();
  if (typeof body.url === 'string') patch.url = body.url.trim() || undefined;
  if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;
  if (typeof body.order === 'number') patch.order = body.order;

  const item = await updatePress(params.id, patch);
  if (!item) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'press.update',
    target: params.id,
    ...requestMeta(req),
    meta: { keys: Object.keys(patch) },
  });
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const ok = await deletePress(params.id);
  if (!ok) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'press.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
