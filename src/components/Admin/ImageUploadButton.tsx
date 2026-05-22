'use client';

import { DragEvent, FC, useRef, useState } from 'react';
import styles from './admin-form.module.scss';

interface Props {
  /** The product slug determines the upload target path
   *  (`/products/<slug>/<filename>`). When blank the button is disabled. */
  slug: string;
  /** Called with the new public URL on success. */
  onUploaded: (url: string) => void;
  label?: string;
  /** Allow uploading multiple files in one go — invokes onUploaded for each. */
  multiple?: boolean;
  /** "pill" = small button only; "drop" = larger drop zone with hover hint. */
  variant?: 'pill' | 'drop';
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/svg+xml';
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/svg+xml',
]);

const ImageUploadButton: FC<Props> = ({
  slug,
  onUploaded,
  label = 'Upload image',
  multiple = false,
  variant = 'pill',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  const uploadOne = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', slug);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(`Upload failed (${file.name}): ${data.error ?? res.status}`);
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const ingest = async (files: File[]) => {
    if (files.length === 0) return;
    setErr(null);
    if (!slug.trim()) {
      setErr('Set a slug first.');
      return;
    }
    const filtered = files.filter((f) => ALLOWED.has(f.type));
    if (filtered.length === 0) {
      setErr('Only JPEG/PNG/WebP/AVIF/SVG are allowed.');
      return;
    }
    setPending(true);
    for (const f of filtered) {
      const url = await uploadOne(f);
      if (url) onUploaded(url);
    }
    setPending(false);
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await ingest(Array.from(e.target.files ?? []));
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDragOver = (e: DragEvent) => {
    if (!slug.trim() || pending) return;
    e.preventDefault();
    setOver(true);
  };
  const onDragLeave = () => setOver(false);
  const onDrop = async (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (!slug.trim() || pending) return;
    await ingest(Array.from(e.dataTransfer.files ?? []));
  };

  const click = () => inputRef.current?.click();

  if (variant === 'drop') {
    return (
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !pending && slug.trim() && click()}
        className={`${styles.dropZone} ${over ? styles.dropZoneOver : ''}`}
        role="button"
        tabIndex={0}
        title={!slug.trim() ? 'Slug must be set first' : ''}
        style={{ cursor: !slug.trim() || pending ? 'not-allowed' : 'pointer' }}
      >
        <span className={styles.dropZoneLabel}>
          {pending
            ? 'Uploading…'
            : !slug.trim()
              ? 'Set a slug to enable uploads'
              : label}
        </span>
        <span className={styles.dropZoneHint}>
          {pending
            ? ' '
            : 'Drag images here or click to choose'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple={multiple}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        {err && <span style={{ color: '#d98ea0', fontSize: 12 }}>{err}</span>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        disabled={pending || !slug.trim()}
        onClick={click}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`${styles.addBtn} ${over ? styles.addBtnOver : ''}`}
        title={!slug.trim() ? 'Slug must be set first' : ''}
      >
        {pending ? 'Uploading…' : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      {err && (
        <span style={{ color: '#d98ea0', fontSize: 12 }}>{err}</span>
      )}
    </div>
  );
};

export default ImageUploadButton;
