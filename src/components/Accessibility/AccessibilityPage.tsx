'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Layout/Footer/Footer';
import styles from './AccessibilityPage.module.scss';

const AccessibilityPage: FC = () => {
  const t = useTranslations('accessibility');

  return (
    <div className={`pageScroll ${styles.page}`}>
      <main className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('general')}</h2>
          <p className={styles.p}>{t('websites')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('interfaceTitle')}</h2>
          <p className={styles.p}>{t('interfaceText')}</p>
          <ul className={styles.list}>
            <li>{t('readers')}</li>
            <li>{t('navigating')}</li>
            <li>{t('contrast')}</li>
            <li>{t('alt')}</li>
            <li>{t('scaling')}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>{t('feedbackTitle')}</h2>
          <p className={styles.p}>{t('difficulties')}</p>
          <p className={styles.p}>{t('feedbackHelp')}</p>
        </section>

        <section className={styles.section}>
          <p className={`${styles.p} ${styles.muted}`}>{t('obligationsText')}</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AccessibilityPage;
