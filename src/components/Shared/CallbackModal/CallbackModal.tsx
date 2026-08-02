'use client';

import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { track } from '@/lib/track';
import { readStoredUtm } from '@/components/Analytics/UtmCapture';
import styles from './CallbackModal.module.scss';

/** Compact "request a callback" popup — the old mitoderm.com pattern
 *  (name / profession buttons / phone / email → success card) rebuilt on
 *  the new design tokens. Mounted once per page tree; any button opens it
 *  via `openCallbackModal()` (a window CustomEvent under the hood), so no
 *  prop drilling. Submits to the same /api/leads pipeline as the big form
 *  with source "callback-modal". */

export const OPEN_EVENT = 'mitoderm:open-callback';

export function openCallbackModal() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Profession = 'cosmetologist' | 'doctor' | 'clinic';

const CallbackModal: FC = () => {
  const t = useTranslations('callbackModal');
  const locale = useLocale() as 'en' | 'ru' | 'he';
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState<Profession>('cosmetologist');
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      track('callback_modal_open');
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setError('');
    if (done) {
      // Fresh form the next time the modal opens after a success.
      setDone(false);
      setName('');
      setPhone('');
      setEmail('');
      setAgree(false);
    }
  }, [done]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const id = setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      clearTimeout(id);
    };
  }, [open, close]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!name.trim() || !phone.trim()) {
      setError(t('errorRequired'));
      return;
    }
    if (!emailRe.test(email)) {
      setError(t('errorEmail'));
      return;
    }
    if (!agree) {
      setError(t('errorAgree'));
      return;
    }
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          clinic: t(`profession_${profession}`),
          message: `${t('leadMessage')} — ${t(`profession_${profession}`)}`,
          website,
          source: 'callback-modal',
          locale,
          utm: readStoredUtm(),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setDone(true);
      track('lead_submit', { source: 'callback-modal' });
    } catch {
      setError(t('errorServer'));
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className={styles.dialog}
      >
        <button
          type="button"
          className={styles.close}
          aria-label={t('close')}
          onClick={close}
        >
          ×
        </button>

        {done ? (
          <div className={styles.success}>
            <span className={styles.successMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26">
                <path
                  d="M4.5 12.5l5 5L19.5 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className={styles.successTitle}>{t('successTitle')}</h3>
            <p className={styles.successText}>{t('successText')}</p>
            <button type="button" className={styles.submit} onClick={close}>
              {t('successClose')}
            </button>
          </div>
        ) : (
          <>
            <span className={styles.kicker}>{t('kicker')}</span>
            <h3 className={styles.title}>{t('title')}</h3>
            <p className={styles.subtitle}>{t('subtitle')}</p>

            <form onSubmit={submit} noValidate>
              <label className={styles.label}>
                {t('name')}
                <input
                  ref={nameRef}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </label>

              <span className={styles.label}>{t('profession')}</span>
              <div
                className={styles.chips}
                role="radiogroup"
                aria-label={t('profession')}
              >
                {(['cosmetologist', 'doctor', 'clinic'] as Profession[]).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={profession === p}
                      className={`${styles.chip} ${
                        profession === p ? styles.chipActive : ''
                      }`}
                      onClick={() => setProfession(p)}
                    >
                      {t(`profession_${p}`)}
                    </button>
                  )
                )}
              </div>

              <div className={styles.row}>
                <label className={styles.label}>
                  {t('phone')}
                  <input
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    dir="ltr"
                    autoComplete="tel"
                  />
                </label>
                <label className={styles.label}>
                  {t('email')}
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                  />
                </label>
              </div>

              {/* Honeypot — hidden from real users, dropped server-side. */}
              <input
                className={styles.hp}
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                aria-hidden="true"
              />

              <label className={styles.agree}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>{t('agree')}</span>
              </label>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submit} disabled={sending}>
                {sending ? t('sending') : t('submit')}
              </button>
              <p className={styles.note}>{t('note')}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackModal;
