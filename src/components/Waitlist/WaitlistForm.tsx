'use client';

import { FC, FormEvent, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { track } from '@/lib/track';
import { readStoredUtm } from '@/components/Analytics/UtmCapture';
import styles from './WaitlistForm.module.scss';

interface Props {
  /** Origin tag — must match a key in RELAXED_SOURCES on the /api/leads
   *  route (e.g. "bio-spicules-waitlist"). */
  source: string;
  /** Display title above the form. */
  title: string;
  /** Short paragraph under the title. */
  text: string;
  /** Submit button label when idle. */
  ctaLabel: string;
  /** Email input placeholder. */
  emailPlaceholder: string;
  /** Title rendered after a successful signup. */
  successTitle: string;
  /** Body text after a successful signup. */
  successText: string;
  /** Generic error message on network/server failure. */
  errorText: string;
}

/** Inline email-only waitlist form. Posts to /api/leads with a `source`
 *  tag so the lead lands in the same store but stays separable in admin.
 *  Uses the same honeypot defence as the main contact form. */
const WaitlistForm: FC<Props> = ({
  source,
  title,
  text,
  ctaLabel,
  emailPlaceholder,
  successTitle,
  successText,
  errorText,
}) => {
  const t = useTranslations('waitlist');
  const locale = useLocale() as 'en' | 'ru' | 'he';
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setPending(true);
    setErr(null);
    try {
      const utm = readStoredUtm();
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source, website, locale, utm }),
      });
      if (!res.ok) {
        setErr(errorText);
      } else {
        setDone(true);
        track('lead_submit', { source });
        track('lead_success', { source });
      }
    } catch {
      setErr(errorText);
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <section className={styles.band} role="status" aria-live="polite">
        <span className={styles.glow} aria-hidden="true" />
        <h2 className={styles.title}>{successTitle}</h2>
        <p className={styles.text}>{successText}</p>
      </section>
    );
  }

  return (
    <section className={styles.band}>
      <span className={styles.glow} aria-hidden="true" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{text}</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {/* Honeypot — real users never see or fill this. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
          }}
        />

        <label className={styles.field}>
          <span className="sr-only">{t('emailLabel')}</span>
          <input
            type="email"
            required
            className={styles.input}
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
            aria-invalid={!!err}
          />
        </label>
        <button
          type="submit"
          className={styles.button}
          disabled={pending || !email.trim()}
        >
          {pending ? t('sending') : ctaLabel}
        </button>
      </form>

      {err && (
        <p className={styles.error} role="alert">
          {err}
        </p>
      )}
    </section>
  );
};

export default WaitlistForm;
