'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Shared/Reveal/Reveal';
import BeforeAfterSlider from '@/components/Shared/BeforeAfterSlider/BeforeAfterSlider';
import styles from './ResultsStrip.module.scss';

/** Curated real before/after composites (each image is a single
 *  before | after frame) downloaded from mitoderm.com. */
const SHOTS = ['1', '4', '5', '7', '12', '18'];

/** "Proven on real skin" — the audit's #1 proof block. Each result is a
 *  draggable before/after comparison slider. Reduced-motion safe. */
const ResultsStrip: FC = () => {
  const t = useTranslations('home.results');

  return (
    <section className={styles.results} aria-label={t('title')}>
      <div className={styles.head}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
        <p className={styles.hint}>{t('dragHint')}</p>
      </div>

      <Reveal variant="rise" stagger={110} className={styles.grid}>
        {SHOTS.map((n) => (
          <BeforeAfterSlider
            key={n}
            src={`/proof/before-after/${n}.webp`}
            beforeLabel={t('before')}
            afterLabel={t('after')}
            alt={t('alt')}
          />
        ))}
      </Reveal>

      <p className={styles.disclaimer}>{t('disclaimer')}</p>
    </section>
  );
};

export default ResultsStrip;
