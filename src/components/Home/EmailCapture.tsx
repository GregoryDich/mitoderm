'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { track } from '@/lib/track';
import styles from './EmailCapture.module.scss';

interface Props {
  placeholder: string;
  cta: string;
}

/** Single-field capture for the partner recruitment band — lower friction
 *  than bouncing to the full form. Carries the email into /apply, where it
 *  pre-fills the application. */
const EmailCapture: FC<Props> = ({ placeholder, cta }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    track('partner_email_capture', { hasEmail: !!v });
    router.push(v ? `/apply?email=${encodeURIComponent(v)}` : '/apply');
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={styles.input}
      />
      <button type="submit" className={styles.btn}>
        {cta}
      </button>
    </form>
  );
};

export default EmailCapture;
