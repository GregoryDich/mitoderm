'use client';

import { FC, useEffect, useRef, useState } from 'react';
import styles from './ProductSectionNav.module.scss';

interface Props {
  sections: { id: string; label: string }[];
}

const ProductSectionNav: FC<Props> = ({ sections }) => {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root =
      (document.querySelector('.pageScroll') as HTMLElement | null) ?? null;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible entry currently above the middle
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        root,
        // Trigger band: just under the sticky nav (~210px from top) to ~50% down
        rootMargin: '-200px 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [sections]);

  const onClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    // If the section is a collapsed <details> (the secondary cluster),
    // open it first so the jump reveals content, not a closed summary.
    const det = target.closest('details') as HTMLDetailsElement | null;
    if (det && !det.open) det.open = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

  // Deep-link support: if the page loads with a hash pointing at a
  // collapsed section, open it on mount so the browser's own scroll
  // lands on visible content.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    const det = target?.closest('details') as HTMLDetailsElement | null;
    if (det && !det.open) det.open = true;
  }, []);

  // Keep the active pill in view (horizontal scroll on mobile)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector(
      `[data-id="${active}"]`
    ) as HTMLElement | null;
    if (!el) return;
    const left = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  return (
    <nav className={styles.nav} aria-label="Product sections">
      <div className={styles.list} ref={listRef}>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-id={s.id}
            onClick={onClick(s.id)}
            aria-current={active === s.id ? 'true' : undefined}
            className={`${styles.pill} ${
              active === s.id ? styles.pillActive : ''
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default ProductSectionNav;
