'use client';

import { FC, useRef, useState } from 'react';
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
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/svg+xml';

const ImageUploadButton: FC<Props> = ({
  slug,
  onUploaded,
  label = 'Upload image',
  multiple = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setErr(null);
    if (!slug.trim()) {
      setErr('Set a slug first.');
      return;
    }
    setPending(true);
    for (const f of files) {
      const url = await uploadOne(f);
      if (url) onUploaded(url);
    }
    setPending(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        disabled={pending || !slug.trim()}
        onClick={() => inputRef.current?.click()}
        className={styles.addBtn}
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
