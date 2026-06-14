'use client';

import { FC, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { SocialPost } from '@/lib/social-store';
import styles from './SocialStrip.module.scss';

interface Props {
  posts: SocialPost[];
}

function fmtDate(iso?: string): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const SocialStrip: FC<Props> = ({ posts }) => {
  const t = useTranslations('social');
  const railRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) return null;

  const scroll = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w * 0.8), behavior: 'smooth' });
  };

  return (
    <section className={styles.section} aria-labelledby="social-strip-title">
      <header className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h2 className={styles.title} id="social-strip-title">
            {t('title')}
          </h2>
        </div>
        <div className={styles.nav} aria-hidden="false">
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scroll(-1)}
            aria-label={t('prev')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scroll(1)}
            aria-label={t('next')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className={styles.rail} ref={railRef} role="list">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
            role="listitem"
            aria-label={p.caption ?? t('openInInstagram')}
          >
            <div className={styles.poster}>
              {p.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.poster}
                  alt={p.caption ?? ''}
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <span className={styles.posterFallback} aria-hidden="true">
                  IG
                </span>
              )}
              <span className={styles.kindBadge}>
                {p.kind === 'reel' && (
                  <>
                    <PlayIcon /> {t('kind.reel')}
                  </>
                )}
                {p.kind === 'post' && (
                  <>
                    <PostIcon /> {t('kind.post')}
                  </>
                )}
                {p.kind === 'seminar' && (
                  <>
                    <CalIcon /> {t('kind.seminar')}
                  </>
                )}
              </span>
              <span className={styles.playOverlay} aria-hidden="true">
                <PlayIconLg />
              </span>
            </div>
            {(p.caption || p.date) && (
              <div className={styles.meta}>
                {p.caption && <span className={styles.caption}>{p.caption}</span>}
                {p.date && (
                  <span className={styles.date}>{fmtDate(p.date)}</span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
};

const PlayIcon: FC = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
    <path d="M7 5l12 7-12 7V5z" fill="currentColor" />
  </svg>
);

const PlayIconLg: FC = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M7 5l12 7-12 7V5z" fill="currentColor" />
  </svg>
);

const PostIcon: FC = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const CalIcon: FC = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 9h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default SocialStrip;
