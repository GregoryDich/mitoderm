'use client';

import { FC, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import BeforeAfterSlider from '@/components/Shared/BeforeAfterSlider/BeforeAfterSlider';
import styles from './ResultsStrip.module.scss';

/** All 18 real before/after composites downloaded from mitoderm.com. */
const SHOTS = Array.from({ length: 18 }, (_, i) => String(i + 1));

/** "Real results, on real skin" — a carousel of drag-to-compare
 *  before/after sliders (arrows + dots + counter), matching the
 *  original site's results presentation. Reduced-motion safe. */
const ResultsStrip: FC = () => {
  const t = useTranslations('home.results');
  const [i, setI] = useState(0);

  const go = useCallback(
    (delta: number) => setI((v) => (v + delta + SHOTS.length) % SHOTS.length),
    []
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      go(-1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      go(1);
      e.preventDefault();
    }
  };

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

      <div
        className={styles.stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={t('title')}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={() => go(-1)}
          aria-label={t('prev')}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className={styles.frame}>
          <BeforeAfterSlider
            key={SHOTS[i]}
            src={`/proof/before-after/${SHOTS[i]}.webp`}
            beforeLabel={t('before')}
            afterLabel={t('after')}
            alt={t('alt')}
          />
        </div>

        <button
          type="button"
          className={`${styles.nav} ${styles.navNext}`}
          onClick={() => go(1)}
          aria-label={t('next')}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className={styles.counter} aria-live="polite">
        {i + 1} / {SHOTS.length}
      </div>

      <div className={styles.dots} role="tablist" aria-label={t('title')}>
        {SHOTS.map((n, idx) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-label={`${idx + 1}`}
            aria-selected={idx === i}
            className={`${styles.dot} ${idx === i ? styles.dotActive : ''}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>

      <p className={styles.disclaimer}>{t('disclaimer')}</p>
    </section>
  );
};

export default ResultsStrip;
