'use client';

import { FC } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useConsent } from '@/components/Consent/ConsentProvider';
import WebVitals from './WebVitals';

/** Mount-gate for analytics: GoogleAnalytics + WebVitals only render
 *  when the visitor has explicitly granted consent. While the consent
 *  state is `unset` or `denied`, no third-party scripts are injected
 *  and no metrics flow.
 *
 *  This is the consent contract. Anywhere we add a tracking integration,
 *  it should mount here behind the same gate. */
const ConsentedAnalytics: FC<{ gaId?: string }> = ({ gaId }) => {
  const { state } = useConsent();
  if (state !== 'granted') return null;
  if (!gaId) return null;
  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <WebVitals />
    </>
  );
};

export default ConsentedAnalytics;
