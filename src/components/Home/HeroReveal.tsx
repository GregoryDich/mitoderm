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

/** Portrait-poster hotspots (percent of the 853×1844 mobile composition,
 *  measured off the rendered poster region by region). Same contract as
 *  HOTSPOTS; the poster does not mirror in RTL. Tune with ?debugHotspots. */
const PORTRAIT_HOTSPOTS: typeof HOTSPOTS = [
  { slug: 'mitopen', left: 2, top: 33, width: 11, height: 19, chipAbove: true },
  { slug: 'mitoscan', left: 13, top: 41, width: 31, height: 13 },
  { slug: 'v-tech-serum', left: 44, top: 32, width: 18, height: 24, chipAbove: true },
  { slug: 'exosignal-hair', left: 62, top: 38, width: 21, height: 14 },
  { slug: 'exosignal-hair-spray', left: 83, top: 44, width: 17, height: 15 },
  {
    slug: null,
    fallbackLabel: 'EXOCELL Mask',
    left: 4,
    top: 60,
    width: 37,
    height: 17,
  },
  { slug: 'exo-nad', left: 33, top: 60, width: 30, height: 20 },
  { slug: 'v-tech-serum', left: 63, top: 62, width: 36, height: 18 },
  { slug: 'exotech-gel', left: 12, top: 81, width: 43, height: 11, chipAbove: true },
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
  // Mobile poster: index of the PORTRAIT_HOTSPOTS entry under the finger
  // (shows its chip), plus refs for the touch-driven spotlight.
  const [touchSpot, setTouchSpot] = useState<number | null>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mLitRef = useRef<HTMLDivElement>(null);
  const touchFade = useRef<ReturnType<typeof setTimeout>>();

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

  /** Touch spotlight on the portrait poster: the lit twin is revealed in a
   *  soft circle under the finger (desktop-hover analogue) and the hotspot
   *  under the finger shows its name chip. Release fades back to idle. */
  const onPosterTouch = (e: React.TouchEvent) => {
    const box = mobileRef.current;
    const litEl = mLitRef.current;
    if (!box || !litEl) return;
    const r = box.getBoundingClientRect();
    const t = e.touches[0];
    if (!t) return;
    const x = t.clientX - r.left;
    const y = t.clientY - r.top;
    const g = `radial-gradient(circle 170px at ${x.toFixed(0)}px ${y.toFixed(
      0
    )}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 42%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0) 100%)`;
    litEl.style.setProperty('mask-image', g);
    litEl.style.setProperty('-webkit-mask-image', g);
    litEl.style.setProperty('mask-size', '100% 100%');
    litEl.style.setProperty('-webkit-mask-size', '100% 100%');
    litEl.classList.add(styles.mLitTouch);
    if (touchFade.current) clearTimeout(touchFade.current);
    const px = (x / r.width) * 100;
    const py = (y / r.height) * 100;
    const idx = PORTRAIT_HOTSPOTS.findIndex(
      (h) =>
        px >= h.left && px <= h.left + h.width &&
        py >= h.top && py <= h.top + h.height
    );
    setTouchSpot(idx >= 0 ? idx : null);
  };

  const onPosterTouchEnd = () => {
    touchFade.current = setTimeout(() => {
      const litEl = mLitRef.current;
      if (litEl) {
        litEl.classList.remove(styles.mLitTouch);
        litEl.style.removeProperty('mask-image');
        litEl.style.removeProperty('-webkit-mask-image');
        litEl.style.removeProperty('mask-size');
        litEl.style.removeProperty('-webkit-mask-size');
      }
      setTouchSpot(null);
    }, 1300);
  };

  return (
    <>
    <section ref={sectionRef} className={styles.hero}>
      {/* Mobile-only portrait poster: the flat base with the lit twin
          revealed under a slow, self-drifting spotlight (no hover on
          touch). Reduced-motion shows the lit poster fully lit. */}
      {basePortrait && litPortrait && (
        <div
          ref={mobileRef}
          className={styles.photoMobile}
          onTouchStart={onPosterTouch}
          onTouchMove={onPosterTouch}
          onTouchEnd={onPosterTouchEnd}
          onTouchCancel={onPosterTouchEnd}
        >
          <div
            className={styles.mBase}
            style={{ backgroundImage: `url(${basePortrait})` }}
            aria-hidden="true"
          />
          <div
            ref={mLitRef}
            className={styles.mLit}
            style={{ backgroundImage: `url(${litPortrait})` }}
            aria-hidden="true"
          />
          <span className={styles.mScrim} aria-hidden="true" />

          {/* Product hotspots on the portrait poster — the whole lineup is
              tappable; the touched product lights up and names itself.
              The layer mirrors the drawn image box (cover, anchored top),
              so percent coordinates match the poster exactly. */}
          <div className={styles.mHotspots}>
            {PORTRAIT_HOTSPOTS.map((h, i) => {
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
                  className={`${styles.chip} ${h.chipAbove ? styles.chipUp : ''} ${
                    touchSpot === i ? styles.chipOn : ''
                  }`}
                >
                  {label}
                </span>
              );
              return product ? (
                <Link
                  key={`m-${h.slug}-${i}`}
                  href={`/products/${product.slug}`}
                  aria-label={label}
                  className={`${styles.hotspot} ${debug ? styles.debug : ''}`}
                  style={pos}
                >
                  {chip}
                </Link>
              ) : (
                <span
                  key={`mx-${i}`}
                  className={`${styles.hotspot} ${debug ? styles.debug : ''}`}
                  style={pos}
                  aria-hidden="true"
                >
                  {chip}
                </span>
              );
            })}
          </div>
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

    </section>

    {/* Intro copy — its own section under the photo block (owner request
        01.08: the hero keeps only the interactive lineup; the badge/H1/
        desc/CTA column follows as the next, centered section). */}
    <section className={styles.intro}>
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
    </section>
    </>
  );
};

export default HeroReveal;
