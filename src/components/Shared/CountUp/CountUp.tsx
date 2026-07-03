'use client';

import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  /** The final display string, e.g. "40+", "~30 nm", "100%", "3", "IL".
   *  The first integer found is animated from 0; surrounding text is
   *  preserved ("40+" counts 0→40 then shows "+"). Strings with no
   *  digits render as-is (no animation). */
  value: string;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
}

/** Animates the numeric part of a stat value when it scrolls into view.
 *  Falls back to static text under prefers-reduced-motion or when the
 *  value contains no number. Renders a <span>. */
const CountUp: FC<Props> = ({ value, duration = 1200, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/\d+/);
    if (!match) return; // nothing to animate
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return; // static
    }
    const el = ref.current;
    if (!el) return;
    const target = parseInt(match[0], 10);
    const prefix = value.slice(0, match.index ?? 0);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    const root =
      (document.querySelector('.pageScroll') as HTMLElement | null) ?? null;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        obs.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          // easeOutCubic — fast start, gentle settle
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };
        setDisplay(`${prefix}0${suffix}`);
        requestAnimationFrame(tick);
      },
      { root, threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;
