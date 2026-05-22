'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { ProductAccent } from '@/products';
import styles from './ProductMedia.module.scss';

interface Props {
  image?: string;
  accent: ProductAccent;
  alt: string;
  label?: string;
  sublabel?: string;
  className?: string;
  /** Mark the LCP image so it's preloaded and not lazy-loaded. */
  priority?: boolean;
  /** `sizes` hint for next/image. Defaults to a sensible responsive value. */
  sizes?: string;
}

const DEFAULT_SIZES =
  '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 520px';

const ProductMedia: FC<Props> = ({
  image,
  accent,
  alt,
  label,
  sublabel,
  className,
  priority,
  sizes = DEFAULT_SIZES,
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;

  return (
    <div
      className={`${styles.media} ${styles[accent]} ${className ?? ''}`}
      {...(showImage ? {} : { role: 'img', 'aria-label': alt })}
    >
      {showImage ? (
        <Image
          src={image}
          alt={alt}
          fill
          className={styles.img}
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <span className={styles.orb} aria-hidden="true" />
          <span className={styles.frame} aria-hidden="true">
            {label && <span className={styles.label}>{label}</span>}
            {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
          </span>
        </>
      )}
    </div>
  );
};

export default ProductMedia;
