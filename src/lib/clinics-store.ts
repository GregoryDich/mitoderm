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
  /** Referral program (C04). Owner-tunable per clinic.
   *  - referralCode: unique slug the clinic gives out; tracked when a
   *    new application arrives with it pre-filled.
   *  - referralRate: % commission on the first wholesale order from
   *    every clinic that signed up with this code. 0 disables.
   *  - referredById: backref — set when this clinic was itself
   *    referred by another. */
  referralCode?: string;
  referralRate?: number;
  referredById?: string;
  /** Loyalty / reorder discount (C06).
   *  - loyaltyTier: free-text label ('silver' / 'gold' / 'partner').
   *  - loyaltyDiscount: % off list applied to wholesale invoices.
   *    Defaults to 0 (no discount). */
  loyaltyTier?: string;
  loyaltyDiscount?: number;
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
  input: Omit<ClinicAccount, 'id' | 'status' | 'appliedAt' | 'token'> & {
    referralCode?: string;
  }
): Promise<{ ok: true; clinic: ClinicAccount } | { ok: false; error: string }> {
  const all = await readClinics();
  const email = input.email.toLowerCase().trim();
  if (all.some((c) => c.email.toLowerCase() === email)) {
    return { ok: false, error: 'duplicate_email' };
  }
  // Resolve referral code → referredById, if the code matches an
  // approved clinic with a non-empty code. Unknown codes are silently
  // dropped to avoid leaking who's in the program.
  let referredById: string | undefined;
  if (input.referralCode) {
    const code = input.referralCode.trim().toLowerCase();
    const referrer = all.find(
      (c) => c.status === 'approved' && c.referralCode?.toLowerCase() === code
    );
    if (referrer) referredById = referrer.id;
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
    referredById,
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

export async function setClinicPerks(
  id: string,
  patch: {
    referralCode?: string | null;
    referralRate?: number | null;
    loyaltyTier?: string | null;
    loyaltyDiscount?: number | null;
  }
): Promise<ClinicAccount | null> {
  const all = await readClinics();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const cur = all[idx];
  // Treat explicit null as "clear"; undefined as "leave alone".
  const next: ClinicAccount = {
    ...cur,
    referralCode:
      patch.referralCode === null
        ? undefined
        : patch.referralCode !== undefined
        ? patch.referralCode.trim().toLowerCase() || undefined
        : cur.referralCode,
    referralRate:
      patch.referralRate === null
        ? undefined
        : patch.referralRate !== undefined
        ? Math.max(0, Math.min(100, Number(patch.referralRate) || 0))
        : cur.referralRate,
    loyaltyTier:
      patch.loyaltyTier === null
        ? undefined
        : patch.loyaltyTier !== undefined
        ? patch.loyaltyTier.trim() || undefined
        : cur.loyaltyTier,
    loyaltyDiscount:
      patch.loyaltyDiscount === null
        ? undefined
        : patch.loyaltyDiscount !== undefined
        ? Math.max(0, Math.min(100, Number(patch.loyaltyDiscount) || 0))
        : cur.loyaltyDiscount,
  };
  all[idx] = next;
  await persist(all);
  return next;
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
