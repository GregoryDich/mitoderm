'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CatalogItem, ProductCategory, ProductAccent } from '@/products';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from '@/components/Product/ProductMedia';
import styles from './Catalog.module.scss';

interface Props {
  items: CatalogItem[];
}

type Filter = 'all' | ProductCategory;

const filters: { key: Filter; labelKey: string }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'exosome', labelKey: 'filterExosome' },
  { key: 'mask', labelKey: 'filterMask' },
  { key: 'peel', labelKey: 'filterPeel' },
  { key: 'bio-spicules', labelKey: 'filterBioSpicules' },
];

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const Catalog: FC<Props> = ({ items }) => {
  const t = useTranslations('catalog');
  const [active, setActive] = useState<Filter>('all');

  const visible = useMemo(
    () =>
      active === 'all' ? items : items.filter((i) => i.category === active),
    [active, items]
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
                />
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
