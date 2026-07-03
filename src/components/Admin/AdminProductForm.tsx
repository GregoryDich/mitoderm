'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductContent } from '@/products';
import { LocaleType } from '@/types';
import LocaleContentEditor from './LocaleContentEditor';
import ImageUploadButton from './ImageUploadButton';
import GalleryEditor from './GalleryEditor';
import styles from './admin-form.module.scss';

interface Props {
  mode: 'create' | 'edit';
  initial?: Product;
}

const LOCALES: LocaleType[] = ['en', 'ru', 'he'];

const EMPTY_CONTENT: ProductContent = {
  name: '',
  eyebrow: '',
  tagline: '',
  description: '',
  shortDescription: '',
  stats: [],
  benefits: [],
  ingredientsIntro: '',
  ingredients: [],
  chipsTitle: '',
  chips: [],
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

/** Drop empty optional sections and trim string arrays before sending. */
function clean(c: ProductContent): ProductContent {
  const trim = (xs?: string[]) =>
    xs ? xs.map((s) => s.trim()).filter(Boolean) : undefined;
  const trimRows = <T extends object>(rows?: T[]): T[] | undefined =>
    rows
      ? rows.filter((r) =>
          Object.values(r as Record<string, unknown>).some(
            (v) => typeof v === 'string' && v.trim()
          )
        )
      : undefined;

  const dropEmpty = <T,>(v: T | undefined): T | undefined =>
    v && (Array.isArray(v) ? v.length > 0 : true) ? v : undefined;

  const out: ProductContent = {
    ...c,
    keyFacts: dropEmpty(trim(c.keyFacts)),
    ingredients: trim(c.ingredients) ?? [],
    chips: trim(c.chips) ?? [],
    stats: trimRows(c.stats) ?? [],
    benefits: trimRows(c.benefits) ?? [],
    steps: dropEmpty(trimRows(c.steps)),
    pack: dropEmpty(trimRows(c.pack)),
    stepsTitle: c.stepsTitle?.trim() || undefined,
    packTitle: c.packTitle?.trim() || undefined,
  };

  const mut = out as unknown as Record<string, unknown>;
  for (const key of ['protocol', 'aftercare', 'contraindications'] as const) {
    const v = c[key];
    if (!v) {
      delete mut[key];
      continue;
    }
    const items = trim(v.items) ?? [];
    const title = v.title.trim();
    if (!title && items.length === 0) {
      delete mut[key];
    } else {
      mut[key] = { title, items };
    }
  }

  return out;
}

const AdminProductForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const seed = initial ?? EMPTY;
  const [slug, setSlug] = useState(seed.slug);
  const [category, setCategory] = useState<Product['category']>(seed.category);
  const [status, setStatus] = useState<Product['status']>(seed.status);
  const [accent, setAccent] = useState<Product['accent']>(seed.accent);
  const [image, setImage] = useState(seed.image ?? '');
  const [gallery, setGallery] = useState<string[]>(seed.gallery ?? []);
  const [cardVideo, setCardVideo] = useState(seed.cardVideo ?? '');
  const [heroFailed, setHeroFailed] = useState(false);
  const [activeLoc, setActiveLoc] = useState<LocaleType>('en');
  const [content, setContent] = useState<Record<LocaleType, ProductContent>>({
    en: seed.content.en,
    ru: seed.content.ru,
    he: seed.content.he,
  });
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);

    for (const loc of LOCALES) {
      if (!content[loc].name?.trim()) {
        setErr(`The ${loc.toUpperCase()} name is required.`);
        setActiveLoc(loc);
        return;
      }
    }

    const cleaned: Record<LocaleType, ProductContent> = {
      en: clean(content.en),
      ru: clean(content.ru),
      he: clean(content.he),
    };

    const cleanedGallery = gallery.map((s) => s.trim()).filter(Boolean);
    const payload: Product = {
      slug: slug.trim(),
      category,
      status,
      accent,
      image: image.trim() || undefined,
      gallery: cleanedGallery.length ? cleanedGallery : undefined,
      cardVideo: cardVideo.trim() || undefined,
      content: cleaned,
    };

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
    <form onSubmit={onSubmit} className={styles.form}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create'
            ? 'New product'
            : `Edit ${initial?.content.en?.name ?? slug}`}
        </h1>
        <button type="submit" disabled={pending} className={styles.save}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </header>

      <section className={styles.card}>
        <h2 className={styles.sub}>Basics</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Slug</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              pattern="[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?"
              required
              disabled={mode === 'edit'}
              className={styles.input}
            />
            {mode === 'edit' && (
              <span className={styles.fieldHint}>
                Slug isn’t editable — would break existing URLs.
              </span>
            )}
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Category</span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Product['category'])
              }
              className={styles.input}
            >
              <option value="exosome">Exosome</option>
              <option value="mask">Mask</option>
              <option value="peel">Peel</option>
              <option value="bio-spicules">Bio-spicules</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Product['status'])}
              className={styles.input}
            >
              <option value="available">Available</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Accent</span>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value as Product['accent'])}
              className={styles.input}
            >
              <option value="gold">Gold (V-Tech / Exotech)</option>
              <option value="teal">Teal (Exosignal)</option>
              <option value="amber">Amber (EXO-NAD)</option>
              <option value="steel">Steel (Devices)</option>
              <option value="rose">Rose (Bio-Spicules)</option>
            </select>
          </label>
          <div className={`${styles.field} ${styles.wide}`}>
            <span className={styles.fieldLabel}>Hero image</span>
            <div className={styles.heroPreview}>
              {image && !heroFailed ? (
                <span className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    onError={() => setHeroFailed(true)}
                  />
                </span>
              ) : (
                <span className={styles.thumb}>
                  <span className={styles.thumbEmpty}>—</span>
                </span>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setHeroFailed(false);
                  }}
                  placeholder="/products/my-product/hero.jpg"
                  className={styles.input}
                />
                <ImageUploadButton
                  slug={slug}
                  label="Upload hero image"
                  variant="drop"
                  onUploaded={(url) => {
                    setImage(url);
                    setHeroFailed(false);
                  }}
                />
              </div>
            </div>
          </div>
          <div className={`${styles.field} ${styles.wide}`}>
            <span className={styles.fieldLabel}>Gallery</span>
            <GalleryEditor
              value={gallery}
              onChange={setGallery}
              slug={slug}
            />
          </div>
          <div className={`${styles.field} ${styles.wide}`}>
            <span className={styles.fieldLabel}>
              Hover-to-play card video (optional)
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'rgba(245,242,240,0.55)',
                marginBottom: 6,
                lineHeight: 1.5,
              }}
            >
              Short muted clip (4–10s, MP4 or WebM, ≤ 12 MB) that auto-plays
              when a visitor hovers the catalog or featured card. Owner-uploaded
              content only — your own footage / Reels — no third-party clips.
            </span>
            <div className={styles.heroPreview}>
              <span
                className={styles.thumb}
                style={{ background: '#000', overflow: 'hidden' }}
              >
                {cardVideo ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={cardVideo}
                    muted
                    loop
                    playsInline
                    autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className={styles.thumbEmpty}>—</span>
                )}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  value={cardVideo}
                  onChange={(e) => setCardVideo(e.target.value)}
                  placeholder="/products/my-product/loop.mp4"
                  className={styles.input}
                />
                <ImageUploadButton
                  slug={slug}
                  label="Upload card video"
                  variant="drop"
                  accept="video/mp4,video/webm"
                  onUploaded={(url) => setCardVideo(url)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Localized content</h2>
        <div className={styles.tabs}>
          {LOCALES.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => setActiveLoc(l)}
              className={`${styles.tab} ${
                activeLoc === l ? styles.tabActive : ''
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <LocaleContentEditor
          key={activeLoc}
          value={content[activeLoc]}
          onChange={(next) =>
            setContent((prev) => ({ ...prev, [activeLoc]: next }))
          }
          dir={activeLoc === 'he' ? 'rtl' : 'ltr'}
        />
      </section>

      {err && (
        <p role="alert" className={styles.err}>
          {err}
        </p>
      )}
    </form>
  );
};

export default AdminProductForm;
