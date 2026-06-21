import { FC } from 'react';
import { Link } from '@/i18n/routing';
import type {
  CatalogItem,
  ProductAccent,
  ProductLine,
} from '@/products';
import type { LocaleType } from '@/types';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from '@/components/Product/ProductMedia';
import WaitlistForm from '@/components/Waitlist/WaitlistForm';
import styles from './LinePage.module.scss';

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

interface Props {
  line: ProductLine;
  items: CatalogItem[];
  locale: LocaleType;
  strings: {
    productsTitle: string;
    ingredientsTitle: string;
    protocolFallback: string;
    indicationsTitle: string;
    backToHome: string;
    contactCta: string;
  };
  /** Waitlist copy is opt-in: only sent for `coming-soon` lines that
   *  have a waitlist source configured upstream. Undefined → render the
   *  default contact CTA band. */
  waitlist?: {
    source: string;
    title: string;
    text: string;
    ctaLabel: string;
    emailPlaceholder: string;
    successTitle: string;
    successText: string;
    errorText: string;
  };
}

const LinePage: FC<Props> = ({ line, items, locale, strings, waitlist }) => {
  const c = line.content[locale];

  return (
    <div
      className={`pageScroll ${styles.page}`}
      style={{ ['--accent' as string]: accentVar[line.accent] }}
    >
      {/* ambient glows */}
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <Link href="/" className={styles.back}>
            <span className={styles.arrow}>←</span> {strings.backToHome}
          </Link>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {c.eyebrow}
          </span>
          <h1 className={styles.title}>{c.name}</h1>
          <p className={styles.tagline}>{c.tagline}</p>
          <p className={styles.desc}>{c.shortDescription}</p>
        </div>
        <div className={styles.heroMedia} aria-hidden="true">
          {line.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={line.image} alt="" loading="eager" />
          ) : (
            <span className={styles.mediaSoon}>{c.eyebrow}</span>
          )}
        </div>
      </header>

      <main className={styles.content}>
        {/* The science / story */}
        <section className={styles.block}>
          <p className={styles.story}>{c.story}</p>
        </section>

        {/* Active ingredients lead-in */}
        {c.ingredientsLead && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.ingredientsTitle}</h2>
            <p className={styles.ingredients}>{c.ingredientsLead}</p>
          </section>
        )}

        {/* Products grid */}
        {items.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.productsTitle}</h2>
            <div className={styles.products}>
              {items.map((p) => (
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

        {/* Protocol */}
        {c.protocolItems.length > 0 ? (
          <section className={styles.block}>
            <h2 className={styles.h2}>{c.protocolTitle}</h2>
            <ol className={styles.protocol}>
              {c.protocolItems.map((step, i) => (
                <li key={`${step.slice(0, 8)}-${i}`}>
                  <span className={styles.stepIdx}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <section className={styles.block}>
            <h2 className={styles.h2}>{c.protocolTitle || strings.protocolFallback}</h2>
            <p className={styles.story}>{strings.protocolFallback}</p>
          </section>
        )}

        {/* Indications */}
        {c.indications.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{strings.indicationsTitle}</h2>
            <ul className={styles.indications}>
              {c.indications.map((ind) => (
                <li key={ind} className={styles.indication}>
                  <span className={styles.indicationDot} aria-hidden="true" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA — waitlist form for coming-soon lines, contact CTA otherwise. */}
        {waitlist ? (
          <WaitlistForm
            source={waitlist.source}
            title={waitlist.title}
            text={waitlist.text}
            ctaLabel={waitlist.ctaLabel}
            emailPlaceholder={waitlist.emailPlaceholder}
            successTitle={waitlist.successTitle}
            successText={waitlist.successText}
            errorText={waitlist.errorText}
          />
        ) : (
          <section className={styles.ctaBand}>
            <span className={styles.ctaGlow} aria-hidden="true" />
            <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
            <p className={styles.ctaText}>{c.ctaText}</p>
            <Link href="/form" className={styles.ctaButton}>
              {strings.contactCta}
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LinePage;
