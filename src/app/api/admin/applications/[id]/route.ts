import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  deleteClinic,
  regenerateToken,
  reviewClinic,
  setClinicPerks,
} from '@/lib/clinics-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let body: { action?: string; note?: string };
  try {
    body = (await req.json()) as { action?: string; note?: string };
  } catch {
    return bad('invalid_json');
  }
  if (body.action === 'approve' || body.action === 'reject') {
    const c = await reviewClinic(params.id, {
      status: body.action === 'approve' ? 'approved' : 'rejected',
      note: body.note,
    });
    if (!c) return bad('not_found', 404);
    await logAudit({
      at: new Date().toISOString(),
      action: body.action === 'approve' ? 'clinic.approve' : 'clinic.reject',
      target: params.id,
      ...requestMeta(req),
    });
    return NextResponse.json({ ok: true, clinic: c });
  }
  if (body.action === 'regenerate') {
    const c = await regenerateToken(params.id);
    if (!c) return bad('not_found', 404);
    await logAudit({
      at: new Date().toISOString(),
      action: 'clinic.regenerateToken',
      target: params.id,
      ...requestMeta(req),
    });
    return NextResponse.json({ ok: true, clinic: c });
  }
  if (body.action === 'perks') {
    const raw = (body as Record<string, unknown>).perks as
      | Record<string, unknown>
      | undefined;
    if (!raw || typeof raw !== 'object') return bad('invalid_perks');
    const c = await setClinicPerks(params.id, {
      referralCode:
        raw.referralCode === null
          ? null
          : typeof raw.referralCode === 'string'
          ? raw.referralCode
          : undefined,
      referralRate:
        raw.referralRate === null
          ? null
          : typeof raw.referralRate === 'number'
          ? raw.referralRate
          : undefined,
      loyaltyTier:
        raw.loyaltyTier === null
          ? null
          : typeof raw.loyaltyTier === 'string'
          ? raw.loyaltyTier
          : undefined,
      loyaltyDiscount:
        raw.loyaltyDiscount === null
          ? null
          : typeof raw.loyaltyDiscount === 'number'
          ? raw.loyaltyDiscount
          : undefined,
    });
    if (!c) return bad('not_found', 404);
    await logAudit({
      at: new Date().toISOString(),
      action: 'clinic.regenerateToken',
      target: params.id,
      ...requestMeta(req),
      meta: { kind: 'perks', keys: Object.keys(raw) },
    });
    return NextResponse.json({ ok: true, clinic: c });
  }
  return bad('invalid_action');
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const ok = await deleteClinic(params.id);
  if (!ok) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'clinic.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
