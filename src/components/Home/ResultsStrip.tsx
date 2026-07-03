'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './ResultsStrip.module.scss';

/** Curated real before/after composites (each image is a single
 *  before | after frame) downloaded from mitoderm.com. */
const SHOTS = ['1', '4', '5', '7', '12', '18'];

/** "Proven on real skin" — the audit's #1 proof block. Renders the
 *  owner's own professional before/after results with a compliance
 *  disclaimer. Reduced-motion safe via Reveal. */
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
      </div>

      <Reveal variant="rise" stagger={110} className={styles.grid}>
        {SHOTS.map((n) => (
          <figure key={n} className={styles.card}>
            <Image
              src={`/proof/before-after/${n}.webp`}
              alt={t('alt')}
              fill
              className={styles.img}
              sizes="(max-width: 760px) 100vw, 560px"
              loading="lazy"
            />
            <figcaption className={styles.chip}>{t('beforeAfter')}</figcaption>
          </figure>
        ))}
      </Reveal>

      <p className={styles.disclaimer}>{t('disclaimer')}</p>
    </section>
  );
};

export default ResultsStrip;
