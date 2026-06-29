import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import Reveal from '@/components/Shared/Reveal/Reveal';
import styles from './AboutPage.module.scss';

const AboutPage: FC = () => {
  const t = useTranslations('about');
  const tFaq = useTranslations('faq');
  const stats = (t.raw('stats') as { value: string; label: string }[]) ?? [];
  const faq = [1, 2, 3].map((i) => ({
    q: tFaq(`item${i}.title`),
    a: tFaq(`item${i}.text`),
  }));

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
      </section>

      <main className={styles.content}>
        <Reveal>
          <section className={styles.block}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>01</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>{t('missionLabel')}</span>
            </div>
            <h2 className={styles.h2}>{t('missionTitle')}</h2>
            <p className={styles.lead}>{t('missionText')}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className={styles.block}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>02</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>{t('scienceLabel')}</span>
            </div>
            <h2 className={styles.h2}>{t('scienceTitle')}</h2>
            <p className={styles.lead}>{t('scienceText')}</p>
            <div className={styles.statGrid}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className={styles.block}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>03</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>{t('founderLabel')}</span>
            </div>
            <h2 className={styles.h2}>{t('founderName')}</h2>
            <p className={styles.founderRole}>{t('founderRole')}</p>
            <p className={styles.lead}>{t('founderText')}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className={styles.block}>
            <div className={styles.secLabel}>
              <span className={styles.secNum}>04</span>
              <span className={styles.secLine} />
              <span className={styles.secName}>FAQ</span>
            </div>
            <h2 className={styles.h2}>{tFaq('title')}</h2>
            <div className={styles.faqList}>
              {faq.map((f, i) => (
                <details
                  key={f.q}
                  className={styles.faqItem}
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className={styles.faqQ}>
                    <span>{f.q}</span>
                    <span className={styles.faqChev} aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className={styles.faqA}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className={styles.ctaBand}>
            <span className={styles.ctaGlow} aria-hidden="true" />
            <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
            <p className={styles.ctaText}>{t('ctaText')}</p>
            <Link href="/form" className={styles.btnPrimary}>
              {t('ctaButton')}
            </Link>
          </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
