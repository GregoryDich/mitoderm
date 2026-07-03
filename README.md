# Mitoderm

Next.js 14 marketing site + admin for **Mitoderm** — Israeli B2B
distributor of clinical-grade exosome skincare for cosmetologists and
aesthetic practitioners.

- Tri-locale **EN / RU / HE** with proper RTL on Hebrew
- Premium-dark visual system, conversion-funnels to WhatsApp / form
- Owner-managed admin at `/admin` (data records only, no site-copy CMS)
- Optional integrations: Resend (lead emails), CRM webhook, n8n
  Instagram ingest, Anthropic chat, GA4

[![ci](https://github.com/gregorydich/mitoderm/actions/workflows/ci.yml/badge.svg)](https://github.com/gregorydich/mitoderm/actions/workflows/ci.yml)

## Deploy now (5 min)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgregorydich%2Fmitoderm&env=ADMIN_PASSWORD,GITHUB_TOKEN,GITHUB_OWNER,GITHUB_REPO,GITHUB_BRANCH&envDescription=ADMIN_PASSWORD%20enables%20%2Fadmin%3B%20GITHUB_*%20vars%20make%20admin%20saves%20commit%20to%20the%20repo.%20See%20docs%2Fhosting.md.&envLink=https%3A%2F%2Fgithub.com%2Fgregorydich%2Fmitoderm%2Fblob%2Fmain%2F.env.example&project-name=mitoderm&repository-name=mitoderm)

After Vercel imports the repo, add your custom domain in Project →
Settings → Domains. SSL auto-issues. Every branch gets a preview URL;
`main` is production. Full walkthrough: [`docs/hosting.md`](docs/hosting.md).

## Read first

| File | What it tells you |
| - | - |
| [`STATE.md`](STATE.md) | Resume-on-new-session — current branch, last commit, what's built, what's open. **Read first.** |
| [`CLAUDE.md`](CLAUDE.md) | Durable conventions and reusable techniques for the Mitoderm repo. |
| [`docs/hosting.md`](docs/hosting.md) | Vercel setup + preview/production branching, with env-var checklist. |
| [`docs/admin-content-guide.md`](docs/admin-content-guide.md) | Step-by-step for filling each admin section with content. |
| [`docs/n8n-instagram.md`](docs/n8n-instagram.md) | n8n workflow that pushes new Reels into `/admin/social` drafts. |
| [`docs/c-bucket-triage.md`](docs/c-bucket-triage.md) | What's left on the long-tail roadmap, what blocks it. |
| [`.env.example`](.env.example) | Every env var, what it unlocks. |

## Run locally

```bash
npm install
ADMIN_PASSWORD=devpass npm run dev
```

Then:

- Public site: <http://localhost:3000/en>
- Admin: <http://localhost:3000/admin>
- Health check (env-var status): <http://localhost:3000/admin/health>

## Useful scripts

| Script | Purpose |
| - | - |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | Next.js lint |
| `npm run check:locales` | Fail on missing en→ru/he keys (strict ns only) |
| `node scripts/seed-product-faq.mjs` | Re-seed per-product FAQ |
| `node scripts/seed-product-extras.mjs` | Re-seed clinicalResults / economics placeholders |
| `node scripts/seed-product-bundles.mjs` | Re-seed `/protocols` data |

## High-level architecture

```
src/
  app/
    [lang]/                  ← public site, locale-prefixed
      page.tsx                home (Stories → featured → social → press → why → CTA)
      catalog/                /catalog with search + filter
      products/[slug]/        PDP — 11 structural slots (faq, training,
                                clinical, economics, logistics, comparison,
                                bundle, beforeAfter, gallery, indications…)
      products/[slug]/brief/  print-to-PDF leaflet
      protocols/              "Shop the protocol" landing
      regimen/                3-question quiz → top-2 product reco
      clinics/                doctor directory with LocalBusiness JSON-LD
      seminars/               upcoming + past events with Event JSON-LD
      apply/                  partner clinic application form
      pro/                    invite-only /pro portal (magic-link cookie)
      accessibility/          IS 5568 statement
    api/
      leads/                  public lead capture (validation → store → webhook)
      apply/                  partner application
      pro/login/              magic-link cookie issuance
      chat/product/           Anthropic Haiku 4.5 product chat
      og/                     edge-rendered OG images
      integrations/social/    n8n → /admin/social drafts
      admin/                  admin CRUD + CSV exports + audit
    admin/                    unified admin shell (9 sections)
  components/                 Layout · Home · Catalog · Product · Clinics ·
                                Seminars · Protocols · Stories · Social ·
                                Press · Pro · Admin · InterestList ·
                                RecentlyViewed · A11yWidget · …
  data/                       JSON stores (products, doctors, social, press,
                                stories, clinics, leads)
  lib/                        admin-auth · pro-auth · stores · seo · whatsapp ·
                                lead-classifier · glossary · experiments
  middleware.ts               i18n + security headers + A/B cookie issuance
docs/                         hosting · admin content guide · n8n setup · C triage
scripts/                      idempotent content seeds + locale parity check
.github/workflows/ci.yml      type-check, locale parity, lint
```

## Contributing

If you're picking this up after a context reset, read `STATE.md`.
The full work-trail is in `git log` on the `claude/add-catalog-page-65V89`
branch (or its successor merged into `main`).
