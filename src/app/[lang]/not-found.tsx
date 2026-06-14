import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={`pageScroll ${styles.page}`}>
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.box}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.text}>
          The page you’re looking for has moved, doesn’t exist, or is being
          prepared.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/" className={styles.btnPrimary}>
            Back to home
          </Link>
          <Link href="/catalog" className={styles.btnGhost}>
            Browse the catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
