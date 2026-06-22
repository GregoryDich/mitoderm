import { FC } from 'react';
import { Link } from '@/i18n/routing';
import type {
  CatalogItem,
  LineSummary,
  ProductAccent,
} from '@/products';
import type { LocaleType } from '@/types';
import type { PostSummary } from '@/posts';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from '@/components/Product/ProductMedia';
import styles from './ConcernPage.module.scss';

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

interface Props {
  slug: string;
  accent: ProductAccent;
  locale: LocaleType;
  /** Lines that address this concern, resolved to summary rows server-side. */
  lineSummaries: LineSummary[];
  /** Products to feature on the landing, slim catalog rows. */
  products: CatalogItem[];
  /** Journal posts tag-matching the concern, server-resolved. */
  posts: PostSummary[];
  strings: {
    eyebrow: string;
    title: string;
    lead: string;
    explainer: string;
    linesTitle: string;
    productsTitle: string;
    postsTitle: string;
    backToHome: string;
    contactCta: string;
    openLine: string;
  };
}

const ConcernPage: FC<Props> = ({
  accent,
  lineSummaries,
  products,
  posts,
  strings,
}) => {
  const explainerParas = strings.explainer
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className={`pageScroll ${styles.page}`}
      style={{ ['--accent' as string]: accentVar[accent] }}
    >
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      <header className={styles.intro}>
        <Link href="/" className={styles.back}>
          <span className={styles.arrow}>←</span> {strings.backToHome}
        </Link>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {strings.eyebrow}
        </span>
        <h1 className={styles.title}>{strings.title}</h1>
        <p className={styles.lead}>{strings.lead}</p>
      </header>

      <main className={styles.content}>
        {explainerParas.length > 0 && (
          <section className={styles.explainer}>
            {explainerParas.map((p, i) => (
              <p key={i} className={styles.explainerText}>
                {p}
              </p>
            ))}
          </section>
        )}

        {lineSummaries.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.linesTitle}</h2>
            <div className={styles.lineGrid}>
              {lineSummaries.map((l) => (
                <Link
                  key={l.slug}
                  href={`/lines/${l.slug}`}
                  className={styles.lineCard}
                  style={{
                    ['--accent' as string]:
                      accentVar[l.accent as ProductAccent],
                  }}
                >
                  <span className={styles.lineEyebrow}>{l.eyebrow}</span>
                  <h3 className={styles.lineName}>{l.name}</h3>
                  <p className={styles.lineDesc}>{l.shortDescription}</p>
                  <span className={styles.lineLink}>
                    {strings.openLine} <span className={styles.arrow}>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.productsTitle}</h2>
            <div className={styles.productGrid}>
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  className={styles.productCard}
                  style={{
                    ['--accent' as string]:
                      accentVar[p.accent as ProductAccent],
                  }}
                >
                  <div className={styles.productMedia}>
                    <ProductMedia
                      image={p.image}
                      accent={p.accent}
                      alt={p.name}
                      className={styles.productMediaInner}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className={styles.productBody}>
                    <span className={styles.productCat}>
                      {p.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className={styles.productName}>{p.name}</h3>
                    <p className={styles.productDesc}>{p.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.postsTitle}</h2>
            <div className={styles.postGrid}>
              {posts.map((post) => (
                <Link key={post.slug} href={post.href} className={styles.postCard}>
                  <span className={styles.postEyebrow}>{post.eyebrow}</span>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>{strings.title}</h2>
          <p className={styles.ctaText}>{strings.lead}</p>
          <Link href="/form" className={styles.ctaButton}>
            {strings.contactCta}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConcernPage;
