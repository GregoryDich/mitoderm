import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { deleteLead, updateLead, type LeadStatus } from '@/lib/leads-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'closed', 'archived'];

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body: { status?: string; note?: string };
  try {
    body = (await req.json()) as { status?: string; note?: string };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const patch: { status?: LeadStatus; note?: string } = {};
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
    }
    patch.status = body.status as LeadStatus;
  }
  if (body.note !== undefined) {
    patch.note = body.note.toString().slice(0, 4000);
  }
  const lead = await updateLead(params.id, patch);
  if (!lead) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  await logAudit({
    at: new Date().toISOString(),
    action: 'lead.update',
    target: params.id,
    ...requestMeta(req),
    meta: { status: patch.status, noteLen: patch.note?.length },
  });
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const ok = await deleteLead(params.id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  await logAudit({
    at: new Date().toISOString(),
    action: 'lead.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
