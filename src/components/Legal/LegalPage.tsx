import { FC } from 'react';
import Footer from '@/components/Layout/Footer/Footer';
import styles from './LegalPage.module.scss';

export interface LegalSection {
  /** Plain-text heading. */
  heading: string;
  /** Paragraphs. Rendered as separate <p> nodes. */
  paragraphs: string[];
  /** Optional bullet list rendered under the paragraphs. */
  bullets?: string[];
}

interface Props {
  eyebrow: string;
  title: string;
  updated: string;
  /** Notice rendered at the very top — used to flag DRAFT status until
   *  the owner replaces the placeholder text with legal-reviewed copy. */
  draftNotice?: string;
  intro: string;
  sections: LegalSection[];
  contactHeading: string;
  contactText: string;
}

const LegalPage: FC<Props> = ({
  eyebrow,
  title,
  updated,
  draftNotice,
  intro,
  sections,
  contactHeading,
  contactText,
}) => {
  return (
    <div className={`pageScroll ${styles.page}`}>
      <header className={styles.intro}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {eyebrow}
        </span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>{updated}</p>
      </header>

      <main className={styles.content}>
        {draftNotice && (
          <aside className={styles.draft} role="note">
            {draftNotice}
          </aside>
        )}

        <p className={styles.lead}>{intro}</p>

        {sections.map((s, i) => (
          <section key={`${i}-${s.heading}`} className={styles.section}>
            <h2 className={styles.h2}>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} className={styles.p}>
                {p}
              </p>
            ))}
            {s.bullets && s.bullets.length > 0 && (
              <ul className={styles.list}>
                {s.bullets.map((b, k) => (
                  <li key={k} className={styles.item}>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className={styles.section}>
          <h2 className={styles.h2}>{contactHeading}</h2>
          <p className={styles.p}>{contactText}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
