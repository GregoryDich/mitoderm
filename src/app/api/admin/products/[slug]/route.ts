import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readProducts, writeProducts } from '@/lib/admin-store';
import type { Product } from '@/products';

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let patch: Partial<Product>;
  try {
    patch = (await req.json()) as Partial<Product>;
  } catch {
    return bad('invalid_json');
  }
  const all = await readProducts();
  const idx = all.findIndex((p) => p.slug === params.slug);
  if (idx === -1) return bad('not_found', 404);
  // If slug changes, ensure new slug is unique.
  if (patch.slug && patch.slug !== params.slug) {
    if (all.some((p) => p.slug === patch.slug)) return bad('slug_taken', 409);
  }
  const merged: Product = { ...all[idx], ...patch } as Product;
  // Merge nested content per locale rather than replacing the whole object,
  // so partial PATCHes from the edit form don't wipe untouched locales.
  if (patch.content) {
    merged.content = {
      en: { ...all[idx].content.en, ...(patch.content.en ?? {}) },
      ru: { ...all[idx].content.ru, ...(patch.content.ru ?? {}) },
      he: { ...all[idx].content.he, ...(patch.content.he ?? {}) },
    };
  }
  const next = [...all];
  next[idx] = merged;
  const { persisted } = await writeProducts(
    next,
    `chore(admin): update product ${params.slug}`
  );
  return NextResponse.json({ ok: true, persisted, product: merged });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAdmin()) return bad('unauthorized', 401);
  const all = await readProducts();
  const exists = all.some((p) => p.slug === params.slug);
  if (!exists) return bad('not_found', 404);
  const next = all.filter((p) => p.slug !== params.slug);
  const { persisted } = await writeProducts(
    next,
    `chore(admin): delete product ${params.slug}`
  );
  return NextResponse.json({ ok: true, persisted });
}
