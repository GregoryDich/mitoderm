'use client';

import { FC } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import useAppStore from '@/store/store';
import { ModalType } from '@/types';
import styles from './Footer.module.scss';

const Footer: FC = () => {
  const t = useTranslations('footer');
  const toggleModal = useAppStore((s) => s.toggleModal);
  const setModalContent = useAppStore((s) => s.setModalContent);

  const openModal = (content: ModalType) => {
    setModalContent(content);
    toggleModal(true);
  };

  return (
    <footer className={styles.footer}>
      <Image
        src="/brand/logo.svg"
        alt="Mitoderm"
        className={styles.logo}
        width={140}
        height={36}
      />
      <span className={styles.copyright}>{t('copyright')}</span>
      <div className={styles.links}>
        <button type="button" onClick={() => openModal('privatePolicy')}>
          {t('privacy')}
        </button>
        <Link href="/accessibility">{t('accessibility')}</Link>
      </div>
    </footer>
  );
};

export default Footer;
