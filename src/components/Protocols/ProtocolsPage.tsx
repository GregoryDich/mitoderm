'use client';

import { FC, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import PageHeader from '@/components/Shared/PageHeader/PageHeader';
import Reveal from '@/components/Shared/Reveal/Reveal';
import ProductMedia from '@/components/Product/ProductMedia';
import type { Product, ProductAccent } from '@/products';
import { useCatalogIndex } from '@/components/Catalog/CatalogIndexProvider';
import { track } from '@/lib/track';
import styles from './ProtocolsPage.module.scss';

interface ProtocolEntry {
  anchor: Product;
  bundle: { title: string; intro?: string; items: { slug: string; role?: string }[] };
  headline: string;
}

interface Props {
  protocols: ProtocolEntry[];
}

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

const ProtocolsPage: FC<Props> = ({ protocols }) => {
  const t = useTranslations('protocols');
  const catalog = useCatalogIndex();

  // Funnel signal: visitor reached the protocols hub. One event per
  // mount; the GA `gtag` instance dedupes on the GA side if needed.
  useEffect(() => {
    track('view_protocol', { hub: true, count: protocols.length });
  }, [protocols.length]);

  return (
    <div className={`pageScroll ${styles.page}`}>
      <PageHeader
        kicker={t('eyebrow')}
        title={t('title')}
        lead={t('subtitle')}
      />

      <main className={styles.content}>
        {protocols.length === 0 ? (
          <div className={styles.empty}>
            <p>{t('emptyText')}</p>
            <Link href="/catalog" className={styles.emptyLink}>
              {t('browseCatalog')}
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {protocols.map((entry) => {
              const items = entry.bundle.items
                .map((bi) => {
                  const ref = catalog.find((c) => c.slug === bi.slug);
                  return ref ? { ...ref, role: bi.role } : null;
                })
                .filter((x): x is NonNullable<typeof x> => x !== null);

              return (
                <Reveal key={entry.anchor.slug}>
                <section
                  className={styles.protocol}
                  style={{
                    ['--accent' as string]: accentVar[entry.anchor.accent],
                  }}
                >
                  <header className={styles.protocolHead}>
                    <span className={styles.protocolFor}>
                      {t('anchor')} · {entry.headline}
                    </span>
                    <h2 className={styles.protocolTitle}>{entry.bundle.title}</h2>
                    {entry.bundle.intro && (
                      <p className={styles.protocolIntro}>{entry.bundle.intro}</p>
                    )}
                  </header>
                  <ol className={styles.steps}>
                    {items.map((b, i) => (
                      <li key={b.slug} className={styles.step}>
                        <span className={styles.stepIndex}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <Link href={b.href} className={styles.stepCard}>
                          <div className={styles.stepMedia}>
                            <ProductMedia
                              image={b.image}
                              accent={b.accent}
                              alt={b.name}
                              className={styles.stepMediaInner}
                              sizes="(max-width: 768px) 100vw, 220px"
                            />
                          </div>
                          <div className={styles.stepBody}>
                            {b.role && (
                              <span className={styles.stepRole}>{b.role}</span>
                            )}
                            <h3 className={styles.stepName}>{b.name}</h3>
                            <p className={styles.stepDesc}>{b.shortDescription}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Link
                    href={`/products/${entry.anchor.slug}`}
                    className={styles.protocolCta}
                  >
                    {t('viewAnchor')} →
                  </Link>
                </section>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal>
        <section className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaText')}</p>
          <Link href="/form" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export default ProtocolsPage;
