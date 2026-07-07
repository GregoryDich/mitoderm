import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import PageHeader from '@/components/Shared/PageHeader/PageHeader';
import Reveal from '@/components/Shared/Reveal/Reveal';
import type { ProductChip } from '@/products';
import styles from './GlossaryPage.module.scss';

export interface GlossaryEntry {
  term: string;
  def: string;
  /** URL-safe anchor id. */
  id: string;
  /** Products that list this term as an ingredient — rendered as
   *  linked chips so a definition becomes an entry point. May be empty. */
  products?: ProductChip[];
}

const accentVar: Record<ProductChip['accent'], string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
  amber: '#cf9b4e',
  steel: '#8ba0ab',
};

interface Props {
  entries: GlossaryEntry[];
}

const GlossaryPage: FC<Props> = ({ entries }) => {
  const t = useTranslations('glossaryPage');

  return (
    <div className={`pageScroll ${styles.page}`}>
      <PageHeader
        kicker={t('eyebrow')}
        title={t('title')}
        lead={t('subtitle')}
      />

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

        <Reveal>
        <dl className={styles.list}>
          {entries.map((e) => (
            <div key={e.id} id={e.id} className={styles.entry}>
              <dt className={styles.term}>{e.term}</dt>
              <dd className={styles.def}>
                {e.def}
                {e.products && e.products.length > 0 && (
                  <span className={styles.usedIn}>
                    <span className={styles.usedInLabel}>{t('usedIn')}</span>
                    <span className={styles.chips}>
                      {e.products.map((p) => (
                        <Link
                          key={p.slug}
                          href={p.href}
                          className={styles.chip}
                          style={{
                            ['--accent' as string]: accentVar[p.accent],
                          }}
                        >
                          {p.name}
                        </Link>
                      ))}
                    </span>
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
};

export default GlossaryPage;
