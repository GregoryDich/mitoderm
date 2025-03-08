import { unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import Success from '@/components/Success/Success';

export default function SuccessPage({ params: { lang } }: any) {
  unstable_setRequestLocale(lang);
  return (
    <main className='successPage'>
      <Suspense>
        <Success />
      </Suspense>
    </main>
  );
}
