import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Server-only helper. Returns the given public path if the file exists
 *  under /public, otherwise undefined. Lets components render an image
 *  slot progressively — the markup only appears once the owner drops
 *  the generated asset in place, so a missing file is never a broken
 *  <img>. Safe to call in Server Components / route handlers; do NOT
 *  import from a 'use client' module. */
export function publicAsset(path: string): string | undefined {
  if (!path.startsWith('/')) return undefined;
  const abs = join(process.cwd(), 'public', path.replace(/^\//, ''));
  try {
    return existsSync(abs) ? path : undefined;
  } catch {
    return undefined;
  }
}
