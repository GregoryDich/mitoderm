'use client';

import { FC, useCallback, useRef, useState, PointerEvent, KeyboardEvent } from 'react';
import styles from './BeforeAfterSlider.module.scss';

interface Props {
  /** A single "before | after" composite image (left half = before,
   *  right half = after). The component reveals each half via CSS, so
   *  no pre-split assets are needed. */
  src: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
}

/** Draggable before/after comparison. Physical (LTR) by design — the
 *  image halves are physically left=before / right=after regardless of
 *  page direction. Pointer + keyboard accessible (role="slider"). */
const BeforeAfterSlider: FC<Props> = ({ src, beforeLabel, afterLabel, alt }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 1) setFromClientX(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={styles.wrap}
      role="img"
      aria-label={alt}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div className={styles.before} style={{ backgroundImage: `url(${src})` }} />
      <div
        className={styles.after}
        style={{
          backgroundImage: `url(${src})`,
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      />
      <span className={`${styles.tag} ${styles.tagBefore}`}>{beforeLabel}</span>
      <span className={`${styles.tag} ${styles.tagAfter}`}>{afterLabel}</span>
      <div
        className={styles.handle}
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label={`${beforeLabel} / ${afterLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className={styles.grip} aria-hidden="true">
          ‹›
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
