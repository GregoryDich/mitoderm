import { FC } from 'react';
import type { Doctor } from '@/lib/doctors-store';
import styles from './TrustedByStrip.module.scss';

interface Props {
  doctors: Doctor[];
  /** Optional label override; defaults to "TRUSTED BY". */
  label?: string;
}

const PROFESSION_BADGE: Record<Doctor['profession'], string> = {
  doctor: 'MD',
  cosmetologist: 'Cosmetologist',
  trichologist: 'Trichologist',
  'hair-stylist': 'Hair stylist',
  clinic: 'Clinic',
};

const TrustedByStrip: FC<Props> = ({ doctors, label = 'TRUSTED BY' }) => {
  const visible = doctors.filter((d) => d.isPublished).slice(0, 6);
  if (visible.length === 0) return null;

  return (
    <aside className={styles.strip} aria-label={label}>
      <span className={styles.label}>{label}</span>
      <ul className={styles.list}>
        {visible.map((d) => (
          <li key={d.id} className={styles.item}>
            <span className={styles.avatar} aria-hidden="true">
              {d.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.photo} alt="" loading="lazy" />
              ) : (
                <span className={styles.avatarPlaceholder}>
                  {d.name
                    .split(' ')
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>{d.name}</span>
              <span className={styles.role}>
                {PROFESSION_BADGE[d.profession]} · {d.city}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TrustedByStrip;
