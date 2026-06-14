'use client';
import { FC, useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import styles from './StickyMobileCta.module.scss';

interface Props {
  waHref?: string | null;
  waLabel: string;
  quoteLabel: string;
}

const StickyMobileCta: FC<Props> = ({ waHref, waLabel, quoteLabel }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const h = window.innerHeight;
      const doc = document.documentElement.scrollHeight;
      // show after first viewport, hide near the footer
      setVisible(y > h * 0.6 && y + h < doc - 240);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`${styles.bar} ${visible ? styles.visible : ''}`}
      role="region"
      aria-label={quoteLabel}
    >
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className={`${styles.btn} ${styles.primary}`}
          aria-label={waLabel}
        >
          {waLabel}
        </a>
      ) : (
        <Link
          href="/form"
          className={`${styles.btn} ${styles.primary}`}
          aria-label={quoteLabel}
        >
          {quoteLabel}
        </Link>
      )}
      {waHref ? (
        <Link href="/form" className={styles.btn} aria-label={quoteLabel}>
          {quoteLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default StickyMobileCta;
