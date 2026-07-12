'use client';

import { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './CertStrip.module.scss';

/** lucide-style inline icons (no dependency). */
const ICONS: ReactNode[] = [
  // flask — clinical grade
  <svg key="flask" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 14h9" />
  </svg>,
  // shield-check — sterile / single-dose
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3zM9 12l2 2 4-4" />
  </svg>,
  // award — professional-only
  <svg key="award" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="9" r="5" />
    <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
  </svg>,
  // sparkles — Italian technology
  <svg key="spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z" />
  </svg>,
];

/** Standards & certifications — a 4-icon trust grid matching the Figma. */
const CertStrip: FC = () => {
  const t = useTranslations('home');
  const badges = (t.raw('badges') as string[]) ?? [];

  return (
    <section className={styles.certs} aria-label={t('certTitle')}>
      <div className={styles.head}>
        <span className={styles.line} />
        <h2 className={styles.title}>{t('certTitle')}</h2>
        <span className={styles.line} />
      </div>
      <Reveal variant="rise" stagger={100} className={styles.grid}>
        {badges.map((b, i) => (
          <div key={b} className={styles.card}>
            <span className={styles.icon}>{ICONS[i % ICONS.length]}</span>
            <span className={styles.label}>{b}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
};

export default CertStrip;
