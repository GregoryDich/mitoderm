# Mitoderm — operations runbook

A single reference for the moments that aren't routine: a token
expires, a deploy goes red, an uptime alert fires, a lead lands during
the night. Each section is owner-actionable and points at the relevant
code path so future operators can find their way without spelunking.

---

## Environment variables (production)

| Var | Required | What happens without it |
| - | - | - |
| `ADMIN_PASSWORD` | yes | Admin login + HMAC cookie derivation breaks — `/admin/*` returns 500. |
| `NEXT_PUBLIC_GOOGLE_ID` | recommended | GA never loads; site works otherwise. After consent it's still inert if missing. |
| `RESEND_API_KEY` + `LEADS_FROM_EMAIL` | recommended | Auto-reply to visitors silently skipped. Internal lead log still works. |
| `LEADS_TO_EMAIL` | recommended | Internal notifications via Resend skipped. |
| `LEADS_WEBHOOK_URL` (+ `LEADS_WEBHOOK_SECRET`) | optional | Outbound CRM fan-out skipped. |
| `GITHUB_TOKEN` + `GITHUB_OWNER` + `GITHUB_REPO` + `GITHUB_BRANCH` | recommended | `/admin` writes don't mirror to GitHub; `data/*.json` lives only on Vercel's ephemeral FS until the next cold start, then disappears. |
| `SOCIAL_INGEST_TOKEN` + `SOCIAL_INGEST_SECRET` | required if using n8n | n8n → `/api/integrations/social/ingest` won't authenticate. |
| `SENTRY_DSN` | optional | Errors only show in Vercel logs, not in a dashboard. |

## Uptime monitoring

The site exposes `GET /api/health` (unauthenticated, no cache):

```json
{ "status": "ok", "service": "mitoderm", "commit": "abc1234",
  "env": "production", "ts": "2026-06-22T10:00:00.000Z" }
```

Wire an external pinger so we hear about an outage before clients
do.

### Recommended: UptimeRobot (free, 5-minute interval)

1. Sign up at <https://uptimerobot.com>.
2. **Add new monitor** → type `HTTP(s)`, URL
   `https://exoskin.co.il/api/health`, interval `5 minutes`.
3. Under **Alert Contacts**: add the on-call email or Telegram bot.
4. (Optional) add a keyword check: alert if response body does not
   contain `"status":"ok"`.

That's it — no code on our side. If `/api/health` returns non-200 or
the keyword vanishes, you get a ping within ~5 minutes.

### Alternatives (no preference)

- **Better Stack** (formerly Better Uptime) — nicer status pages,
  paid for status-page customisation.
- **Vercel cron** — possible but circular: if Vercel is down the cron
  can't tell us.

## Data persistence: leads + audit log

The site writes two JSON sinks under `data/`:

- `data/leads.json` — every lead from `/api/leads`. Schema in
  `src/lib/leads-store.ts`.
- `data/audit.jsonl` — admin writes (one JSON object per line).
  Helper in `src/lib/audit-log.ts`.

On Vercel these live on an **ephemeral filesystem** — they survive
warm-instance reuse but vanish on cold start. The `admin-store.ts`
adapter therefore mirrors changes to the GitHub repo via the Contents
API when `GITHUB_TOKEN` is set.

### If `GITHUB_TOKEN` expires or is revoked

Symptoms: admin writes succeed on the page but disappear after a
deploy / cold start. The `[admin-store] github write failed …` line
appears in Vercel logs.

Fix:

1. Create a new fine-grained PAT in GitHub → Settings → Developer
   settings → Personal access tokens, with **Contents: read & write**
   on the `mitoderm` repository.
2. Update the Vercel project env var `GITHUB_TOKEN`. Redeploy or wait
   for the next deploy.
3. Verify with a small admin edit + checking that the
   `data/leads.json` commit lands on the target branch.

### Backups

The GitHub repo is the backup. To pull a manual snapshot:

```bash
git fetch origin
git show origin/main:data/leads.json > /tmp/leads-$(date +%F).json
git show origin/main:data/audit.jsonl > /tmp/audit-$(date +%F).jsonl
```

Recommend running this on the first of each month and archiving
off-platform (e.g. owner's Google Drive) so a catastrophic GitHub
incident doesn't take the lead history with it.

## On-call quick list

- Lead form returns 5xx → check `/api/leads` runtime log on Vercel.
  Spam-guard returns silent 200, so a real visitor would only see 5xx
  if the persistence layer threw.
- Cookie banner stuck on screen → user has localStorage disabled
  (Safari private mode). Expected behaviour, no action.
- Sudden burst of leads with identical content → likely a scraper.
  Rate-limit will drop them after the 5th in a minute; if it persists,
  add the IP to a denylist in middleware.
- Hebrew page renders LTR → `dir="rtl"` on `<body>` is set in
  `src/app/[lang]/layout.tsx`. Confirm the locale-routing middleware
  isn't redirecting to `en`.

## Where things live (cheat sheet)

| Concern | File |
| - | - |
| Lead persistence | `src/lib/leads-store.ts` |
| Auto-reply mailer | `src/lib/leads-mailer.ts` |
| Spam guard | `src/lib/spam-guard.ts` |
| Rate limit | `src/lib/rate-limit.ts` |
| Admin auth | `src/lib/admin-auth.ts` |
| GitHub-backed admin store | `src/lib/admin-store.ts` |
| Error reporter | `src/lib/report-error.ts` |
| Public health probe | `src/app/api/health/route.ts` |
| Cookie consent | `src/components/Consent/ConsentProvider.tsx` + `CookieConsent.tsx` |
| Analytics gate | `src/components/Analytics/ConsentedAnalytics.tsx` |
| UTM capture | `src/components/Analytics/UtmCapture.tsx` |
