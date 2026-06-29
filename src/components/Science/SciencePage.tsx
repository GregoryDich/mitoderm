import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import { publicAsset } from '@/lib/public-asset';
import styles from './SciencePage.module.scss';

interface Pillar {
  key: string;
  accent: 'teal' | 'gold' | 'rose';
  href?: string;
  hrefLabelKey?: string;
}

const pillars: Pillar[] = [
  { key: 'exosomes', accent: 'gold', href: '/lines/exosomes', hrefLabelKey: 'pillarToLine' },
  { key: 'polynucleotides', accent: 'gold', href: '/products/v-tech-gel-mask', hrefLabelKey: 'pillarToProduct' },
  { key: 'nad', accent: 'gold', href: '/lines/peeling', hrefLabelKey: 'pillarToLine' },
  { key: 'delivery', accent: 'teal', href: '/products/mitopen', hrefLabelKey: 'pillarToProduct' },
];

const accentVar: Record<Pillar['accent'], string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const SciencePage: FC = () => {
  const t = useTranslations('science');

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
        <section className={styles.lead}>
          <p className={styles.leadText}>{t('leadParagraph')}</p>
        </section>

        <ol className={styles.pillars}>
          {pillars.map((p, i) => {
            const art = publicAsset(`/science/${p.key}.webp`);
            return (
            <li
              key={p.key}
              className={`${styles.pillar} ${i % 2 === 1 ? styles.pillarFlipped : ''} ${
                art ? styles.pillarHasArt : ''
              }`}
              style={{ ['--accent' as string]: accentVar[p.accent] }}
            >
              <div className={styles.pillarNumber}>
                <span className={styles.pillarNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.pillarLine} />
              </div>
              {art && (
                <div className={styles.pillarArt} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art} alt="" loading="lazy" />
                </div>
              )}
              <div className={styles.pillarBody}>
                <span className={styles.pillarEyebrow}>{t(`pillars.${p.key}.eyebrow`)}</span>
                <h2 className={styles.pillarTitle}>{t(`pillars.${p.key}.title`)}</h2>
                <p className={styles.pillarLead}>{t(`pillars.${p.key}.lead`)}</p>
                <p className={styles.pillarBodyText}>{t(`pillars.${p.key}.body`)}</p>
                {p.href && p.hrefLabelKey && (
                  <Link href={p.href} className={styles.pillarLink}>
                    {t(p.hrefLabelKey)} <span className={styles.arrow}>→</span>
                  </Link>
                )}
              </div>
            </li>
            );
          })}
        </ol>

        <section className={styles.protocol}>
          <span className={styles.protocolEyebrow}>{t('protocol.eyebrow')}</span>
          <h2 className={styles.protocolTitle}>{t('protocol.title')}</h2>
          <p className={styles.protocolText}>{t('protocol.text')}</p>
          <div className={styles.protocolCtas}>
            <Link href="/protocols" className={styles.btnPrimary}>
              {t('protocol.ctaProtocols')}
            </Link>
            <Link href="/blog" className={styles.btnGhost}>
              {t('protocol.ctaBlog')}
            </Link>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaText}>{t('cta.text')}</p>
          <Link href="/form" className={styles.btnPrimary}>
            {t('cta.button')}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SciencePage;
