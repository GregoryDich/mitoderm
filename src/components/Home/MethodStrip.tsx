'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './MethodStrip.module.scss';

interface Row {
  from: string;
  to: string;
  note: string;
}

/** "The method" — the solution-aware rung of the funnel: a busy buyer
 *  asking "why exosomes / NAD at all?" gets an honest contrast of the
 *  regenerative approach vs conventional treatment (no competitor names,
 *  no clinical claims), then a link into the science. New-design idioms:
 *  gold kicker, serif title, from → to rows, Reveal cascade (RTL-safe). */
const MethodStrip: FC = () => {
  const t = useTranslations('home.method');
  const rows = (t.raw('rows') as Row[]) ?? [];

  return (
    <section className={styles.section} aria-labelledby="method-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.kicker}>{t('kicker')}</span>
          <h2 id="method-title" className={styles.title}>
            {t('title')}
          </h2>
          <p className={styles.lead}>{t('lead')}</p>
        </header>

        <Reveal variant="rise" stagger={90} className={styles.rows}>
          {rows.map((r) => (
            <div key={r.to} className={styles.row}>
              <div className={styles.shift}>
                <span className={styles.from}>{r.from}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
                <span className={styles.to}>{r.to}</span>
              </div>
              <p className={styles.note}>{r.note}</p>
            </div>
          ))}
        </Reveal>

        <Link href="/science" className={styles.cta}>
          {t('scienceCta')}
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
};

export default MethodStrip;
