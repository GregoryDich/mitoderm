'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PressItem } from '@/lib/press-store';
import ImageUploadButton from './ImageUploadButton';
import styles from './admin-form.module.scss';

interface Props {
  mode: 'create' | 'edit';
  initial?: PressItem;
}

const AdminPressForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [logo, setLogo] = useState(initial?.logo ?? '');
  const [logoFailed, setLogoFailed] = useState(false);
  const [url, setUrl] = useState(initial?.url ?? '');
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const payload = {
      name: name.trim(),
      logo: logo.trim(),
      url: url.trim() || undefined,
      order: Number(order) || 0,
      isPublished,
    };
    const reqUrl =
      mode === 'create'
        ? '/api/admin/press'
        : `/api/admin/press/${encodeURIComponent(initial!.id)}`;
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
    router.replace('/admin/press');
    router.refresh();
  };

  const uploadSlug = initial?.id ?? 'press-new';

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? 'New press / award' : `Edit ${initial?.name}`}
        </h1>
        <button type="submit" disabled={pending} className={styles.save}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </header>

      <section className={styles.card}>
        <h2 className={styles.sub}>Basics</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Name *</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="IMCAS 2026 · Vogue Israel · …"
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Click-through URL (optional)</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className={styles.input}
            />
          </label>
          <label className={styles.field} style={{ gridColumn: '1 / -1' }}>
            <span className={styles.fieldLabel}>Logo *</span>
            <span className={styles.hint}>
              Transparent PNG / SVG works best — we render white-on-transparent.
              The strip applies <code>filter: brightness(0) invert(1)</code> so
              even a dark logo will read on the dark background.
            </span>
            <input
              type="text"
              value={logo}
              onChange={(e) => {
                setLogo(e.target.value);
                setLogoFailed(false);
              }}
              placeholder="/press/<slug>/logo.svg"
              className={styles.input}
            />
            <ImageUploadButton
              slug={uploadSlug}
              label="Upload logo"
              variant="drop"
              onUploaded={(u) => {
                setLogo(u);
                setLogoFailed(false);
              }}
            />
            {logo && !logoFailed && (
              <span
                style={{
                  display: 'inline-flex',
                  marginTop: 12,
                  height: 56,
                  padding: '0 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  alignItems: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt=""
                  onError={() => setLogoFailed(true)}
                  style={{
                    height: 36,
                    width: 'auto',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.85,
                  }}
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

export default AdminPressForm;
