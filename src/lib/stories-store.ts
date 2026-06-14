import fs from 'node:fs/promises';
import path from 'node:path';

const FILE_PATH = 'src/data/stories.json';

export interface StorySlide {
  /** Public path under /public (jpg/png/webp). 9:16 strongly preferred. */
  image: string;
  /** Optional caption rendered overlaid at the bottom of the slide. */
  caption?: string;
  /** Optional click-through target (e.g. /products/v-tech-serum). */
  link?: string;
}

export interface Story {
  id: string;
  /** Tile title shown beneath the circle on the home strip. */
  title: string;
  /** Public path to the cover image used inside the circle. */
  cover: string;
  /** Ordered list of slides for this story. */
  slides: StorySlide[];
  /** Optional ISO yyyy-mm-dd. When in the future, the story stays
   *  hidden from the public strip until that day. */
  publishAt?: string;
  /** Optional ISO yyyy-mm-dd — story disappears after that day. */
  expireAt?: string;
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

export async function readStories(): Promise<Story[]> {
  const file = abs(FILE_PATH);
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(file, 'utf8');
  try {
    const arr = JSON.parse(raw) as Story[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function persist(items: Story[]) {
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

export async function createStory(
  input: Omit<Story, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
    order?: number;
  }
): Promise<Story> {
  const all = await readStories();
  const now = new Date().toISOString();
  const story: Story = {
    id: makeId(input.title || 'story'),
    title: input.title,
    cover: input.cover,
    slides: input.slides,
    publishAt: input.publishAt,
    expireAt: input.expireAt,
    isPublished: input.isPublished,
    order: input.order ?? all.length,
    createdAt: now,
    updatedAt: now,
  };
  all.push(story);
  await persist(all);
  return story;
}

export async function updateStory(
  id: string,
  patch: Partial<Omit<Story, 'id' | 'createdAt'>>
): Promise<Story | null> {
  const all = await readStories();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  await persist(all);
  return all[idx];
}

export async function deleteStory(id: string): Promise<boolean> {
  const all = await readStories();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await persist(next);
  return true;
}

export async function getStory(id: string): Promise<Story | null> {
  const all = await readStories();
  return all.find((s) => s.id === id) ?? null;
}

/** Filter stories that are within their publish/expire window today. */
export function isLive(s: Story, today = new Date().toISOString().slice(0, 10)): boolean {
  if (!s.isPublished) return false;
  if (s.publishAt && s.publishAt > today) return false;
  if (s.expireAt && s.expireAt < today) return false;
  return true;
}
