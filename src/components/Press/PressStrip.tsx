import { FC } from 'react';
import { useTranslations } from 'next-intl';
import type { PressItem } from '@/lib/press-store';
import styles from './PressStrip.module.scss';

interface Props {
  items: PressItem[];
}

const PressStrip: FC<Props> = ({ items }) => {
  const t = useTranslations('press');
  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="press-strip-title">
      <h2 id="press-strip-title" className={styles.title}>
        {t('title')}
      </h2>
      <ul className={styles.list}>
        {items.map((p) => {
          const inner = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.logo}
              alt={p.name}
              title={p.name}
              loading="lazy"
              className={styles.logo}
            />
          );
          return (
            <li key={p.id} className={styles.item}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noreferrer" aria-label={p.name}>
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default PressStrip;
