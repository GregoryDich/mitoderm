'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.scss';

export type RevealVariant = 'rise' | 'fade' | 'scale' | 'blur';

interface Props {
  children: ReactNode;
  /** Transition delay in ms for the wrapper itself. */
  delay?: number;
  className?: string;
  /** Entry style. Defaults to the classic rise (fade + translateY). */
  variant?: RevealVariant;
  /** When set, direct children get incremental transition delays of
   *  `stagger` ms each (child 0 → 0ms, child 1 → stagger, …), creating
   *  a cascade. Children must be block-level for transforms to apply. */
  stagger?: number;
}

const variantClass: Record<RevealVariant, string> = {
  rise: styles.vRise,
  fade: styles.vFade,
  scale: styles.vScale,
  blur: styles.vBlur,
};

const Reveal: FC<Props> = ({
  children,
  delay = 0,
  className,
  variant = 'rise',
  stagger,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const root =
      (document.querySelector('.pageScroll') as HTMLElement | null) ?? null;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { root, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stagger: assign incremental delays to direct children via CSS vars.
  useEffect(() => {
    if (!stagger || !ref.current) return;
    const kids = Array.from(ref.current.children) as HTMLElement[];
    kids.forEach((k, i) => {
      k.style.transitionDelay = `${delay + i * stagger}ms`;
    });
  }, [stagger, delay]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${variantClass[variant]} ${
        stagger ? styles.staggered : ''
      } ${shown ? styles.revealed : ''} ${className ?? ''}`}
      style={!stagger && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
