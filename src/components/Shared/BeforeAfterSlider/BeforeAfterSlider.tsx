'use client';

import { FC, useCallback, useRef, useState, PointerEvent, KeyboardEvent } from 'react';
import styles from './BeforeAfterSlider.module.scss';

interface Props {
  /** A single "before | after" composite image. By default the left half
   *  is "before" and the right half is "after"; some source shots are
   *  mounted the other way round, so `beforeSide` flips which physical
   *  half each label sits over. The component reveals halves via CSS, so
   *  no pre-split assets are needed. */
  src: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  /** Physical side that holds the "before" half of the composite. */
  beforeSide?: 'left' | 'right';
}

/** Draggable before/after comparison. Physical (LTR) by design — the
 *  image halves are physically left=before / right=after regardless of
 *  page direction. Pointer + keyboard accessible (role="slider"). */
const BeforeAfterSlider: FC<Props> = ({
  src,
  beforeLabel,
  afterLabel,
  alt,
  beforeSide = 'left',
}) => {
  // The slider mirrors the composite: the after-half (right of the file) is
  // revealed on the LEFT of the frame, the before-half shows on the RIGHT.
  // So for a standard file (before on its left half) the LEFT tag names the
  // "after" result; a file mounted the other way flips that.
  const leftIsBefore = beforeSide === 'right';
  const leftLabel = leftIsBefore ? beforeLabel : afterLabel;
  const rightLabel = leftIsBefore ? afterLabel : beforeLabel;
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
    // Keep the arrow keys on the slider handle — don't let the parent
    // carousel also page when the handle is focused.
    e.stopPropagation();
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
      <span
        className={`${styles.tag} ${styles.tagLeft} ${
          leftIsBefore ? '' : styles.tagResult
        }`}
      >
        {leftLabel}
      </span>
      <span
        className={`${styles.tag} ${styles.tagRight} ${
          leftIsBefore ? styles.tagResult : ''
        }`}
      >
        {rightLabel}
      </span>
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
