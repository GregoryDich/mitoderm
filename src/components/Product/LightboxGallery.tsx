'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './LightboxGallery.module.scss';

interface Props {
  images: string[];
  name: string;
}

const LightboxGallery: FC<Props> = ({ images, name }) => {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const close = useCallback(() => setOpenAt(null), []);
  const prev = useCallback(
    () => setOpenAt((i) => (i == null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenAt((i) => (i == null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openAt == null) return;
    const scroller = document.querySelector('.pageScroll') as HTMLElement | null;
    const prevOverflow = scroller?.style.overflow;
    if (scroller) scroller.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (scroller) scroller.style.overflow = prevOverflow ?? '';
    };
  }, [openAt, close, prev, next]);

  return (
    <>
      <div className={styles.gallery}>
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Open ${name} photo ${i + 1}`}
            onClick={() => setOpenAt(i)}
            className={`${styles.galleryItem} ${
              i === 0 ? styles.galleryWide : ''
            }`}
          >
            <Image
              src={src}
              alt={`${name} — ${i + 1}`}
              fill
              sizes={
                i === 0
                  ? '(max-width: 600px) 100vw, (max-width: 1024px) 100vw, 66vw'
                  : '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              className={styles.thumb}
            />
          </button>
        ))}
      </div>

      {openAt !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} gallery`}
          className={styles.overlay}
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            className={`${styles.iconBtn} ${styles.close}`}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Previous"
            className={`${styles.iconBtn} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            className={`${styles.iconBtn} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[openAt]}
              alt={`${name} — ${openAt + 1}`}
              className={styles.stageImg}
              width={1600}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 90vw"
              priority
            />
            <span className={styles.counter}>
              {openAt + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default LightboxGallery;
