'use client';

import { FC } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import type { SocialPost } from '@/lib/social-store';
import styles from './SeminarsPage.module.scss';

interface Props {
  upcoming: SocialPost[];
  past: SocialPost[];
}

function fmtDate(iso?: string, locale?: string): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const SeminarCard: FC<{ p: SocialPost; locale: string; cta: string }> = ({
  p,
  locale,
  cta,
}) => (
  <a href={p.url} target="_blank" rel="noreferrer" className={styles.card}>
    <div className={styles.poster}>
      {p.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.poster} alt={p.caption ?? ''} loading="lazy" />
      ) : (
        <span aria-hidden="true">IG</span>
      )}
    </div>
    <div className={styles.body}>
      {p.date && <span className={styles.date}>{fmtDate(p.date, locale)}</span>}
      {p.caption && <h3 className={styles.title}>{p.caption}</h3>}
      <span className={styles.cta}>
        {cta} <span aria-hidden="true" className={styles.arrow}>→</span>
      </span>
    </div>
  </a>
);

const SeminarsPage: FC<Props> = ({ upcoming, past }) => {
  const t = useTranslations('seminars');
  const locale = useLocale();

  const hasAny = upcoming.length + past.length > 0;

  return (
    <div className={`pageScroll ${styles.page}`}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.titleH1}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <main className={styles.content}>
        {!hasAny && (
          <p className={styles.empty}>{t('empty')}</p>
        )}

        {hasAny && (
          <>
            <section className={styles.section}>
              <h2 className={styles.h2}>{t('upcoming')}</h2>
              {upcoming.length === 0 ? (
                <p className={styles.empty}>{t('noUpcoming')}</p>
              ) : (
                <div className={styles.grid}>
                  {upcoming.map((p) => (
                    <SeminarCard
                      key={p.id}
                      p={p}
                      locale={locale}
                      cta={t('viewOnInstagram')}
                    />
                  ))}
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.h2}>{t('past')}</h2>
                <div className={styles.grid}>
                  {past.map((p) => (
                    <SeminarCard
                      key={p.id}
                      p={p}
                      locale={locale}
                      cta={t('viewOnInstagram')}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className={styles.ctaBand}>
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

export default SeminarsPage;
