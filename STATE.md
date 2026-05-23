# Mitoderm — project state & roadmap

> **Project: Mitoderm only.** Repo `gregorydich/mitoderm`, working
> directory `/home/user/mitoderm`. **Do NOT load or apply this file
> in any other project (e.g. fitscan)** — those live on separate
> branches / worktrees and must not cross-contaminate. If the current
> working directory is not `/home/user/mitoderm`, stop and read that
> project's own STATE.md.

> **Resume-on-new-session.** This is the single document that brings a
> fresh session up to speed. Read this before doing anything. Two
> companion files:
>
> - `CLAUDE.md` — durable Claude memory (skills, extraction technique).
> - `MITODERM-CYCLE-1.md` — the long-form Cycle 1 plan (50 specialists,
>   research summary, full prioritised backlog). Cross-link, don't
>   duplicate.

Last updated: **2026-05-22** (Cycle 1 closed + Cycle 2 in flight).
Branch **`claude/add-catalog-page-65V89`** @ commit **`9d23044`**.
Snapshot of the "before" state preserved as branch + tag
**`cycle-0-snapshot`** @ `96e029c`.

### Done in this push (since `d5bf194`)

**Cycle 1 A bucket — all shipped except A17 (Cloudinary, gated on
owner decision):**

- **A07** sticky mobile WhatsApp/quote bar on product pages
- **A13** `/[lang]/accessibility` route + footer link (IS 5568)
- **A16** `scripts/check-locales.mjs` + `npm run check:locales`
- **A14** A11y widget (font scale / high contrast / reduce motion /
  underline links), preference persisted in localStorage
- **A15** Design tokens consolidated → `src/styles/tokens.scss`
- **A19** Audit log of all admin writes →
  `data/audit.jsonl` + `/admin/audit` viewer
- **A18** `POST /api/admin/products/[slug]/duplicate` + Duplicate
  button in admin list
- **A02 / A03** Structural slots `clinicalResults` and `bundle`
  ("protocol kit") on `ProductContent`; render conditionally
- **A12** RTL audit — Modal switched to logical properties
- **A20** `next/image` migration for Header / Footer logo +
  LightboxGallery stage image
- Drive-by: fixed product POST category validator to accept
  current catalog categories (serum/gel/hair/mask)
- Marked `STATE.md` and `CLAUDE.md` as **Mitoderm-only** so a
  parallel fitscan worktree won't import these conventions

**Cycle 2 B bucket — shipped so far:**

- **B17** Search input on `/catalog` (filters by name + description
  + category)
- **B18** Hardened response headers via middleware — HSTS,
  X-Frame-Options, CSP, Permissions-Policy
- **B14** Logistics structural slot on `ProductContent` (region /
  lead time / notes)
- **B15** Comparison structural slot (semantic accessible table)
- **B10** `/api/leads` forwards to `LEADS_WEBHOOK_URL` (CRM
  fan-out), optional HMAC-SHA256 signature
- **B19** `POST /api/admin/leads/mirror?token=…` — leads snapshot to
  GitHub via Contents API (cron-friendly endpoint)
- **B04** `/[lang]/clinics` certified-clinic directory backed by
  doctors store + LocalBusiness JSON-LD
- **B05** `/[lang]/protocols` "Shop the protocol" landing page —
  aggregates every product's `bundle` slot into numbered protocols
- **B06** Treatment-economics structural slot (`economics`) — same
  card strip as `clinicalResults`, plus a small disclaimer line
- **B16** Print-friendly product brief at
  `/[lang]/products/[slug]/brief` — single click → browser
  Save-as-PDF, no PDF runtime dependency
- **B12** Regimen quiz at `/[lang]/regimen` — three questions
  → top-2 product recommendation with pre-filled WhatsApp inquiry
- **B07** Before/after structural slot + tap-to-compare slider
  (mouse / touch / keyboard, RTL-mirrored handle)
- **Social (new beyond B-list)** — Instagram strip on homepage,
  `/admin/social` curation with drafts queue, dedicated
  `/[lang]/seminars` page with Schema.org Event JSON-LD,
  `POST /api/integrations/social/ingest` endpoint for n8n →
  draft pipeline (Bearer + optional HMAC, dedup, heuristic kind &
  date, downloads poster from IG thumbnail to `/public/social/`).
  Setup walkthrough in `docs/n8n-instagram.md`.
- **B11-lite** Product chat on the PDP — pre-baked Q&A chips +
  free-text Jaccard match + WhatsApp escalation with the typed
  question appended. No LLM dependency.
- **B13** Heuristic lead classifier — language / intent / clinic
  size / score chip on every entry in `/admin/leads` + 🔥 Hot
  toggle

---

## 0. Quick context

Mitoderm is a B2B Israeli distributor selling clinical-grade
exosome-based skincare to **cosmetologists / aesthetic clinics**. The
brand voice is "family of cosmetologists united by science". Buyer
research lives in `MITODERM-CYCLE-1.md`.

Tri-locale Next.js 14 (App Router) site: **EN / RU / HE** with proper
RTL on Hebrew. No on-site checkout — every CTA leads to **WhatsApp /
form / phone**. Premium-dark visual system.

**Hard constraints to remember every session**:

1. **Owner is sensitive to copy edits.** Default to adding structural
   slots / schema / interaction surfaces. Don't propose rewriting
   product copy unless explicitly asked.
2. **Block reordering is welcome.** Layout changes are fair game.
3. **Site-copy editing inside admin is out of scope.** Admin manages
   data records only (catalog · family · leads).
4. **IS 5568 / WCAG 2.1 AA is mandatory** (Israeli accessibility law).
5. The brand name shift `EXOXE / EXOCELL / EXO-NAD` → `V-Tech / Exotech
   / Exosignal` is **already done in our catalog** (`src/data/products.json`).
   Legacy preserved at `src/data/products.legacy.json` and at branch
   `cycle-0-snapshot`.

---

## 1. What's built (and where to find it)

### Public site

| Surface | Files | Locales | Notes |
| - | - | - | - |
| `/` (home) | `src/components/Home/HomePage.tsx` | EN/RU/HE | Hero · stats · featured products (auto from catalog) · why · CTA. Reveal-on-scroll wrappers. |
| `/catalog` | `src/components/Catalog/Catalog.tsx` | EN/RU/HE | Filter pills (All · Serums · Masks · Gels · Hair). Glass cards with art-directed media. `aria-pressed` filters. |
| `/products/<slug>` | `src/components/Product/ProductPage.tsx` | EN/RU/HE | Hero · TrustedByStrip · Key Facts · Stat strip · sticky in-page nav · Benefits · System · Formula · Kit · Protocol · Aftercare · Safety · Gallery (Lightbox) · Indications · Related · CTA band. WhatsApp pre-filled CTA when env set, fallback to form button. |
| `/about` | `src/components/About/AboutPage.tsx` | EN/RU/HE | Mission · Science · Stats · FAQ (3 Q&A) · CTA. |
| `/form` | `src/components/Contact/ContactForm.tsx` | EN/RU/HE | Client-validated fields → `POST /api/leads`. Optional Resend email when env set. |
| `/not-found` | `src/app/[lang]/not-found.tsx` | EN | Premium-dark 404. |
| `sitemap.xml` + `robots.txt` | `src/app/sitemap.ts` + `robots.ts` | — | Dynamic, hreflang alternates incl. `x-default`, regenerates from `products.json` on each build. |

### Data layer

| Store | File | Source-of-truth | Mutated by |
| - | - | - | - |
| Products | `src/data/products.json` | yes | `/admin/products` |
| Doctors | `src/data/doctors.json` | yes | `/admin/doctors` |
| Leads | `data/leads.json` (gitignored) | yes | `/api/leads` (public), `/admin/leads` |
| Legacy products (EXOXE / EXOCELL / EXO-NAD / bio-spicules) | `src/data/products.legacy.json` | archive | not used |

### Admin (unified shell at `/admin`)

- Auth: single `ADMIN_PASSWORD` env, HMAC-signed HttpOnly cookie
  (`src/lib/admin-auth.ts`).
- Storage adapter: writes to local filesystem in dev / Docker, commits to
  GitHub Contents API when `GITHUB_TOKEN/OWNER/REPO/BRANCH` are set
  (`src/lib/admin-store.ts`). Same adapter handles JSON data and binary
  asset uploads under `public/`.
- Three sections (top-nav, active section highlighted gold):
  - **Catalog** — list + structured create / edit form with hero +
    gallery uploaders, per-locale tabs, repeatable rows for
    stats/benefits/steps/pack/keyFacts. (`/admin/products`)
  - **Family** — clinic / cosmetologist / MD directory with portrait
    upload + Published toggle. Feeds the public `TrustedByStrip`.
    (`/admin/doctors`)
  - **Leads** — CRM-lite: list newest-first, status pills
    (new/contacted/closed/archived), search, expandable detail with
    internal note, mailto / tel / WhatsApp deep-links, delete.
    (`/admin/leads`)
- Image upload pipeline: `POST /api/admin/upload` accepts JPEG / PNG /
  WebP / AVIF / SVG up to 4 MB; sanitises filename; writes to
  `public/products/<slug>/<file>` via the same dual-target adapter.

### SEO + structured data

- `Organization` + `WebSite` JSON-LD in root layout.
- `Product` + `BreadcrumbList` + `MedicalProcedure` JSON-LD on every
  product page (with `additionalProperty` for Key Facts).
- `MedicalBusiness` + `ProfessionalService` + `FAQPage` JSON-LD on
  `/about`.
- Per-route `generateMetadata` with `alternates.languages` (en / ru /
  he-IL / x-default), OpenGraph locale + alternateLocale.
- Sitemap renders 30+ URLs (5 paths × 3 locales + 5 products × 3
  locales) with `xhtml:link` alternates per URL.

### Deploy paths

Documented in `DEPLOY.md`. Three options:

1. **Vercel + GitHub-as-CMS** — set `ADMIN_PASSWORD` + `GITHUB_*` env
   vars. Admin saves commit to the repo; Vercel auto-redeploys.
2. **Docker** — `docker compose up -d --build` with `.env`. Two named
   volumes (`mitoderm-data` for catalog + doctors JSON,
   `mitoderm-leads` for leads). Survives `docker compose down`.
3. **Hybrid** — both set. Saves hit the volume immediately AND mirror
   to GitHub.

### Other admin / infra

- WhatsApp deep-link generator at `src/lib/whatsapp.ts` (per-locale
  templates). Activated by `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Lead email via Resend (optional; `RESEND_API_KEY` + `LEADS_TO_EMAIL`).
- Logo + favicon set under `public/brand/` and `public/favicon/`.
- `Reveal` IntersectionObserver wrapper for fade-up on scroll
  (respects `prefers-reduced-motion`).
- `ScrollToTop` FAB.
- `LightboxGallery` with keyboard + RTL chevron flip.
- `ProductSectionNav` sticky in-page nav with active-section tracking.

---

## 2. Commit history (chronological, this branch only)

| Commit | Headline |
| - | - |
| `f45cd06` | Add catalog page and product pages (EXOCELL Mask, EXO-NAD, bio-spicules) |
| `12abf5f` | Redesign catalog & product pages into a unified premium-dark system |
| `97d2ca2` | Wire real EXO-NAD & EXOCELL Mask product photos + gallery |
| `ad95180` | Make redesign fully RTL-safe & fluid; QA fixes; add project memory |
| `bebaa9a` | Adopt brand assets from upstream; fix home route |
| `86245db` | Build out home and contact pages in the premium-dark system |
| `1f48879` | Page UX upgrades: sticky section nav, gallery lightbox, 404, scroll-to-top, active nav |
| `0075bf4` | Related products, real /api/leads, scroll-reveal, middleware bypass |
| `b94ae65` | Add /about page (mission + science) and nav entry |
| `407e48a` | SEO pass: JSON-LD, hreflang alternates, static sitemap & robots |
| `2ca88ae` | Product Key Facts + next/image migration (AIO + LCP/CLS wins) |
| `5497d4e` | Dynamic sitemap & robots, Resend email, FAQ on /about |
| `c07eeea` | EXO-NAD: real brand copy + clinical sections (protocol, aftercare, safety) |
| `6739ec2` | Dockerize: standalone build + compose with persistent admin data |
| `62663cc` | Add /admin: catalog editor with cookie auth + GitHub-as-CMS |
| `5c8b847` | Admin: structured field editor (no more JSON textarea) |
| `eeaddcb` | Brand-voice content for Mask + Bio-Spicules; image upload in admin |
| `3c668d0` | Admin: thumbnails + structured gallery editor + drag-and-drop uploads |
| `96e029c` | Cycle 1 — state file: 50-specialist review + prioritised backlog **← `cycle-0-snapshot` tag** |
| `9c11bed` | Rebuild catalog to V-Tech / Exotech / Exosignal; CRM-in-admin (Leads) |
| `d1c2be4` | Unified admin shell + Family-of-cosmetologists section (doctors) |
| `6ec6ec7` | TrustedByStrip + MedicalProcedure / FAQ JSON-LD + WhatsApp pre-filled CTA **← HEAD** |

---

## 3. Open questions waiting on the owner

Nothing here blocks current work; ship-now items in Section 5 keep
moving without them. Order is "highest unlock value first".

1. **WhatsApp number** for `NEXT_PUBLIC_WHATSAPP_NUMBER` — flips every
   product CTA to a wa.me deep-link instantly.
2. **First 5–10 cosmetologists** for the Family of cosmetologists
   directory — feeds `/admin/doctors` and the public `TrustedByStrip`.
   Photo + name + city + Instagram + contact each.
3. **Product photos** for the 5 new SKUs — drop them in
   `public/products/<slug>/{hero,g1,g2,…}.{jpg,png}` or upload via
   `/admin/products/<slug>/edit`. Slugs: `v-tech-serum`, `v-tech-gel-mask`,
   `exotech-gel`, `exosignal-hair`, `exosignal-hair-spray`.
4. **CRM** in use — name it (HubSpot / Pipedrive / Notion /
   Make / Zapier / Bitrix) so we can webhook `/api/leads` into it.
5. **Image-store provider** for >4 MB uploads — Cloudinary or Vercel
   Blob (Mitoderm-managed account, env vars).
6. **Catalog naming finality** — V-Tech / Exotech / Exosignal vs the
   legacy line (now in `products.legacy.json`). The current build ships
   the new line; confirm we're not bringing back the old one.
7. **Resend account** for transactional email (`RESEND_API_KEY` +
   `LEADS_TO_EMAIL`). Without it, leads are persisted and shown in
   `/admin/leads` but no email is sent.

---

## 4. Architecture quick reference

```
src/
  app/
    [lang]/        ← public site, en/ru/he, RTL on he
      layout.tsx   ← Header (dynamic ssr:false) · Modal · {children} · Footer · ScrollToTop · JsonLd × 2
      page.tsx     ← Home
      catalog/     ← /catalog
      products/[slug]/  ← /products/<slug> (5 V-Tech / Exotech / Exosignal)
      about/       ← /about
      form/        ← /form
      not-found.tsx
    admin/         ← unified admin shell, EN only, robots noindex
      layout.tsx   ← AdminNav (Catalog · Family · Leads) + logout
      page.tsx     ← login OR redirect to /admin/products
      products/    ← catalog admin
      doctors/     ← family admin
      leads/       ← CRM-lite
    api/
      leads/       ← public form sink → leads-store
      admin/
        login · logout
        products · products/[slug]
        doctors · doctors/[id]
        leads · leads/[id]
        upload    ← image upload
    sitemap.ts · robots.ts
  components/      ← Layout · Home · Catalog · Product · About · Contact · Admin · Seo · Shared
  data/            ← products.json · products.legacy.json · doctors.json
  i18n/            ← routing (next-intl)
  lib/             ← admin-auth · admin-store · doctors-store · leads-store · seo · whatsapp
  middleware.ts    ← bypass /api · /admin · /_next · file-like paths; intl-redirect everything else
messages/          ← en.json · ru.json · he.json
public/            ← favicon/ · brand/ · products/<slug>/{hero,g1..g6}
DEPLOY.md          ← Vercel · Docker · Hybrid
MITODERM-CYCLE-1.md ← long-form plan (50 specialists, research)
STATE.md           ← this file
CLAUDE.md          ← durable Claude memory
```

---

## 5. Roadmap

Each item carries a priority (**A** ship this cycle / **B** next cycle /
**C** depends on owner inputs) and a `text-stable` flag — `Y` means it
does not require the owner to rewrite product copy. Effort sized
**S** (≤ 1 day), **M** (≤ 1 week), **L** (> 1 week).

### Cycle 1 — remaining (A bucket)

A07, A12, A13, A14, A15, A16, A18, A19, A20, A02, A03 — **all
shipped** in commits `e1cd447` → `124eef3`. See the "Done in this
push" list near the top.

Still open:

| # | Item | Effort | Text-stable |
| - | - | - | - |
| A17 | **Cloudinary** image adapter (env-gated) — bypasses 4 MB Next API cap for admin uploads | M | Y |

A17 is the last A-item and is gated on the owner deciding whether
to wire Cloudinary credentials (or stay on local/GitHub storage,
which works fine within 4 MB). Skipped until that choice is made.

### Cycle 2 — next sprint (B bucket)

| # | Item | Effort |
| - | - | - |
| B01 | Pro-gated wholesale portal — signup → credential verification → unlocked wholesale view + private pricing PDF |  L |
| B02 | Clinician-only logged-in zone (`/pro`) — protocol PDFs, marketing assets, reorder history | L |
| B03 | Practitioner training hub per product (video + cert + protocol PDF) — slots until content | M |
| B04 | Certified-clinic locator with `LocalBusiness` schema; sources from Family directory | M |
| B05 | "Shop the protocol" page — Serum + Gel Mask + Exotech Gel bundle, computed-at-render discount | M |
| B06 | Treatment-economics panel per product (cost-per-session, suggested charge, margin) — owner fills numbers | M |
| B07 | Real before/after gallery (IL clinics) with tap-to-compare slider + indication filters | L |
| B08 | Click-to-WhatsApp ad creative pack (3 video formats per product) | M |
| B09 | Sora-class b-roll for each hero — short looping clip, AVIF poster, behind `<video>` | L |
| B10 | `/api/leads` → CRM webhook (HubSpot / Pipedrive / Make) routing per region | M |
| B11 | AI chat-with-product advisor on each PDP — answers from product data, escalates to WhatsApp | L |
| B12 | Regimen quiz → bundle suggestion → WhatsApp prefilled inquiry | M |
| B13 | Lead-qualification classifier (lang detection, clinic-size hint) | M |
| B14 | Per-region logistics transparency block (lead time + cold chain) | S |
| B15 | Comparison block: Mitoderm vs other exosome brands — neutral facts (concentration, source, MoH status) | M |
| B16 | Auto-generated PDF download (protocol + IFU + storage) per product, per locale | M |
| B17 | Search input on `/catalog` once SKU count > 12 | S |
| B18 | CSP + HSTS + X-Frame-Options via Next middleware response headers | S |
| B19 | `data/leads.jsonl` nightly mirror commit to GitHub (cron) | S |
| B20 | Per-locale canonical lock (`he-IL` primary for the IL market) | S |

### Cycle 3 — exploratory / depends on input (C bucket)

| # | Item |
| - | - |
| C01 | Sub-brand split if both EXOXE/EXOCELL and V-Tech kept (dual taxonomy) |
| C02 | Live shopping / WhatsApp Business catalog sync |
| C03 | AR / virtual try-on (limited fit for clinicals — revisit) |
| C04 | Ambassador referral program with per-region revenue share |
| C05 | Multilingual leaflet generator (PDF on demand) |
| C06 | Loyalty / reorder discount for verified clinics |
| C07 | A/B testing harness (Vercel Edge split / PostHog) |
| C08 | Translated transcribed video captions (HE / RU) — once b-roll exists |
| C09 | Mobile app for repeat-order clinics |
| C10 | Mitoderm-branded WhatsApp template approval (24h message window) |

---

## 6. How to resume in a new session

1. Read this file from top.
2. `git fetch && git checkout claude/add-catalog-page-65V89 && git pull`.
3. `cp .env.example .env.local` and fill in **at minimum**
   `ADMIN_PASSWORD`. (`NEXT_PUBLIC_WHATSAPP_NUMBER` flips on the
   wa.me CTAs — set it if you have the number.)
4. `npm ci && npm run dev`. Open `http://localhost:3000`.
5. **Compare against the "before" state** — Vercel-deploy the
   `cycle-0-snapshot` branch (or `git checkout cycle-0-snapshot`) to
   see the previous catalog (EXOCELL / EXO-NAD / bio-spicules).
6. To continue the roadmap: pick the next item from **Section 5 →
   Cycle 1 remaining**, top-down. They're sorted by leverage. None of
   them blocks on owner input.
7. To unblock the **B-cycle** items, push the owner to answer the
   questions in Section 3.

A future session should also re-read `MITODERM-CYCLE-1.md` for the
research findings (live mitoderm.com inventory, competitor patterns,
2026 SERP trends) — they shape decisions like "video-first hero" vs
"photo-only" or "WhatsApp-first vs form-first".
