'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CatalogItem, ProductCategory, ProductAccent } from '@/products';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from '@/components/Product/ProductMedia';
import InterestToggle from '@/components/InterestList/InterestToggle';
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
];

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const Catalog: FC<Props> = ({ items }) => {
  const t = useTranslations('catalog');
  const [active, setActive] = useState<Filter>('all');
  const [query, setQuery] = useState('');

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
                onClick={() => setActive(f.key)}
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
        {visible.length === 0 && (
          <p className={styles.empty}>{t('noResults')}</p>
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
                <ProductMedia
                  image={item.image}
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

      <Footer />
    </div>
  );
};

export default Catalog;
