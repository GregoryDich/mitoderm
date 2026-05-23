'use client';

import { FC, useEffect, useRef, useState } from 'react';
import ProductMedia from './ProductMedia';
import styles from './HoverVideoMedia.module.scss';

interface Props {
  image?: string;
  video?: string;
  accent: 'teal' | 'gold' | 'rose';
  alt: string;
  className?: string;
  sizes?: string;
}

/** Image-by-default, hover-to-play short video clip. The <video> element
 *  is only mounted after the user signals interest (hover on desktop,
 *  touch on mobile), so the page doesn't fetch the clip until needed —
 *  saves bandwidth on visitors who scroll past. Respects
 *  prefers-reduced-motion: if set, the video never auto-plays. */
const HoverVideoMedia: FC<Props> = ({
  image,
  video,
  accent,
  alt,
  className,
  sizes,
}) => {
  const [armed, setArmed] = useState(false);
  const [reduce, setReduce] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    if (armed && ref.current && !reduce) {
      // Best effort — modern browsers reject autoplay when not muted,
      // but we are muted, so this normally resolves immediately.
      ref.current.play().catch(() => undefined);
    }
  }, [armed, reduce]);

  const handleEnter = () => {
    if (!video || reduce) return;
    setArmed(true);
  };

  const handleLeave = () => {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };

  // If there's no video, just render the still — saves the hover wiring.
  if (!video || reduce) {
    return (
      <ProductMedia
        image={image}
        accent={accent}
        alt={alt}
        className={className}
        sizes={sizes}
      />
    );
  }

  return (
    <div
      className={`${styles.wrap} ${className ?? ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <div className={styles.still}>
        <ProductMedia
          image={image}
          accent={accent}
          alt={alt}
          className={styles.media}
          sizes={sizes}
        />
      </div>
      {armed && (
        <video
          ref={ref}
          className={styles.video}
          src={video}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default HoverVideoMedia;
