'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './PhilosophyStrip.module.scss';

interface Stat {
  value: string;
  label: string;
}

/** The Mitoderm Philosophy — a light (paper) section that breaks the
 *  dark rhythm, matching the Figma reference: centered kicker + serif
 *  manifesto + a 3-stat rule grid. */
const PhilosophyStrip: FC = () => {
  const t = useTranslations('home.philosophy');
  const stats = (t.raw('stats') as Stat[]) ?? [];

  return (
    <section className={styles.philosophy} aria-label={t('kicker')}>
      <div className={styles.inner}>
        <Reveal variant="fade">
          <span className={styles.kicker}>{t('kicker')}</span>
        </Reveal>
        <Reveal variant="rise">
          <p className={styles.quote}>{t('quote')}</p>
        </Reveal>
        {stats.length > 0 && (
          <Reveal variant="rise" stagger={120} className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default PhilosophyStrip;
