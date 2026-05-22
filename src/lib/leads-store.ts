import fs from 'node:fs/promises';
import path from 'node:path';

const LEADS_PATH = 'data/leads.json';
const LEGACY_PATH = 'data/leads.jsonl';

export type LeadStatus = 'new' | 'contacted' | 'closed' | 'archived';

export interface Lead {
  id: string;
  ts: string;
  name: string;
  email: string;
  phone: string;
  clinic: string;
  message: string;
  status: LeadStatus;
  note?: string;
  updatedAt?: string;
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

function id(ts: string, email: string): string {
  // Stable id derived from the timestamp + email so re-imports stay coherent.
  return ts.replace(/[:.]/g, '-') + '-' + email.toLowerCase();
}

async function migrateLegacyIfNeeded(): Promise<Lead[]> {
  const json = abs(LEADS_PATH);
  if (await exists(json)) {
    const raw = await fs.readFile(json, 'utf8');
    return JSON.parse(raw) as Lead[];
  }
  const legacy = abs(LEGACY_PATH);
  if (!(await exists(legacy))) return [];
  const lines = (await fs.readFile(legacy, 'utf8'))
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const leads: Lead[] = lines
    .map((line) => {
      try {
        const o = JSON.parse(line) as Partial<Lead>;
        const ts = o.ts ?? new Date().toISOString();
        const email = o.email ?? '';
        return {
          id: id(ts, email),
          ts,
          name: o.name ?? '',
          email,
          phone: o.phone ?? '',
          clinic: o.clinic ?? '',
          message: o.message ?? '',
          status: 'new' as LeadStatus,
        };
      } catch {
        return null;
      }
    })
    .filter((x): x is Lead => x !== null);
  await fs.mkdir(path.dirname(json), { recursive: true });
  await fs.writeFile(json, JSON.stringify(leads, null, 2) + '\n', 'utf8');
  return leads;
}

export async function readLeads(): Promise<Lead[]> {
  return migrateLegacyIfNeeded();
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  const json = abs(LEADS_PATH);
  await fs.mkdir(path.dirname(json), { recursive: true });
  await fs.writeFile(json, JSON.stringify(leads, null, 2) + '\n', 'utf8');
}

/** Append a new lead. Returns the persisted record. */
export async function appendLead(
  input: Omit<Lead, 'id' | 'ts' | 'status'> & {
    ts?: string;
    status?: LeadStatus;
  }
): Promise<Lead> {
  const ts = input.ts ?? new Date().toISOString();
  const lead: Lead = {
    id: id(ts, input.email),
    ts,
    name: input.name,
    email: input.email,
    phone: input.phone,
    clinic: input.clinic,
    message: input.message,
    status: input.status ?? 'new',
  };
  const all = await readLeads();
  all.push(lead);
  await writeLeads(all);
  return lead;
}

/** Update a lead's status/note. Returns the updated lead or null if not found. */
export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, 'status' | 'note'>>
): Promise<Lead | null> {
  const all = await readLeads();
  const idx = all.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  all[idx] = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeLeads(all);
  return all[idx];
}

export async function deleteLead(id: string): Promise<boolean> {
  const all = await readLeads();
  const next = all.filter((l) => l.id !== id);
  if (next.length === all.length) return false;
  await writeLeads(next);
  return true;
}
