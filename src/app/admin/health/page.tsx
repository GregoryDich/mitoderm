import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

interface Check {
  key: string;
  label: string;
  on: boolean;
  detail?: string;
}

function ok(v: string | undefined): boolean {
  return typeof v === 'string' && v.trim().length > 0;
}

export default function AdminHealth() {
  if (!isAdmin()) redirect('/admin');

  const groups: { title: string; checks: Check[] }[] = [
    {
      title: 'Core',
      checks: [
        {
          key: 'ADMIN_PASSWORD',
          label: 'Admin login + cookie signing',
          on: ok(process.env.ADMIN_PASSWORD),
        },
      ],
    },
    {
      title: 'GitHub persistence (admin writes commit to repo)',
      checks: [
        { key: 'GITHUB_TOKEN', label: 'Fine-grained PAT (Contents R+W)', on: ok(process.env.GITHUB_TOKEN) },
        { key: 'GITHUB_OWNER', label: 'Repo owner', on: ok(process.env.GITHUB_OWNER), detail: process.env.GITHUB_OWNER },
        { key: 'GITHUB_REPO', label: 'Repo name', on: ok(process.env.GITHUB_REPO), detail: process.env.GITHUB_REPO },
        { key: 'GITHUB_BRANCH', label: 'Target branch', on: ok(process.env.GITHUB_BRANCH), detail: process.env.GITHUB_BRANCH ?? '(defaults to main)' },
      ],
    },
    {
      title: 'WhatsApp + conversions',
      checks: [
        { key: 'NEXT_PUBLIC_WHATSAPP_NUMBER', label: 'wa.me deep-links + sample-request CTA', on: ok(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) },
      ],
    },
    {
      title: 'Email (Resend)',
      checks: [
        { key: 'RESEND_API_KEY', label: 'API key', on: ok(process.env.RESEND_API_KEY) },
        { key: 'LEADS_TO_EMAIL', label: 'Owner destination address', on: ok(process.env.LEADS_TO_EMAIL), detail: process.env.LEADS_TO_EMAIL },
        { key: 'LEADS_FROM_EMAIL', label: 'Verified sender address', on: ok(process.env.LEADS_FROM_EMAIL), detail: process.env.LEADS_FROM_EMAIL },
      ],
    },
    {
      title: 'CRM webhook fan-out',
      checks: [
        { key: 'LEADS_WEBHOOK_URL', label: 'POST every lead to this URL', on: ok(process.env.LEADS_WEBHOOK_URL) },
        { key: 'LEADS_WEBHOOK_SECRET', label: 'HMAC-SHA256 body signature', on: ok(process.env.LEADS_WEBHOOK_SECRET) },
        { key: 'LEADS_MIRROR_TOKEN', label: 'Cron leads-mirror endpoint token', on: ok(process.env.LEADS_MIRROR_TOKEN) },
      ],
    },
    {
      title: 'Social ingest (n8n → /admin/social drafts)',
      checks: [
        { key: 'SOCIAL_INGEST_TOKEN', label: 'Bearer token for n8n', on: ok(process.env.SOCIAL_INGEST_TOKEN) },
        { key: 'SOCIAL_INGEST_SECRET', label: 'Optional HMAC-SHA256 body signature', on: ok(process.env.SOCIAL_INGEST_SECRET) },
      ],
    },
    {
      title: 'LLM product chat (B11)',
      checks: [
        { key: 'ANTHROPIC_API_KEY', label: 'Anthropic key (Claude Haiku 4.5)', on: ok(process.env.ANTHROPIC_API_KEY) },
      ],
    },
    {
      title: 'Analytics',
      checks: [
        { key: 'NEXT_PUBLIC_GOOGLE_ID', label: 'GA4 measurement id', on: ok(process.env.NEXT_PUBLIC_GOOGLE_ID), detail: process.env.NEXT_PUBLIC_GOOGLE_ID },
      ],
    },
  ];

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: -0.5 }}>
          Health
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
          Which integrations are wired in this environment. Read-only — to
          turn anything on, set the env var in Vercel and redeploy.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groups.map((g) => (
          <section
            key={g.title}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: 18,
              background: 'rgba(255,255,255,0.025)',
            }}
          >
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'rgba(245,242,240,0.55)',
              }}
            >
              {g.title}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.checks.map((c) => (
                <li
                  key={c.key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '20px 1fr auto',
                    gap: 12,
                    alignItems: 'center',
                    fontSize: 13.5,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: c.on ? '#66cc80' : '#9aa0a6',
                      boxShadow: c.on ? '0 0 0 4px rgba(102,204,128,0.18)' : 'none',
                    }}
                  />
                  <div>
                    <code
                      style={{
                        fontSize: 12,
                        color: c.on ? '#dfba74' : 'rgba(245,242,240,0.55)',
                      }}
                    >
                      {c.key}
                    </code>{' '}
                    <span style={{ color: 'rgba(245,242,240,0.85)' }}>{c.label}</span>
                    {c.detail && (
                      <span
                        style={{
                          marginInlineStart: 8,
                          color: 'rgba(245,242,240,0.5)',
                          fontSize: 12,
                          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        }}
                      >
                        — {c.detail}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: c.on ? '#66cc80' : 'rgba(245,242,240,0.4)',
                    }}
                  >
                    {c.on ? 'on' : 'off'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p
        style={{
          marginTop: 24,
          color: 'rgba(245,242,240,0.4)',
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        Reference: <code>.env.example</code> in the repo lists every variable
        and what it unlocks. Reference: <code>docs/hosting.md</code> for the
        Vercel setup steps.
      </p>
    </div>
  );
}
