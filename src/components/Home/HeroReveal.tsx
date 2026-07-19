'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './HeroReveal.module.scss';

/** Owner-supplied lineup photos: the same composition shot twice —
 *  `base` flat/unlit, `lit` with the gold glow. The lit version shows
 *  only inside a soft circular mask that trails the cursor, so the
 *  product under the pointer "lights up". */
export interface HeroHotspotProduct {
  slug: string;
  name: string;
}

interface Props {
  base: string;
  lit: string;
  /** Portrait twins (853×1844) for the mobile hero — the same base/lit
   *  pair, composed vertically so phones get a full-height poster instead
   *  of the letterboxed wide strip. Falls back to the wide shot if absent. */
  basePortrait?: string;
  litPortrait?: string;
  products: HeroHotspotProduct[];
}

const SPOTLIGHT_R = 260;

/** Photo canvas aspect (1920×819). Both shots share it, so base and
 *  lit layers stay pixel-aligned inside the same box. */
const PHOTO_AR = '1920 / 819';

/** Hotspot rectangles in percent of the photo box, measured off the
 *  lineup composition. Physical left/top on purpose: the photo does
 *  not mirror in RTL, so the regions must not either. `slug: null`
 *  lights up + labels without linking (no live PDP for that product).
 *  Append ?debugHotspots to the URL to outline them while tuning. */
const HOTSPOTS: {
  slug: string | null;
  fallbackLabel?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  /** Chips sit under the region by default; the leftmost products sit
   *  over the overlay paragraph, so their chips flip above. */
  chipAbove?: boolean;
}[] = [
  { slug: 'mitopen', left: 3.2, top: 25, width: 6, height: 62, chipAbove: true },
  {
    slug: 'mitoscan',
    left: 9.2,
    top: 49,
    width: 15.5,
    height: 40,
    chipAbove: true,
  },
  { slug: 'v-tech-serum', left: 24.7, top: 43, width: 9.5, height: 45 },
  { slug: 'exosignal-hair', left: 34.2, top: 49, width: 20, height: 39 },
  { slug: 'exosignal-hair-spray', left: 54.2, top: 43, width: 8, height: 45 },
  {
    slug: null,
    fallbackLabel: 'EXOCELL Mask',
    left: 62.2,
    top: 46,
    width: 18.5,
    height: 42,
  },
  { slug: 'exo-nad', left: 84, top: 44, width: 12.6, height: 30 },
  { slug: 'exotech-gel', left: 80.8, top: 70, width: 7.7, height: 20 },
  { slug: 'exo-nad', left: 94.8, top: 65, width: 4.6, height: 24 },
];

const HeroReveal: FC<Props> = ({
  base,
  lit,
  basePortrait,
  litPortrait,
  products,
}) => {
  const t = useTranslations('home');
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>();
  // True on first paint so SSR shows the flat photo — touch devices
  // swap to the lit one after hydration instead of desktops flashing.
  const [canHover, setCanHover] = useState(true);
  const [active, setActive] = useState(false);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setDebug(window.location.search.includes('debugHotspots'));
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!canHover) return;
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    const tick = () => {
      const m = mouse.current;
      const s = smooth.current;
      // First contact snaps instead of sliding in from off-screen.
      if (s.x < -5000) {
        s.x = m.x;
        s.y = m.y;
      } else {
        s.x += (m.x - s.x) * 0.1;
        s.y += (m.y - s.y) * 0.1;
      }
      const el = revealRef.current;
      if (el && m.x > -5000) {
        const g = `radial-gradient(circle ${SPOTLIGHT_R}px at ${s.x.toFixed(
          1
        )}px ${s.y.toFixed(
          1
        )}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`;
        el.style.setProperty('mask-image', g);
        el.style.setProperty('-webkit-mask-image', g);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canHover]);

  /** Keyboard path to the same affordance: focusing a hotspot parks
   *  the spotlight on it. */
  const focusSpot = (h: (typeof HOTSPOTS)[number]) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    mouse.current = {
      x: ((h.left + h.width / 2) / 100) * r.width,
      y: ((h.top + h.height / 2) / 100) * r.height,
    };
    setActive(true);
  };

  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Mobile-only portrait poster: the flat base with the lit twin
          revealed under a slow, self-drifting spotlight (no hover on
          touch). Reduced-motion shows the lit poster fully lit. */}
      {basePortrait && litPortrait && (
        <div className={styles.photoMobile} aria-hidden="true">
          <div
            className={styles.mBase}
            style={{ backgroundImage: `url(${basePortrait})` }}
          />
          <div
            className={styles.mLit}
            style={{ backgroundImage: `url(${litPortrait})` }}
          />
          <span className={styles.mScrim} />
        </div>
      )}

      <div
        ref={boxRef}
        className={styles.photoBox}
        style={{ aspectRatio: PHOTO_AR }}
      >
        <div className={styles.zoom}>
          <div
            className={styles.baseImg}
            style={{ backgroundImage: `url(${canHover ? base : lit})` }}
          />
          {canHover && (
            <div
              ref={revealRef}
              className={`${styles.litImg} ${active ? styles.litOn : ''}`}
              style={{ backgroundImage: `url(${lit})` }}
              aria-hidden="true"
            />
          )}
        </div>
        <span className={styles.photoFeather} aria-hidden="true" />

        {canHover && (
          <div className={styles.hotspots}>
            {HOTSPOTS.map((h, i) => {
              const product = h.slug ? bySlug.get(h.slug) : undefined;
              if (h.slug && !product) return null;
              const label = product?.name ?? h.fallbackLabel ?? '';
              const pos = {
                left: `${h.left}%`,
                top: `${h.top}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
              };
              const chip = (
                <span
                  className={`${styles.chip} ${
                    h.chipAbove ? styles.chipUp : ''
                  }`}
                >
                  {label}
                </span>
              );
              return product ? (
                <Link
                  key={`${h.slug}-${i}`}
                  href={`/products/${product.slug}`}
                  aria-label={label}
                  className={`${styles.hotspot} ${debug ? styles.debug : ''}`}
                  style={pos}
                  onFocus={() => focusSpot(h)}
                  onBlur={() => setActive(false)}
                >
                  {chip}
                </Link>
              ) : (
                <span
                  key={`x-${i}`}
                  className={`${styles.hotspot} ${debug ? styles.debug : ''}`}
                  style={pos}
                  aria-hidden="true"
                >
                  {chip}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.overlay}>
        <div className={styles.headBlock}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {t('heroBadge')}
          </span>
          <h1 className={styles.title}>
            <span className={styles.line1}>{t('heroTitle1')}</span>
            <span className={`${styles.line2} ${styles.titleAccent}`}>
              {t('heroTitle2')}
            </span>
          </h1>
        </div>

        <p className={styles.desc}>{t('heroDesc')}</p>

        <div className={styles.ctaBlock}>
          <Link href="/catalog" className={styles.btnPrimary}>
            {t('heroCta1')}
          </Link>
          <Link href="/catalog" className={styles.btnText}>
            {t('heroCta2')} <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroReveal;
