'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { ProductAccent } from '@/products';
import ProductMedia from '@/components/Product/ProductMedia';
import { useCatalogIndex } from '@/components/Catalog/CatalogIndexProvider';
import { useRecentlyViewed } from './RecentlyViewedProvider';
import styles from './RecentlyViewedStrip.module.scss';

interface Props {
  /** Optional — slug to exclude (e.g. the PDP the user is currently on). */
  excludeSlug?: string;
  /** Also call track(currentSlug) on mount when set. */
  trackSlug?: string;
}

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const RecentlyViewedStrip: FC<Props> = ({ excludeSlug, trackSlug }) => {
  const t = useTranslations('recentlyViewed');
  const { items, track } = useRecentlyViewed();
  const catalogIndex = useCatalogIndex();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Track the current product view. We do this in an effect, so the slug
  // gets pushed to the top of the list on every PDP visit, regardless of
  // whether the user came from the catalog or from a direct link.
  useEffect(() => {
    if (trackSlug) track(trackSlug);
  }, [trackSlug, track]);

  if (!mounted) return null;
  const catalog = catalogIndex;
  const list = items
    .filter((slug) => slug !== excludeSlug)
    .map((slug) => catalog.find((c) => c.slug === slug))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 6);

  if (list.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="recently-viewed-title">
      <h2 className={styles.title} id="recently-viewed-title">
        {t('title')}
      </h2>
      <div className={styles.rail} role="list">
        {list.map((p) => (
          <Link
            key={p.slug}
            href={p.href}
            className={styles.card}
            role="listitem"
            style={{
              ['--accent' as string]: accentVar[p.accent as ProductAccent],
            }}
          >
            <div className={styles.media}>
              <ProductMedia
                image={p.image}
                accent={p.accent}
                alt={p.name}
                className={styles.mediaInner}
                sizes="180px"
              />
            </div>
            <div className={styles.body}>
              <span className={styles.cat}>
                {p.category.replace('-', ' ').toUpperCase()}
              </span>
              <span className={styles.name}>{p.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedStrip;
