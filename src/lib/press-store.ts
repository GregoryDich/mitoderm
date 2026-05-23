import fs from 'node:fs/promises';
import path from 'node:path';

const FILE_PATH = 'src/data/press.json';

export interface PressItem {
  id: string;
  /** Display name — e.g. "IMCAS 2025" or "Vogue Israel". */
  name: string;
  /** Logo image under /public (white-on-transparent works best). */
  logo: string;
  /** Optional click-through URL. */
  url?: string;
  isPublished: boolean;
  order: number;
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

export async function readPress(): Promise<PressItem[]> {
  const file = abs(FILE_PATH);
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(file, 'utf8');
  try {
    const arr = JSON.parse(raw) as PressItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function persist(items: PressItem[]) {
  const file = abs(FILE_PATH);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(items, null, 2) + '\n', 'utf8');
}

function makeId(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) +
    '-' +
    Math.random().toString(36).slice(2, 6)
  );
}

export async function createPress(
  input: Omit<PressItem, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
    order?: number;
  }
): Promise<PressItem> {
  const all = await readPress();
  const now = new Date().toISOString();
  const item: PressItem = {
    id: makeId(input.name),
    name: input.name,
    logo: input.logo,
    url: input.url,
    isPublished: input.isPublished,
    order: input.order ?? all.length,
    createdAt: now,
    updatedAt: now,
  };
  all.push(item);
  await persist(all);
  return item;
}

export async function updatePress(
  id: string,
  patch: Partial<Omit<PressItem, 'id' | 'createdAt'>>
): Promise<PressItem | null> {
  const all = await readPress();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  await persist(all);
  return all[idx];
}

export async function deletePress(id: string): Promise<boolean> {
  const all = await readPress();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await persist(next);
  return true;
}

export async function getPress(id: string): Promise<PressItem | null> {
  const all = await readPress();
  return all.find((p) => p.id === id) ?? null;
}
