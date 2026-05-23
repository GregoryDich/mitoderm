'use client';

import { FC } from 'react';
import { useInterestList } from './InterestListProvider';
import styles from './InterestToggle.module.scss';

interface Props {
  slug: string;
  addLabel: string;
  removeLabel: string;
  /** "icon" = circular fab on cards; "wide" = inline button on PDP. */
  variant?: 'icon' | 'wide';
}

const InterestToggle: FC<Props> = ({
  slug,
  addLabel,
  removeLabel,
  variant = 'icon',
}) => {
  const { toggle, has } = useInterestList();
  const added = has(slug);

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${added ? styles.added : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={added}
      aria-label={added ? removeLabel : addLabel}
      title={added ? removeLabel : addLabel}
    >
      <svg
        viewBox="0 0 24 24"
        width={variant === 'wide' ? '16' : '20'}
        height={variant === 'wide' ? '16' : '20'}
        aria-hidden="true"
      >
        <path
          d="M12 21l-1.45-1.32C5.4 14.36 2 11.27 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.77-3.4 6.86-8.55 11.18L12 21z"
          fill={added ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {variant === 'wide' && (
        <span className={styles.label}>{added ? removeLabel : addLabel}</span>
      )}
    </button>
  );
};

export default InterestToggle;
