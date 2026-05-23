'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../../app/admin/admin.module.scss';

interface Props {
  socialDrafts?: number;
}

const SECTIONS = [
  { href: '/admin/products', label: 'Catalog' },
  { href: '/admin/doctors', label: 'Family' },
  { href: '/admin/social', label: 'Social' },
  { href: '/admin/press', label: 'Press' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/audit', label: 'Audit' },
];

const AdminNav: FC<Props> = ({ socialDrafts = 0 }) => {
  const pathname = usePathname() || '';
  return (
    <nav className={styles.nav}>
      {SECTIONS.map((s) => {
        const active = pathname === s.href || pathname.startsWith(s.href + '/');
        const showBadge = s.href === '/admin/social' && socialDrafts > 0;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? 'page' : undefined}
            className={`${styles.navLink} ${active ? styles.navActive : ''}`}
          >
            {s.label}
            {showBadge && (
              <span
                aria-label={`${socialDrafts} drafts`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 18,
                  height: 18,
                  padding: '0 5px',
                  marginInlineStart: 8,
                  borderRadius: 9,
                  background: '#dfba74',
                  color: '#08080a',
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {socialDrafts}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
