'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from './PromoBar.module.scss';

interface Props {
  /** Optional ISO date — formatted in the visitor's locale. */
  date?: string;
  /** Short headline shown in the bar — typically the seminar caption. */
  text: string;
  /** Click-through URL (Instagram seminar post or /seminars). */
  href: string;
  /** Stable id used to remember the per-visitor dismissal. */
  id: string;
}

const STORAGE = 'mitoderm-promo-dismissed';

function fmtDate(iso: string | undefined, locale: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return iso;
  }
}

const PromoBar: FC<Props> = ({ date, text, href, id }) => {
  const t = useTranslations('promo');
  const locale = useLocale();
  const [hidden, setHidden] = useState(true); // hidden until we know storage state

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      const dismissed = raw ? (JSON.parse(raw) as string[]) : [];
      setHidden(dismissed.includes(id));
    } catch {
      setHidden(false);
    }
  }, [id]);

  // Toggle a class on <html> so the layout can shift Header /
  // pageScroll padding below the promo bar without prop-drilling.
  useEffect(() => {
    document.documentElement.classList.toggle('has-promo', !hidden);
    return () => {
      document.documentElement.classList.remove('has-promo');
    };
  }, [hidden]);

  const dismiss = () => {
    setHidden(true);
    try {
      const raw = localStorage.getItem(STORAGE);
      const cur = raw ? (JSON.parse(raw) as string[]) : [];
      if (!cur.includes(id)) {
        // Keep the list short — only the last 8 dismissed promos
        const next = [...cur, id].slice(-8);
        localStorage.setItem(STORAGE, JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
  };

  if (hidden) return null;

  const when = fmtDate(date, locale);

  return (
    <div className={styles.bar} role="region" aria-label={t('label')}>
      <a href={href} target="_blank" rel="noreferrer" className={styles.link}>
        <span className={styles.tag}>{t('tag')}</span>
        {when && <span className={styles.date}>{when}</span>}
        <span className={styles.text}>{text}</span>
        <span className={styles.cta}>
          {t('cta')} <span className={styles.arrow}>→</span>
        </span>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label={t('dismiss')}
        className={styles.close}
      >
        ×
      </button>
    </div>
  );
};

export default PromoBar;
