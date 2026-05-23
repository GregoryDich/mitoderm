import { readSocial, type SocialPost } from '@/lib/social-store';

/** Returns the next upcoming published seminar, if any. Used to drive
 *  the top promo bar — auto-surfaces upcoming events without any extra
 *  authoring on the owner's side. */
export async function nextUpcomingSeminar(): Promise<SocialPost | null> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await readSocial();
  const upcoming = all
    .filter((p) => p.isPublished && p.kind === 'seminar')
    .filter((p) => !p.date || p.date >= today)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  return upcoming[0] ?? null;
}
