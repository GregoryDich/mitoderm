'use client';

import { FC, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import BeforeAfterSlider from '@/components/Shared/BeforeAfterSlider/BeforeAfterSlider';
import styles from './ResultsStrip.module.scss';

/** The 18 real before/after composites from mitoderm.com.
 *  Their layout is NOT uniform — each was inspected by eye:
 *  - most are side-by-side pairs with *before* on the left half;
 *  - a few put *before* on the right (`beforeSide: 'right'`);
 *  - three aren't a clean left|right pair at all (#4 is stacked with
 *    its own AFTER/BEFORE labels, #8 is a 3-stage progression, #15 is
 *    ambiguous), so they render as static frames, not drag-sliders. */
type Shot =
  | { n: number; kind: 'slider'; beforeSide: 'left' | 'right' }
  | { n: number; kind: 'static' };

const SHOTS: Shot[] = [
  { n: 1, kind: 'slider', beforeSide: 'left' },
  { n: 2, kind: 'slider', beforeSide: 'left' },
  { n: 3, kind: 'slider', beforeSide: 'right' },
  { n: 4, kind: 'static' },
  { n: 5, kind: 'slider', beforeSide: 'right' },
  { n: 6, kind: 'slider', beforeSide: 'left' },
  { n: 7, kind: 'slider', beforeSide: 'left' },
  { n: 8, kind: 'static' },
  { n: 9, kind: 'slider', beforeSide: 'right' },
  { n: 10, kind: 'slider', beforeSide: 'left' },
  { n: 11, kind: 'slider', beforeSide: 'right' },
  { n: 12, kind: 'slider', beforeSide: 'left' },
  { n: 13, kind: 'slider', beforeSide: 'left' },
  { n: 14, kind: 'slider', beforeSide: 'left' },
  { n: 15, kind: 'static' },
  { n: 16, kind: 'slider', beforeSide: 'left' },
  { n: 17, kind: 'slider', beforeSide: 'left' },
  { n: 18, kind: 'slider', beforeSide: 'left' },
];

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
          className={styles.nav}
          onClick={() => go(-1)}
          aria-label={t('prev')}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div className={styles.frame}>
          {SHOTS[i].kind === 'slider' ? (
            <BeforeAfterSlider
              key={SHOTS[i].n}
              src={`/proof/before-after/${SHOTS[i].n}.webp`}
              beforeLabel={t('before')}
              afterLabel={t('after')}
              alt={t('alt')}
              beforeSide={SHOTS[i].beforeSide}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={SHOTS[i].n}
              src={`/proof/before-after/${SHOTS[i].n}.webp`}
              alt={t('alt')}
              className={styles.staticShot}
              loading="lazy"
              draggable={false}
            />
          )}
        </div>

        <button
          type="button"
          className={styles.nav}
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
        {SHOTS.map((s, idx) => (
          <button
            key={s.n}
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
