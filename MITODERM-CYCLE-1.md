# Mitoderm — Cycle 1 (state file)

> Internal planning document. Captures the multi-disciplinary review of the
> current site against the live Mitoderm public presence, competitor
> patterns and 2026 trends, plus a prioritised improvement backlog. Owner
> edits to copy are kept minimal by design (the owner prefers reordering
> blocks over rewriting text); every Cycle-1 item is tagged with
> `text-stable: yes/no` so the painful-edit items can be deferred.

Updated 2026-05-22 · Branch `claude/add-catalog-page-65V89`.

---

## 0. Context we are designing against

- **Audience** — Israeli professional cosmetologists / aesthetic clinicians
  (B2B). Hebrew first, Russian large minority, English for global / science.
  80% women, 20% men. They are the "family of cosmetologists united by
  science" the brand wants to gather.
- **Buying motion** — distributor → clinic. No on-site checkout. CTA is
  "request price / book consult". WhatsApp is dominant in IL.
- **Brand voice** — premium clinical, science-led, not pharmacy-discount.
  Trust and credentials > flashy.
- **Owner constraint** — sensitive to copy edits, comfortable with
  block reordering. Every UI we add should let the structure evolve
  without forcing him to touch text. Admin already gives drag/upload;
  Cycle 1 deepens this.
- **Legal baseline** — IS 5568 / WCAG 2.1 AA required by IL accessibility
  law. Non-compliance is a litigation risk, not a "nice to have".

---

## 1. Brand & competitor intel (research summary)

### Mitoderm's actual public presence (2026)

- `mitoderm.com` (EN) and `mitoderm.co.il` (HE) — same B2B brand site.
- **Current SKUs on the live site**:
  - **V-Tech Serum** (synthetic exosomes + 2% PDRN + biomimetic peptides
    + plant stem cells, 5 ml)
  - **V-Tech Gel Mask** (low-MW polynucleotides + peptides + snail mucin
    + HA, 5 ml — paired with V-Tech Serum as a "1+1=3" protocol)
  - **Exotech Gel** (actives encapsulated in synthetic exosomes)
  - **Exosignal Hair** (professional ampoules)
  - **Exosignal Hair Spray** (home maintenance)
- **Branding shift flagged**: the legacy `EXOXE` / `EXOCELL Mask` /
  `EXO-NAD` names — which the current catalog (`src/data/products.json`)
  still uses — do **not** appear on the live mitoderm.com lineup. They
  may be retired, renamed, or moved to a sub-brand. **Open question for
  owner**: confirm canonical naming before the public launch.
- B2B-only positioning ("Only for professional usage"), certified-clinic
  directory, training-program funnel, WhatsApp deep-link with pre-filled
  message.

### Twelve patterns to steal from premium / clinical PDPs

(Sephora, Sulwhasoo, SkinCeuticals, Goldapple, Rive Gauche, ZO Skin,
Dermalogica Pro, Charlotte Tilbury, Fenty, L'Oréal, Julia Armind, plus
2026 generic trends.)

1. **Sticky video hero** in the product carousel (looping protocol /
   application clip as slide 1; product 360 as slide 2). Video lifts
   conversion 8–14 % over photo-only.
2. **Clinical Results module** — "X% agreed in N-day study on M
   participants" with study disclosure (SkinCeuticals / Sulwhasoo
   format).
3. **Key ingredients legend with tooltips** — each hero actant
   (PDRN, biomimetic peptide, synthetic exosome, NAD+) with one-line
   mechanism, icon, optional 3D molecule.
4. **"Shop the Protocol" bundle** — Serum + Gel Mask + Exotech Gel as
   a discounted session kit; mirrors Mitoderm's "1+1=3" message.
   AOV lift 10–18 %.
5. **Before/after as a first-class PDP section** — filterable by
   indication (face / hair / scar / pigmentation), tap-to-compare slider.
6. **Pro-gated wholesale catalogue with tiered MOQ + net-30/60** —
   replaces "Contact for price" friction with a real portal.
7. **Practitioner training hub** — "Get certified to use this" CTA,
   video modules, downloadable protocol PDF, certificate.
8. **Certified-clinic locator** — surfaced from every PDP ("find a
   clinic near you that runs this protocol") to drive B2C demand into
   B2B partners.
9. **WhatsApp-first conversational commerce in Hebrew** — pre-filled
   templates per product, automated abandoned-inquiry recovery, optional
   AI advisor.
10. **AI chat-with-product advisor** — Fenty / L'Oréal model: answers
    ingredient, contraindication, protocol questions and logs leads.
11. **IS 5568 / WCAG 2.1 AA compliance baseline** — statement page,
    widget, keyboard nav, RTL focus rings, alt text. Mandatory in IL.
12. **Structured PDP data for AI-Overview citation** — `Product` +
    `MedicalProcedure` + `FAQ` schema, ingredient JSON-LD, transcribed
    video captions, so ChatGPT/Perplexity cite Mitoderm.

### 2026 macro trends that bear on us

- Video-first PDPs; Sora-class generated b-roll replacing stock.
- Quiz → built-regimen bundles (AOV + retention lift).
- WhatsApp commerce dominant in IL (45–60 % conversion in beauty).
- Generative AI on-page + AI-Overview citation (66 % of consumers will
  complete a purchase inside chat).
- Practitioner / wholesale portals are table stakes for clinical brands.
- Israeli accessibility law tightening, fines real.

---

## 2. Audience — 8 archetypes from a 25-cosmetologist simulation

Each carries the same family-of-cosmetologists framing, but different
questions / friction / tippers.

1. **TLV Solo Boutique Owner** — exclusivity + named-TLV-derm proof.
2. **Russian-speaking Haifa Veteran** — RU protocol PDF + RU peer group.
3. **Herzliya Medspa Manager (non-owner)** — building a procurement case
   for the dermatologist-owner; needs margin maths and case study.
4. **Jerusalem Conservative Clinician** — modest imagery + non-invasive +
   phone-friendly inquiry.
5. **Be'er Sheva / Periphery Newcomer** — affordable starter kit +
   ready-to-post social assets.
6. **Male Aesthetic-Med Doctor (Ra'anana / Netanya)** — peer-reviewed
   science, IFU, adverse-event data.
7. **Eilat Resort-Spa Lead** — multilingual leaflets, heat-stable
   logistics, periphery delivery.
8. **Skeptical Switcher** — head-to-head differentiation vs the exosome
   brand they currently use; account-manager responsiveness.

### Top-15 jobs the site must do for this audience

1. Make Hebrew the default, RTL flawless; RU and EN as equal peers.
2. Show the family of cosmetologists — real Israeli faces, named
   clinics, city tags.
3. Prove the science once, prominently — mechanism, source, one
   peer-reviewed citation per hero product.
4. Replace "Contact for price" dead-ends with a fast WhatsApp-first
   inquiry path.
5. Show a credible IL dermatologist / MD endorsement above the fold on
   product pages.
6. Give each product a downloadable clinician PDF (protocol, IFU,
   storage) in HE / RU / EN.
7. Publish per-treatment economics — cost-per-session and a suggested
   clinic price band.
8. Make "starter kit" obvious for new / small clinics; reduce MOQ
   anxiety.
9. Show real before/afters from Israeli clinics, not vendor stock.
10. Build the site in stable copy blocks the owner can reorder without
    breaking layout or i18n.
11. Surface training and onboarding as a product, not a footnote.
12. Add a clinician-only logged-in zone for protocols, marketing assets,
    reorder history.
13. Logistics transparency — lead time, cold chain, periphery delivery
    (Eilat, Negev, North).
14. Differentiate clearly from other exosome brands — one comparison
    block, not vague superlatives.
15. Community proof — visible roster, WhatsApp / Telegram clinician
    group, named ambassadors per region.

---

## 3. The Fifty — multi-disciplinary review

Ten disciplines × five specialist lenses per discipline. Each
specialist's lens is summarised in one line + their #1 recommendation
for Mitoderm. The 50 hero recommendations feed Section 4.

> Convention: `[N] Lens — top recommendation`. Sources of style /
> influence are named where they sharpened the recommendation.

### A. Business strategy / B2B distribution
- **A1 — Distribution-channel strategist (ZO Skin, Galderma school)** —
  Build a tiered wholesale portal with MOQ + net-30 to replace
  "contact for price" friction.
- **A2 — Clinic-economics consultant** — Publish a per-product
  "treatment economics" panel (cost-per-session, suggested charge,
  estimated margin) so buyers can build the procurement case in a
  minute.
- **A3 — Partner-program lead (Aesthetic franchise networks)** —
  Visible regional ambassador roster (5–10 named clinicians per
  region) to seed peer proof.
- **A4 — Pricing strategist** — Replace opaque pricing with a private
  pricing PDF unlocked on credential verification — keeps exclusivity,
  removes ping-pong.
- **A5 — Geographic-coverage planner** — Logistics transparency block:
  lead time per region (TLV / Haifa / Jerusalem / Negev / Eilat) +
  cold-chain note.

### B. Brand marketing
- **B1 — Premium-clinical brand strategist (Sulwhasoo school)** — Anchor
  the brand on a single, repeatable hero proof point ("Synthetic
  exosomes + PDRN + biomimetic peptides — clinically demonstrated").
- **B2 — Community-marketing lead** — "Family of cosmetologists" page:
  visible roster, named ambassadors, member badges; converts the
  framing from slogan to artefact.
- **B3 — Editorial / luxury storytelling (Dolce, Gucci Beauty)** —
  Long-form Story block per product (problem → mechanism → result)
  with cinematographic photo or Sora b-roll.
- **B4 — Visual-identity director** — Promote a single signature motif
  (the diamond + DNA-helix lockup) across hero, favicon, social cards;
  stop competing motifs.
- **B5 — Trust / credentials lead** — Above-the-fold "as used by"
  strip with 3–5 named IL dermatologists / MDs + their photo.

### C. Performance marketing (paid + SEO)
- **C1 — SEO lead** — Per-product `Product` + `MedicalProcedure` +
  `FAQPage` structured data, HE-first; lock canonical to `/he/...`
  for the IL market.
- **C2 — Paid social strategist (Meta / TikTok)** — Build a Click-to-
  WhatsApp ad funnel per product (already the dominant IL acquisition
  motion in beauty).
- **C3 — Local SEO** — Embed the certified-clinic locator with `LocalBusiness`
  schema per clinic; rank for "exosome treatment near me" in HE.
- **C4 — Content marketing** — A small "Science" hub (4–6 evergreen
  articles: what are exosomes, NAD+ basics, post-laser protocols,
  contraindications) — feeds AI-Overview citation.
- **C5 — Email / lifecycle** — Resend pipeline once leads land in
  `/api/leads`: 3-touch nurture (welcome → protocol PDF → ambassador
  case study) in HE / RU.

### D. Content & copywriting (text-stable lens)
> The owner is sensitive to copy edits. These items add structural
> placeholders without rewriting prose.
- **D1 — Editor-in-chief** — Author one master "scientific abstract"
  per product once; lock it; every other surface reuses it.
- **D2 — UX writer** — Replace the "Contact for Price" microcopy with
  the WhatsApp-first inquiry CTA — one string swap, three locales.
- **D3 — Translator-coordinator** — Add a single source of truth
  (`src/data/products.json`) + machine-validated parity across en / ru /
  he so the owner edits in one place.
- **D4 — Information architect** — Add structural slots
  (`clinicalResults`, `ingredientsLegend`, `bundle`) that render only
  when filled — no edits forced today.
- **D5 — Legal copy** — Boilerplate disclaimer & professional-use
  notice block per product (write once, render everywhere).

### E. Conversion-rate optimisation
- **E1 — Funnel analyst** — Replace dead-end "Contact for price" with
  a 2-field WhatsApp template (clinic + city) + an inline lead form.
- **E2 — A/B test designer** — Test "video-first hero" vs "photo hero"
  on product pages.
- **E3 — Heatmap / scroll analyst** — Add scroll-depth events to GA
  to measure where the buyer drops off in long product pages.
- **E4 — Sticky-CTA designer** — Sticky "Request quote" bar on mobile
  PDP scroll (the dominant clinic browsing device).
- **E5 — Form designer** — Add country/clinic-name autocomplete to
  the contact form so qualified leads are easier to score.

### F. UX / UI design
- **F1 — Information-design lead (Goldapple)** — Pre-define an ordered
  block library (Hero / Key Facts / Stats / Benefits / Protocol / Kit
  / Application / Aftercare / Safety / Gallery / Reviews / Related /
  CTA / FAQ) so the owner can re-order, hide and show without breaking
  layout.
- **F2 — Premium-luxe designer (Charlotte Tilbury / Gucci)** — Add a
  single full-bleed cinematic frame per product page (hero or section
  break) — generated via Sora and finished in Figma.
- **F3 — Interaction designer** — Animate section reveal on scroll
  (already in place); add a sticky in-page nav (already in place);
  next: per-section anchor share links.
- **F4 — RTL specialist** — Audit every directional glyph and chevron;
  the existing `.arrow` flip helper is correct; extend to gallery
  next/prev buttons and form arrows.
- **F5 — Accessibility specialist** — IS 5568 / WCAG 2.1 AA pass:
  statement page, accessibility widget, focus-visible rings, contrast
  audit.

### G. Frontend engineering
- **G1 — Next.js architect** — Standardise on Server Components +
  Client islands; the current split is correct, keep it.
- **G2 — Performance engineer** — Verify INP < 200 ms on mobile; the
  in-page sticky nav and lightbox are the riskiest interaction
  surfaces; defer non-critical IO until idle.
- **G3 — Design-systems lead** — Extract the premium-dark token set
  into a CSS variable file; today every component re-declares the
  palette.
- **G4 — i18n engineer** — Add an automated parity check that fails
  CI when a string is missing in `ru.json` or `he.json`.
- **G5 — Animation engineer** — Add the cinematic full-bleed video
  hero block (lazy-loaded, AVIF poster, `<video>` with `playsInline
  autoPlay muted loop`) gated behind `prefers-reduced-motion`.

### H. Backend engineering
- **H1 — API designer** — Add `POST /api/admin/products/[slug]/duplicate`
  so an operator can clone V-Tech Serum and tweak two fields for a new
  variant.
- **H2 — Storage engineer** — The dual local / GitHub storage adapter
  is solid; add a third adapter for Cloudinary (image-only) so large
  uploads bypass the 4 MB API limit.
- **H3 — Lead-routing engineer** — Extend `/api/leads` with a
  Resend → CRM webhook (HubSpot / Pipedrive / Make) so leads land in
  the sales tool, not just a JSONL.
- **H4 — Search engineer** — Add a tiny `/api/search` (lunr / minisearch)
  for the catalog once it crosses 12 products — needed once V-Tech /
  Exosignal join the page.
- **H5 — Auditability engineer** — Log every admin write
  (`who / when / slug`) to the same JSONL the leads go to; doubles as
  an audit trail when changes go via GitHub.

### I. DevOps / architecture
- **I1 — Deploy strategist** — Two parallel paths supported (Vercel
  with GitHub-as-CMS, Docker with volume); recommend Vercel for the
  marketing site + GitHub commits, Docker only for self-hosted Coolify.
- **I2 — Image-pipeline engineer** — Migrate large uploads to
  Cloudinary or Vercel Blob (the in-image-upload route currently has a
  4 MB API cap).
- **I3 — Observability engineer** — Add Vercel Web Analytics +
  Speed Insights + Sentry; the marketing CRO loop needs real numbers.
- **I4 — Security engineer** — Add CSP, X-Frame-Options, HSTS via Next
  middleware response headers; admin endpoints already cookie-gated.
- **I5 — Backup engineer** — `data/leads.jsonl` and
  `src/data/products.json` are the two state surfaces; add a nightly
  GitHub commit of `data/leads.jsonl` so leads survive a container
  reset.

### J. AI & personalisation
- **J1 — AI-Overview optimiser** — Already in flight (JSON-LD +
  Key Facts + declarative section leads); next add `FAQ` JSON-LD on
  `/about` and per-product transcribed video captions.
- **J2 — Chat-with-product advisor** — A small client-side chat
  widget on each PDP backed by an LLM that answers from the product's
  own data (ingredients, contraindications, protocol).
- **J3 — Regimen builder** — A 4-question quiz → a bundle suggestion
  → a WhatsApp-prefilled cart.
- **J4 — Personalisation engineer** — Detect locale + region (IL vs
  ROW) and prioritise regional ambassador / clinic locator content.
- **J5 — Lead-qualification AI** — On the lead form, classify the
  inbound (clinic size, intent, language) and route to the right
  account manager.

---

## 4. Cycle 1 — prioritised improvement list (50 items, AZ bucketed)

> **A** — ship in this cycle (~2 weeks).
> **B** — next cycle (~4 weeks).
> **C** — exploratory / dependent on owner decisions.

> Effort: S ≤ 1 day · M ≤ 1 week · L > 1 week.
> Text-stable: `Y` means it adds structure without forcing copy edits.

### Bucket A — ship now

| # | Item | Discipline | Effort | Text-stable |
| - | - | - | - | - |
| A01 | Resolve the **EXOXE/EXOCELL/EXO-NAD vs V-Tech/Exosignal** naming question with the owner before the catalog goes live | Brand | S | open-Q |
| A02 | Add `clinicalResults` block (structural; empty until owner fills it) to `ProductContent` and render only when present | UX + IA | S | Y |
| A03 | Add `bundle` ("Shop the protocol") block, render only when present; supports the V-Tech "1+1=3" framing | UX + Biz | M | Y |
| A04 | Add a **"Trusted by" strip** (5 named clinicians, photos, optional clinic) to the product page hero — content slot, no copy rewrite | Brand + UX | S | Y |
| A05 | Replace "Contact for Price" CTA microcopy with WhatsApp-first inquiry; preserve fallback contact form | CRO | S | one-string-swap × 3 |
| A06 | WhatsApp pre-filled template per product (`?text=…`) embedded in the WhatsApp CTA | Perf-marketing | S | Y |
| A07 | Sticky mobile "Request quote" bar on product pages | CRO | S | Y |
| A08 | Add `FAQ` JSON-LD to `/about` (the FAQ block is already there; just wrap with schema) | SEO / AI | S | Y |
| A09 | Add `MedicalProcedure` JSON-LD beside `Product` on every product page | SEO / AI | S | Y |
| A10 | Add Vercel Web Analytics + Speed Insights + Sentry env wiring (off by default; env-gated) | DevOps | S | Y |
| A11 | Lead form → Resend pipeline already in place; add a small in-thread auto-reply that thanks the lead in their detected locale | Lifecycle | S | Y |
| A12 | Audit RTL for every directional glyph in gallery, sticky nav, lightbox; extend `.arrow` helper coverage | UX | S | Y |
| A13 | Accessibility statement page (`/accessibility`) + visible link from footer (IS 5568 mandatory in IL) | A11y / Legal | S | one new page |
| A14 | Add a small **Accessibility widget** (font scale + contrast toggle) gated behind a floating button (IS 5568) | A11y | M | Y |
| A15 | Move `--colorGold`, `--colorTeal`, `--bg`, `--txt`, `--glass*` to a single `src/styles/tokens.scss` and have every module import — kills palette drift | Design-system | M | Y |
| A16 | Locale-parity CI check — fail build if any key present in `en.json` is missing from `ru.json` or `he.json` | i18n | S | Y |
| A17 | Replace gallery 4 MB upload limit with **Cloudinary** adapter (env-gated); falls back to the existing local / GitHub paths if env not set | Storage | M | Y |
| A18 | `POST /api/admin/products/[slug]/duplicate` — clone a product as a starter for variants | Admin | S | Y |
| A19 | Audit log: every admin write appended to `data/admin.jsonl` (who/when/slug/diff-summary) | Auditability | S | Y |
| A20 | Add `next/image` migration for the **footer/header logo** + the lightbox stage image (the remaining `<img>` holdouts) | Performance | S | Y |

### Bucket B — next cycle

| # | Item | Discipline | Effort | Text-stable |
| - | - | - | - | - |
| B01 | Pro-gated wholesale portal: signup → credential verification → unlocked "wholesale" view with private pricing PDF | Biz / Backend | L | Y |
| B02 | Clinician-only logged-in zone (`/pro`): protocol PDFs, marketing assets, reorder history | Backend / Brand | L | Y |
| B03 | Practitioner training hub on each PDP (video modules + cert + downloadable PDF) — empty slots until owner uploads content | UX / Brand | M | slots empty |
| B04 | Certified-clinic locator (map + filters) with `LocalBusiness` schema per entry | Local SEO / UX | M | Y |
| B05 | "Shop the protocol" page (Serum + Gel Mask + Exotech Gel bundle) with discount math computed at render time | Biz / Frontend | M | Y |
| B06 | Treatment-economics panel (cost-per-session, suggested charge, margin) per product — owner fills the numbers in admin | Biz / Frontend | M | Y |
| B07 | Real before/after gallery component (IL clinics first), with tap-to-compare slider + indication filters | UX / Frontend | L | slots empty |
| B08 | Click-to-WhatsApp ad creative pack (3 video formats per product) — owner approves, marketing runs | Perf-marketing | M | Y |
| B09 | Sora-class b-roll for each hero — short looping clip, AVIF poster, lazy-loaded behind `<video>` + `prefers-reduced-motion` | Brand / Frontend | L | Y |
| B10 | Lead-routing webhook: `/api/leads` → CRM (HubSpot / Pipedrive / Make), per-region account-manager routing | Backend | M | Y |
| B11 | AI advisor on each PDP — "ask about this product" — answers from product data + escalates to WhatsApp on confidence drop | AI | L | Y |
| B12 | Regimen quiz → bundle suggestion → WhatsApp prefilled inquiry | AI / CRO | M | Y |
| B13 | Lead-qualification classifier (lang detection, clinic-size hint) | AI | M | Y |
| B14 | Per-region logistics transparency block (lead time + cold chain) | Brand / UX | S | Y |
| B15 | Comparison block: Mitoderm vs. "other exosome brands" with neutral facts (concentration, source, IL-MoH status) | Brand | M | Y |
| B16 | Auto-generated PDF download (Protocol + IFU + storage) per product, per locale — derived from existing data | Backend / Brand | M | Y |
| B17 | Search input on `/catalog` once SKU count > 12 | Frontend | S | Y |
| B18 | CSP + HSTS + X-Frame headers via Next middleware | Security | S | Y |
| B19 | `data/leads.jsonl` nightly mirror commit to GitHub (cron in Docker / Vercel cron) | Backup | S | Y |
| B20 | Per-locale canonical lock — keep `he-IL` as the primary canonical for the IL market | SEO | S | Y |

### Bucket C — exploratory / depends on owner input

| # | Item | Discipline | Effort | Text-stable |
| - | - | - | - | - |
| C01 | Sub-brand split if EXOXE/EXOCELL are kept (V-Tech + legacy line, dual taxonomy) | Brand / IA | L | open-Q |
| C02 | Live shopping / WhatsApp Business catalog sync | AI / Biz | L | Y |
| C03 | AR / virtual try-on (limited use for clinical actants; revisit) | AI / UX | L | open-Q |
| C04 | Ambassador referral program (per-region named ambassadors with revenue share) | Biz | L | open-Q |
| C05 | Multilingual leaflet generator for clinics (PDF on demand) | Brand / Backend | M | Y |
| C06 | Loyalty / reorder discount for verified clinics | Biz | M | Y |
| C07 | A/B testing harness (Vercel Edge Middleware split or PostHog) | DevOps | M | Y |
| C08 | Translated transcribed video captions (HE / RU) for the future Sora b-roll — once the b-roll exists | Brand / AI | M | Y |
| C09 | Mobile app for repeat-order clinics (low priority; web covers 95 %) | DevOps | L | C |
| C10 | Mitoderm-branded WhatsApp template approval (24-hour message window) | Perf-marketing | M | Y |

---

## 5. Ship-now subset — the 10 highest-leverage items we can do without owner copy edits

1. `clinicalResults` structural block (A02)
2. `bundle` structural block ("Shop the protocol") (A03)
3. "Trusted by" strip slot on PDP hero (A04)
4. WhatsApp pre-filled inquiry CTA — one-string swap × 3 locales (A05, A06)
5. Sticky mobile "Request quote" bar (A07)
6. `FAQ` + `MedicalProcedure` JSON-LD (A08, A09)
7. Accessibility statement page + widget (A13, A14) — legal must-have
8. Design-tokens consolidation (A15)
9. Locale-parity CI check (A16)
10. Audit log + product-duplicate API (A18, A19)

Each of these adds structure or schema; none requires the owner to
rewrite product copy.

---

## 6. Open questions for the owner

1. **Brand catalog**: keep `EXOXE / EXOCELL / EXO-NAD` (current
   `src/data/products.json`) or migrate to the live-site naming
   (`V-Tech Serum / V-Tech Gel Mask / Exotech Gel / Exosignal *`)?
2. **Pricing path**: keep "Contact for Price" gated, or unlock a
   private wholesale PDF for verified clinicians?
3. **Whose photo / name** should sit in the "Trusted by" strip?
4. **What's the canonical WhatsApp number** the CTA should deep-link to?
5. **Cloudinary / Vercel Blob account** for large image uploads?
6. **CRM**: HubSpot, Pipedrive, Notion, Make/Zapier — where should the
   lead pipeline land?
7. **Ambassador roster** — names and regions for the first 5–10
   "family of cosmetologists" entries.

---

## 7. References

- Mitoderm V-Tech site (EN): https://www.mitoderm.com
- Mitoderm V-Tech site (HE): https://www.mitoderm.co.il
- Sulwhasoo (Sephora): https://www.sephora.com/brand/sulwhasoo
- Amazon PDP video 2026: https://www.velocitysellers.com/2026/05/21/amazon-product-video-pdp-2026/
- Shopify PDP best practices 2026: https://cartylabs.com/blog/shopify-product-page-best-practices/
- Bundles 2026: https://www.skailama.com/blog/top-product-bundles-built-by-easy-bundles
- Cosmetic B2B platforms 2026: https://www.beautetips.com/blog/9-leading-cosmetic-b2b-platforms-for-2026
- B2B Beauty wholesale: https://www.shopify.com/enterprise/blog/b2b-beauty
- Generative AI in beauty 2026: https://inferencebeauty.com/blog/generative-ai-in-beauty-industry-2026/
- Fenty WhatsApp AI advisor: https://digiday.com/marketing/fenty-beauty-launches-whatsapp-ai-advisor-as-messaging-becomes-beautys-next-commerce-channel/
- WhatsApp in Israel: https://blogs.timesofisrael.com/how-whatsapp-became-israels-unofficial-business-platform/
- Click-to-WhatsApp ads Israel: https://waliner.io/click-to-whatsapp-ads-in-israel/
- IS 5568 accessibility: https://www.skynettechnologies.com/blog/israeli-standard-5568
- Israeli accessibility law 2026: https://vee.co.il/accessibility-law-2026/
- AI shopping discovery: https://searchengineland.com/ai-driven-shopping-discovery-product-page-optimization-468765
