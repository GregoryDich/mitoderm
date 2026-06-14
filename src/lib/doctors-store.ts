import fs from 'node:fs/promises';
import path from 'node:path';
import { writeAsset } from './admin-store';

const FILE_PATH = 'src/data/doctors.json';

export type DoctorProfession = 'doctor' | 'cosmetologist' | 'clinic';
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

function makeId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9א-ת]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

export async function createDoctor(
  input: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt' | 'isPublished'> & {
    isPublished?: boolean;
  }
): Promise<Doctor> {
  const all = await readDoctors();
  const now = new Date().toISOString();
  const doc: Doctor = {
    id: makeId(input.name),
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
