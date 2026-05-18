'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
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
      <span className={styles.logo}>MITODERM</span>
      <span className={styles.copyright}>{t('copyright')}</span>
      <div className={styles.links}>
        <button type="button" onClick={() => openModal('privatePolicy')}>
          {t('privacy')}
        </button>
        <button type="button" onClick={() => openModal('accessibility')}>
          {t('accessibility')}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
