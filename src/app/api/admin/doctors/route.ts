import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  createDoctor,
  readDoctors,
  type DoctorArea,
  type DoctorProfession,
} from '@/lib/doctors-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

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

export async function GET() {
  if (!isAdmin()) return bad('unauthorized', 401);
  const doctors = await readDoctors();
  doctors.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json({ doctors });
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
  const profession = String(body.profession ?? '');
  const city = String(body.city ?? '').trim();
  const area = String(body.area ?? '');
  const contact = String(body.contact ?? '').trim();
  const instagram = body.instagram
    ? String(body.instagram).trim() || undefined
    : undefined;
  const photo = body.photo ? String(body.photo).trim() || undefined : undefined;
  const bio = body.bio ? String(body.bio).trim().slice(0, 2000) || undefined : undefined;
  const isPublished = Boolean(body.isPublished);

  if (!name) return bad('name_required');
  if (!city) return bad('city_required');
  if (!contact) return bad('contact_required');
  if (!PROFESSIONS.includes(profession as DoctorProfession)) {
    return bad('invalid_profession');
  }
  if (!AREAS.includes(area as DoctorArea)) return bad('invalid_area');

  const doc = await createDoctor({
    name,
    profession: profession as DoctorProfession,
    city,
    area: area as DoctorArea,
    contact,
    instagram,
    photo,
    bio,
    isPublished,
  });
  await logAudit({
    at: new Date().toISOString(),
    action: 'doctor.create',
    target: doc.id,
    ...requestMeta(req),
    meta: { name },
  });
  return NextResponse.json({ ok: true, doctor: doc });
}
