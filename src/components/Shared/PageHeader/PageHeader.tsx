import { FC, ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import styles from './PageHeader.module.scss';

interface Props {
  /** Small uppercase gold label above the title. */
  kicker: ReactNode;
  /** The page H1. Rendered in the serif display face. */
  title: ReactNode;
  /** Optional muted paragraph under the title. */
  lead?: ReactNode;
  /** Alignment of the header block. Defaults to centered to match the
   *  existing inner-page heroes; pass 'start' for a left-aligned,
   *  editorial hero like the homepage sections. */
  align?: 'center' | 'start';
  /** Optional back link rendered above the kicker. */
  backHref?: string;
  backLabel?: string;
  /** Extra content rendered under the lead (badges, CTAs, meta). */
  children?: ReactNode;
  className?: string;
}

/** The shared inner-page hero: serif display title, gold kicker with the
 *  hairline motif, muted lead, two blurred glow blobs and a staggered
 *  load-in cascade. Physically symmetric (works in RTL unchanged) and
 *  gated behind prefers-reduced-motion. Replaces the eyebrow/title/
 *  subtitle block every inner page used to hand-roll. */
const PageHeader: FC<Props> = ({
  kicker,
  title,
  lead,
  align = 'center',
  backHref,
  backLabel,
  children,
  className,
}) => {
  return (
    <header
      className={[
        styles.header,
        align === 'start' ? styles.start : styles.center,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />
      <div className={styles.inner}>
        {backHref && backLabel && (
          <Link href={backHref} className={styles.back}>
            <span className={styles.backArrow} aria-hidden="true">
              ←
            </span>
            {backLabel}
          </Link>
        )}
        <span className={styles.kicker}>
          <span className={styles.kickerLine} aria-hidden="true" />
          {kicker}
        </span>
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
