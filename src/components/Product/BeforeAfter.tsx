'use client';

import { FC, useCallback, useRef, useState } from 'react';
import styles from './BeforeAfter.module.scss';

interface Pair {
  before: string;
  after: string;
  indication?: string;
  weeksAfter?: string;
}

interface Props {
  pairs: Pair[];
  beforeLabel: string;
  afterLabel: string;
}

const BeforeAfter: FC<Props> = ({ pairs, beforeLabel, afterLabel }) => {
  return (
    <div className={styles.list}>
      {pairs.map((p, i) => (
        <Pair
          key={`${p.before}-${p.after}-${i}`}
          pair={p}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
        />
      ))}
    </div>
  );
};

const Pair: FC<{ pair: Pair; beforeLabel: string; afterLabel: string }> = ({
  pair,
  beforeLabel,
  afterLabel,
}) => {
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPct(Math.max(0, Math.min(100, p)));
  }, []);

  const onDown = (clientX: number) => {
    dragging.current = true;
    move(clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };
  const onMove = (clientX: number) => {
    if (dragging.current) move(clientX);
  };

  return (
    <figure className={styles.frame}>
      <div
        className={styles.stage}
        ref={wrap}
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onMouseMove={(e) => onMove(e.clientX)}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchEnd={onUp}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        role="region"
        aria-label={`${beforeLabel} / ${afterLabel}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.before}
          alt={beforeLabel}
          className={styles.img}
          loading="lazy"
          draggable={false}
        />
        <div
          className={styles.afterClip}
          style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pair.after}
            alt={afterLabel}
            className={styles.img}
            loading="lazy"
            draggable={false}
          />
        </div>
        <span className={styles.labelBefore}>{beforeLabel}</span>
        <span className={styles.labelAfter}>{afterLabel}</span>
        <div
          className={styles.handle}
          // Physical `left` (not logical): the drag math and the clip
          // are both physical-left-based, so the handle must track the
          // same axis or it detaches from the reveal line in RTL.
          style={{ left: `${pct}%` }}
          aria-hidden="true"
        >
          <span className={styles.handleBar} />
          <span className={styles.handleKnob}>
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path
                d="M8 6l-4 6 4 6M16 6l4 6-4 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
        </div>
        {/* a11y slider — keyboard control */}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pct)}
          onChange={(e) => setPct(Number(e.target.value))}
          className={styles.range}
          aria-label={`${beforeLabel} / ${afterLabel}`}
        />
      </div>
      {(pair.indication || pair.weeksAfter) && (
        <figcaption className={styles.caption}>
          {pair.indication && (
            <span className={styles.capInd}>{pair.indication}</span>
          )}
          {pair.weeksAfter && (
            <span className={styles.capTime}>{pair.weeksAfter}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default BeforeAfter;
