import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getCatalogItems, ProductAccent } from '@/products';
import { LocaleType } from '@/types';
import ProductMedia from '@/components/Product/ProductMedia';
import Footer from '@/components/Layout/Footer/Footer';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './HomePage.module.scss';

interface Props {
  locale: LocaleType;
}

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const HomePage: FC<Props> = ({ locale }) => {
  const t = useTranslations('home');
  const featured = getCatalogItems(locale)
    .filter((i) => i.status === 'available')
    .slice(0, 3);

  const stats = (t.raw('stats') as { value: string; label: string }[]) ?? [];
  const why = (t.raw('why') as { title: string; text: string }[]) ?? [];

  return (
    <div className={`pageScroll ${styles.page}`}>
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      <section className={styles.hero}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.tagline}>{t('tagline')}</p>
        <p className={styles.desc}>{t('description')}</p>
        <div className={styles.ctaRow}>
          <Link href="/catalog" className={styles.btnPrimary}>
            {t('ctaPrimary')}
          </Link>
          <Link href="/form" className={styles.btnGhost}>
            {t('ctaSecondary')}
          </Link>
        </div>
      </section>

      <div className={styles.statStrip}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <main className={styles.content}>
        <Reveal>
        <section className={styles.block}>
          <div className={styles.secLabel}>
            <span className={styles.secNum}>01</span>
            <span className={styles.secLine} />
            <span className={styles.secName}>{t('featuredLabel')}</span>
          </div>
          <h2 className={styles.h2}>{t('featuredTitle')}</h2>
          <div className={styles.grid}>
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className={styles.card}
                style={{ ['--accent' as string]: accentVar[item.accent] }}
              >
                <div className={styles.cardMedia}>
                  <ProductMedia
                    image={item.image}
                    accent={item.accent}
                    alt={item.name}
                    className={styles.media}
                  />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.tag}>
                    {item.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <p className={styles.cardDesc}>{item.shortDescription}</p>
                  <span className={styles.cardLink}>
                    {t('viewProduct')}{' '}
                    <span className={styles.arrow}>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className={styles.block}>
          <div className={styles.secLabel}>
            <span className={styles.secNum}>02</span>
            <span className={styles.secLine} />
            <span className={styles.secName}>{t('whyLabel')}</span>
          </div>
          <h2 className={styles.h2}>{t('whyTitle')}</h2>
          <div className={styles.why}>
            {why.map((w, i) => (
              <article key={w.title} className={styles.whyCard}>
                <span className={styles.whyIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.whyTitleEl}>{w.title}</h3>
                <p className={styles.whyText}>{w.text}</p>
              </article>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className={styles.ctaBand}>
          <span className={styles.ctaGlow} aria-hidden="true" />
          <h2 className={styles.ctaTitle}>{t('ctaBandTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaBandText')}</p>
          <Link href="/form" className={styles.btnPrimary}>
            {t('ctaBandButton')}
          </Link>
        </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
