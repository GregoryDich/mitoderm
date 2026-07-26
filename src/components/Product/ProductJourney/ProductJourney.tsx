'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '@/i18n/routing';
import type { Product, ProductAccent } from '@/products';
import type { LocaleType } from '@/types';
import type { JourneyConfig, JourneyChapterConfig } from '@/lib/journey';
import styles from './ProductJourney.module.scss';

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

export interface JourneyStrings {
  scrollHint: string;
  ctaContact: string;
  /** Ordered kicker/title pair per chapter id. */
  chapters: Record<
    JourneyChapterConfig['id'],
    { kicker: string; title: string }
  >;
}

interface Props {
  product: Product;
  locale: LocaleType;
  config: JourneyConfig;
  strings: JourneyStrings;
  waHref?: string;
}

/** The scroll-driven, cinematic top of a Journey-enabled PDP. Renders the
 *  6 awareness-ladder chapters (docs/product-funnel.md) from the product's
 *  existing localized content, over per-chapter keyframe media. GSAP only
 *  *enhances* — under `prefers-reduced-motion` every chapter is a plain,
 *  fully-legible stacked section. The classic PDP (formula, protocol,
 *  logistics, FAQ, …) continues below this component as the reference layer. */
const ProductJourney: FC<Props> = ({
  product,
  locale,
  config,
  strings,
  waHref,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const c = product.content[locale];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles.reveal}`)
    );
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // The site scrolls inside `.pageScroll` (body is position:fixed), so the
    // window never scrolls — both the reveal observer and ScrollTrigger must
    // use this element as their scroller/root, not the viewport.
    const scroller = root.closest<HTMLElement>('.pageScroll');

    // Reduced motion (or no IO support): reveal everything immediately, no
    // parallax. Nothing ever stays hidden behind a scroll effect.
    if (reduce || typeof IntersectionObserver === 'undefined') {
      reveals.forEach((el) => el.classList.add(styles.in));
      return;
    }

    // Content reveal via IntersectionObserver — robust for above-the-fold
    // content too (elements already in view intersect on observe and reveal
    // at once), unlike a scroll-triggered tween that can miss the first beat.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        });
      },
      { root: scroller ?? null, rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));

    // GSAP is used only for the cinematic media parallax.
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(`.${styles.mediaInner}`).forEach((m) => {
        const chapter = m.closest(`.${styles.chapter}`);
        if (!chapter) return;
        gsap.fromTo(
          m,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.16,
            ease: 'none',
            scrollTrigger: {
              scroller: scroller ?? undefined,
              trigger: chapter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [locale]);

  const media = (chapter: JourneyChapterConfig, idx: number): ReactNode => {
    const src = chapter.media || product.image;
    if (!src) return <span className={styles.mediaFallback} aria-hidden="true" />;
    return (
      <div className={styles.media} aria-hidden="true">
        <div className={styles.mediaInner}>
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={idx === 0}
            className={styles.mediaImg}
          />
        </div>
        <span className={styles.veil} />
      </div>
    );
  };

  const heading = (id: JourneyChapterConfig['id']): ReactNode => {
    const s = strings.chapters[id];
    return (
      <header className={styles.head}>
        <span className={`${styles.kicker} ${styles.reveal}`}>{s.kicker}</span>
        <h2 className={`${styles.title} ${styles.reveal}`}>{s.title}</h2>
      </header>
    );
  };

  // Mirror the classic PDP's placeholder guard: values still carrying a
  // "TODO" (unfilled admin slots) must not render on the live page.
  const clean = (s?: string): string | undefined =>
    s && !s.includes('TODO') ? s : undefined;
  const econItems = (c.economics?.items ?? []).filter((it) => clean(it.value));

  const body: Record<JourneyChapterConfig['id'], ReactNode> = {
    // 1 — Arrival (Unaware): the hook. Name, tagline, one-line promise.
    arrival: (
      <>
        <p className={`${styles.eyebrow} ${styles.reveal}`}>{c.eyebrow}</p>
        <p className={`${styles.lede} ${styles.reveal}`}>{c.tagline}</p>
        <p className={`${styles.para} ${styles.reveal}`}>{c.description}</p>
        {c.keyFacts && c.keyFacts.length > 0 && (
          <ul className={`${styles.factList} ${styles.reveal}`}>
            {c.keyFacts.map((f) => (
              <li key={f} className={styles.fact}>
                <span className={styles.factDot} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <span className={`${styles.scrollHint} ${styles.reveal}`}>
          {strings.scrollHint} <span className={styles.scrollArrow}>↓</span>
        </span>
      </>
    ),
    // 2 — Plateau (Problem-aware): reframe benefits as the client's problem.
    plateau: (
      <div className={`${styles.grid2} ${styles.reveal}`}>
        {c.benefits.map((b, i) => (
          <article key={b.title} className={styles.card}>
            <span className={styles.cardNum} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p className={styles.cardText}>{b.text}</p>
          </article>
        ))}
      </div>
    ),
    // 3 — Mechanism (Solution-aware): the system steps + proof-of-mechanism stats.
    mechanism: (
      <>
        {c.steps && (
          <ol className={`${styles.steps} ${styles.reveal}`}>
            {c.steps.map((s) => (
              <li key={s.num} className={styles.step}>
                <span className={styles.stepNum}>{s.num}</span>
                <div>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardText}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
        {c.stats.length > 0 && (
          <div className={`${styles.stats} ${styles.reveal}`}>
            {c.stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </>
    ),
    // 4 — Product (Product-aware): the protocol you actually run.
    product: (
      <>
        {c.protocol && (
          <ol className={`${styles.numList} ${styles.reveal}`}>
            {c.protocol.items.map((it, i) => (
              <li key={it} className={styles.numItem}>
                <span className={styles.numIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ol>
        )}
        {c.chips.length > 0 && (
          <ul className={`${styles.chips} ${styles.reveal}`}>
            {c.chips.map((ch) => (
              <li key={ch} className={styles.chip}>
                {ch}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
    // 5 — Proof (Most-aware): clinical results (before/after promotes here when present).
    proof: (
      <>
        {c.clinicalResults && c.clinicalResults.items.length > 0 && (
          <div className={`${styles.results} ${styles.reveal}`}>
            {c.clinicalResults.items.map((r) => (
              <article key={`${r.label}-${r.value}`} className={styles.result}>
                <span className={styles.resultValue}>{r.value}</span>
                <span className={styles.resultLabel}>{r.label}</span>
                {clean(r.source) && (
                  <span className={styles.resultSource}>{r.source}</span>
                )}
              </article>
            ))}
          </div>
        )}
      </>
    ),
    // 6 — Partner (Most-aware → repeat): the economics + the invitation.
    partner: (
      <>
        {econItems.length > 0 && (
          <div className={`${styles.results} ${styles.reveal}`}>
            {econItems.map((it) => (
              <article key={it.label} className={styles.result}>
                <span className={styles.resultValue}>{it.value}</span>
                <span className={styles.resultLabel}>{it.label}</span>
                {clean(it.sub) && (
                  <span className={styles.resultSource}>{it.sub}</span>
                )}
              </article>
            ))}
          </div>
        )}
        <div className={`${styles.close} ${styles.reveal}`}>
          <h3 className={styles.closeTitle}>{c.ctaTitle}</h3>
          <p className={styles.para}>{c.ctaText}</p>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={styles.cta}
            >
              {strings.ctaContact}
            </a>
          ) : (
            <Link href="/form" className={styles.cta}>
              {strings.ctaContact}
            </Link>
          )}
        </div>
      </>
    ),
  };

  return (
    <div
      ref={rootRef}
      className={styles.journey}
      style={{ ['--accent' as string]: accentVar[product.accent] }}
    >
      {config.chapters.map((chapter, idx) => (
        <section
          key={chapter.id}
          className={styles.chapter}
          data-chapter={chapter.id}
          aria-label={strings.chapters[chapter.id].title}
        >
          {media(chapter, idx)}
          <div className={styles.inner}>
            {heading(chapter.id)}
            <div className={styles.content}>{body[chapter.id]}</div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductJourney;
