import { FC } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Layout/Footer/Footer';
import styles from './GlossaryPage.module.scss';

export interface GlossaryEntry {
  term: string;
  def: string;
  /** URL-safe anchor id. */
  id: string;
}

interface Props {
  entries: GlossaryEntry[];
}

const GlossaryPage: FC<Props> = ({ entries }) => {
  const t = useTranslations('glossaryPage');

  return (
    <div className={`pageScroll ${styles.page}`}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <main className={styles.content}>
        {entries.length > 0 && (
          <nav className={styles.jump} aria-label={t('jumpLabel')}>
            {entries.map((e) => (
              <a key={e.id} href={`#${e.id}`} className={styles.jumpLink}>
                {e.term}
              </a>
            ))}
          </nav>
        )}

        <dl className={styles.list}>
          {entries.map((e) => (
            <div key={e.id} id={e.id} className={styles.entry}>
              <dt className={styles.term}>{e.term}</dt>
              <dd className={styles.def}>{e.def}</dd>
            </div>
          ))}
        </dl>
      </main>

      <Footer />
    </div>
  );
};

export default GlossaryPage;
