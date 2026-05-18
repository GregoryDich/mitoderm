'use client';

import { FC, CSSProperties } from 'react';
import { Link } from '@/i18n/routing';
import styles from './Button.module.scss';

interface Props {
  text: string;
  colored?: boolean;
  style?: CSSProperties;
  href?: string;
  /** Legacy prop kept for compatibility with event/form pages. */
  formPage?: 'main' | 'event';
  onClick?: () => void;
}

const Button: FC<Props> = ({ text, colored, style, href, formPage, onClick }) => {
  const className = `${styles.button} ${colored ? styles.colored : styles.outline}`;

  if (onClick) {
    return (
      <button type="button" className={className} style={style} onClick={onClick}>
        {text}
      </button>
    );
  }

  const target = href ?? (formPage === 'event' ? '/event/form' : '/form');

  return (
    <Link href={target} className={className} style={style}>
      {text}
    </Link>
  );
};

export default Button;
