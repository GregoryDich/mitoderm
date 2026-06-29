'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Footer.module.scss';

const Footer: FC = () => {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Image
            src="/brand/logo.svg"
            alt="Mitoderm"
            className={styles.logo}
            width={150}
            height={38}
          />
          <p className={styles.brandText}>{t('brandText')}</p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <span className={styles.colTitle}>{t('colDiscoverTitle')}</span>
            <Link href="/science" className={styles.colLink}>
              {t('linkScience')}
            </Link>
            <Link href="/blog" className={styles.colLink}>
              {t('linkBlog')}
            </Link>
            <Link href="/protocols" className={styles.colLink}>
              {t('linkProtocols')}
            </Link>
            <Link href="/glossary" className={styles.colLink}>
              {t('linkGlossary')}
            </Link>
            <Link href="/concerns/density" className={styles.colLink}>
              {t('linkConcerns')}
            </Link>
            <Link href="/regimen" className={styles.colLink}>
              {t('linkRegimen')}
            </Link>
          </div>

          <div className={styles.col}>
            <span className={styles.colTitle}>{t('colCatalogTitle')}</span>
            <Link href="/lines/exosomes" className={styles.colLink}>
              {t('linkLines')}
            </Link>
            <Link href="/catalog" className={styles.colLink}>
              {t('linkCatalog')}
            </Link>
            <Link href="/clinics" className={styles.colLink}>
              {t('linkClinics')}
            </Link>
          </div>

          <div className={styles.col}>
            <span className={styles.colTitle}>{t('colProTitle')}</span>
            <Link href="/seminars" className={styles.colLink}>
              {t('linkSeminars')}
            </Link>
            <Link href="/apply" className={styles.colLink}>
              {t('linkApply')}
            </Link>
            <Link href="/form" className={styles.colLink}>
              {t('linkContact')}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>{t('copyright')}</span>
        <div className={styles.legal}>
          <Link href="/privacy">{t('linkPrivacy')}</Link>
          <Link href="/terms">{t('linkTerms')}</Link>
          <Link href="/cookies">{t('linkCookies')}</Link>
          <Link href="/accessibility">{t('accessibility')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
