import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Product } from '@/products';
import { LocaleType } from '@/types';
import Button from '@/components/Shared/Button/Button';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from './ProductMedia';
import styles from './ProductPage.module.scss';

interface Props {
  product: Product;
  locale: LocaleType;
}

const ProductPage: FC<Props> = ({ product, locale }) => {
  const t = useTranslations('product');
  const c = product.content[locale];

  return (
    <div className={`pageScroll ${styles.page}`}>
      <section className={`${styles.hero} ${styles[product.accent]}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <Link href="/catalog" className={styles.back}>
              ← {t('backToCatalog')}
            </Link>
            <p className={styles.eyebrow}>{c.eyebrow}</p>
            <h1 className={styles.title}>{c.name}</h1>
            <p className={styles.tagline}>{c.tagline}</p>
            <p className={styles.desc}>{c.description}</p>
            <div className={styles.ctaRow}>
              <Button text={t('contactForPrice')} colored href="/form" />
            </div>
          </div>
          <ProductMedia
            image={product.image}
            accent={product.accent}
            alt={c.name}
            label={`${c.name}\nproduct photo`}
            className={styles.heroMedia}
          />
        </div>
      </section>

      <section className={styles.statStrip}>
        <div className={styles.statInner}>
          {c.stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <main className={styles.content}>
        <section className={styles.block}>
          <h2 className={styles.h2}>{t('keyBenefits')}</h2>
          <div className={styles.benefits}>
            {c.benefits.map((b) => (
              <article key={b.title} className={styles.card}>
                <span className={styles.dot} />
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardText}>{b.text}</p>
              </article>
            ))}
          </div>
        </section>

        {c.steps && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{c.stepsTitle}</h2>
            <div className={styles.steps}>
              {c.steps.map((s) => (
                <article key={s.num} className={styles.step}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardText}>{s.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={`${styles.block} ${styles.ingWrap}`}>
          <div className={styles.ingText}>
            <h2 className={styles.h2}>{t('activeIngredients')}</h2>
            <p className={styles.ingIntro}>{c.ingredientsIntro}</p>
            <ul className={styles.ingList}>
              {c.ingredients.map((i) => (
                <li key={i}>
                  <span className={styles.bullet} />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <ProductMedia
            image={product.image}
            accent="rose"
            alt={c.name}
            label={'texture / lifestyle\nimage'}
            className={styles.ingMedia}
          />
        </section>

        {c.pack && (
          <section className={styles.block}>
            <h2 className={styles.h2}>{c.packTitle}</h2>
            <div className={styles.steps}>
              {c.pack.map((p) => (
                <article key={p.title} className={styles.card}>
                  <div className={styles.packHead}>
                    <span className={styles.stepNum}>{p.qty}</span>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                  </div>
                  <p className={styles.cardText}>{p.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className={styles.block}>
          <h2 className={styles.h2}>{c.chipsTitle}</h2>
          <div className={styles.chips}>
            {c.chips.map((ch) => (
              <span key={ch} className={styles.chip}>
                {ch}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
          <p className={styles.ctaText}>{c.ctaText}</p>
          <Button
            text={t('contactForPrice')}
            colored
            href="/form"
            style={{ backgroundColor: 'var(--colorWhite)', color: 'var(--buttonAccentColor)' }}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
