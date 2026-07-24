import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  deleteDoctor,
  updateDoctor,
  type Doctor,
  type DoctorArea,
  type DoctorProfession,
} from '@/lib/doctors-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

const PROFESSIONS: DoctorProfession[] = [
  'doctor',
  'cosmetologist',
  'trichologist',
  'hair-stylist',
  'clinic',
];
const AREAS: DoctorArea[] = ['north', 'center', 'south', 'jerusalem', 'eilat'];

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
  const patch: Partial<Omit<Doctor, 'id' | 'createdAt'>> = {};
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.city === 'string') patch.city = body.city.trim();
  if (typeof body.contact === 'string') patch.contact = body.contact.trim();
  if (typeof body.instagram === 'string') {
    patch.instagram = body.instagram.trim() || undefined;
  }
  if (typeof body.photo === 'string') {
    patch.photo = body.photo.trim() || undefined;
  }
  if (typeof body.bio === 'string') {
    patch.bio = body.bio.slice(0, 2000) || undefined;
  }
  if (typeof body.isPublished === 'boolean') patch.isPublished = body.isPublished;
  if (typeof body.profession === 'string') {
    if (!PROFESSIONS.includes(body.profession as DoctorProfession)) {
      return bad('invalid_profession');
    }
    patch.profession = body.profession as DoctorProfession;
  }
  if (typeof body.area === 'string') {
    if (!AREAS.includes(body.area as DoctorArea)) return bad('invalid_area');
    patch.area = body.area as DoctorArea;
  }
  const doc = await updateDoctor(params.id, patch);
  if (!doc) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'doctor.update',
    target: params.id,
    ...requestMeta(req),
    meta: { keys: Object.keys(patch) },
  });
  return NextResponse.json({ ok: true, doctor: doc });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const ok = await deleteDoctor(params.id);
  if (!ok) return bad('not_found', 404);
  await logAudit({
    at: new Date().toISOString(),
    action: 'doctor.delete',
    target: params.id,
    ...requestMeta(req),
  });
  return NextResponse.json({ ok: true });
}
