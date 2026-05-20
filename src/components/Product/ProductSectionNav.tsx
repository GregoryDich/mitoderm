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
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(id);
  };

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
