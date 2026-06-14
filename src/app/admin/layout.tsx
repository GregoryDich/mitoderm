import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Rubik } from 'next/font/google';
import '../globals.scss';
import { isAdmin, SESSION_COOKIE } from '@/lib/admin-auth';
import { readSocial } from '@/lib/social-store';
import AdminLogoutButton from '@/components/Admin/AdminLogoutButton';
import AdminNav from '@/components/Admin/AdminNav';
import styles from './admin.module.scss';

export const dynamic = 'force-dynamic';

const rubik = Rubik({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-Rubik',
});

export const metadata: Metadata = {
  title: 'Mitoderm Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read cookie just to decide whether to render the nav — the actual auth
  // check happens in each page / API route.
  const authed = isAdmin();
  void SESSION_COOKIE;
  void cookies;

  let socialDrafts = 0;
  if (authed) {
    const social = await readSocial();
    socialDrafts = social.filter((p) => !p.isPublished).length;
  }

  return (
    <html lang="en">
      <body className={`${rubik.className} ${styles.body}`}>
        <header className={styles.topbar}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandName}>Mitoderm admin</span>
          </Link>
          {authed && (
            <div className={styles.navRow}>
              <AdminNav socialDrafts={socialDrafts} />
              <AdminLogoutButton />
            </div>
          )}
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
