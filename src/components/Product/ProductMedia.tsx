'use client';

import { FC, useState } from 'react';
import { ProductAccent } from '@/products';
import styles from './ProductMedia.module.scss';

interface Props {
  image?: string;
  accent: ProductAccent;
  alt: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

const ProductMedia: FC<Props> = ({
  image,
  accent,
  alt,
  label,
  sublabel,
  className,
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = image && !failed;

  return (
    <div
      className={`${styles.media} ${styles[accent]} ${className ?? ''}`}
      {...(showImage ? {} : { role: 'img', 'aria-label': alt })}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={alt}
          className={styles.img}
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
