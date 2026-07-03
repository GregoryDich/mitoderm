import { FC } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import MountTracker from '@/components/Analytics/MountTracker';
import type { Post, PostSummary } from '@/posts';
import { DEFAULT_AUTHOR } from '@/posts';
import type { CatalogItem } from '@/products';
import type { LocaleType } from '@/types';
import styles from './BlogPost.module.scss';

interface Props {
  post: Post;
  locale: LocaleType;
  related?: PostSummary[];
  products?: CatalogItem[];
}

const accentVar: Record<'teal' | 'gold' | 'rose' | 'amber' | 'steel', string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

const BlogPost: FC<Props> = ({ post, locale, related = [], products = [] }) => {
  const t = useTranslations('blog');
  const format = useFormatter();
  const c = post.content[locale];

  return (
    <div
      className={`pageScroll ${styles.page}`}
      style={{ ['--accent' as string]: accentVar[post.accent] }}
    >
      <MountTracker
        event="read_post"
        params={{ slug: post.slug, tags: post.tags.join(','), locale }}
      />
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
            <span aria-hidden="true">·</span>
            <span className={styles.byline}>
              {(post.author ?? DEFAULT_AUTHOR).name}
              {(post.author ?? DEFAULT_AUTHOR).role && (
                <>
                  <span className={styles.bylineSep}> · </span>
                  <span className={styles.bylineRole}>
                    {(post.author ?? DEFAULT_AUTHOR).role}
                  </span>
                </>
              )}
            </span>
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

        {products.length > 0 && (
          <section className={styles.featured} aria-labelledby="featured-title">
            <h2 id="featured-title" className={styles.relatedTitle}>
              {t('featuredProductsTitle')}
            </h2>
            <ul className={styles.featuredList}>
              {products.map((p) => (
                <li key={p.slug} className={styles.featuredCard}>
                  <Link href={p.href} className={styles.featuredLink}>
                    {p.image && (
                      <span className={styles.featuredMedia} aria-hidden="true">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" loading="lazy" />
                      </span>
                    )}
                    <span className={styles.featuredBody}>
                      <span className={styles.featuredCat}>
                        {p.category.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={styles.featuredName}>{p.name}</span>
                      <span className={styles.featuredDesc}>
                        {p.shortDescription}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-title">
            <h2 id="related-title" className={styles.relatedTitle}>
              {t('relatedTitle')}
            </h2>
            <ul className={styles.relatedList}>
              {related.map((r) => (
                <li key={r.slug} className={styles.relatedCard}>
                  <Link href={r.href} className={styles.relatedLink}>
                    <span className={styles.relatedEyebrow}>{r.eyebrow}</span>
                    <span className={styles.relatedHeadline}>{r.title}</span>
                    <span className={styles.relatedMeta}>{r.readTime}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
