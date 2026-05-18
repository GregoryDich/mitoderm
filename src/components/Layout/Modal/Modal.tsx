'use client';

import { FC, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useAppStore from '@/store/store';
import styles from './Modal.module.scss';

const Modal: FC = () => {
  const t = useTranslations('accessibility');
  const isOpen = useAppStore((s) => s.modalIsOpen);
  const toggleModal = useAppStore((s) => s.toggleModal);
  const content = useAppStore((s) => s.modalContent);

  useEffect(() => {
    document.body.classList.toggle('modalOpened', isOpen);
    return () => document.body.classList.remove('modalOpened');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => toggleModal(false)}
      role="presentation"
    >
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={() => toggleModal(false)}
        >
          ×
        </button>
        <h2 className={styles.title}>{t('title')}</h2>
        {content === 'accessibility' ? (
          <div className={styles.body}>
            <h3>{t('general')}</h3>
            <p>{t('websites')}</p>
            <h3>{t('interfaceTitle')}</h3>
            <p>{t('interfaceText')}</p>
            <ul>
              <li>{t('readers')}</li>
              <li>{t('navigating')}</li>
              <li>{t('contrast')}</li>
              <li>{t('alt')}</li>
              <li>{t('scaling')}</li>
            </ul>
            <h3>{t('feedbackTitle')}</h3>
            <p>{t('difficulties')}</p>
            <p>{t('feedbackHelp')}</p>
          </div>
        ) : (
          <div className={styles.body}>
            <p>{t('obligationsText')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
