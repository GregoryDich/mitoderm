'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { openCallbackModal } from './CallbackModal';
import styles from './CallbackButton.module.scss';

/** Ghost pill that opens the callback popup — droppable into any section
 *  (server components included) without prop drilling. */
const CallbackButton: FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('callbackModal');
  return (
    <button
      type="button"
      className={`${styles.btn} ${className ?? ''}`}
      onClick={openCallbackModal}
    >
      <span className={styles.dot} aria-hidden="true" />
      {t('openButton')}
    </button>
  );
};

export default CallbackButton;
