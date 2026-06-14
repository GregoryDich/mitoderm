# Hosting & previews — Mitoderm

This guide answers two adjacent questions:

1. **Where to host the production site?** (recommendation + reasoning)
2. **How do I test branch work without breaking production?** (preview
   environments)

Short answer up front: **Vercel Hobby + GitHub repo**. Free, doesn't
pause, every push to a branch gets its own URL automatically, custom
domain is free, SSL is automatic. Setup takes ~10 minutes one-time.

---

## Why Vercel (and not the alternatives)

Mitoderm is a Next.js 14 App Router app with:

- Server components + edge runtime (for OG images)
- File-based JSON stores (admin writes commit to GitHub in prod)
- Image uploads stored in `/public` (also via GitHub Contents API)
- **No traditional database**

| Host | Free tier | Pauses? | Custom domain | Next.js fit |
| - | - | - | - | - |
| **Vercel** | Hobby (100GB/mo) | **no** | free + SSL | **native** (made by them) |
| Cloudflare Pages | very generous | no | free + SSL | good (edge runtime) |
| Netlify | 100GB/mo | no | free + SSL | good but lags on App Router |
| Render | free web service | **sleeps 15min** | free + SSL | works, cold-start ~30s |
| Fly.io | 3 small VMs free | sleeps unless paid | free + SSL | manual setup |
| Railway | $5/mo minimum | n/a | yes | manual setup |
| Supabase | 500MB DB, **pauses 7d** | **yes — manual resume** | n/a | not a web host (it's a DB + auth + storage backend) |

You were probably thinking of **Supabase** when you mentioned the "every
2 weeks" thing — their free Postgres pauses after 7 days of inactivity
and you have to manually wake it. **We don't need Supabase at all** —
Mitoderm has no traditional DB; all admin data lives in JSON committed
to git via the admin write pipeline.

Vercel Hobby does **not** pause your project. Your site stays up 24/7.

---

## One-time Vercel setup (~10 min)

1. Go to <https://vercel.com> → sign in with GitHub.
2. **Import** the `gregorydich/mitoderm` repo. Vercel detects Next.js
   automatically.
3. Set the environment variables in the Vercel dashboard
   (Project → Settings → Environment Variables). Copy from
   `.env.example`. The minimum to make admin work in production:

   ```
   ADMIN_PASSWORD = <long random string>
   GITHUB_TOKEN   = ghp_… (fine-grained PAT, Contents: Read+Write)
   GITHUB_OWNER   = gregorydich
   GITHUB_REPO    = mitoderm
   GITHUB_BRANCH  = main
   ```

   Optional but recommended:

   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER = 972XXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ID       = G-XXXXXXXXXX
   RESEND_API_KEY              = re_…
   LEADS_TO_EMAIL              = [email protected]
   LEADS_FROM_EMAIL            = [email protected]
   LEADS_WEBHOOK_URL           = <CRM webhook>
   LEADS_WEBHOOK_SECRET        = <random>
   SOCIAL_INGEST_TOKEN         = <random>      # for n8n → /admin/social drafts
   SOCIAL_INGEST_SECRET        = <random>
   LEADS_MIRROR_TOKEN          = <random>      # for nightly leads mirror
   ```

4. **Deploy.** Vercel builds the `main` branch by default — that's
   your **production** URL (`mitoderm.vercel.app`).
5. Project Settings → **Domains** → add your custom domain. Vercel
   shows you the DNS record to set at your registrar. SSL auto-issues
   from Let's Encrypt within minutes.

---

## How testing works after that

| Branch | What it becomes |
| - | - |
| `main` | Production — your custom domain |
| Any other branch (e.g. `claude/add-catalog-page-65V89`) | **Preview** — a unique URL like `mitoderm-git-claude-add-catalog-page-65v89-<your-team>.vercel.app` |

So the flow is:

1. We work on `claude/add-catalog-page-65V89` (the branch we've been
   building on). Every commit auto-builds a preview.
2. You open the preview URL, click around, share it with anyone for
   feedback. Production stays untouched.
3. When you're happy, open a Pull Request `claude/add-catalog-page-65V89
   → main`. Vercel comments on the PR with the preview URL and a
   "Promote to production" button on merge.
4. Merging the PR triggers a production build. Your custom domain now
   serves the new code.

A free domain you already own works exactly the same — point it at
Vercel's nameservers (or just an A/CNAME record) and SSL is automatic.

---

## Practical cheat sheet for this branch

The branch `claude/add-catalog-page-65V89` already contains every
feature shipped so far (catalog rebuild, admin, Stories, n8n ingest,
SEO, OG, regimen quiz, interest list, brand stories, …). To preview:

```bash
# In your local shell, after Vercel is connected to the repo:
git fetch origin
git checkout claude/add-catalog-page-65V89
git pull
# Push if you have local changes — Vercel will build the preview.

# To inspect the latest commit URL via the Vercel CLI (optional):
npx vercel login            # one-time
npx vercel ls               # list deployments
```

For the production cutover, open the PR:

```bash
# Once Vercel is connected, this is enough — Vercel detects the PR
# and posts the preview link.
# If you prefer locally:
gh pr create --base main --head claude/add-catalog-page-65V89
```

---

## Two things to know about admin in production

1. **Admin saves commit to GitHub.** Vercel's filesystem is read-only,
   so without the `GITHUB_*` env vars set, admin saves silently no-op.
   With them set, every save (product / doctor / lead status / social
   item / press item / story / etc.) becomes a commit to
   `src/data/<store>.json` on the configured branch — Vercel sees the
   commit and rebuilds. End-to-end latency for a change to appear:
   ~30 seconds.
2. **Uploads behave the same way.** Image / video uploads (`/admin →
   upload`) commit binary files under `public/...` to the repo via
   the Contents API. The 12 MB max for videos (4 MB for images) keeps
   the API responses well under Vercel's body limit.

---

## What if you want a database later

If at some point you outgrow the JSON-in-git pattern (e.g. you start
collecting hundreds of leads/day and the JSON file grows large), the
clean migration path is:

- Keep Vercel as the web host.
- Add **Vercel Postgres** (free tier covers small workloads) or
  **Neon** (Postgres, free tier doesn't pause aggressively) or
  **Supabase Postgres** (you'd want the $25/mo Pro tier to avoid
  the 7-day pause).
- Migrate `src/lib/leads-store.ts` (and similar) to a tiny DB adapter
  behind the same interface — no UI changes needed.

But: nothing forces you to do this. The current pattern can comfortably
handle thousands of leads + many product / story / press records.
