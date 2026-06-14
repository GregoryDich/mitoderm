'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Story, StorySlide } from '@/lib/stories-store';
import ImageUploadButton from './ImageUploadButton';
import styles from './admin-form.module.scss';

interface Props {
  mode: 'create' | 'edit';
  initial?: Story;
}

interface DraftSlide extends StorySlide {
  key: string;
}

function rk() {
  return Math.random().toString(36).slice(2);
}

const AdminStoryForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [cover, setCover] = useState(initial?.cover ?? '');
  const [coverFailed, setCoverFailed] = useState(false);
  const [slides, setSlides] = useState<DraftSlide[]>(
    initial?.slides.map((s) => ({ ...s, key: rk() })) ?? []
  );
  const [publishAt, setPublishAt] = useState(initial?.publishAt ?? '');
  const [expireAt, setExpireAt] = useState(initial?.expireAt ?? '');
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const uploadSlug = initial?.id ?? 'stories-new';

  const updateSlide = (key: string, patch: Partial<StorySlide>) =>
    setSlides((cur) => cur.map((s) => (s.key === key ? { ...s, ...patch } : s)));

  const addSlide = () =>
    setSlides((cur) => [...cur, { key: rk(), image: '' }]);

  const removeSlide = (key: string) =>
    setSlides((cur) => cur.filter((s) => s.key !== key));

  const moveSlide = (key: string, dir: -1 | 1) =>
    setSlides((cur) => {
      const i = cur.findIndex((s) => s.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const cleanSlides = slides
      .filter((s) => s.image.trim())
      .map(({ key, ...s }) => ({
        image: s.image,
        caption: s.caption?.trim() || undefined,
        link: s.link?.trim() || undefined,
      }));
    if (cleanSlides.length === 0) {
      setErr('Add at least one slide with an image');
      setPending(false);
      return;
    }
    const payload = {
      title: title.trim(),
      cover: cover.trim(),
      slides: cleanSlides,
      publishAt: publishAt.trim() || undefined,
      expireAt: expireAt.trim() || undefined,
      order: Number(order) || 0,
      isPublished,
    };
    const reqUrl =
      mode === 'create'
        ? '/api/admin/stories'
        : `/api/admin/stories/${encodeURIComponent(initial!.id)}`;
    const method = mode === 'create' ? 'POST' : 'PATCH';
    const res = await fetch(reqUrl, {
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
    router.replace('/admin/stories');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? 'New story' : `Edit ${initial?.title}`}
        </h1>
        <button type="submit" disabled={pending} className={styles.save}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </header>

      <section className={styles.card}>
        <h2 className={styles.sub}>Basics</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Title *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="V-Tech launch · Seminar Tel-Aviv · …"
              className={styles.input}
            />
            <span className={styles.hint}>
              Shown under the circle on the homepage strip.
            </span>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Cover image *</span>
            <input
              type="text"
              value={cover}
              onChange={(e) => {
                setCover(e.target.value);
                setCoverFailed(false);
              }}
              placeholder="/stories/<slug>/cover.jpg"
              className={styles.input}
            />
            <ImageUploadButton
              slug={uploadSlug}
              label="Upload cover"
              variant="drop"
              onUploaded={(u) => {
                setCover(u);
                setCoverFailed(false);
              }}
            />
            {cover && !coverFailed && (
              <span
                style={{
                  display: 'inline-flex',
                  marginTop: 12,
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt=""
                  onError={() => setCoverFailed(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>
            )}
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Slides</h2>
        <p className={styles.hint}>
          Each slide auto-advances after ~5s in the viewer. Recommended ratio
          is 9:16 (vertical). Use the caption sparingly — viewers skim. Add
          an optional link to push to a product / catalog page.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
          {slides.map((s, i) => (
            <SlideRow
              key={s.key}
              slide={s}
              index={i}
              total={slides.length}
              uploadSlug={uploadSlug}
              onChange={(patch) => updateSlide(s.key, patch)}
              onRemove={() => removeSlide(s.key)}
              onMoveUp={() => moveSlide(s.key, -1)}
              onMoveDown={() => moveSlide(s.key, 1)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addSlide}
          style={{
            marginTop: 16,
            padding: '10px 18px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px dashed rgba(255,255,255,0.25)',
            color: '#f5f2f0',
            fontSize: 13.5,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          + Add slide
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Schedule &amp; publishing</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Publish on (optional)</span>
            <input
              type="date"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className={styles.input}
            />
            <span className={styles.hint}>
              Stays hidden until this date. Leave empty to publish immediately.
            </span>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Expire on (optional)</span>
            <input
              type="date"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
              className={styles.input}
            />
            <span className={styles.hint}>
              Disappears from the strip after this date.
            </span>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Order</span>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className={styles.input}
            />
            <span className={styles.hint}>Lower numbers come first.</span>
          </label>
          <label className={styles.field} style={{ alignSelf: 'end' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published — visible on the public site
            </span>
          </label>
        </div>
      </section>

      {err && (
        <p role="alert" className={styles.err}>
          {err}
        </p>
      )}
    </form>
  );
};

interface SlideRowProps {
  slide: DraftSlide;
  index: number;
  total: number;
  uploadSlug: string;
  onChange: (patch: Partial<StorySlide>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SlideRow: FC<SlideRowProps> = ({
  slide,
  index,
  total,
  uploadSlug,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr auto',
        gap: 14,
        padding: 14,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          width: 120,
          aspectRatio: '9 / 16',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {slide.image && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.image}
            alt=""
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(245,242,240,0.4)',
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Slide {index + 1}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <input
          type="text"
          value={slide.image}
          onChange={(e) => {
            onChange({ image: e.target.value });
            setImgFailed(false);
          }}
          placeholder="/stories/<id>/slide.jpg"
          style={inputStyle}
        />
        <ImageUploadButton
          slug={uploadSlug}
          label="Upload slide"
          variant="pill"
          onUploaded={(u) => onChange({ image: u })}
        />
        <input
          type="text"
          value={slide.caption ?? ''}
          onChange={(e) => onChange({ caption: e.target.value.slice(0, 140) })}
          placeholder="Caption (≤ 140 chars, optional)"
          maxLength={140}
          style={inputStyle}
        />
        <input
          type="text"
          value={slide.link ?? ''}
          onChange={(e) => onChange({ link: e.target.value })}
          placeholder="Click-through link (optional, e.g. /products/v-tech-serum)"
          style={inputStyle}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          style={iconBtn(index === 0)}
          aria-label="Move up"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          style={iconBtn(index === total - 1)}
          aria-label="Move down"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={{
            ...iconBtn(false),
            color: '#d98ea0',
            borderColor: 'rgba(217,142,160,0.5)',
            marginTop: 'auto',
          }}
          aria-label="Remove slide"
          title="Remove slide"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f5f2f0',
  fontFamily: 'inherit',
  fontSize: 13,
};

const iconBtn = (disabled: boolean): React.CSSProperties => ({
  width: 30,
  height: 30,
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'transparent',
  color: 'rgba(245,242,240,0.85)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.35 : 1,
  fontSize: 14,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default AdminStoryForm;
