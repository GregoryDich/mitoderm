import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  getCatalogItems,
  ProductAccent,
  LineSummary,
} from '@/products';
import { LocaleType } from '@/types';
import { publicAsset } from '@/lib/public-asset';
import HoverVideoMedia from '@/components/Product/HoverVideoMedia';
import Footer from '@/components/Layout/Footer/Footer';
import Reveal from '@/components/Shared/Reveal/Reveal';
import CountUp from '@/components/Shared/CountUp/CountUp';
import SocialStrip from '@/components/Social/SocialStrip';
import PressStrip from '@/components/Press/PressStrip';
import StoriesStrip from '@/components/Stories/StoriesStrip';
import LinesShowcase from '@/components/Lines/LinesShowcase';
import ConcernsStrip from '@/components/Concerns/ConcernsStrip';
import ResultsStrip from '@/components/Home/ResultsStrip';
import TrustedByStrip from '@/components/Product/TrustedByStrip';
import type { SocialPost } from '@/lib/social-store';
import type { PressItem } from '@/lib/press-store';
import type { Story } from '@/lib/stories-store';
import type { Doctor } from '@/lib/doctors-store';
import styles from './HomePage.module.scss';

interface Props {
  locale: LocaleType;
  social?: SocialPost[];
  press?: PressItem[];
  stories?: Story[];
  lines?: LineSummary[];
  doctors?: Doctor[];
}

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

const HomePage: FC<Props> = ({
  locale,
  social = [],
  press = [],
  stories = [],
  lines = [],
  doctors = [],
}) => {
  const t = useTranslations('home');
  const featured = getCatalogItems(locale)
    .filter((i) => i.status === 'available')
    .slice(0, 3);

  const stats = (t.raw('stats') as { value: string; label: string }[]) ?? [];
  const badges = (t.raw('badges') as string[]) ?? [];
  const why = (t.raw('why') as { title: string; text: string }[]) ?? [];
  const heroArt = publicAsset('/home/hero.webp');

  return (
    <div className={`pageScroll ${styles.page}`}>
      {heroArt && (
        <div className={styles.heroArt} aria-hidden="true">
          <Image
            src={heroArt}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroArtImg}
          />
          <span className={styles.heroArtScrim} />
        </div>
      )}
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

      {/* Reveal-as-strip: the stats are direct children so the stagger
          cascades across them; numbers count up on entry. */}
      <Reveal variant="rise" stagger={120} className={styles.statStrip}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <CountUp value={s.value} className={styles.statValue} />
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </Reveal>

      {/* Trust badges — safety / exclusivity reassurance at a glance. */}
      <Reveal variant="fade" stagger={90} className={styles.badgeRow}>
        {badges.map((b) => (
          <span key={b} className={styles.badge}>
            <span className={styles.badgeTick} aria-hidden="true">
              ✓
            </span>
            {b}
          </span>
        ))}
      </Reveal>

      <main className={styles.content}>
        {/* Proof leads: real before/after before any brand copy. */}
        <ResultsStrip />

        {doctors.length > 0 && (
          <TrustedByStrip doctors={doctors} label={t('trustedBy')} />
        )}

        {stories.length > 0 && <StoriesStrip stories={stories} />}

        {/* Concerns first: a task-based entry ("hair thinning") is a
            stronger hook than the product-led line showcase, so it
            precedes LinesShowcase. */}
        <Reveal>
          <ConcernsStrip />
        </Reveal>

        {lines.length > 0 && (
          <Reveal>
            <LinesShowcase lines={lines} />
          </Reveal>
        )}

        <Reveal>
        <section className={styles.block}>
          <div className={styles.secLabel}>
            <span className={styles.secNum}>01</span>
            <span className={styles.secLine} />
            <span className={styles.secName}>{t('featuredLabel')}</span>
          </div>
          <h2 className={styles.h2}>{t('featuredTitle')}</h2>
          {/* Reveal-as-grid: cards cascade in with a 140ms stagger. */}
          <Reveal variant="rise" stagger={140} className={styles.grid}>
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className={styles.card}
                style={{ ['--accent' as string]: accentVar[item.accent] }}
              >
                <div className={styles.cardMedia}>
                  <HoverVideoMedia
                    image={item.image}
                    video={item.cardVideo}
                    accent={item.accent}
                    alt={item.name}
                    className={styles.media}
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          </Reveal>
        </section>
        </Reveal>

        {social.length > 0 && (
          <Reveal>
            <SocialStrip posts={social} />
          </Reveal>
        )}

        {press.length > 0 && (
          <Reveal>
            <PressStrip items={press} />
          </Reveal>
        )}

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
          {/* Recruitment, not generic contact: the warmest intent goes
              to the partner application, not the 9-field contact form. */}
          <Link href="/apply" className={styles.btnPrimary}>
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
