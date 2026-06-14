'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SocialKind, SocialPost } from '@/lib/social-store';
import ImageUploadButton from './ImageUploadButton';
import styles from './admin-form.module.scss';

interface Props {
  mode: 'create' | 'edit';
  initial?: SocialPost;
}

const KINDS: { v: SocialKind; label: string; hint: string }[] = [
  { v: 'reel', label: 'Reel', hint: 'Short vertical video — best 9:16 poster' },
  { v: 'post', label: 'Post', hint: 'Static / carousel — best 1:1 poster' },
  { v: 'seminar', label: 'Seminar', hint: 'Event announcement — also appears on /seminars' },
];

const AdminSocialForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.url ?? '');
  const [kind, setKind] = useState<SocialKind>(initial?.kind ?? 'reel');
  const [caption, setCaption] = useState(initial?.caption ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [poster, setPoster] = useState(initial?.poster ?? '');
  const [posterFailed, setPosterFailed] = useState(false);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const payload = {
      url: url.trim(),
      kind,
      caption: caption.trim() || undefined,
      date: date.trim() || undefined,
      poster: poster.trim() || undefined,
      order: Number(order) || 0,
      isPublished,
    };
    const reqUrl =
      mode === 'create'
        ? '/api/admin/social'
        : `/api/admin/social/${encodeURIComponent(initial!.id)}`;
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
    router.replace('/admin/social');
    router.refresh();
  };

  const uploadSlug = initial?.id ?? 'social-new';

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? 'New social item' : 'Edit social item'}
        </h1>
        <button type="submit" disabled={pending} className={styles.save}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </header>

      <section className={styles.card}>
        <h2 className={styles.sub}>Source</h2>
        <div className={styles.grid}>
          <label className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <span className={styles.fieldLabel}>Instagram URL *</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://www.instagram.com/reel/Cxxxxxx/"
              className={styles.input}
            />
            <span className={styles.hint}>
              Reels: <code>/reel/…</code>. Posts: <code>/p/…</code>. IGTV: <code>/tv/…</code>.
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Kind</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as SocialKind)}
              className={styles.input}
            >
              {KINDS.map((k) => (
                <option key={k.v} value={k.v}>
                  {k.label}
                </option>
              ))}
            </select>
            <span className={styles.hint}>
              {KINDS.find((k) => k.v === kind)?.hint}
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              Date {kind === 'seminar' ? '(event date)' : '(optional)'}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
            />
          </label>

          <label className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <span className={styles.fieldLabel}>Caption (≤ 140)</span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 140))}
              rows={2}
              maxLength={140}
              placeholder="Short line shown under the card on the site"
              className={styles.input}
            />
            <span className={styles.hint}>{caption.length}/140</span>
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Poster image</h2>
        <p className={styles.hint}>
          Required for the public strip. Take a clean frame from the Reel (or the
          carousel cover) and upload as a JPG/PNG/WebP — 9:16 for Reels works best.
        </p>
        <div className={styles.grid}>
          <label className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <span className={styles.fieldLabel}>Poster URL</span>
            <input
              type="text"
              value={poster}
              onChange={(e) => {
                setPoster(e.target.value);
                setPosterFailed(false);
              }}
              placeholder="/social/<slug>/poster.jpg"
              className={styles.input}
            />
            <ImageUploadButton
              slug={uploadSlug}
              label="Upload poster"
              variant="drop"
              onUploaded={(u) => {
                setPoster(u);
                setPosterFailed(false);
              }}
            />
            {poster && !posterFailed && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 12,
                  width: 100,
                  height: 140,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster}
                  alt=""
                  onError={() => setPosterFailed(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </span>
            )}
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Publishing</h2>
        <div className={styles.grid}>
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
          <label
            className={styles.field}
            style={{ alignSelf: 'end' }}
          >
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

export default AdminSocialForm;
