'use client';

import { FC } from 'react';
import { Link } from '@/i18n/routing';
import { Product } from '@/products';
import { LocaleType } from '@/types';
import styles from './ProductBrief.module.scss';

interface Strings {
  download: string;
  backToProduct: string;
  keyFacts: string;
  benefits: string;
  ingredients: string;
  protocol: string;
  aftercare: string;
  safety: string;
  indications: string;
  professionalOnly: string;
  version: string;
}

interface Props {
  product: Product;
  locale: LocaleType;
  strings: Strings;
}

/** Print-friendly product brief. The toolbar at the top is screen-only;
 *  `window.print()` opens the browser's native print/save-PDF dialog,
 *  which gives the user a high-quality PDF without us shipping a PDF
 *  library to the runtime. The print stylesheet (in the SCSS module
 *  via @media print) drops all chrome and tightens the layout. */
const ProductBrief: FC<Props> = ({ product, locale, strings }) => {
  const c = product.content[locale];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar} aria-hidden="false">
        <Link href={`/products/${product.slug}`} className={styles.back}>
          ← {strings.backToProduct}
        </Link>
        <button
          type="button"
          className={styles.print}
          onClick={() => window.print()}
        >
          {strings.download}
        </button>
      </div>

      <article className={styles.brief}>
        <header className={styles.head}>
          <div className={styles.brandLine}>
            <span className={styles.brand}>MITODERM</span>
            <span className={styles.locale}>{locale.toUpperCase()}</span>
            <span className={styles.dateLine}>
              {strings.version}: {today}
            </span>
          </div>
          <h1 className={styles.title}>{c.name}</h1>
          <p className={styles.tagline}>{c.tagline}</p>
          <p className={styles.desc}>{c.description}</p>
          <span className={styles.pro}>{strings.professionalOnly}</span>
        </header>

        {c.keyFacts && c.keyFacts.length > 0 && (
          <section className={styles.section}>
            <h2>{strings.keyFacts}</h2>
            <ul>
              {c.keyFacts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2>{strings.benefits}</h2>
          <dl className={styles.dl}>
            {c.benefits.map((b) => (
              <div key={b.title}>
                <dt>{b.title}</dt>
                <dd>{b.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <h2>{strings.ingredients}</h2>
          <ol className={styles.ol}>
            {c.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ol>
        </section>

        {c.protocol && (
          <section className={styles.section}>
            <h2>
              {strings.protocol}: {c.protocol.title}
            </h2>
            <ol className={styles.ol}>
              {c.protocol.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
        )}

        {c.aftercare && (
          <section className={styles.section}>
            <h2>
              {strings.aftercare}: {c.aftercare.title}
            </h2>
            <ul>
              {c.aftercare.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {c.contraindications && (
          <section className={styles.section}>
            <h2>
              {strings.safety}: {c.contraindications.title}
            </h2>
            <ul className={styles.warn}>
              {c.contraindications.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h2>{strings.indications}</h2>
          <p>{c.chips.join(' · ')}</p>
        </section>

        <footer className={styles.foot}>
          <span>mitoderm.com</span>
          <span>{c.name}</span>
          <span>{today}</span>
        </footer>
      </article>
    </div>
  );
};

export default ProductBrief;
