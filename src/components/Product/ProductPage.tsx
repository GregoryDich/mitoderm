import { FC, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Product, ProductAccent, getCatalogItems } from '@/products';
import { LocaleType } from '@/types';
import Button from '@/components/Shared/Button/Button';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from './ProductMedia';
import LightboxGallery from './LightboxGallery';
import ProductSectionNav from './ProductSectionNav';
import TrustedByStrip from './TrustedByStrip';
import StickyMobileCta from './StickyMobileCta';
import BeforeAfter from './BeforeAfter';
import type { Doctor } from '@/lib/doctors-store';
import { productInquiryMessage, whatsappHref } from '@/lib/whatsapp';
import styles from './ProductPage.module.scss';

interface Props {
  product: Product;
  locale: LocaleType;
  trustedBy?: Doctor[];
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
  id?: string;
  children: ReactNode;
}> = ({ num, label, title, id, children }) => (
  <section className={styles.block} id={id}>
    <SectionLabel num={num} label={label} />
    <h2 className={styles.h2}>{title}</h2>
    {children}
  </section>
);

const ProductPage: FC<Props> = ({ product, locale, trustedBy = [] }) => {
  const t = useTranslations('product');
  const c = product.content[locale];
  const waHref = whatsappHref(productInquiryMessage(c.name, locale));

  let n = 0;
  const next = () => String(++n).padStart(2, '0');

  const related = getCatalogItems(locale)
    .filter((i) => i.slug !== product.slug)
    .sort((a, b) =>
      a.status === b.status ? 0 : a.status === 'available' ? -1 : 1
    )
    .slice(0, 3);

  const bundleItems =
    c.bundle && c.bundle.items.length > 0
      ? c.bundle.items
          .map((bi) => {
            const ref = getCatalogItems(locale).find((i) => i.slug === bi.slug);
            return ref ? { ...ref, role: bi.role } : null;
          })
          .filter((x): x is NonNullable<typeof x> => x !== null)
      : [];

  const sectionNav: { id: string; label: string }[] = [
    { id: 'benefits', label: 'Benefits' },
    ...(c.steps ? [{ id: 'system', label: 'System' }] : []),
    ...(c.clinicalResults && c.clinicalResults.items.length > 0
      ? [{ id: 'results', label: 'Results' }]
      : []),
    { id: 'formula', label: 'Formula' },
    ...(c.pack ? [{ id: 'kit', label: 'Kit' }] : []),
    ...(c.protocol ? [{ id: 'protocol', label: 'Protocol' }] : []),
    ...(c.aftercare ? [{ id: 'aftercare', label: 'Aftercare' }] : []),
    ...(c.contraindications ? [{ id: 'safety', label: 'Safety' }] : []),
    ...(c.beforeAfter && c.beforeAfter.pairs.length > 0
      ? [{ id: 'beforeafter', label: 'Before / After' }]
      : []),
    ...(product.gallery && product.gallery.length > 0
      ? [{ id: 'gallery', label: 'Gallery' }]
      : []),
    ...(bundleItems.length > 0 ? [{ id: 'bundle', label: 'Protocol kit' }] : []),
    ...(c.logistics && c.logistics.items.length > 0
      ? [{ id: 'logistics', label: 'Logistics' }]
      : []),
    ...(c.comparison && c.comparison.rows.length > 0
      ? [{ id: 'compare', label: 'Compare' }]
      : []),
    ...(c.economics && c.economics.items.length > 0
      ? [{ id: 'economics', label: 'Economics' }]
      : []),
    { id: 'indications', label: 'Indications' },
  ];

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
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className={styles.waBtn}
                aria-label={t('contactViaWhatsApp')}
              >
                {t('contactViaWhatsApp')}
              </a>
            ) : (
              <Button text={t('contactForPrice')} colored href="/form" />
            )}
            <Link href={`/products/${product.slug}/brief`} className={styles.ghost}>
              {t('downloadBrief')}
            </Link>
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
          priority
          sizes="(max-width: 1024px) 100vw, 520px"
        />
      </section>

      {trustedBy.length > 0 && (
        <TrustedByStrip doctors={trustedBy} label={t('trustedBy')} />
      )}

      {c.keyFacts && c.keyFacts.length > 0 && (
        <aside className={styles.keyFacts} aria-label={t('keyFacts')}>
          <h2 className={styles.kfTitle}>{t('keyFacts')}</h2>
          <ul className={styles.kfList}>
            {c.keyFacts.map((f) => (
              <li key={f} className={styles.kfItem}>
                <span className={styles.kfBullet} aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className={styles.statStrip}>
        {c.stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <main className={styles.content}>
        <ProductSectionNav sections={sectionNav} />
        <Section
          id="benefits"
          num={next()}
          label="BENEFITS"
          title={t('keyBenefits')}
        >
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
            id="system"
            num={next()}
            label="SYSTEM"
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

        {c.clinicalResults && c.clinicalResults.items.length > 0 && (
          <Section
            id="results"
            num={next()}
            label="RESULTS"
            title={c.clinicalResults.title}
          >
            {c.clinicalResults.intro && (
              <p className={styles.sectionIntro}>{c.clinicalResults.intro}</p>
            )}
            <div className={styles.results}>
              {c.clinicalResults.items.map((r) => (
                <article key={`${r.label}-${r.value}`} className={styles.resultCard}>
                  <span className={styles.resultValue}>{r.value}</span>
                  <span className={styles.resultLabel}>{r.label}</span>
                  {r.source && (
                    <span className={styles.resultSource}>{r.source}</span>
                  )}
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
            id="kit"
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

        {c.protocol && (
          <Section
            id="protocol"
            num={next()}
            label="PROTOCOL"
            title={c.protocol.title}
          >
            <ol className={styles.numList}>
              {c.protocol.items.map((it, i) => (
                <li key={it} className={styles.numItem}>
                  <span className={styles.numIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{it}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {c.aftercare && (
          <Section
            id="aftercare"
            num={next()}
            label="AFTERCARE"
            title={c.aftercare.title}
          >
            <ul className={styles.bulletList}>
              {c.aftercare.items.map((it) => (
                <li key={it} className={styles.bulletItem}>
                  <span className={styles.bulletDot} aria-hidden="true" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {c.contraindications && (
          <Section
            id="safety"
            num={next()}
            label="SAFETY"
            title={c.contraindications.title}
          >
            <ul className={`${styles.bulletList} ${styles.bulletListWarn}`}>
              {c.contraindications.items.map((it) => (
                <li key={it} className={styles.bulletItem}>
                  <span
                    className={`${styles.bulletDot} ${styles.bulletDotWarn}`}
                    aria-hidden="true"
                  />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {c.beforeAfter && c.beforeAfter.pairs.length > 0 && (
          <Section
            id="beforeafter"
            num={next()}
            label="BEFORE / AFTER"
            title={c.beforeAfter.title}
          >
            {c.beforeAfter.intro && (
              <p className={styles.sectionIntro}>{c.beforeAfter.intro}</p>
            )}
            <BeforeAfter
              pairs={c.beforeAfter.pairs}
              beforeLabel={t('before')}
              afterLabel={t('after')}
            />
          </Section>
        )}

        {product.gallery && product.gallery.length > 0 && (
          <Section
            id="gallery"
            num={next()}
            label="GALLERY"
            title={t('gallery')}
          >
            <LightboxGallery images={product.gallery} name={c.name} />
          </Section>
        )}

        {bundleItems.length > 0 && c.bundle && (
          <Section
            id="bundle"
            num={next()}
            label="PROTOCOL KIT"
            title={c.bundle.title}
          >
            {c.bundle.intro && (
              <p className={styles.sectionIntro}>{c.bundle.intro}</p>
            )}
            <div className={styles.bundle}>
              {bundleItems.map((b) => (
                <Link
                  key={b.slug}
                  href={b.href}
                  className={styles.bundleCard}
                  style={{
                    ['--accent' as string]: accentVar[b.accent as ProductAccent],
                  }}
                >
                  <div className={styles.bundleMedia}>
                    <ProductMedia
                      image={b.image}
                      accent={b.accent}
                      alt={b.name}
                      className={styles.bundleMediaInner}
                      sizes="(max-width: 600px) 100vw, 33vw"
                    />
                  </div>
                  <div className={styles.bundleBody}>
                    {b.role && <span className={styles.bundleRole}>{b.role}</span>}
                    <h3 className={styles.bundleName}>{b.name}</h3>
                    <p className={styles.bundleDesc}>{b.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {c.logistics && c.logistics.items.length > 0 && (
          <Section
            id="logistics"
            num={next()}
            label="LOGISTICS"
            title={c.logistics.title}
          >
            {c.logistics.intro && (
              <p className={styles.sectionIntro}>{c.logistics.intro}</p>
            )}
            <div className={styles.logistics}>
              {c.logistics.items.map((it) => (
                <article key={it.region} className={styles.logiCard}>
                  <span className={styles.logiRegion}>{it.region}</span>
                  <span className={styles.logiLead}>{it.leadTime}</span>
                  {it.notes && <p className={styles.logiNotes}>{it.notes}</p>}
                </article>
              ))}
            </div>
          </Section>
        )}

        {c.comparison && c.comparison.rows.length > 0 && (
          <Section
            id="compare"
            num={next()}
            label="COMPARE"
            title={c.comparison.title}
          >
            {c.comparison.intro && (
              <p className={styles.sectionIntro}>{c.comparison.intro}</p>
            )}
            <div className={styles.compareWrap}>
              <table className={styles.compare}>
                <thead>
                  <tr>
                    {c.comparison.columns.map((col, i) => (
                      <th
                        key={`${col}-${i}`}
                        scope={i === 0 ? 'col' : 'col'}
                        className={i === 0 ? styles.compareRowHead : ''}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.comparison.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className={styles.compareRowHead}>
                        {row.label}
                      </th>
                      {row.cells.map((cell, j) => (
                        <td
                          key={`${row.label}-${j}`}
                          className={j === 0 ? styles.compareUs : ''}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {c.economics && c.economics.items.length > 0 && (
          <Section
            id="economics"
            num={next()}
            label="ECONOMICS"
            title={c.economics.title}
          >
            {c.economics.intro && (
              <p className={styles.sectionIntro}>{c.economics.intro}</p>
            )}
            <div className={styles.results}>
              {c.economics.items.map((it) => (
                <article key={it.label} className={styles.resultCard}>
                  <span className={styles.resultValue}>{it.value}</span>
                  <span className={styles.resultLabel}>{it.label}</span>
                  {it.sub && <span className={styles.resultSource}>{it.sub}</span>}
                </article>
              ))}
            </div>
            {c.economics.disclaimer && (
              <p className={styles.disclaimer}>{c.economics.disclaimer}</p>
            )}
          </Section>
        )}

        <Section
          id="indications"
          num={next()}
          label="INDICATIONS"
          title={c.chipsTitle}
        >
          <div className={styles.chips}>
            {c.chips.map((ch) => (
              <span key={ch} className={styles.chip}>
                {ch}
              </span>
            ))}
          </div>
        </Section>

        {related.length > 0 && (
          <section className={styles.block}>
            <SectionLabel num={next()} label="RELATED" />
            <h2 className={styles.h2}>{t('related')}</h2>
            <div className={styles.related}>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={styles.relCard}
                  style={{
                    ['--accent' as string]:
                      accentVar[item.accent as ProductAccent],
                  }}
                >
                  <div className={styles.relMedia}>
                    <ProductMedia
                      image={item.image}
                      accent={item.accent}
                      alt={item.name}
                      className={styles.relMediaInner}
                      sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className={styles.relBody}>
                    <span className={styles.relTag}>
                      {item.category.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className={styles.relName}>{item.name}</h3>
                    <p className={styles.relDesc}>{item.shortDescription}</p>
                    <span className={styles.relLink}>
                      {t('learnMore')}{' '}
                      <span className={styles.arrow}>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>{c.ctaTitle}</h2>
          <p className={styles.ctaText}>{c.ctaText}</p>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={styles.waBtn}
            >
              {t('contactViaWhatsApp')}
            </a>
          ) : (
            <Button text={t('contactForPrice')} colored href="/form" />
          )}
        </section>
      </main>

      <Footer />

      <StickyMobileCta
        waHref={waHref}
        waLabel={t('contactViaWhatsApp')}
        quoteLabel={t('contactForPrice')}
      />
    </div>
  );
};

export default ProductPage;
