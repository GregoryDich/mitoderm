'use client';

import { FC, useState } from 'react';
import ImageUploadButton from './ImageUploadButton';
import styles from './admin-form.module.scss';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  slug: string;
}

function Thumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={styles.thumb} aria-hidden="true">
        <span className={styles.thumbEmpty}>—</span>
      </span>
    );
  }
  return (
    <span className={styles.thumb}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" onError={() => setFailed(true)} />
    </span>
  );
}

const GalleryEditor: FC<Props> = ({ value, onChange, slug }) => {
  const updatePath = (i: number, next: string) => {
    const arr = value.slice();
    arr[i] = next;
    onChange(arr);
  };
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));
  const move = (i: number, delta: -1 | 1) => {
    const j = i + delta;
    if (j < 0 || j >= value.length) return;
    const arr = value.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  const append = () => onChange([...value, '']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {value.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: 10,
                alignItems: 'center',
                padding: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
              }}
            >
              <Thumb src={p} />
              <input
                type="text"
                value={p}
                onChange={(e) => updatePath(i, e.target.value)}
                placeholder="/products/<slug>/file.jpg"
                className={styles.input}
              />
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move up"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move down"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => remove(i)}
                  aria-label="Remove"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ImageUploadButton
        slug={slug}
        label="Upload to gallery"
        multiple
        variant="drop"
        onUploaded={(url) => onChange([...value, url])}
      />
      <button type="button" className={styles.addBtn} onClick={append}>
        + Paste path manually
      </button>
    </div>
  );
};

export default GalleryEditor;
