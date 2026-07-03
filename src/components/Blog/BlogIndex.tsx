'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import Reveal from '@/components/Shared/Reveal/Reveal';
import type { PostSummary } from '@/posts';
import styles from './BlogIndex.module.scss';

interface Props {
  posts: PostSummary[];
}

const accentVar: Record<'teal' | 'gold' | 'rose' | 'amber' | 'steel', string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

/** Editorial categories derived from post tags — the Journal reads as a
 *  curated knowledge base, not a flat feed. */
type Cat = 'all' | 'exosomes' | 'hair' | 'protocols' | 'education' | 'longevity';

const CAT_TAGS: Record<Exclude<Cat, 'all'>, string[]> = {
  exosomes: ['exosomes', 'v-tech'],
  hair: ['hair', 'exosignal'],
  protocols: ['protocol', 'microneedling', 'mitopen', 'recovery'],
  education: ['education', 'patient-education'],
  longevity: ['nad', 'peeling', 'longevity'],
};

const CATS: Cat[] = [
  'all',
  'exosomes',
  'hair',
  'protocols',
  'education',
  'longevity',
];

const inCat = (p: PostSummary, cat: Cat): boolean =>
  cat === 'all' || p.tags.some((tg) => CAT_TAGS[cat].includes(tg));

const BlogIndex: FC<Props> = ({ posts }) => {
  const t = useTranslations('blog');
  const format = useFormatter();
  const [cat, setCat] = useState<Cat>('all');

  const visible = useMemo(
    () => posts.filter((p) => inCat(p, cat)),
    [posts, cat]
  );
  // The newest matching post leads as the featured hero.
  const [featured, ...rest] = visible;

  const fmtDate = (d: string) =>
    format.dateTime(new Date(d), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className={`pageScroll ${styles.page}`}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <main className={styles.content}>
        {/* Category chips */}
        <div
          className={styles.chips}
          role="group"
          aria-label={t('filterLabel')}
        >
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.chip} ${cat === c ? styles.chipActive : ''}`}
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
            >
              {t(`cat_${c}`)}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <>
            {/* Featured hero — the newest matching article, full width. */}
            {featured && (
              <Link
                href={featured.href}
                className={styles.featured}
                style={{ ['--accent' as string]: accentVar[featured.accent] }}
              >
                {featured.image && (
                  <span className={styles.featuredMedia} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.image} alt="" loading="eager" />
                  </span>
                )}
                <span className={styles.featuredBody}>
                  <span className={styles.featuredTag}>{t('featured')}</span>
                  <span className={styles.cardEyebrow}>{featured.eyebrow}</span>
                  <span className={styles.featuredTitle}>{featured.title}</span>
                  <span className={styles.featuredExcerpt}>
                    {featured.excerpt}
                  </span>
                  <span className={styles.cardMeta}>
                    <time dateTime={featured.date}>
                      {fmtDate(featured.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readTime}</span>
                  </span>
                </span>
              </Link>
            )}

            {rest.length > 0 && (
              <Reveal variant="rise" stagger={100} className={styles.list}>
                {rest.map((p) => (
                  <div
                    key={p.slug}
                    className={styles.card}
                    style={{ ['--accent' as string]: accentVar[p.accent] }}
                  >
                    <Link href={p.href} className={styles.cardLink}>
                      {p.image && (
                        <span className={styles.cardMedia} aria-hidden="true">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt="" loading="lazy" />
                        </span>
                      )}
                      <span className={styles.cardBody}>
                        <span className={styles.cardEyebrow}>{p.eyebrow}</span>
                        <h2 className={styles.cardTitle}>{p.title}</h2>
                        <p className={styles.cardExcerpt}>{p.excerpt}</p>
                        <span className={styles.cardMeta}>
                          <time dateTime={p.date}>{fmtDate(p.date)}</time>
                          <span aria-hidden="true">·</span>
                          <span>{p.readTime}</span>
                        </span>
                      </span>
                    </Link>
                  </div>
                ))}
              </Reveal>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
