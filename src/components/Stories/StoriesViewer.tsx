'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Story } from '@/lib/stories-store';
import styles from './StoriesViewer.module.scss';

interface Props {
  stories: Story[];
  startAt: number;
  onClose: () => void;
  /** Notified when a story finishes (all slides shown). */
  onView: (id: string, updatedAt: string) => void;
}

const SLIDE_MS = 5000; // 5 seconds per slide
const TICK_MS = 60;

const StoriesViewer: FC<Props> = ({ stories, startAt, onClose, onView }) => {
  const t = useTranslations('stories');
  const [storyIdx, setStoryIdx] = useState(startAt);
  const [slideIdx, setSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current slide
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const story = stories[storyIdx];
  const slide = story?.slides[slideIdx];

  const next = useCallback(() => {
    setProgress(0);
    setSlideIdx((cur) => {
      if (!story) return cur;
      if (cur + 1 < story.slides.length) return cur + 1;
      // last slide -> mark seen, advance to next story
      onView(story.id, story.updatedAt);
      setStoryIdx((si) => {
        if (si + 1 < stories.length) return si + 1;
        // last story finished -> close
        queueMicrotask(onClose);
        return si;
      });
      return 0;
    });
  }, [story, stories.length, onView, onClose]);

  const prev = useCallback(() => {
    setProgress(0);
    setSlideIdx((cur) => {
      if (cur > 0) return cur - 1;
      setStoryIdx((si) => {
        if (si > 0) {
          const target = stories[si - 1];
          // jump to its last slide
          queueMicrotask(() => setSlideIdx(target.slides.length - 1));
          return si - 1;
        }
        return si;
      });
      return 0;
    });
  }, [stories]);

  // tick the progress bar
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setProgress((p) => {
        const np = p + TICK_MS / SLIDE_MS;
        if (np >= 1) {
          // schedule advance after this tick
          queueMicrotask(next);
          return 0;
        }
        return np;
      });
    }, TICK_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slideIdx, storyIdx, next]);

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.classList.add('modalOpened');
    return () => document.body.classList.remove('modalOpened');
  }, []);

  if (!story || !slide) return null;

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < r.width / 2) prev();
    else next();
  };

  return (
    <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={t('label')}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label={t('close')}
        onClick={onClose}
      />
      <div className={styles.stage}>
        <header className={styles.head}>
          <div className={styles.bars}>
            {story.slides.map((_, i) => (
              <div key={i} className={styles.bar}>
                <span
                  className={styles.barFill}
                  style={{
                    width:
                      i < slideIdx
                        ? '100%'
                        : i === slideIdx
                        ? `${progress * 100}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>
          <div className={styles.meta}>
            <span className={styles.cover}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={story.cover} alt="" />
            </span>
            <span className={styles.metaText}>
              <span className={styles.title}>{story.title}</span>
              <span className={styles.counter}>
                {slideIdx + 1} / {story.slides.length}
              </span>
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label={t('close')}
            >
              ×
            </button>
          </div>
        </header>

        <div
          className={styles.frame}
          onClick={handleTap}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt=""
            className={styles.image}
            key={`${storyIdx}-${slideIdx}`}
          />
          {slide.caption && (
            <span className={styles.caption}>{slide.caption}</span>
          )}
          {slide.link && (
            <a
              href={slide.link}
              className={styles.link}
              onClick={(e) => e.stopPropagation()}
            >
              {t('seeMore')} <span aria-hidden="true">→</span>
            </a>
          )}
          <button
            type="button"
            className={styles.prev}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label={t('prev')}
          />
          <button
            type="button"
            className={styles.next}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={t('next')}
          />
        </div>
      </div>
    </div>
  );
};

export default StoriesViewer;
