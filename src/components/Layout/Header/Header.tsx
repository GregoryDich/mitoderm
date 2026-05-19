'use client';

import { FC, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LocaleType } from '@/types';
import styles from './Header.module.scss';

const locales: LocaleType[] = ['en', 'he', 'ru'];

const Header: FC = () => {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: t('product'), href: '/' },
    { label: t('catalog'), href: '/catalog' },
    { label: t('contact'), href: '/form' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.svg" alt="Mitoderm" className={styles.logoImg} />
      </Link>

      <button
        type="button"
        className={styles.burger}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`${styles.right} ${open ? styles.rightOpen : ''}`}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.lang}>
          {locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              className={`${styles.langLink} ${
                l === locale ? styles.langActive : ''
              }`}
              onClick={() => setOpen(false)}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
