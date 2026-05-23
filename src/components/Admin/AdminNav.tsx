'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../app/admin/admin.module.scss';

const SECTIONS = [
  { href: '/admin/products', label: 'Catalog' },
  { href: '/admin/doctors', label: 'Family' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/audit', label: 'Audit' },
];

const AdminNav: FC = () => {
  const pathname = usePathname() || '';
  return (
    <nav className={styles.nav}>
      {SECTIONS.map((s) => {
        const active = pathname === s.href || pathname.startsWith(s.href + '/');
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? 'page' : undefined}
            className={`${styles.navLink} ${active ? styles.navActive : ''}`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
