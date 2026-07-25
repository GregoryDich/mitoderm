import fs from 'node:fs/promises';
import path from 'node:path';
import { writeAsset } from './admin-store';

const FILE_PATH = 'src/data/doctors.json';

export type DoctorProfession =
  | 'doctor'
  | 'cosmetologist'
  | 'trichologist'
  | 'hair-stylist'
  | 'clinic';
export type DoctorArea = 'north' | 'center' | 'south' | 'jerusalem' | 'eilat';

export interface Doctor {
  id: string;
  name: string;
  profession: DoctorProfession;
  city: string;
  area: DoctorArea;
  contact: string;
  instagram?: string;
  photo?: string;
  bio?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

function abs(p: string) {
  return path.join(process.cwd(), p);
}

async function exists(p: string) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

export async function readDoctors(): Promise<Doctor[]> {
  const file = abs(FILE_PATH);
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(file, 'utf8');
  try {
    const arr = JSON.parse(raw) as Doctor[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function persist(
  doctors: Doctor[],
  message: string
): Promise<{ persisted: 'local' | 'github' }> {
  const json = JSON.stringify(doctors, null, 2) + '\n';
  // writeAsset writes binary under /public — for src/data we use direct fs
  // writes here so the existing GitHub adapter can be reused via
  // writeProducts-style helper. Keep this simple for now: always write
  // locally; the GitHub mirror can be added later when needed.
  const file = abs(FILE_PATH);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, json, 'utf8');
  // Touch writeAsset import so tree-shaking doesn't drop it before the
  // GitHub mirror is wired (placeholder for parity with products store).
  void writeAsset;
  void message;
  return { persisted: 'local' };
}

/** Next clean sequential id (md-001, md-002, …) from the current max.
 *  Keeps the whole table on one tidy scheme regardless of how a record
 *  was added — single form, bulk import or seed. */
function nextDoctorId(all: Doctor[]): string {
  let max = 0;
  for (const d of all) {
    const m = /^md-(\d+)$/.exec(d.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `md-${String(max + 1).padStart(3, '0')}`;
}

export async function createDoctor(
  input: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'isPublished'> & {
    isPublished?: boolean;
  }
): Promise<Doctor> {
  const all = await readDoctors();
  const now = new Date().toISOString();
  const doc: Doctor = {
    id: nextDoctorId(all),
    name: input.name,
    profession: input.profession,
    city: input.city,
    area: input.area,
    contact: input.contact,
    instagram: input.instagram,
    photo: input.photo,
    bio: input.bio,
    isPublished: input.isPublished ?? false,
    createdAt: now,
    updatedAt: now,
  };
  all.push(doc);
  await persist(all, `chore(admin): add doctor ${doc.id}`);
  return doc;
}

export type DoctorInput = Omit<
  Doctor,
  'id' | 'createdAt' | 'updatedAt' | 'isPublished'
> & { isPublished?: boolean };

/** Create many records in one write. Skips rows that duplicate an existing
 *  entry (same name + contact, case-insensitive) so re-running an import is
 *  safe. Ids are assigned as a clean md-NNN run after the current max. */
export async function createDoctorsBulk(
  inputs: DoctorInput[]
): Promise<{ created: number; skipped: number }> {
  const all = await readDoctors();
  const now = new Date().toISOString();
  const key = (name: string, contact: string) =>
    `${name.trim().toLowerCase()}|${contact.trim().toLowerCase()}`;
  const seen = new Set(all.map((d) => key(d.name, d.contact)));

  let created = 0;
  let skipped = 0;
  for (const input of inputs) {
    const k = key(input.name, input.contact);
    if (seen.has(k)) {
      skipped += 1;
      continue;
    }
    seen.add(k);
    all.push({
      id: nextDoctorId(all),
      name: input.name,
      profession: input.profession,
      city: input.city,
      area: input.area,
      contact: input.contact,
      instagram: input.instagram,
      photo: input.photo,
      bio: input.bio,
      isPublished: input.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    });
    created += 1;
  }

  if (created > 0) {
    await persist(all, `chore(admin): bulk import ${created} doctors`);
  }
  return { created, skipped };
}

export async function updateDoctor(
  id: string,
  patch: Partial<Omit<Doctor, 'id' | 'createdAt'>>
): Promise<Doctor | null> {
  const all = await readDoctors();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  all[idx] = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await persist(all, `chore(admin): update doctor ${id}`);
  return all[idx];
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const all = await readDoctors();
  const next = all.filter((d) => d.id !== id);
  if (next.length === all.length) return false;
  await persist(next, `chore(admin): delete doctor ${id}`);
  return true;
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  const all = await readDoctors();
  return all.find((d) => d.id === id) ?? null;
}
