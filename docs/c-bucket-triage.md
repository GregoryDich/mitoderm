# Cycle 3 (C-bucket) — what's shippable, what blocks, what dies

This is a triage of the exploratory C-bucket from `STATE.md` after Cycles 1
and 2 closed. The goal: tell the owner exactly what each item needs
before any more code is worth writing.

| # | Item | Status | Blocker |
| - | - | - | - |
| **C01** | Sub-brand split (EXOXE/EXOCELL alongside V-Tech) | **Park** | Owner has moved to V-Tech naming — sub-brand legacy already lives at `cycle-0-snapshot`. Revisit only if both lines are sold simultaneously. |
| **C02** | WhatsApp Business catalog sync | **Blocked: external** | Requires a Meta Business catalog approval (manual review) and template message approval. We can wire the API once the owner has the catalog id + access token. |
| **C03** | AR / virtual try-on | **Drop** | Poor fit for clinical exosome treatments — there's nothing to "try on". Revisit only if Mitoderm ever ships a consumer-line. |
| **C04** | Ambassador referral program with revenue share | **Half-shippable** | Need a business rule: % share, payout cadence, payout currency, who counts as referred (form submit? approved /pro account?). The data layer + admin slot is small once those are decided. |
| **C05** | Multilingual leaflet generator (PDF on demand) | **Shipped (B16-style)** | `/[lang]/products/[slug]/brief` is the leaflet — print-to-PDF via the browser. No extra runtime PDF dep. Extend with wholesale info gated by `/pro` if needed. |
| **C06** | Loyalty / reorder discount for verified clinics | **Half-shippable** | Same dependency as C04 — needs the business rule (% off after Nth order, decay, etc.). Once decided, it's a small admin slot on `/admin/applications` per clinic. |
| **C07** | A/B testing harness (Edge split) | **Shipped** | `src/lib/experiments.ts` + middleware cookie. No active experiments declared yet — owner can add one to the `EXPERIMENTS` array. |
| **C08** | Translated transcribed video captions (HE / RU) | **Blocked: content** | Owner needs to ship the b-roll first. Once there's a video, Whisper transcription + DeepL/Anthropic translation is a 30-line script. |
| **C09** | Mobile app for repeat-order clinics | **Out of scope** | The `/pro` portal solves the same job and runs as a PWA on mobile. Native app revisit only if there's a documented engagement bottleneck. |
| **C10** | WhatsApp template approval (24h message window) | **Blocked: external** | Mitoderm Business needs to submit utility templates through Meta. Once approved we can issue them from the lead webhook. |

## TL;DR for the owner

- Three items are **shipped** outright: C05 (already covered by the
  printable brief in B16) and C07 (just landed). Plus C03/C09 are
  documented out-of-scope.
- Four items are **blocked on external approval** (C02, C08, C10) or
  **on a business rule** (C04, C06). Each unblocks in a few lines of
  code the moment the owner makes the call.
- C01 is parked behind the `cycle-0-snapshot` branch — revivable if you
  ever decide to dual-list.

## What's worth working on instead, right now

Once Cycles 1+2 are deployed to Vercel and a real preview URL exists,
the next high-leverage tasks are content-driven, not code-driven:

1. **Photograph the products** + upload poster + (optional) 4–10s
   loop video → `/admin/products/<slug>/edit`.
2. **Seed the doctors directory** (`/admin/doctors`) — the public
   `/clinics` page and the "Trusted by" rail are gated on this data.
3. **Approve 2–3 real clinic applications** at `/admin/applications`
   so the `/pro` portal has a live test path.
4. **Wire n8n → /api/integrations/social/ingest** so new Reels arrive
   as drafts in `/admin/social`.
5. **Decide a single A/B test** (e.g. hero CTA copy) and seed it in
   `EXPERIMENTS`.

Code keeps moving forward only against blockers that get unblocked.
The site itself is ready.
