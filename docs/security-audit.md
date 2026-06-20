# Security audit — June 2026

Snapshot of security posture taken right after the production cutover.
Re-run `npm audit --omit=dev` after any dependency change to refresh.

## Surface inventory

| Endpoint | Auth | Rate-limit | Notes |
| - | - | - | - |
| `POST /api/leads` | none (public) | 5/IP/min | Spam guard |
| `POST /api/apply` | none (public) | 3/IP/min | Stricter |
| `POST /api/admin/login` | none (gate) | 5/IP/5min | Brute-force defense |
| `POST /api/admin/logout` | none | n/a | Clears cookie |
| `POST /api/pro/logout` | none | n/a | Clears cookie |
| `GET /api/pro/login?token=…` | magic-link token | n/a | Single-use bootstrap |
| `POST /api/chat/product` | none (public) | 10/IP/min | LLM cost guard |
| `POST /api/integrations/social/ingest` | Bearer + optional HMAC | 60/IP/min | + SSRF host allowlist |
| `POST /api/admin/leads/mirror?token=…` | static token | n/a | Cron-callable |
| `POST /api/apply`, all `POST /api/admin/*` writes | cookie or token | — | Audit-logged |

All admin write routes are gated by `isAdmin()` (verified via grep — 20/20
admin routes covered; `login`, `logout`, `leads/mirror` use other auth by
design).

## Hardening already in place

- **Cookies** — admin + /pro sessions: `httpOnly`, `secure` (prod),
  `sameSite=lax`, `path=/`. HMAC-signed with secret derived from
  `ADMIN_PASSWORD` via a fixed salt.
- **Constant-time comparisons** in `admin-auth.ts`, `pro-auth.ts`,
  social-ingest token verify, leads-mirror token.
- **Response headers** (in `middleware.ts`):
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
  - `Content-Security-Policy` — restrictive script/connect/frame sources.
- **Upload pipeline** — MIME-whitelist, separate caps (4 MB image / 12 MB
  video), `path.basename` sanitization, ext-forced filename, slug regex
  validation.
- **Social ingest SSRF defense** — poster downloader requires
  `https://*.cdninstagram.com | *.fbcdn.net | instagram.com` host with
  explicit private-IP block + 8s AbortController timeout.
- **Lang/locale sanitization** in /pro login redirect: `/[^a-z]/g` strip
  + 4-char slice, so the redirect URL can never be open-redirect to an
  attacker domain.
- **No leaked secrets in source** (grep -r tokens/passwords clean).
- **Audit log** of every admin write (`data/audit.jsonl`) with IP / UA /
  meta — surfaced at `/admin/audit`.

## Known advisories (kept under mitigation)

| pkg | severity | advisory | why kept | mitigation |
| - | - | - | - | - |
| next 14.2.35 | high | DoS / RSC deserialization / smuggling | Fix only in 15+/16+ (breaking) | On 14.2.35 — last v14, contains hotfixes. We don't expose `remotePatterns` (no remote images). We don't use rewrites. |
| next-intl 3.26.5 | moderate | open-redirect, prototype pollution | Fix only in 4.x (breaking config) | Our middleware sanitizes `lang` to `[a-z]{1,4}` everywhere it touches a redirect. We don't use `experimental.messages.precompile`. |
| postcss (dev-only) | moderate | XSS via Unescaped `</style>` | Build-tool, not runtime exposed | N/A — postcss runs only at build time inside Vercel's sandbox; output is static CSS. |

Next 15/16 upgrade is the right next move once the site is stable on
production and you have time for a Next migration smoke test.

## What we proactively removed

- `nodemailer` dependency (high severity; was only used by deleted
  `/event` payment flow → fully dead).
- `src/utils/sendPaymentEmail.ts`, `sendPayment.ts`, `sendEmailData.ts` —
  dead code tied to the removed event registration.

## Re-running the audit

```bash
npm audit --omit=dev
npm audit fix     # safe patches only
```

For the full surface inventory, run:

```bash
# 1. Confirm every admin route is gated
for f in $(find src/app/api/admin -name route.ts); do
  grep -q "isAdmin()" "$f" || echo "MISSING: $f"
done

# 2. Confirm rate limits on every public POST
grep -rln "rateLimited\|isAdmin" src/app/api/ | sort
```
