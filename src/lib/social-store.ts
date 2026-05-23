import fs from 'node:fs/promises';
import path from 'node:path';

const FILE_PATH = 'src/data/social.json';

export type SocialKind = 'reel' | 'post' | 'seminar';

export interface SocialPost {
  id: string;
  /** Public Instagram URL — instagram.com/reel/… or instagram.com/p/…
   *  Used as the click-through target; never embedded directly. */
  url: string;
  kind: SocialKind;
  /** Public path under /public to a 9:16 (or 1:1) poster image. */
  poster?: string;
  /** Short caption shown under the card (≤ 140 chars). */
  caption?: string;
  /** Optional date — useful for "seminar" kind so upcoming events
   *  can be filtered. ISO yyyy-mm-dd. */
  date?: string;
  isPublished: boolean;
  /** Manual ordering — lower numbers come first. Defaults to 0. */
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

export async function readSocial(): Promise<SocialPost[]> {
  const file = abs(FILE_PATH);
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(file, 'utf8');
  try {
    const arr = JSON.parse(raw) as SocialPost[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function persist(posts: SocialPost[]): Promise<void> {
  const file = abs(FILE_PATH);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(posts, null, 2) + '\n', 'utf8');
}

function makeId(): string {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
  );
}

const URL_RE = /^https:\/\/(www\.)?instagram\.com\/(reel|p|reels|tv)\/[A-Za-z0-9_-]+/i;

export function isInstagramUrl(s: string): boolean {
  return URL_RE.test(s);
}

export async function createSocial(
  input: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
    order?: number;
  }
): Promise<SocialPost> {
  const all = await readSocial();
  const now = new Date().toISOString();
  const post: SocialPost = {
    id: makeId(),
    url: input.url,
    kind: input.kind,
    poster: input.poster,
    caption: input.caption,
    date: input.date,
    isPublished: input.isPublished,
    order: input.order ?? all.length,
    createdAt: now,
    updatedAt: now,
  };
  all.push(post);
  await persist(all);
  return post;
}

export async function updateSocial(
  id: string,
  patch: Partial<Omit<SocialPost, 'id' | 'createdAt'>>
): Promise<SocialPost | null> {
  const all = await readSocial();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  await persist(all);
  return all[idx];
}

export async function deleteSocial(id: string): Promise<boolean> {
  const all = await readSocial();
  const next = all.filter((p) => p.id !== id);
  if (next.length === all.length) return false;
  await persist(next);
  return true;
}

export async function getSocial(id: string): Promise<SocialPost | null> {
  const all = await readSocial();
  return all.find((p) => p.id === id) ?? null;
}
