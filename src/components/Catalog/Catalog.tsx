'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CatalogItem, ProductCategory, ProductAccent } from '@/products';
import Footer from '@/components/Layout/Footer/Footer';
import HoverVideoMedia from '@/components/Product/HoverVideoMedia';
import InterestToggle from '@/components/InterestList/InterestToggle';
import RecentlyViewedStrip from '@/components/RecentlyViewed/RecentlyViewedStrip';
import { track } from '@/lib/track';
import styles from './Catalog.module.scss';

interface Props {
  items: CatalogItem[];
}

type Filter = 'all' | ProductCategory;

const filters: { key: Filter; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'serum', labelKey: 'filterSerum' },
  { key: 'mask', labelKey: 'filterMask' },
  { key: 'gel', labelKey: 'filterGel' },
  { key: 'hair', labelKey: 'filterHair' },
  { key: 'peel', labelKey: 'filterPeel' },
  { key: 'device', labelKey: 'filterDevice' },
];

const FILTER_KEYS = new Set<string>(filters.map((f) => f.key));

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

/** Reflect filter + query into the URL without a Next navigation —
 *  shallow replaceState keeps the scroll position and avoids a server
 *  round-trip, while still making the view shareable / back-button
 *  friendly. */
function syncUrl(active: Filter, query: string): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (active === 'all') params.delete('category');
  else params.set('category', active);
  if (query.trim()) params.set('q', query.trim());
  else params.delete('q');
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
  window.history.replaceState(null, '', url);
}

const Catalog: FC<Props> = ({ items }) => {
  const t = useTranslations('catalog');
  const searchParams = useSearchParams();

  // Seed initial state from the URL so a shared /catalog?category=serum
  // link lands pre-filtered.
  const initialCategory = searchParams.get('category');
  const [active, setActive] = useState<Filter>(
    initialCategory && FILTER_KEYS.has(initialCategory)
      ? (initialCategory as Filter)
      : 'all'
  );
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    syncUrl(active, query);
  }, [active, query]);

  const onFilter = useCallback((key: Filter) => {
    setActive(key);
    track('catalog_filter', { category: key });
  }, []);

  const reset = useCallback(() => {
    setActive('all');
    setQuery('');
  }, []);

  const visible = useMemo(() => {
    const byCategory =
      active === 'all' ? items : items.filter((i) => i.category === active);
    const q = query.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((i) => {
      const haystack = `${i.name} ${i.shortDescription} ${i.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [active, items, query]);

  const isFiltered = active !== 'all' || query.trim().length > 0;

  return (
    <div className={`pageScroll ${styles.page}`}>
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <span className={styles.glowC} />
      </div>

      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <main className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={active === f.key}
                className={`${styles.filter} ${
                  active === f.key ? styles.filterActive : ''
                }`}
                onClick={() => onFilter(f.key)}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
          <label className={styles.searchWrap}>
            <span className="sr-only">{t('searchLabel')}</span>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M20 20l-3.6-3.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              className={styles.search}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('searchLabel')}
            />
          </label>
        </div>
        <div className={styles.resultRow} aria-live="polite">
          <span className={styles.resultCount}>
            {t('resultCount', { shown: visible.length, total: items.length })}
          </span>
          {isFiltered && (
            <button type="button" className={styles.resetBtn} onClick={reset}>
              {t('clearFilters')}
            </button>
          )}
        </div>

        {visible.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t('noResults')}</p>
            <button type="button" className={styles.emptyReset} onClick={reset}>
              {t('clearFilters')}
            </button>
          </div>
        )}

        <div className={styles.grid}>
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className={styles.card}
              style={{ ['--accent' as string]: accentVar[item.accent] }}
            >
              <div className={styles.cardMedia}>
                <HoverVideoMedia
                  image={item.image}
                  video={item.cardVideo}
                  accent={item.accent}
                  alt={item.name}
                  className={styles.media}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className={styles.cardFav}>
                  <InterestToggle
                    slug={item.slug}
                    addLabel={t('addToList')}
                    removeLabel={t('removeFromList')}
                  />
                </span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.tags}>
                  <span className={styles.tag}>
                    {item.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={styles.status}>
                    <span
                      className={`${styles.dot} ${
                        item.status === 'available'
                          ? styles.dotOk
                          : styles.dotSoon
                      }`}
                    />
                    {item.status === 'available'
                      ? t('available')
                      : t('comingSoon')}
                  </span>
                </div>
                <h3 className={styles.cardName}>{item.name}</h3>
                <p className={styles.cardDesc}>{item.shortDescription}</p>
                <span className={styles.cardLink}>
                  {t('learnMore')} <span className={styles.arrow}>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaText')}</p>
          <Link href="/form" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </section>
      </main>

      <RecentlyViewedStrip />

      <Footer />
    </div>
  );
};

export default Catalog;
