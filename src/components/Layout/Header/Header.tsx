'use client';

import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const navItems = [
    { label: t('product'), href: '/' },
    { label: t('lines'), href: '/lines/exosomes' },
    { label: t('catalog'), href: '/catalog' },
    { label: t('seminars'), href: '/seminars' },
    { label: t('clinics'), href: '/clinics' },
    { label: t('blog'), href: '/blog' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/form' },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
        <Image
          src="/brand/logo.svg"
          alt="Mitoderm"
          className={styles.logoImg}
          width={160}
          height={40}
          priority
        />
      </Link>

      <button
        type="button"
        className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
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
          {navItems.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href ||
                  pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`${styles.navLink} ${
                  active ? styles.navActive : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
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
