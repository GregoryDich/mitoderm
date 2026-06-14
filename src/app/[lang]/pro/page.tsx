import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { LocaleType } from '@/types';
import { Link } from '@/i18n/routing';
import { currentProUser } from '@/lib/pro-auth';
import { getClinic } from '@/lib/clinics-store';
import { products } from '@/products';
import Footer from '@/components/Layout/Footer/Footer';
import ProLogoutButton from '@/components/Pro/ProLogoutButton';
import { absUrl, alternatesFor, SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: LocaleType };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: lang, namespace: 'pro' });
  return {
    title: `${t('title')} | ${SITE_NAME}`,
    description: t('subtitle'),
    alternates: alternatesFor(lang, '/pro'),
    robots: { index: false, follow: false },
  };
}

export default async function ProHome({
  params: { lang },
}: {
  params: { lang: LocaleType };
}) {
  unstable_setRequestLocale(lang);
  const session = currentProUser();
  if (!session) redirect(`/${lang}/pro/login`);

  // Double-check the account is still approved (admin may have rejected
  // after the session was issued).
  const clinic = await getClinic(session.id);
  if (!clinic || clinic.status !== 'approved') {
    redirect(`/${lang}/pro/login?error=invalid`);
  }

  const t = await getTranslations({ locale: lang, namespace: 'pro' });

  return (
    <div className="pageScroll" style={{ background: '#08080a', color: '#f5f2f0', paddingTop: 88 }}>
      <main
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: 'clamp(28px, 5vw, 56px) clamp(20px, 5vw, 48px) 60px',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 24,
            marginBottom: 36,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#dfba74',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#66cc80',
                }}
              />
              {t('badge')}
            </span>
            <h1
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {t('greeting', { name: clinic.clinic })}
            </h1>
            <p
              style={{
                color: 'rgba(245,242,240,0.7)',
                margin: '8px 0 0',
                fontSize: 15,
              }}
            >
              {t('subtitle')}
            </p>
          </div>
          <ProLogoutButton label={t('signOut')} />
        </header>

        {/* Asset grid — per-product wholesale resources */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,240,0.6)',
              margin: '0 0 16px',
            }}
          >
            {t('productAssets')}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {products.map((p) => {
              const c = p.content[lang];
              return (
                <article
                  key={p.slug}
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#dfba74',
                      fontWeight: 600,
                    }}
                  >
                    {p.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>
                    {c.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                    <Link
                      href={`/products/${p.slug}/brief`}
                      style={proLinkStyle}
                    >
                      <span>📄</span> {t('protocolPdf')}
                    </Link>
                    <Link
                      href={`/products/${p.slug}`}
                      style={proLinkStyle}
                    >
                      <span>↪</span> {t('publicPage')}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Account info + reorder CTA */}
        <section
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          <div>
            <h3 style={cardTitleStyle}>{t('accountInfo')}</h3>
            <p style={infoLineStyle}>
              <strong>{clinic.clinic}</strong>
            </p>
            <p style={infoLineStyle}>{clinic.email}</p>
            {clinic.phone && <p style={infoLineStyle}>{clinic.phone}</p>}
            {clinic.city && <p style={infoLineStyle}>{clinic.city}</p>}
          </div>
          <div>
            <h3 style={cardTitleStyle}>{t('reorderTitle')}</h3>
            <p style={{ ...infoLineStyle, color: 'rgba(245,242,240,0.7)' }}>
              {t('reorderText')}
            </p>
            <Link
              href="/form"
              style={{
                display: 'inline-block',
                marginTop: 12,
                padding: '10px 22px',
                borderRadius: 24,
                background: '#dfba74',
                color: '#08080a',
                fontWeight: 600,
                fontSize: 13.5,
                textDecoration: 'none',
              }}
            >
              {t('reorderCta')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

const proLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: 'rgba(245,242,240,0.85)',
  fontSize: 13.5,
  textDecoration: 'none',
  padding: '6px 10px',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.04)',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 12,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(245,242,240,0.55)',
  fontWeight: 600,
};

const infoLineStyle: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: 14,
  color: '#f5f2f0',
};

void absUrl;
