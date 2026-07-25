import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  createDoctorsBulk,
  type DoctorArea,
  type DoctorInput,
  type DoctorProfession,
} from '@/lib/doctors-store';
import { fromCsv } from '@/lib/csv';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PROFESSIONS: DoctorProfession[] = [
  'doctor',
  'cosmetologist',
  'trichologist',
  'hair-stylist',
  'clinic',
];
const AREAS: DoctorArea[] = ['north', 'center', 'south', 'jerusalem', 'eilat'];

/** Column-name aliases so the same importer eats our Export CSV and a
 *  loosely-typed sheet. Keys are lowercased header names. */
const ALIASES: Record<string, keyof DoctorInput | 'isPublished'> = {
  name: 'name',
  'имя': 'name',
  שם: 'name',
  profession: 'profession',
  профессия: 'profession',
  city: 'city',
  город: 'city',
  עיר: 'city',
  area: 'area',
  район: 'area',
  contact: 'contact',
  phone: 'contact',
  контакт: 'contact',
  טלפון: 'contact',
  instagram: 'instagram',
  bio: 'bio',
  photo: 'photo',
  ispublished: 'isPublished',
  published: 'isPublished',
};

const truthy = (v: string) => /^(yes|y|true|1|да|published)$/i.test(v.trim());

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function POST(req: Request) {
  if (!isAdmin()) return bad('unauthorized', 401);

  let csv = '';
  let publishAll = false;
  const ctype = req.headers.get('content-type') ?? '';
  try {
    if (ctype.includes('application/json')) {
      const body = (await req.json()) as { csv?: unknown; publish?: unknown };
      csv = String(body.csv ?? '');
      publishAll = Boolean(body.publish);
    } else {
      csv = await req.text();
    }
  } catch {
    return bad('invalid_body');
  }
  if (!csv.trim()) return bad('empty');

  const rows = fromCsv(csv);
  if (rows.length === 0) return bad('no_rows');

  const inputs: DoctorInput[] = [];
  const errors: { row: number; reason: string }[] = [];

  rows.forEach((raw, i) => {
    const rec: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      const mapped = ALIASES[k.trim().toLowerCase()];
      if (mapped) rec[mapped] = v;
    }

    const name = (rec.name ?? '').trim();
    if (!name) {
      errors.push({ row: i + 2, reason: 'missing name' });
      return;
    }
    const professionRaw = (rec.profession ?? '').trim().toLowerCase();
    const profession = (professionRaw || 'cosmetologist') as DoctorProfession;
    if (!PROFESSIONS.includes(profession)) {
      errors.push({ row: i + 2, reason: `unknown profession "${professionRaw}"` });
      return;
    }
    const areaRaw = (rec.area ?? '').trim().toLowerCase();
    const area = (AREAS.includes(areaRaw as DoctorArea)
      ? areaRaw
      : 'center') as DoctorArea;

    inputs.push({
      name,
      profession,
      city: (rec.city ?? '').trim(),
      area,
      contact: (rec.contact ?? '').trim(),
      instagram: rec.instagram?.trim() || undefined,
      photo: rec.photo?.trim() || undefined,
      bio: rec.bio?.trim().slice(0, 2000) || undefined,
      isPublished: publishAll || truthy(rec.isPublished ?? ''),
    });
  });

  const { created, skipped } = await createDoctorsBulk(inputs);

  await logAudit({
    at: new Date().toISOString(),
    action: 'doctor.import',
    target: `${created} created`,
    ...requestMeta(req),
    meta: { created, skipped, invalid: errors.length },
  });

  return NextResponse.json({
    ok: true,
    created,
    skipped,
    invalid: errors.length,
    errors: errors.slice(0, 50),
  });
}
