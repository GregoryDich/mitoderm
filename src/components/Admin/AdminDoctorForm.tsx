'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  Doctor,
  DoctorArea,
  DoctorProfession,
} from '@/lib/doctors-store';
import ImageUploadButton from './ImageUploadButton';
import styles from './admin-form.module.scss';

interface Props {
  mode: 'create' | 'edit';
  initial?: Doctor;
}

const PROFESSIONS: { v: DoctorProfession; label: string }[] = [
  { v: 'cosmetologist', label: 'Cosmetologist (face)' },
  { v: 'trichologist', label: 'Trichologist (scalp)' },
  { v: 'hair-stylist', label: 'Hair stylist' },
  { v: 'doctor', label: 'Doctor / MD' },
  { v: 'clinic', label: 'Clinic / Brand' },
];

const AREAS: { v: DoctorArea; label: string }[] = [
  { v: 'center', label: 'Center (Tel Aviv, Herzliya, Ra’anana, Netanya…)' },
  { v: 'north', label: 'North (Haifa, Krayot, Galilee…)' },
  { v: 'south', label: 'South (Be’er Sheva, Negev…)' },
  { v: 'jerusalem', label: 'Jerusalem' },
  { v: 'eilat', label: 'Eilat' },
];

const AdminDoctorForm: FC<Props> = ({ mode, initial }) => {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [profession, setProfession] = useState<DoctorProfession>(
    initial?.profession ?? 'cosmetologist'
  );
  const [city, setCity] = useState(initial?.city ?? '');
  const [area, setArea] = useState<DoctorArea>(initial?.area ?? 'center');
  const [contact, setContact] = useState(initial?.contact ?? '');
  const [instagram, setInstagram] = useState(initial?.instagram ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [photo, setPhoto] = useState(initial?.photo ?? '');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const payload = {
      name: name.trim(),
      profession,
      city: city.trim(),
      area,
      contact: contact.trim(),
      instagram: instagram.trim() || undefined,
      bio: bio.trim() || undefined,
      photo: photo.trim() || undefined,
      isPublished,
    };
    const url =
      mode === 'create'
        ? '/api/admin/doctors'
        : `/api/admin/doctors/${encodeURIComponent(initial!.id)}`;
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
    router.replace('/admin/doctors');
    router.refresh();
  };

  // Photos are stored under public/doctors/<id> when editing, public/doctors/_new/<slug> on create.
  const uploadSlug = initial?.id ?? 'doctors-new';

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {mode === 'create' ? 'New entry' : `Edit ${initial?.name}`}
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
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Profession</span>
            <select
              value={profession}
              onChange={(e) =>
                setProfession(e.target.value as DoctorProfession)
              }
              className={styles.input}
            >
              {PROFESSIONS.map((p) => (
                <option key={p.v} value={p.v}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>City *</span>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Area</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value as DoctorArea)}
              className={styles.input}
            >
              {AREAS.map((a) => (
                <option key={a.v} value={a.v}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Contact *</span>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              placeholder="+972…"
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Instagram</span>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="handle or full URL"
              className={styles.input}
            />
          </label>
          <label className={`${styles.field} ${styles.wide}`}>
            <span className={styles.fieldLabel}>Short bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={2000}
              className={styles.textarea}
              placeholder="Optional — 1–2 sentences shown on the public site."
            />
          </label>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Photo</h2>
        <div className={styles.heroPreview}>
          {photo && !photoFailed ? (
            <span
              className={styles.thumb}
              style={{ borderRadius: '50%', width: 88, height: 88 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt=""
                onError={() => setPhotoFailed(true)}
              />
            </span>
          ) : (
            <span
              className={styles.thumb}
              style={{ borderRadius: '50%', width: 88, height: 88 }}
            >
              <span className={styles.thumbEmpty}>—</span>
            </span>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="text"
              value={photo}
              onChange={(e) => {
                setPhoto(e.target.value);
                setPhotoFailed(false);
              }}
              placeholder="/doctors/<name>/portrait.jpg"
              className={styles.input}
            />
            <ImageUploadButton
              slug={uploadSlug}
              label="Upload portrait"
              variant="drop"
              onUploaded={(url) => {
                setPhoto(url);
                setPhotoFailed(false);
              }}
            />
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sub}>Publishing</h2>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <span>
            Published — visible on the public site (clinic directory and
            “Trusted by” strip). Untick to keep as draft.
          </span>
        </label>
      </section>

      {err && (
        <p role="alert" className={styles.err}>
          {err}
        </p>
      )}
    </form>
  );
};

export default AdminDoctorForm;
