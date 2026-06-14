'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './A11yWidget.module.scss';

type Prefs = {
  fontScale: number; // 1, 1.15, 1.3
  highContrast: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
};

const DEFAULT: Prefs = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
  underlineLinks: false,
};

const STORAGE = 'mitoderm-a11y';

function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  root.style.setProperty('--a11y-font-scale', String(p.fontScale));
  root.classList.toggle('a11y-high-contrast', p.highContrast);
  root.classList.toggle('a11y-reduce-motion', p.reduceMotion);
  root.classList.toggle('a11y-underline-links', p.underlineLinks);
}

const A11yWidget: FC = () => {
  const t = useTranslations('accessibility.widget');
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const stored = { ...DEFAULT, ...JSON.parse(raw) } as Prefs;
        setPrefs(stored);
        applyPrefs(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    applyPrefs(prefs);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const update = (patch: Partial<Prefs>) =>
    setPrefs((cur) => ({ ...cur, ...patch }));

  const reset = () => setPrefs(DEFAULT);

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-label={t('open')}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="12" cy="4.5" r="1.6" fill="currentColor" />
          <path
            d="M4.5 8.5 12 10l7.5-1.5M9.5 22l1.4-7.5h2.2L14.5 22M12 10v6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {open && (
        <div
          id="a11y-panel"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-label={t('title')}
        >
          <header className={styles.head}>
            <h2 className={styles.title}>{t('title')}</h2>
            <button
              type="button"
              className={styles.close}
              aria-label={t('close')}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <section className={styles.group}>
            <h3 className={styles.label}>{t('fontSize')}</h3>
            <div className={styles.row}>
              <button
                type="button"
                className={`${styles.chip} ${prefs.fontScale === 1 ? styles.active : ''}`}
                aria-pressed={prefs.fontScale === 1}
                onClick={() => update({ fontScale: 1 })}
              >
                {t('fontReset')}
              </button>
              <button
                type="button"
                className={`${styles.chip} ${prefs.fontScale === 1.15 ? styles.active : ''}`}
                aria-pressed={prefs.fontScale === 1.15}
                onClick={() => update({ fontScale: 1.15 })}
              >
                A+
              </button>
              <button
                type="button"
                className={`${styles.chip} ${prefs.fontScale === 1.3 ? styles.active : ''}`}
                aria-pressed={prefs.fontScale === 1.3}
                onClick={() => update({ fontScale: 1.3 })}
              >
                A++
              </button>
            </div>
          </section>

          <section className={styles.group}>
            <h3 className={styles.label}>{t('contrast')}</h3>
            <div className={styles.row}>
              <button
                type="button"
                className={`${styles.chip} ${!prefs.highContrast ? styles.active : ''}`}
                aria-pressed={!prefs.highContrast}
                onClick={() => update({ highContrast: false })}
              >
                {t('contrastNormal')}
              </button>
              <button
                type="button"
                className={`${styles.chip} ${prefs.highContrast ? styles.active : ''}`}
                aria-pressed={prefs.highContrast}
                onClick={() => update({ highContrast: true })}
              >
                {t('contrastHigh')}
              </button>
            </div>
          </section>

          <section className={styles.group}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={prefs.reduceMotion}
                onChange={(e) => update({ reduceMotion: e.target.checked })}
              />
              <span>{t('motionReduce')}</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={prefs.underlineLinks}
                onChange={(e) => update({ underlineLinks: e.target.checked })}
              />
              <span>{t('underlineLinks')}</span>
            </label>
          </section>

          <button type="button" className={styles.reset} onClick={reset}>
            {t('reset')}
          </button>
        </div>
      )}
    </>
  );
};

export default A11yWidget;
