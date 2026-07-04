'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { LineSummary } from '@/products';
import Reveal from '@/components/Shared/Reveal/Reveal';
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

/** The ecosystem — each product LINE as one editorial offer block with
 *  its products shown together (synergy), matching the Figma. All lines
 *  visible at once so a clinic owner can compare and self-select. */
const LinesShowcase: FC<Props> = ({ lines }) => {
  const t = useTranslations('lines');
  const highlightsMap =
    (t.raw('highlights') as Record<string, string[]>) ?? {};
  const withProducts = lines.filter((l) => l.items.length > 0);
  if (withProducts.length === 0) return null;

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
        {withProducts.map((line) => (
          <article
            key={line.slug}
            className={styles.line}
            style={{ ['--accent' as string]: accentVar[line.accent] }}
          >
            <div className={styles.lineHead}>
              <span className={styles.accentBar} aria-hidden="true" />
              <div className={styles.lineMeta}>
                <span className={styles.lineEyebrow}>{line.eyebrow}</span>
                <h3 className={styles.lineName}>{line.name}</h3>
                <p className={styles.lineTagline}>{line.tagline}</p>
                {(highlightsMap[line.slug] ?? []).length > 0 && (
                  <ul className={styles.highlights}>
                    {highlightsMap[line.slug].map((h) => (
                      <li key={h} className={styles.highlight}>
                        <span className={styles.check} aria-hidden="true">
                          ✓
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Link
                href={line.href}
                className={styles.exploreLink}
                onClick={() =>
                  track('line_cta', { slug: line.slug, source: 'home' })
                }
              >
                {t('explore')} <span className={styles.arrow}>→</span>
              </Link>
            </div>

            {/* Products of the line, together — the "1+1=3" synergy. */}
            <Reveal
              variant="rise"
              stagger={110}
              className={`${styles.products} ${
                line.items.length === 1
                  ? styles.productsOne
                  : line.items.length === 2
                  ? styles.productsTwo
                  : ''
              }`}
            >
              {line.items.map((item) => (
                <Link key={item.slug} href={item.href} className={styles.pcard}>
                  <div className={styles.pmedia}>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" loading="lazy" />
                    ) : (
                      <span className={styles.pmediaEmpty} aria-hidden="true" />
                    )}
                  </div>
                  <div className={styles.pbody}>
                    <span className={styles.pcat}>
                      {item.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <h4 className={styles.pname}>{item.name}</h4>
                    <p className={styles.pdesc}>{item.shortDescription}</p>
                    <span className={styles.pdetails}>
                      {t('details')}{' '}
                      <span className={styles.arrow}>↗</span>
                    </span>
                  </div>
                </Link>
              ))}
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LinesShowcase;
