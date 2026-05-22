import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readProducts, writeProducts } from '@/lib/admin-store';
import { logAudit, requestMeta } from '@/lib/audit-log';
import type { Product } from '@/products';

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

/** Pick an unused slug derived from the source — base-copy, base-copy-2, … */
function uniqueSlug(taken: Set<string>, base: string): string {
  const candidate = `${base}-copy`;
  if (!taken.has(candidate)) return candidate;
  let n = 2;
  while (taken.has(`${base}-copy-${n}`)) n++;
  return `${base}-copy-${n}`;
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const all = await readProducts();
  const src = all.find((p) => p.slug === params.slug);
  if (!src) return bad('not_found', 404);

  const taken = new Set(all.map((p) => p.slug));
  const newSlug = uniqueSlug(taken, src.slug);

  // Force-unpublished on duplicate to avoid accidental exposure of a half-
  // edited copy. Owner can flip status once they've adjusted the copy.
  const copy: Product = {
    ...src,
    slug: newSlug,
    status: 'coming-soon',
    content: {
      en: { ...src.content.en, name: `${src.content.en.name} (copy)` },
      ru: { ...src.content.ru, name: `${src.content.ru.name} (copy)` },
      he: { ...src.content.he, name: `${src.content.he.name} (copy)` },
    },
  };

  const next = [...all, copy];
  const { persisted } = await writeProducts(
    next,
    `chore(admin): duplicate product ${src.slug} -> ${newSlug}`
  );
  await logAudit({
    at: new Date().toISOString(),
    action: 'product.duplicate',
    target: newSlug,
    ...requestMeta(req),
    meta: { persisted, source: src.slug },
  });
  return NextResponse.json({ ok: true, persisted, product: copy });
}
