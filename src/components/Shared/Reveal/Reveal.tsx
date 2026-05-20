'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.scss';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const Reveal: FC<Props> = ({ children, delay = 0, className }) => {
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

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.revealed : ''} ${
        className ?? ''
      }`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
