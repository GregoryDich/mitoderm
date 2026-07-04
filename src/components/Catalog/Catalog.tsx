'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { CatalogItem, LineSummary, ProductAccent } from '@/products';
import Footer from '@/components/Layout/Footer/Footer';
import HoverVideoMedia from '@/components/Product/HoverVideoMedia';
import InterestToggle from '@/components/InterestList/InterestToggle';
import RecentlyViewedStrip from '@/components/RecentlyViewed/RecentlyViewedStrip';
import { track } from '@/lib/track';
import styles from './Catalog.module.scss';

interface Props {
  items: CatalogItem[];
  /** Line summaries — the catalog is explored by product line (Figma). */
  lines?: LineSummary[];
}

type Filter = 'all' | string;

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

/** Reflect filter + query into the URL without a Next navigation —
 *  shallow replaceState keeps the scroll position and avoids a server
 *  round-trip, while still making the view shareable / back-button
 *  friendly. */
function syncUrl(active: Filter, query: string): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (active === 'all') params.delete('line');
  else params.set('line', active);
  if (query.trim()) params.set('q', query.trim());
  else params.delete('q');
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
  window.history.replaceState(null, '', url);
}

const Catalog: FC<Props> = ({ items, lines = [] }) => {
  const t = useTranslations('catalog');
  const searchParams = useSearchParams();

  const lineSlugs = useMemo(() => new Set(lines.map((l) => l.slug)), [lines]);

  // Seed initial state from the URL so a shared /catalog?line=hair link
  // lands pre-filtered.
  const initialLine = searchParams.get('line');
  const [active, setActive] = useState<Filter>(
    initialLine && lineSlugs.has(initialLine as never) ? initialLine : 'all'
  );
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    syncUrl(active, query);
  }, [active, query]);

  const onFilter = useCallback((key: Filter) => {
    setActive(key);
    track('catalog_filter', { line: key });
  }, []);

  const reset = useCallback(() => {
    setActive('all');
    setQuery('');
  }, []);

  const q = query.trim().toLowerCase();

  // Explore by line: pick the active line(s), then narrow each line's
  // items by the search query. A line drops out only when a search
  // empties it (coming-soon lines stay unless a search is active).
  const visibleLines = useMemo(() => {
    const base =
      active === 'all' ? lines : lines.filter((l) => l.slug === active);
    if (!q) return base;
    return base
      .map((l) => ({
        ...l,
        items: l.items.filter((i) =>
          `${i.name} ${i.shortDescription} ${i.category}`
            .toLowerCase()
            .includes(q)
        ),
      }))
      .filter((l) => l.items.length > 0);
  }, [active, lines, q]);

  const shownCount = visibleLines.reduce((n, l) => n + l.items.length, 0);
  const totalCount = items.length;
  const isFiltered = active !== 'all' || q.length > 0;

  const renderCard = (item: CatalogItem) => (
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
                item.status === 'available' ? styles.dotOk : styles.dotSoon
              }`}
            />
            {item.status === 'available' ? t('available') : t('comingSoon')}
          </span>
        </div>
        <h3 className={styles.cardName}>{item.name}</h3>
        <p className={styles.cardDesc}>{item.shortDescription}</p>
        <span className={styles.cardLink}>
          {t('learnMore')} <span className={styles.arrow}>→</span>
        </span>
      </div>
    </Link>
  );

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
            <button
              type="button"
              aria-pressed={active === 'all'}
              className={`${styles.filter} ${
                active === 'all' ? styles.filterActive : ''
              }`}
              onClick={() => onFilter('all')}
            >
              {t('allLines')}
            </button>
            {lines.map((l) => (
              <button
                key={l.slug}
                type="button"
                aria-pressed={active === l.slug}
                className={`${styles.filter} ${
                  active === l.slug ? styles.filterActive : ''
                }`}
                onClick={() => onFilter(l.slug)}
              >
                {l.name}
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
            {t('resultCount', { shown: shownCount, total: totalCount })}
          </span>
          {isFiltered && (
            <button type="button" className={styles.resetBtn} onClick={reset}>
              {t('clearFilters')}
            </button>
          )}
        </div>

        {visibleLines.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t('noResults')}</p>
            <button type="button" className={styles.emptyReset} onClick={reset}>
              {t('clearFilters')}
            </button>
          </div>
        )}

        {/* Explore by product line — each line is one block (Figma).
            Cosmetologists compare by line/system, not loose SKUs. */}
        <div className={styles.systems}>
          {visibleLines.map((line) => {
            const soon = line.status === 'coming-soon' || line.items.length === 0;
            return (
              <section
                key={line.slug}
                className={styles.system}
                style={{ ['--accent' as string]: accentVar[line.accent] }}
              >
                <div className={styles.systemHead}>
                  <div className={styles.systemMeta}>
                    <span className={styles.systemEyebrow}>{line.eyebrow}</span>
                    <h2 className={styles.systemName}>
                      {line.name}
                      {soon && (
                        <span className={styles.soonPill}>
                          {t('comingSoon')}
                        </span>
                      )}
                    </h2>
                    <p className={styles.systemTagline}>
                      {line.shortDescription || line.tagline}
                    </p>
                  </div>
                  {!soon && (
                    <Link href={line.href} className={styles.systemLink}>
                      {t('openLine')} <span className={styles.arrow}>→</span>
                    </Link>
                  )}
                </div>

                {soon ? (
                  <div className={styles.comingSoonCard}>
                    <span className={styles.csIcon} aria-hidden="true">
                      ✦
                    </span>
                    <h3 className={styles.csTitle}>
                      {line.name} — {t('inDevelopment')}
                    </h3>
                    <p className={styles.csText}>{t('comingSoonText')}</p>
                    <Link href="/form" className={styles.csBtn}>
                      {t('notifyMe')}
                    </Link>
                  </div>
                ) : (
                  <div className={styles.grid}>{line.items.map(renderCard)}</div>
                )}
              </section>
            );
          })}
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
