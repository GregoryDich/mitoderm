import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readProducts, writeProducts } from '@/lib/admin-store';
import type { Product } from '@/products';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

function bad(reason: string, status = 400) {
  return NextResponse.json({ error: reason }, { status });
}

function validateProduct(p: unknown): p is Product {
  if (!p || typeof p !== 'object') return false;
  const x = p as Partial<Product>;
  if (!x.slug || typeof x.slug !== 'string' || !SLUG_RE.test(x.slug)) {
    return false;
  }
  if (
    x.category !== 'exosome' &&
    x.category !== 'mask' &&
    x.category !== 'peel' &&
    x.category !== 'bio-spicules'
  ) {
    return false;
  }
  if (x.status !== 'available' && x.status !== 'coming-soon') return false;
  if (x.accent !== 'teal' && x.accent !== 'gold' && x.accent !== 'rose') {
    return false;
  }
  if (!x.content || typeof x.content !== 'object') return false;
  for (const loc of ['en', 'ru', 'he'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = (x.content as any)[loc];
    if (!c || typeof c !== 'object') return false;
    if (typeof c.name !== 'string' || !c.name.trim()) return false;
  }
  return true;
}

export async function GET() {
  if (!isAdmin()) return bad('unauthorized', 401);
  const products = await readProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!isAdmin()) return bad('unauthorized', 401);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad('invalid_json');
  }
  if (!validateProduct(body)) return bad('invalid_product');
  const incoming = body as Product;
  const all = await readProducts();
  if (all.some((p) => p.slug === incoming.slug)) {
    return bad('slug_taken', 409);
  }
  const next = [...all, incoming];
  const { persisted } = await writeProducts(
    next,
    `chore(admin): add product ${incoming.slug}`
  );
  return NextResponse.json({ ok: true, persisted, product: incoming });
}
