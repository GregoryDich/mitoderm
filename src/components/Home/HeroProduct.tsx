'use client';

import { FC, PointerEvent, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HeroProduct.module.scss';

interface Props {
  src: string;
}

/** The hero product with pointer-reactive parallax tilt + a light sheen
 *  that follows the cursor — the "advanced" hook. Transform-only (60fps),
 *  gated behind prefers-reduced-motion, physically symmetric so it works
 *  in RTL without changes. */
const HeroProduct: FC<Props> = ({ src }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce.current) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty('--tx', `${(px * 16).toFixed(1)}px`);
    el.style.setProperty('--ty', `${(py * 16).toFixed(1)}px`);
    el.style.setProperty('--lx', `${(px * 90 + 50).toFixed(0)}%`);
    el.style.setProperty('--ly', `${(py * 90 + 50).toFixed(0)}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
    el.style.setProperty('--lx', '50%');
    el.style.setProperty('--ly', '50%');
  };

  return (
    <div
      ref={ref}
      className={styles.stage}
      onPointerMove={onMove}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <span className={styles.glow} />
      <div className={styles.tilt}>
        <Image
          src={src}
          alt=""
          width={640}
          height={760}
          priority
          className={styles.img}
        />
        <span className={styles.sheen} />
      </div>
    </div>
  );
};

export default HeroProduct;
