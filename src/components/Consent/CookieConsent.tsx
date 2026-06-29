'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useConsent } from './ConsentProvider';
import styles from './CookieConsent.module.scss';

/** Bottom-corner cookie banner. Visible only while consent state is
 *  `unset`; clicking either button persists the decision and hides the
 *  banner permanently. Uses the site's accent palette + glass surface
 *  so it reads as part of the design, not a third-party widget. */
const CookieConsent: FC = () => {
  const t = useTranslations('consent');
  const { state, grant, deny } = useConsent();
  // Defer mounting one frame so SSR markup matches the unmounted state —
  // avoids a hydration flash where the banner appears before storage is
  // read.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || state !== 'unset') return null;

  return (
    <div className={styles.root} role="dialog" aria-labelledby="cookie-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.body}>
        <h2 id="cookie-title" className={styles.title}>
          {t('title')}
        </h2>
        <p className={styles.text}>
          {t('text')}{' '}
          <Link href="/privacy" className={styles.link}>
            {t('learnMore')}
          </Link>
          .
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={deny}
          className={styles.deny}
          aria-label={t('deny')}
        >
          {t('deny')}
        </button>
        <button
          type="button"
          onClick={grant}
          className={styles.accept}
          aria-label={t('accept')}
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
