'use client';

import { FC, FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Layout/Footer/Footer';
import styles from './ApplyForm.module.scss';

const ApplyForm: FC = () => {
  const t = useTranslations('apply');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clinic, setClinic] = useState('');
  const [license, setLicense] = useState('');
  const [city, setCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [message, setMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const res = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        clinic,
        license,
        city,
        instagram,
        message,
        referralCode,
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(
        data.error === 'duplicate_email'
          ? t('errorDuplicate')
          : t('errorGeneric')
      );
      setPending(false);
      return;
    }
    setDone(true);
    setPending(false);
  };

  return (
    <div className={`pageScroll ${styles.page}`}>
      <main className={styles.container}>
        <header className={styles.head}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {t('eyebrow')}
          </div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        {done ? (
          <section className={styles.success}>
            <h2 className={styles.successTitle}>{t('successTitle')}</h2>
            <p className={styles.successText}>{t('successText')}</p>
          </section>
        ) : (
          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>{t('name')} *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('email')} *</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('phone')}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('clinic')} *</span>
                <input
                  type="text"
                  required
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('license')}</span>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('city')}</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.input}
                />
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span className={styles.label}>{t('instagram')}</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@mitodermclinic"
                  className={styles.input}
                />
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span className={styles.label}>{t('message')}</span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                  className={styles.input}
                  placeholder={t('messagePlaceholder')}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('referralCode')}</span>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.slice(0, 80))}
                  className={styles.input}
                  placeholder={t('referralCodePlaceholder')}
                />
              </label>
            </div>
            {err && <p className={styles.err}>{err}</p>}
            <button
              type="submit"
              disabled={pending}
              className={styles.submit}
            >
              {pending ? t('sending') : t('submit')}
            </button>
            <p className={styles.disclaimer}>{t('disclaimer')}</p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ApplyForm;
