import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProLoginPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: LocaleType };
  searchParams: { error?: string };
}) {
  unstable_setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: 'pro' });
  const errKey = searchParams.error;
  const errMsg =
    errKey === 'invalid'
      ? t('loginErrorInvalid')
      : errKey === 'missing'
      ? t('loginErrorMissing')
      : null;

  return (
    <div className="pageScroll" style={{ background: '#08080a', color: '#f5f2f0', paddingTop: 88 }}>
      <main
        style={{
          maxWidth: 560,
          margin: '0 auto',
          padding: 'clamp(40px, 8vw, 100px) clamp(20px, 5vw, 48px)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 300,
            margin: '0 0 16px',
            letterSpacing: '-0.01em',
          }}
        >
          {t('loginTitle')}
        </h1>
        <p
          style={{
            color: 'rgba(245,242,240,0.7)',
            fontSize: 16,
            lineHeight: 1.55,
            margin: '0 0 28px',
          }}
        >
          {t('loginText')}
        </p>
        {errMsg && (
          <p
            role="alert"
            style={{
              padding: 14,
              background: 'rgba(217,142,160,0.12)',
              border: '1px solid rgba(217,142,160,0.4)',
              borderRadius: 12,
              color: '#d98ea0',
              fontSize: 13.5,
              margin: '0 0 24px',
            }}
          >
            {errMsg}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/apply"
            style={{
              padding: '12px 26px',
              borderRadius: 30,
              background: '#dfba74',
              color: '#08080a',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            {t('applyCta')}
          </Link>
          <Link
            href="/form"
            style={{
              padding: '12px 26px',
              borderRadius: 30,
              background: 'transparent',
              border: '1px solid rgba(245,242,240,0.2)',
              color: '#f5f2f0',
              fontWeight: 500,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            {t('contactCta')}
          </Link>
        </div>
      </main>
    </div>
  );
}
