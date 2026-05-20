'use client';

import { FC, useEffect, useState } from 'react';
import { usePathname } from '@/i18n/routing';
import styles from './ScrollToTop.module.scss';

const THRESHOLD = 400;

const ScrollToTop: FC = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector('.pageScroll') as HTMLElement | null;
    if (!el) {
      setVisible(false);
      return;
    }
    setVisible(el.scrollTop > THRESHOLD);
    const onScroll = () => setVisible(el.scrollTop > THRESHOLD);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const onClick = () => {
    const el = document.querySelector('.pageScroll') as HTMLElement | null;
    el?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={onClick}
      className={`${styles.btn} ${visible ? styles.btnVisible : ''}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
