'use client';

import { FC, useState } from 'react';
import styles from './TrainingHub.module.scss';

type Kind = 'video' | 'pdf' | 'cert' | 'link';

interface Item {
  kind: Kind;
  title: string;
  href: string;
  duration?: string;
  description?: string;
}

interface Props {
  items: Item[];
  strings: {
    play: string;
    open: string;
    download: string;
    enroll: string;
  };
}

/** Extracts a YouTube video id from a watch / share / embed URL. */
function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? m[1] : null;
}

const Tile: FC<{ item: Item; strings: Props['strings'] }> = ({
  item,
  strings,
}) => {
  const [playing, setPlaying] = useState(false);
  const yt = item.kind === 'video' ? youtubeId(item.href) : null;

  if (yt) {
    return (
      <article className={`${styles.tile} ${styles.video}`}>
        <div className={styles.thumb}>
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.iframe}
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className={styles.poster}
              />
              <button
                type="button"
                className={styles.playBtn}
                onClick={() => setPlaying(true)}
                aria-label={`${strings.play}: ${item.title}`}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path d="M7 5l12 7-12 7V5z" fill="currentColor" />
                </svg>
              </button>
            </>
          )}
          {item.duration && (
            <span className={styles.duration}>{item.duration}</span>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.kind}>VIDEO</span>
          <h3 className={styles.title}>{item.title}</h3>
          {item.description && (
            <p className={styles.desc}>{item.description}</p>
          )}
        </div>
      </article>
    );
  }

  const label =
    item.kind === 'pdf'
      ? strings.download
      : item.kind === 'cert'
      ? strings.enroll
      : strings.open;
  const kindLabel =
    item.kind === 'pdf'
      ? 'PDF'
      : item.kind === 'cert'
      ? 'CERTIFICATION'
      : 'LINK';

  return (
    <a
      href={item.href}
      target={item.kind === 'pdf' ? '_blank' : '_blank'}
      rel="noreferrer"
      className={`${styles.tile} ${styles.doc}`}
    >
      <div className={styles.icon}>
        {item.kind === 'pdf' && (
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
            <path
              d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path
              d="M8 13h8M8 17h6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
        {item.kind === 'cert' && (
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
            <circle cx="12" cy="9" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M8 13l-2 8 6-3 6 3-2-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {item.kind === 'link' && (
          <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
            <path
              d="M10 14a4 4 0 016 0M14 10a4 4 0 00-6 0M9 15l-2 2a3 3 0 11-4-4l4-4M15 9l2-2a3 3 0 114 4l-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.kind}>{kindLabel}</span>
        <h3 className={styles.title}>{item.title}</h3>
        {item.description && (
          <p className={styles.desc}>{item.description}</p>
        )}
        <span className={styles.cta}>
          {label} <span aria-hidden="true" className={styles.arrow}>→</span>
        </span>
      </div>
    </a>
  );
};

const TrainingHub: FC<Props> = ({ items, strings }) => {
  return (
    <div className={styles.grid}>
      {items.map((it, i) => (
        <Tile key={`${it.href}-${i}`} item={it} strings={strings} />
      ))}
    </div>
  );
};

export default TrainingHub;
