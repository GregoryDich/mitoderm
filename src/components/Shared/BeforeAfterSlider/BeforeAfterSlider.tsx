'use client';

import { FC, useCallback, useRef, useState, PointerEvent, KeyboardEvent } from 'react';
import styles from './BeforeAfterSlider.module.scss';

interface Props {
  /** A single side-by-side composite image. One half is the "before"
   *  photo, the other the "after"; `beforeSide` says which. The
   *  component reveals each half via CSS, so no pre-split assets are
   *  needed. */
  src: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  /** Which physical half of the composite is the *before* photo.
   *  Not every source file puts before on the left — verified per
   *  image. Defaults to 'left'. */
  beforeSide?: 'left' | 'right';
}

/** Draggable before/after comparison. Physical (LTR) by design — the
 *  reveal is anchored to the composite's physical halves regardless of
 *  page direction, so it reads identically in LTR and RTL. The frame
 *  always shows BEFORE on the left (under the before tag) and AFTER on
 *  the right. Pointer + keyboard accessible (role="slider"). */
const BeforeAfterSlider: FC<Props> = ({
  src,
  beforeLabel,
  afterLabel,
  alt,
  beforeSide = 'left',
}) => {
  // The before layer shows the composite's before-half; the after
  // layer the opposite half. Positions flip when before is on the
  // right of the source file.
  const beforePos = beforeSide === 'left' ? 'left center' : 'right center';
  const afterPos = beforeSide === 'left' ? 'right center' : 'left center';
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
      <div
        className={styles.before}
        style={{ backgroundImage: `url(${src})`, backgroundPosition: beforePos }}
      />
      <div
        className={styles.after}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: afterPos,
          // Reveal the after-half on the RIGHT of the handle so it sits
          // under the after tag; before stays on the left.
          clipPath: `inset(0 0 0 ${pos}%)`,
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
