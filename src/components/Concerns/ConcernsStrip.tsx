'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { track } from '@/lib/track';
import styles from './ConcernsStrip.module.scss';

interface Concern {
  key: string;
  href: string;
  accent: 'teal' | 'gold' | 'rose';
}

const concerns: Concern[] = [
  { key: 'density', href: '/lines/exosomes', accent: 'gold' },
  { key: 'hair', href: '/lines/exosignal-hair', accent: 'teal' },
  { key: 'longevity', href: '/lines/peeling', accent: 'gold' },
  { key: 'devices', href: '/lines/devices', accent: 'teal' },
];

const accentVar: Record<Concern['accent'], string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const ConcernsStrip: FC = () => {
  const t = useTranslations('concerns');

  return (
    <section className={styles.section} aria-labelledby="concerns-title">
      <header className={styles.head}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </span>
        <h2 id="concerns-title" className={styles.title}>
          {t('title')}
        </h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <ul className={styles.grid}>
        {concerns.map((c) => (
          <li key={c.key} className={styles.card} style={{ ['--accent' as string]: accentVar[c.accent] }}>
            <Link
              href={c.href}
              className={styles.link}
              onClick={() => track('cta_click', { source: 'concerns', concern: c.key })}
            >
              <span className={styles.cardEyebrow}>{t(`${c.key}.eyebrow`)}</span>
              <h3 className={styles.cardTitle}>{t(`${c.key}.title`)}</h3>
              <p className={styles.cardText}>{t(`${c.key}.text`)}</p>
              <span className={styles.cardLink}>
                {t('explore')} <span className={styles.arrow}>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ConcernsStrip;
