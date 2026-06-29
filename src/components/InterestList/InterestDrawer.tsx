'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { CatalogItem, ProductAccent } from '@/products';
import { LocaleType } from '@/types';
import { useInterestList } from './InterestListProvider';
import { useCatalogIndex } from '@/components/Catalog/CatalogIndexProvider';
import { productInquiryMessage, whatsappHref } from '@/lib/whatsapp';
import styles from './InterestDrawer.module.scss';

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const InterestDrawer: FC = () => {
  const t = useTranslations('interest');
  const locale = useLocale() as LocaleType;
  const { items, remove, clear, count } = useInterestList();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const catalog = useCatalogIndex();
  const list: CatalogItem[] = mounted
    ? items
        .map((slug) => catalog.find((c) => c.slug === slug))
        .filter((x): x is CatalogItem => !!x)
    : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.classList.add('modalOpened');
    } else {
      document.body.classList.remove('modalOpened');
    }
    return () => document.body.classList.remove('modalOpened');
  }, [open]);

  const names = list.map((p) => p.name).join(', ');
  const waBase = names ? whatsappHref(productInquiryMessage(names, locale)) : null;

  return (
    <>
      <button
        type="button"
        className={`${styles.fab} ${count > 0 ? styles.fabActive : ''}`}
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M12 21l-1.45-1.32C5.4 14.36 2 11.27 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.77-3.4 6.86-8.55 11.18L12 21z"
            fill={count > 0 ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <aside
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            <header className={styles.head}>
              <div>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>
                  {count === 0 ? t('subtitleEmpty') : t('subtitle', { count })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('close')}
                className={styles.close}
              >
                ×
              </button>
            </header>

            <div className={styles.body}>
              {list.length === 0 ? (
                <p className={styles.empty}>{t('emptyHint')}</p>
              ) : (
                <ul className={styles.list}>
                  {list.map((p) => (
                    <li
                      key={p.slug}
                      className={styles.row}
                      style={{
                        ['--accent' as string]:
                          accentVar[p.accent as ProductAccent],
                      }}
                    >
                      <Link
                        href={p.href}
                        className={styles.rowLink}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          className={styles.swatch}
                          style={{
                            backgroundImage: p.image ? `url(${p.image})` : undefined,
                          }}
                          aria-hidden="true"
                        />
                        <div className={styles.rowBody}>
                          <span className={styles.rowCat}>
                            {p.category.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={styles.rowName}>{p.name}</span>
                        </div>
                      </Link>
                      <button
                        type="button"
                        className={styles.rowRemove}
                        onClick={() => remove(p.slug)}
                        aria-label={t('removeOne')}
                        title={t('removeOne')}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {list.length > 0 && (
              <footer className={styles.foot}>
                {waBase && (
                  <a
                    href={waBase}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.cta}
                    onClick={() => setOpen(false)}
                  >
                    {t('sendWhatsApp')}
                  </a>
                )}
                <Link
                  href={`/form?products=${encodeURIComponent(items.join(','))}`}
                  className={styles.ctaGhost}
                  onClick={() => setOpen(false)}
                >
                  {t('sendForm')}
                </Link>
                <button
                  type="button"
                  className={styles.ctaGhost}
                  onClick={() => {
                    if (confirm(t('clearConfirm'))) clear();
                  }}
                >
                  {t('clear')}
                </button>
              </footer>
            )}
          </aside>
        </div>
      )}
    </>
  );
};

export default InterestDrawer;
