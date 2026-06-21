'use client';

import { FC, FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Layout/Footer/Footer';
import { track } from '@/lib/track';
import styles from './ContactForm.module.scss';

interface FormState {
  name: string;
  email: string;
  phone: string;
  clinic: string;
  message: string;
  /** Honeypot — hidden field that real users never fill. The /api/leads
   *  handler silently drops any submission with a non-empty value. */
  website: string;
}

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  clinic: '',
  message: '',
  website: '',
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm: FC = () => {
  const t = useTranslations('contactForm');
  const [v, setV] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setV((p) => ({ ...p, [k]: e.target.value }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!v.name.trim()) next.name = t('errorRequired');
    if (!v.email.trim()) next.email = t('errorRequired');
    else if (!emailRe.test(v.email)) next.email = t('errorEmail');
    if (!v.message.trim()) next.message = t('errorRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setServerError(null);
    track('lead_submit', { has_phone: !!v.phone, has_clinic: !!v.clinic });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(v),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          errors?: Record<string, string>;
        };
        if (data.errors) {
          setErrors({
            name: data.errors.name && t('errorRequired'),
            email:
              data.errors.email === 'invalid'
                ? t('errorEmail')
                : data.errors.email && t('errorRequired'),
            message: data.errors.message && t('errorRequired'),
          });
        } else {
          setServerError(t('errorServer'));
        }
        return;
      }
      setSubmitted(true);
      track('lead_success');
    } catch {
      setServerError(t('errorServer'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`pageScroll ${styles.page}`}>
      <div className={styles.glows} aria-hidden="true">
        <span className={styles.glowA} />
      </div>

      <section className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </section>

      <main className={styles.content}>
        {submitted ? (
          <div className={styles.success} role="status" aria-live="polite">
            <span className={styles.successDot} />
            <h2 className={styles.successTitle}>{t('successTitle')}</h2>
            <p className={styles.successText}>{t('successText')}</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={v.website}
              onChange={set('website')}
              style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                opacity: 0,
              }}
            />
            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.label}>{t('name')}</span>
                <input
                  type="text"
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ''
                  }`}
                  value={v.name}
                  onChange={set('name')}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className={styles.errMsg}>{errors.name}</span>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>{t('email')}</span>
                <input
                  type="email"
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ''
                  }`}
                  value={v.email}
                  onChange={set('email')}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span className={styles.errMsg}>{errors.email}</span>
                )}
              </label>
            </div>

            <div className={styles.row2}>
              <label className={styles.field}>
                <span className={styles.label}>{t('phone')}</span>
                <input
                  type="tel"
                  className={styles.input}
                  value={v.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>{t('clinic')}</span>
                <input
                  type="text"
                  className={styles.input}
                  value={v.clinic}
                  onChange={set('clinic')}
                  autoComplete="organization"
                />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>{t('message')}</span>
              <textarea
                rows={5}
                className={`${styles.input} ${styles.textarea} ${
                  errors.message ? styles.inputError : ''
                }`}
                value={v.message}
                onChange={set('message')}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <span className={styles.errMsg}>{errors.message}</span>
              )}
            </label>

            <button
              type="submit"
              className={styles.submit}
              disabled={sending}
              aria-busy={sending}
            >
              {sending ? t('sending') : t('submit')}
            </button>
            {serverError && (
              <p role="alert" className={styles.errMsg}>
                {serverError}
              </p>
            )}
            <p className={styles.disclaimer}>{t('disclaimer')}</p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ContactForm;
