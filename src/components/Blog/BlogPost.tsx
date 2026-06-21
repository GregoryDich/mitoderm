import { FC } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import type { Post } from '@/posts';
import type { LocaleType } from '@/types';
import styles from './BlogPost.module.scss';

interface Props {
  post: Post;
  locale: LocaleType;
}

const accentVar: Record<'teal' | 'gold' | 'rose', string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const BlogPost: FC<Props> = ({ post, locale }) => {
  const t = useTranslations('blog');
  const format = useFormatter();
  const c = post.content[locale];

  return (
    <div
      className={`pageScroll ${styles.page}`}
      style={{ ['--accent' as string]: accentVar[post.accent] }}
    >
      <article className={styles.article}>
        <Link href="/blog" className={styles.back}>
          ← {t('back')}
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>{c.eyebrow}</span>
          <h1 className={styles.title}>{c.title}</h1>
          <div className={styles.meta}>
            <time dateTime={post.date}>
              {format.dateTime(new Date(post.date), {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{c.readTime}</span>
          </div>
        </header>

        {post.image && (
          <figure className={styles.hero}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt="" />
          </figure>
        )}

        <div className={styles.body}>
          {c.body.map((s, i) => {
            if (s.type === 'p') {
              return (
                <p key={i} className={styles.p}>
                  {s.text}
                </p>
              );
            }
            if (s.type === 'h2') {
              return (
                <h2 key={i} className={styles.h2}>
                  {s.text}
                </h2>
              );
            }
            if (s.type === 'ul') {
              return (
                <ul key={i} className={styles.ul}>
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            }
            if (s.type === 'quote') {
              return (
                <blockquote key={i} className={styles.quote}>
                  <p>{s.text}</p>
                  {s.author && <cite>— {s.author}</cite>}
                </blockquote>
              );
            }
            return null;
          })}
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaText')}</p>
          <Link href="/form" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
