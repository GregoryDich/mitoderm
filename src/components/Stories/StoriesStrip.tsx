'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Story } from '@/lib/stories-store';
import StoriesViewer from './StoriesViewer';
import styles from './StoriesStrip.module.scss';

interface Props {
  stories: Story[];
}

const SEEN_KEY = 'mitoderm-stories-seen';

const StoriesStrip: FC<Props> = ({ stories }) => {
  const t = useTranslations('stories');
  const [openAt, setOpenAt] = useState<number | null>(null);
  const [seen, setSeen] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      if (raw) setSeen(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const markSeen = (id: string, updatedAt: string) => {
    setSeen((cur) => {
      const next = { ...cur, [id]: updatedAt };
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (stories.length === 0) return null;

  return (
    <section
      className={styles.section}
      aria-label={t('label')}
    >
      <div className={styles.rail} role="list">
        {stories.map((s, i) => {
          const isUnseen = seen[s.id] !== s.updatedAt;
          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.tile} ${isUnseen ? styles.unseen : styles.seen}`}
              onClick={() => setOpenAt(i)}
              aria-label={`${t('open')}: ${s.title}`}
              role="listitem"
            >
              <span className={styles.ring} aria-hidden="true" />
              <span className={styles.cover}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.cover} alt="" loading="lazy" />
              </span>
              <span className={styles.title}>{s.title}</span>
            </button>
          );
        })}
      </div>

      {openAt !== null && (
        <StoriesViewer
          stories={stories}
          startAt={openAt}
          onClose={() => setOpenAt(null)}
          onView={markSeen}
        />
      )}
    </section>
  );
};

export default StoriesStrip;
