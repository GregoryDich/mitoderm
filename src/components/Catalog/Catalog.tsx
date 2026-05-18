'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CatalogItem, ProductCategory } from '@/products';
import Button from '@/components/Shared/Button/Button';
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
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.filters}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
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
            >
              <ProductMedia
                image={item.image}
                accent={item.accent}
                alt={item.name}
                label={'photo'}
                className={styles.cardMedia}
              />
              <div className={styles.cardBody}>
                <div className={styles.tags}>
                  <span className={styles.tag}>
                    {item.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span
                    className={`${styles.status} ${
                      item.status === 'available'
                        ? styles.statusAvailable
                        : styles.statusSoon
                    }`}
                  >
                    {item.status === 'available'
                      ? t('available')
                      : t('comingSoon')}
                  </span>
                </div>
                <h3 className={styles.cardName}>{item.name}</h3>
                <p className={styles.cardDesc}>{item.shortDescription}</p>
                <span className={styles.cardLink}>{t('learnMore')} →</span>
              </div>
            </Link>
          ))}
        </div>

        <section className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaText')}</p>
          <Button
            text={t('ctaButton')}
            colored
            href="/form"
            style={{
              backgroundColor: 'var(--colorWhite)',
              color: 'var(--buttonAccentColor)',
            }}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
