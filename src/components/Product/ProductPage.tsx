import { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Product, ProductAccent } from '@/products';
import { LocaleType } from '@/types';
import Button from '@/components/Shared/Button/Button';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from './ProductMedia';
import styles from './ProductPage.module.scss';

interface Props {
  product: Product;
  locale: LocaleType;
}

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const SectionLabel: FC<{ num: string; label: string }> = ({ num, label }) => (
  <div className={styles.secLabel}>
    <span className={styles.secNum}>{num}</span>
    <span className={styles.secLine} />
    <span className={styles.secName}>{label}</span>
  </div>
);

const Section: FC<{
  num: string;
  label: string;
  title: string;
  children: ReactNode;
}> = ({ num, label, title, children }) => (
  <section className={styles.block}>
    <SectionLabel num={num} label={label} />
    <h2 className={styles.h2}>{title}</h2>
    {children}
  </section>
);

const ProductPage: FC<Props> = ({ product, locale }) => {
  const t = useTranslations('product');
  const c = product.content[locale];

  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  return (
    <div
      className={`pageScroll ${styles.page}`}
      style={{ ['--accent' as string]: accentVar[product.accent] }}
    >
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <Link href="/catalog" className={styles.back}>
            <span className={styles.arrow}>←</span> {t('backToCatalog')}
          </Link>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {c.eyebrow}
          </div>
          <h1 className={styles.title}>{c.name}</h1>
          <p className={styles.tagline}>{c.tagline}</p>
          <p className={styles.desc}>{c.description}</p>
          <div className={styles.ctaRow}>
            <Button text={t('contactForPrice')} colored href="/form" />
            <a href="#formula" className={styles.ghost}>
              {t('learnMore')} <span className={styles.arrowDown}>↓</span>
            </a>
          </div>
        </div>
        <ProductMedia
          image={product.image}
          accent={product.accent}
          alt={c.name}
          label={c.name}
          sublabel={`Add /products/${product.slug}/hero.png to replace`}
          className={styles.heroMedia}
        />
      </section>

      <div className={styles.statStrip}>
        {c.stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <main className={styles.content}>
        <Section num={next()} label="BENEFITS" title={t('keyBenefits')}>
          <div className={styles.benefits}>
            {c.benefits.map((b, i) => (
              <article key={b.title} className={styles.card}>
                <span className={styles.ring} />
                <span className={styles.cardIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardText}>{b.text}</p>
              </article>
            ))}
          </div>
        </Section>

        {c.steps && (
          <Section
            num={next()}
            label="PROTOCOL"
            title={c.stepsTitle as string}
          >
            <div className={styles.steps}>
              {c.steps.map((s) => (
                <article key={s.num} className={styles.step}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <span className={styles.stepLine} />
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardText}>{s.text}</p>
                </article>
              ))}
            </div>
          </Section>
        )}

        <section className={styles.block} id="formula">
          <SectionLabel num={next()} label="FORMULA" />
          <h2 className={styles.h2}>{t('activeIngredients')}</h2>
          <div className={styles.ingWrap}>
            <ul className={styles.ingList}>
              {c.ingredients.map((ing, i) => (
                <li key={ing} className={styles.ingRow}>
                  <span>{ing}</span>
                  <span className={styles.ingIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
            <ProductMedia
              image={product.image}
              accent={product.accent}
              alt={c.name}
              label="texture / macro"
              sublabel="add real photo"
              className={styles.ingMedia}
            />
          </div>
        </section>

        {c.pack && (
          <Section
            num={next()}
            label="KIT"
            title={c.packTitle as string}
          >
            <div className={styles.pack}>
              {c.pack.map((p) => (
                <article key={p.title} className={styles.card}>
                  <div className={styles.packHead}>
                    <span className={styles.packQty}>{p.qty}</span>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                  </div>
                  <p className={styles.cardText}>{p.text}</p>
                </article>
              ))}
            </div>
          </Section>
        )}

        {product.gallery && product.gallery.length > 0 && (
          <Section num={next()} label="GALLERY" title={t('gallery')}>
            <div className={styles.gallery}>
              {product.gallery.map((src, i) => (
                <div
                  key={src}
                  className={`${styles.galleryItem} ${
                    i === 0 ? styles.galleryWide : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${c.name} — ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section num={next()} label="INDICATIONS" title={c.chipsTitle}>
          <div className={styles.chips}>
            {c.chips.map((ch) => (
              <span key={ch} className={styles.chip}>
                {ch}
              </span>
            ))}
          </div>
        </Section>

        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
          <p className={styles.ctaText}>{c.ctaText}</p>
          <Button text={t('contactForPrice')} colored href="/form" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
