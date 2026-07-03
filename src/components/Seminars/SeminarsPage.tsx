'use client';

import { FC } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import Reveal from '@/components/Shared/Reveal/Reveal';
import type { SocialPost } from '@/lib/social-store';
import styles from './SeminarsPage.module.scss';

interface Props {
  upcoming: SocialPost[];
  past: SocialPost[];
}

interface AgendaItem {
  time: string;
  title: string;
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
      {p.caption && <h3 className={styles.postTitle}>{p.caption}</h3>}
      <span className={styles.cta}>
        {cta}{' '}
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      </span>
    </div>
  </a>
);

const SeminarsPage: FC<Props> = ({ upcoming, past }) => {
  const t = useTranslations('seminars');
  const locale = useLocale();
  const agenda = (t.raw('agenda') as AgendaItem[]) ?? [];
  const posts = [...upcoming, ...past];

  return (
    <div className={`pageScroll ${styles.page}`}>
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      {/* Invitation */}
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.titleH1}>{t('title')}</h1>
        <p className={styles.lead}>{t('lead')}</p>
        <p className={styles.forYou}>{t('forYou')}</p>
        <p className={styles.door}>{t('door')}</p>
        <div className={styles.ctaRow}>
          <Link href="/form" className={styles.reserve}>
            {t('reserveCta')}
          </Link>
          <span className={styles.byArrangement}>{t('byArrangement')}</span>
        </div>
      </header>

      <main className={styles.content}>
        {/* Program timeline */}
        {agenda.length > 0 && (
          <Reveal className={styles.program}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>01</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>{t('programTitle')}</span>
            </div>
            <ol className={styles.timeline}>
              {agenda.map((a) => (
                <li key={a.time} className={styles.slot}>
                  <span className={styles.time}>{a.time}</span>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.slotTitle}>{a.title}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* Optional: recent seminars from Instagram, only if present */}
        {posts.length > 0 && (
          <section className={styles.section}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>02</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>{t('latestTitle')}</span>
            </div>
            <Reveal variant="rise" stagger={120} className={styles.grid}>
              {posts.map((p) => (
                <SeminarCard
                  key={p.id}
                  p={p}
                  locale={locale}
                  cta={t('viewOnInstagram')}
                />
              ))}
            </Reveal>
          </section>
        )}

        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
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
