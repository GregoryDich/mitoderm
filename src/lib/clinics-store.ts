import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const FILE_PATH = 'data/clinics.json';

export type ClinicStatus = 'pending' | 'approved' | 'rejected';

export interface ClinicAccount {
  id: string;
  /** Used as natural key — duplicate emails are rejected at submission. */
  email: string;
  name: string;
  phone?: string;
  clinic: string;
  /** Free-text license / clinic number / business id. */
  license?: string;
  city?: string;
  instagram?: string;
  message?: string;
  status: ClinicStatus;
  /** Random opaque token — the magic-link login factor. Only set once
   *  the application is approved. */
  token?: string;
  appliedAt: string;
  reviewedAt?: string;
  lastLoginAt?: string;
  /** Free-text internal note from the admin reviewer. */
  note?: string;
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

export async function readClinics(): Promise<ClinicAccount[]> {
  const file = abs(FILE_PATH);
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(file, 'utf8');
  try {
    const arr = JSON.parse(raw) as ClinicAccount[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function persist(items: ClinicAccount[]) {
  const file = abs(FILE_PATH);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(items, null, 2) + '\n', 'utf8');
}

function makeId(email: string) {
  return (
    email.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}

function makeToken() {
  // 32 bytes of url-safe random ≈ 256-bit entropy.
  return randomBytes(32).toString('base64url');
}

export async function applyClinic(
  input: Omit<ClinicAccount, 'id' | 'status' | 'appliedAt' | 'token'>
): Promise<{ ok: true; clinic: ClinicAccount } | { ok: false; error: string }> {
  const all = await readClinics();
  const email = input.email.toLowerCase().trim();
  if (all.some((c) => c.email.toLowerCase() === email)) {
    return { ok: false, error: 'duplicate_email' };
  }
  const clinic: ClinicAccount = {
    id: makeId(email),
    email,
    name: input.name.trim(),
    phone: input.phone?.trim() || undefined,
    clinic: input.clinic.trim(),
    license: input.license?.trim() || undefined,
    city: input.city?.trim() || undefined,
    instagram: input.instagram?.trim() || undefined,
    message: input.message?.trim() || undefined,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };
  all.push(clinic);
  await persist(all);
  return { ok: true, clinic };
}

export async function reviewClinic(
  id: string,
  patch: { status: 'approved' | 'rejected'; note?: string }
): Promise<ClinicAccount | null> {
  const all = await readClinics();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const cur = all[idx];
  all[idx] = {
    ...cur,
    status: patch.status,
    note: patch.note ?? cur.note,
    reviewedAt: new Date().toISOString(),
    token: patch.status === 'approved' && !cur.token ? makeToken() : cur.token,
  };
  await persist(all);
  return all[idx];
}

export async function regenerateToken(id: string): Promise<ClinicAccount | null> {
  const all = await readClinics();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  if (all[idx].status !== 'approved') return null;
  all[idx] = { ...all[idx], token: makeToken() };
  await persist(all);
  return all[idx];
}

export async function deleteClinic(id: string): Promise<boolean> {
  const all = await readClinics();
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await persist(next);
  return true;
}

export async function getClinic(id: string): Promise<ClinicAccount | null> {
  const all = await readClinics();
  return all.find((c) => c.id === id) ?? null;
}

export async function findByToken(token: string): Promise<ClinicAccount | null> {
  if (!token) return null;
  const all = await readClinics();
  return all.find((c) => c.status === 'approved' && c.token === token) ?? null;
}

export async function touchLastLogin(id: string): Promise<void> {
  const all = await readClinics();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], lastLoginAt: new Date().toISOString() };
  await persist(all);
}
