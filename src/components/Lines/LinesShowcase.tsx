'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { LineSummary } from '@/products';
import { track } from '@/lib/track';
import styles from './LinesShowcase.module.scss';

interface Props {
  lines: LineSummary[];
}

const accentVar: Record<'teal' | 'gold' | 'rose' | 'amber' | 'steel', string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

const LinesShowcase: FC<Props> = ({ lines }) => {
  const t = useTranslations('lines');
  if (lines.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="lines-section-title">
      <header className={styles.head}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </span>
        <h2 id="lines-section-title" className={styles.title}>
          {t('title')}
        </h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <div className={styles.list}>
        {lines.map((line, i) => (
          <article
            key={line.slug}
            className={`${styles.line} ${
              i % 2 === 1 ? styles.lineFlipped : ''
            } ${line.status === 'coming-soon' ? styles.soon : ''}`}
            style={{ ['--accent' as string]: accentVar[line.accent] }}
          >
            <div className={styles.media} aria-hidden="true">
              {line.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={line.image} alt="" loading="lazy" />
              ) : (
                <span className={styles.mediaPlaceholder}>
                  <span>{line.eyebrow}</span>
                </span>
              )}
              <span className={styles.glow} />
            </div>

            <div className={styles.body}>
              <span className={styles.lineEyebrow}>{line.eyebrow}</span>
              <h3 className={styles.lineName}>{line.name}</h3>
              <p className={styles.lineTagline}>{line.tagline}</p>
              <p className={styles.lineDesc}>{line.shortDescription}</p>

              {line.items.length > 0 && (
                <ul className={styles.skuList}>
                  {line.items.map((item) => (
                    <li key={item.slug}>
                      <Link href={item.href} className={styles.skuLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.ctaRow}>
                {line.status === 'available' ? (
                  <Link
                    href={line.href}
                    className={styles.cta}
                    onClick={() => track('line_cta', { slug: line.slug, source: 'home' })}
                  >
                    {t('explore')} <span className={styles.arrow}>→</span>
                  </Link>
                ) : (
                  <span className={styles.soonBadge}>{t('comingSoon')}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LinesShowcase;
