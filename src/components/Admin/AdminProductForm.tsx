'use client';

import { FC, FormEvent, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/products';
import { LocaleType } from '@/types';

interface Props {
  mode: 'create' | 'edit';
  initial?: Product;
}

const EMPTY_CONTENT = {
  name: '',
  eyebrow: '',
  tagline: '',
  description: '',
  shortDescription: '',
  stats: [{ value: '', label: '' }],
  benefits: [{ title: '', text: '' }],
  ingredientsIntro: '',
  ingredients: [''],
  chipsTitle: '',
  chips: [''],
  ctaTitle: '',
  ctaText: '',
};

const EMPTY: Product = {
  slug: '',
  category: 'mask',
  status: 'available',
  accent: 'teal',
  image: undefined,
  gallery: undefined,
  content: {
    en: { ...EMPTY_CONTENT },
    ru: { ...EMPTY_CONTENT },
    he: { ...EMPTY_CONTENT },
  },
};

const LOCALES: LocaleType[] = ['en', 'ru', 'he'];

const AdminProductForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const seed = initial ?? EMPTY;
  const [slug, setSlug] = useState(seed.slug);
  const [category, setCategory] = useState<Product['category']>(seed.category);
  const [status, setStatus] = useState<Product['status']>(seed.status);
  const [accent, setAccent] = useState<Product['accent']>(seed.accent);
  const [image, setImage] = useState(seed.image ?? '');
  const [gallery, setGallery] = useState((seed.gallery ?? []).join('\n'));
  const [activeLoc, setActiveLoc] = useState<LocaleType>('en');
  const initialContentJson = useMemo(
    () => ({
      en: JSON.stringify(seed.content.en, null, 2),
      ru: JSON.stringify(seed.content.ru, null, 2),
      he: JSON.stringify(seed.content.he, null, 2),
    }),
    [seed]
  );
  const [contentJson, setContentJson] = useState(initialContentJson);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const setLocJson = (loc: LocaleType, v: string) =>
    setContentJson((p) => ({ ...p, [loc]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Validate JSON per locale upfront with a useful message.
    const content: Product['content'] = { en: undefined as never, ru: undefined as never, he: undefined as never };
    for (const loc of LOCALES) {
      try {
        const parsed = JSON.parse(contentJson[loc]);
        if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
        content[loc] = parsed;
      } catch (e) {
        setErr(`Invalid JSON in ${loc.toUpperCase()} content: ${(e as Error).message}`);
        setActiveLoc(loc);
        return;
      }
    }

    const payload: Product = {
      slug: slug.trim(),
      category,
      status,
      accent,
      image: image.trim() || undefined,
      gallery: gallery
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      content,
    };
    if (payload.gallery && payload.gallery.length === 0) delete payload.gallery;

    setPending(true);
    const url =
      mode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${initial!.slug}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(`Save failed: ${data.error ?? res.status}`);
      setPending(false);
      return;
    }
    router.replace('/admin/products');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} style={S.form}>
      <header style={S.header}>
        <h1 style={S.title}>
          {mode === 'create' ? 'New product' : `Edit ${initial?.content.en?.name ?? slug}`}
        </h1>
        <button type="submit" disabled={pending} style={S.save}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </header>

      <section style={S.card}>
        <h2 style={S.sub}>Basics</h2>
        <div style={S.grid}>
          <Field label="Slug">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              pattern="[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?"
              required
              disabled={mode === 'edit'}
              style={S.input}
            />
            {mode === 'edit' && (
              <small style={S.hint}>
                Slug isn’t editable from the form to avoid broken URLs.
              </small>
            )}
          </Field>
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              style={S.input}
            >
              <option value="exosome">Exosome</option>
              <option value="mask">Mask</option>
              <option value="peel">Peel</option>
              <option value="bio-spicules">Bio-spicules</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Product['status'])}
              style={S.input}
            >
              <option value="available">Available</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </Field>
          <Field label="Accent">
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value as Product['accent'])}
              style={S.input}
            >
              <option value="teal">Teal</option>
              <option value="gold">Gold</option>
              <option value="rose">Rose</option>
            </select>
          </Field>
          <Field label="Hero image (path under /public)" wide>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/products/my-product/hero.jpg"
              style={S.input}
            />
          </Field>
          <Field label="Gallery (one path per line)" wide>
            <textarea
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
              rows={4}
              placeholder={'/products/my-product/g1.jpg\n/products/my-product/g2.jpg'}
              style={{ ...S.input, fontFamily: 'inherit' }}
            />
          </Field>
        </div>
      </section>

      <section style={S.card}>
        <h2 style={S.sub}>Localized content</h2>
        <div style={S.tabs}>
          {LOCALES.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setActiveLoc(l)}
              style={{
                ...S.tab,
                ...(activeLoc === l ? S.tabActive : {}),
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <p style={S.hint}>
          The content for each locale is edited as JSON — this preserves nested
          structures (benefits, steps, pack, stats, keyFacts, …). Required
          keys: <code>name</code>. Optional: everything else.
        </p>
        <textarea
          value={contentJson[activeLoc]}
          onChange={(e) => setLocJson(activeLoc, e.target.value)}
          rows={28}
          spellCheck={false}
          dir={activeLoc === 'he' ? 'rtl' : 'ltr'}
          style={{
            ...S.input,
            minHeight: 460,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        />
      </section>

      {err && (
        <p role="alert" style={S.err}>
          {err}
        </p>
      )}
    </form>
  );
};

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        gridColumn: wide ? '1 / -1' : undefined,
      }}
    >
      <span
        style={{
          fontSize: 12,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: 'rgba(245,242,240,0.6)',
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const S: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 22 },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { margin: 0, fontSize: 28, fontWeight: 300, letterSpacing: -0.5 },
  save: {
    padding: '12px 26px',
    borderRadius: 30,
    background: '#dfba74',
    color: '#08080a',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: 14,
  },
  card: {
    padding: 24,
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  sub: { margin: 0, fontSize: 18, fontWeight: 400 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    color: '#f5f2f0',
    font: 'inherit',
    fontSize: 14,
  },
  hint: { margin: 0, fontSize: 12, color: 'rgba(245,242,240,0.5)' },
  tabs: { display: 'flex', gap: 6 },
  tab: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 20,
    color: 'rgba(245,242,240,0.75)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },
  tabActive: {
    background: '#f5f2f0',
    color: '#08080a',
    borderColor: '#f5f2f0',
  },
  err: {
    margin: 0,
    color: '#d98ea0',
    fontSize: 14,
  },
};

export default AdminProductForm;
