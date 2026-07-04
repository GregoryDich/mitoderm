'use client';

import { FC } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Reveal from '@/components/Shared/Reveal/Reveal';
import { track } from '@/lib/track';
import showcase from '@/data/showcase.json';
import styles from './ProductShowcase.module.scss';

type Loc = 'en' | 'ru' | 'he';
type L = Record<Loc, string>;

interface Item {
  slug: string;
  name: string;
  image: string;
  surface: 'dark' | 'light' | 'gold';
  badge?: L;
  line: L;
  tagline: L;
  description: L;
  highlights: L[];
  /** Curated product/device slugs this one is designed to work with
   *  (the 1+1=3 system story). */
  pairsWith?: string[];
}

const DATA = showcase as unknown as {
  meta: { kicker: L; title: L; learnMore: L; pairsLabel: L };
  items: Item[];
};

/** slug → display name, so pairs-with chips can label their targets. */
const NAME_BY_SLUG: Record<string, string> = Object.fromEntries(
  DATA.items.map((i) => [i.slug, i.name])
);

const surfaceClass: Record<Item['surface'], string> = {
  dark: styles.dark,
  light: styles.light,
  gold: styles.gold,
};

/** The collection — every product as its own editorial banner, matching
 *  the Figma: a large glowing product shot beside a strong one-line USP,
 *  three proof points and a link. Surfaces alternate dark / light / gold
 *  and the image side flips row to row for rhythm. RTL-safe, reveal on
 *  scroll (reduced-motion falls back to instant). */
const ProductShowcase: FC = () => {
  const locale = useLocale() as Loc;
  const pick = (l: L) => l[locale] ?? l.en;

  return (
    <div className={styles.wrap} id="collection">
      <header className={styles.head}>
        <span className={styles.kicker}>{pick(DATA.meta.kicker)}</span>
        <h2 className={styles.title}>{pick(DATA.meta.title)}</h2>
      </header>

      {DATA.items.map((p, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={p.slug}
            className={`${styles.row} ${surfaceClass[p.surface]} ${
              reversed ? styles.reversed : ''
            }`}
          >
            <div className={styles.inner}>
              <Reveal
                variant="scale"
                className={styles.mediaCol}
              >
                <span className={styles.glow} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={`${p.name} — ${pick(p.tagline)}`}
                  className={styles.media}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </Reveal>

              <Reveal variant="rise" delay={80} className={styles.textCol}>
                <div className={styles.metaRow}>
                  <span className={styles.line}>{pick(p.line)}</span>
                  {p.badge && (
                    <span className={styles.badge}>{pick(p.badge)}</span>
                  )}
                </div>

                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.tagline}>{pick(p.tagline)}</p>
                <p className={styles.desc}>{pick(p.description)}</p>

                <ul className={styles.highlights}>
                  {p.highlights.map((h) => (
                    <li key={h.en} className={styles.highlight}>
                      <span className={styles.tick} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="12" height="12">
                          <path
                            d="M5 12.5l4.5 4.5L19 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {pick(h)}
                    </li>
                  ))}
                </ul>

                {p.pairsWith && p.pairsWith.length > 0 && (
                  <div className={styles.pairs}>
                    <span className={styles.pairsLabel}>
                      {pick(DATA.meta.pairsLabel)}
                    </span>
                    <span className={styles.pairsChips}>
                      {p.pairsWith
                        .filter((s) => NAME_BY_SLUG[s])
                        .map((s) => (
                          <Link
                            key={s}
                            href={`/products/${s}`}
                            className={styles.pairChip}
                            onClick={() =>
                              track('catalog_card_click', {
                                slug: s,
                                from: 'pairs',
                              })
                            }
                          >
                            {NAME_BY_SLUG[s]}
                          </Link>
                        ))}
                    </span>
                  </div>
                )}

                <Link
                  href={`/products/${p.slug}`}
                  className={styles.cta}
                  onClick={() =>
                    track('catalog_card_click', {
                      slug: p.slug,
                      from: 'showcase',
                    })
                  }
                >
                  {pick(DATA.meta.learnMore)}
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductShowcase;
