'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import PageHeader from '@/components/Shared/PageHeader/PageHeader';
import type { Doctor, DoctorArea, DoctorProfession } from '@/lib/doctors-store';
import styles from './ClinicsPage.module.scss';

interface Props {
  doctors: Doctor[];
}

type AreaFilter = 'all' | DoctorArea;
type ProfFilter = 'all' | DoctorProfession;

const AREAS: AreaFilter[] = ['all', 'north', 'center', 'jerusalem', 'south', 'eilat'];
const PROFS: ProfFilter[] = ['all', 'doctor', 'cosmetologist', 'clinic'];

const ClinicsPage: FC<Props> = ({ doctors }) => {
  const t = useTranslations('clinics');
  const [area, setArea] = useState<AreaFilter>('all');
  const [prof, setProf] = useState<ProfFilter>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((d) => {
      if (area !== 'all' && d.area !== area) return false;
      if (prof !== 'all' && d.profession !== prof) return false;
      if (!q) return true;
      const hay = `${d.name} ${d.city} ${d.bio ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [doctors, area, prof, query]);

  return (
    <div className={`pageScroll ${styles.page}`}>
      <PageHeader
        kicker={t('eyebrow')}
        title={t('title')}
        lead={t('subtitle')}
      />

      <main className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t('areaLabel')}</span>
            <div className={styles.pills}>
              {AREAS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={area === a}
                  className={`${styles.pill} ${area === a ? styles.pillActive : ''}`}
                  onClick={() => setArea(a)}
                >
                  {t(`area.${a}`)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t('professionLabel')}</span>
            <div className={styles.pills}>
              {PROFS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={prof === p}
                  className={`${styles.pill} ${prof === p ? styles.pillActive : ''}`}
                  onClick={() => setProf(p)}
                >
                  {t(`profession.${p}`)}
                </button>
              ))}
            </div>
          </div>
          <label className={styles.searchWrap}>
            <span className="sr-only">{t('searchLabel')}</span>
            <input
              type="search"
              className={styles.search}
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('searchLabel')}
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className={styles.empty}>
            {doctors.length === 0 ? t('emptyDirectory') : t('noResults')}
          </p>
        ) : (
          <ul className={styles.grid}>
            {visible.map((d) => (
              <li key={d.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.avatar} aria-hidden="true">
                    {d.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={d.photo} alt="" />
                    ) : (
                      <span>{d.name.slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardProf}>
                      {t(`profession.${d.profession}`)}
                    </span>
                    <h3 className={styles.cardName}>{d.name}</h3>
                    <span className={styles.cardCity}>
                      {d.city} · {t(`area.${d.area}`)}
                    </span>
                  </div>
                </div>
                {d.bio && <p className={styles.cardBio}>{d.bio}</p>}
                <div className={styles.cardActions}>
                  {d.contact && (
                    <a
                      className={styles.cardLink}
                      href={d.contact.startsWith('http') ? d.contact : `tel:${d.contact}`}
                    >
                      {t('contact')}
                    </a>
                  )}
                  {d.instagram && (
                    <a
                      className={styles.cardLink}
                      href={d.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>{t('ctaTitle')}</h2>
          <p className={styles.ctaText}>{t('ctaText')}</p>
          <Link href="/form" className={styles.ctaButton}>
            {t('ctaButton')}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicsPage;
