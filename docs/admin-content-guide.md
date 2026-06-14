# Admin content guide — what to load where

This is the step-by-step for filling the live site with content. Every
admin section here writes JSON files into the repo via the GitHub
Contents API (when `GITHUB_TOKEN/OWNER/REPO/BRANCH` env vars are set —
see `docs/hosting.md`). Each save triggers a Vercel rebuild within ~30
seconds.

You don't need to fill every section to ship. The site is built so that
empty slots are invisible — only what you publish surfaces.

---

## 1. `/admin/products` — Catalog

**Already seeded** with the 5 live products (V-Tech Serum, V-Tech Gel
Mask, Exotech Gel, Exosignal Hair, Exosignal Hair Spray) from the
existing mitoderm.com data: names, taglines, descriptions, ingredients,
protocol, aftercare, contraindications, plus FAQ Q&A for the AI chat
widget.

**What you should add per product** (per locale):

| Field | What | Notes |
| - | - | - |
| Hero image | 1 photo (1:1 or 4:5, transparent or solid bg) | Best dimensions: 1200×1200. Will appear on the PDP and as the catalog card. |
| Gallery | 3-6 photos | Macro + texture + applied-on-skin shots. Each ≤ 4 MB. |
| Card video | 4-10s muted loop (mp4 / webm, ≤ 12 MB) | Optional — hover-to-play on catalog cards. Own footage only. |
| Clinical results | Replace `TODO` placeholders | Numbers like "92% improvement at session 4" — replace with your real internal data. |
| Economics | Replace `TODO` placeholders | Wholesale cost / suggested charge / margin. Renders only for partner-facing pages but currently public — gate at `/pro` if you want. |
| Logistics | Add 3 rows | IL / EU / Worldwide with lead time + notes. Strong trust signal. |
| Comparison | Add 3-5 rows | "Mitoderm vs other brand" — concentration, source, MoH status. |
| Bundle | List 2-3 partner SKUs that complete a protocol | Drives the /protocols page. |
| Training | Upload protocol PDF + link to YouTube video | Shows on the PDP and in /pro portal. |
| Before/After | Pairs of jpg/png | 4:3 ratio looks best. Add indication + weeks-after caption per pair. |

---

## 2. `/admin/doctors` — Family of cosmetologists

The public `/clinics` page and the "Trusted by" rail on each PDP are
**empty until you publish here**.

Per entry:
- **Name, profession, city, area, contact** — required
- **Photo** — square, 800×800. Will appear as a circle.
- **Instagram handle** — optional, becomes a link.
- **Bio** — 1-2 sentences. Optional.
- **Is published** — tick to surface on the public site.

Aim for 10-20 entries to make the directory feel real.

---

## 3. `/admin/stories` — Brand Stories

Top of the homepage, IG-style circles. Each story has a circular cover
and an ordered set of 9:16 slides that auto-advance every 5 seconds.

Per story:
- **Title** — shown under the circle. Keep short ("V-Tech launch", "Tel-Aviv seminar").
- **Cover** — square image used inside the circle.
- **Slides** — each slide: 9:16 image, optional caption (≤ 140 chars), optional click-through link.
- **Publish / expire date** — optional. Set a publish date in the future to schedule; set an expire date to auto-archive.
- **Order** — lower numbers come first.

Recommended: keep 3-6 stories live at once.

---

## 4. `/admin/social` — Instagram strip + Seminars page

Two surfaces driven by the same store: the homepage strip and the
`/seminars` page (filtered to `kind=seminar`).

Per item:
- **URL** — public instagram.com URL (`reel/`, `p/`, `tv/`)
- **Kind** — `reel` / `post` / `seminar`
- **Poster** — 9:16 jpg/png/webp for Reels, 1:1 for posts. Take a clean
  frame from the Reel.
- **Caption** — short line shown under the card. ≤ 140 chars.
- **Date** — required for seminars (drives Upcoming vs Past split).
- **Published** — tick when ready.

### Automatic ingestion via n8n

When `SOCIAL_INGEST_TOKEN` is set in env, n8n can POST new Reels to
`/api/integrations/social/ingest`. They land as **drafts** — owner
reviews and publishes. See `docs/n8n-instagram.md`.

---

## 5. `/admin/press` — "As seen at" strip

Each entry needs a **transparent PNG or SVG** logo. The strip applies
`filter: brightness(0) invert(1)` so dark logos render white on the
dark background.

Seeded with three placeholder entries (IMCAS / AMWC / KS Aesthetics) —
they're **not published**. Edit each one, upload the real logo, tick
"Published", save.

Other ideas:
- Allergan / Galderma / Merz partnerships
- Aestheticon, CEEAM, IADM conferences
- Vogue / Tatler / local publication coverage

---

## 6. `/admin/leads` — Inbound enquiries

You don't load anything here — the public `/form` + WhatsApp CTAs fill
it. What's worth doing:

- Filter by status to triage **new** leads daily.
- The 🔥 **Hot** toggle filters to `score ≥ 70` (computed by the lead
  classifier).
- Click a row to expand: set status, add an internal note, open
  WhatsApp / call / email directly.

Optional: set `LEADS_WEBHOOK_URL` in env to forward each new lead to
your CRM via JSON POST. See `.env.example`.

---

## 7. `/admin/applications` — Partner clinic onboarding

Each application from `/[lang]/apply` lands here as **pending**. The
review flow:

1. Open the row → read message + Instagram + license.
2. **Approve** → the row turns green and a magic-link login URL appears
   in the "Magic-link login" panel.
3. **Copy** the URL → paste into WhatsApp / email to the clinic.
4. The clinic clicks once → cookie set for 90 days → access to `/pro`.

**Regen token** invalidates the old magic-link without touching
approval status. Useful if a clinic reports their link was forwarded.

---

## 8. `/admin/audit` — Audit log

Read-only. Every admin write lands here with timestamp, IP, action,
target. Use it to:
- Verify a save worked.
- Audit who changed what (in a multi-admin future).
- Debug n8n ingest activity (`action: social.create, via: ingest`).

Lives at `data/audit.jsonl` — gitignored, not mirrored to the repo.

---

## 9. `/admin/products/<slug>/edit` — per-product structural slots

All optional slots below render only when you fill them — empty stays
invisible. The site already has the JSON skeleton for each.

- **keyFacts** — 3-5 declarative bullets, AI-Overview-friendly.
- **clinicalResults** — numbers strip (value + label + source).
- **economics** — wholesale cost / patient charge / margin strip +
  disclaimer.
- **logistics** — region / lead time / notes (IL / EU / Worldwide).
- **comparison** — neutral comparison table. First column = "us".
- **beforeAfter** — pairs of jpg/png with indication + weeks-after.
- **training** — videos (YouTube URL) + protocol PDFs + certs.
- **faq** — Q&A for the AI product chat (already seeded with 4-5 per
  product; edit / extend as needed).
- **bundle** — link to 2-3 partner products that complete a protocol;
  drives the `/protocols` page.

---

## What to do tomorrow morning (~30 min)

1. Open `/admin/doctors`, add 5 real clinics with photos. Publish.
2. Open `/admin/products/v-tech-serum/edit`, upload the hero photo +
   3 gallery photos. Replace the `TODO` rows in clinicalResults and
   economics with your real numbers.
3. Open `/admin/press`, edit each of the 3 seeded entries — upload the
   real logo, tick Published.
4. Open `/admin/stories`, create one story called "V-Tech launch" with
   3 slides (cover + 3 product photos).
5. Set up Vercel (see `docs/hosting.md`).

That's enough for a believable v1. Everything else is incremental.
