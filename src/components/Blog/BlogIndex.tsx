import { FC } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import type { PostSummary } from '@/posts';
import styles from './BlogIndex.module.scss';

interface Props {
  posts: PostSummary[];
}

const accentVar: Record<'teal' | 'gold' | 'rose', string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const BlogIndex: FC<Props> = ({ posts }) => {
  const t = useTranslations('blog');
  const format = useFormatter();

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
        {posts.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <ul className={styles.list}>
            {posts.map((p) => (
              <li
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
                      <time dateTime={p.date}>
                        {format.dateTime(new Date(p.date), {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{p.readTime}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
