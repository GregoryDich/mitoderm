# Product page as a funnel — strategy & the "Product Journey" build

> Phase 0 of the scroll-story initiative. This doc is the **content /
> strategy layer**: it decides *what* each product page should say, in
> *what order*, and *why* — before any GSAP/Remotion engineering. Read
> this, then the build phases (§6) follow.

Scope: the product detail page (PDP), `src/components/Product/ProductPage.tsx`.
Pilot product: **V-Tech System**. Everything here generalises to Exotech /
Exosignal via the same per-product config.

---

## 1. The problem, stated plainly

The PDP today is **encyclopedic, not persuasive**. It renders ~27 stacked
sections in a fixed order:

> hero → trusted-by → value triad → key facts → stat strip → benefits →
> system → results → formula → kit → protocol → aftercare → safety →
> before/after → gallery → protocol-kit → logistics → compare →
> economics → training → FAQ → indications → related → explore → CTA →
> recently-viewed

Every fact a cosmetologist could want is *present*. But the page has **no
arc**. It answers questions in the order the data model happens to list
them, not in the order a buyer's mind actually moves. A reference sheet
informs; it doesn't convince, and it doesn't build the *desire* that makes
someone message on WhatsApp and then re-order.

The owner's ask — "make each page a scroll-driven adventure / video-story,
where blocks flow into one another" — is really two asks stacked:

1. **Narrative** — reorder and reframe the content as a funnel with a
   beginning, a turn, and a close.
2. **Cinematics** — express that narrative as scroll-linked motion (a
   per-product video/3D background that scrubs as you scroll, with a short
   animated transition between each chapter).

Narrative is the hard part and the durable value. Cinematics is the
delivery. **This doc settles narrative; §6 covers cinematics.**

---

## 2. Who we're selling to (and why order matters)

The buyer is a **professional cosmetologist / aesthetician** deciding
whether to bring an exosome system into their clinic. That is a *considered,
professional* purchase — reputation risk, protocol risk, real money — not an
impulse skincare buy. Their questions arrive in a predictable sequence, and
answering out of sequence *loses* them:

- Lead with economics → reads as pushy before trust exists.
- Lead with 40 ingredient facts → overwhelms before they care why.
- Bury proof and the partner community at the bottom → they leave at the
  encyclopedic middle and never see the two things that actually convert
  and retain.

So order is not cosmetic. It is the product.

---

## 3. The ladder — Ben Hunt's Awareness for a cosmetologist

Ben Hunt's five rungs of awareness, mapped to *this* buyer. Each PDP chapter
targets one rung and moves the reader up one:

| Rung | Buyer's state | What they need to hear | Feeling to create |
|---|---|---|---|
| **1. Unaware** | "Just browsing. Another serum brand." | A hook that signals *premium, different, professional-grade.* | "Wait — this isn't retail skincare." |
| **2. Problem-aware** | "My clients want real regeneration; topicals plateau." | Name their client's problem better than they can. | "That's exactly my chair." |
| **3. Solution-aware** | "OK, exosomes + device. How does it actually work?" | Mechanism, credibly and simply. Science as *trust*, not homework. | "I understand it. It's legitimate." |
| **4. Product-aware** | "What do I actually buy, and how do I run it?" | The product, the kit, the protocol steps. | "I could do this Monday." |
| **5. Most aware** | "Does it work, is it worth it, am I supported?" | Proof (before/after), economics, and — the retention key — the **partner community**. | "I'm in, and I'm not alone." |

The current PDP touches all five rungs but **scrambles them**: economics and
before/after (rung 5) sit *below* logistics and compare; the partner
community isn't a destination at all. The Journey re-sequences to walk the
ladder cleanly.

---

## 4. Per-block audit — keep / cut / reorder

Every existing section, judged on: *does it help the buyer up the ladder, or
get in the way — and would they buy (more) because of it?*

| # | Current section | Rung | Verdict | Why |
|---|---|---|---|---|
| 1 | Hero | 1 | **Keep — becomes Chapter 1** | The hook. Gets the biggest cinematic upgrade (packaging morph). |
| 2 | Trusted-by strip | 1→2 | **Keep, move into hook** | Social proof belongs *early* as a credibility signal, then again at close. |
| 3 | Value triad (Unique·Effective·Safe) | 1 | **Keep — hook punctuation** | One-glance positioning. Perfect chapter-1 closer. |
| 4 | Key facts aside | 2 | **Merge into Problem chapter** | Good scannable facts; currently floats context-free. |
| 5 | Stat strip (CountUp) | 3/5 | **Keep, split** | The *proof* stats move to rung 5; the *mechanism* stats to rung 3. |
| 6 | Benefits (2×2) | 2 | **Keep — Problem chapter** | Reframe as "what this solves for your client," not features. |
| 7 | System (steps) | 3 | **Keep — Solution chapter** | The how-it-works spine. |
| 8 | Clinical results | 5 | **Keep, move DOWN to Proof** | Currently mid-page; it's a rung-5 closer, not a middle fact. |
| 9 | Formula (ingredients + KeyActives) | 3 | **Keep, condense** | Move the deep ingredient list behind a "for the curious" reveal; lead with 3 hero actives. |
| 10 | Kit (pack) | 4 | **Keep — Product chapter** | "What's in the box." |
| 11 | Protocol | 4 | **Keep — Product chapter** | "How I run it." Pairs with Kit. |
| 12 | Aftercare | 4 | **Keep, fold under Protocol** | Secondary detail; reveal, don't stack. |
| 13 | Safety / contraindications | 4 | **Keep, fold under Protocol** | Necessary, not a headline. Reveal. |
| 14 | Before / After | 5 | **Keep — Proof chapter, promote** | The single strongest converter. Deserves a hero moment, not a mid-scroll block. |
| 15 | Gallery | 4/5 | **Keep, optional** | Nice-to-have; lazy, low in the order. |
| 16 | Protocol kit (bundle) | 4→5 | **Keep** | Cross-sell — belongs near the close, "buy more" lever. |
| 17 | Logistics | 4 | **Keep collapsed** | Reference. Already `<details>`. Fine as-is, low. |
| 18 | Compare | 3/5 | **Keep collapsed** | Reference for the skeptic. Fine low. |
| 19 | Economics | 5 | **Keep — Partner chapter, promote** | The margin story is a *reason to buy* and a rung-5 item; currently buried collapsed. Surface it in the close. |
| 20 | Training | 5 | **Keep — Partner chapter** | "You'll be supported" — retention. |
| 21 | FAQ / Ask (ProductChat) | any | **Keep — floating** | Objection handling; should be reachable throughout, not just one block. |
| 22 | Indications (chips) | 2/4 | **Keep, fold** | Good for scanning; merge into Problem or Product. |
| 23 | Related | — | **Keep — exit** | Standard. |
| 24 | Explore (posts) | — | **Keep — exit** | Standard. |
| 25 | CTA band | 5 | **Keep — the close** | Ends on the partner CTA + WhatsApp. |
| 26 | Recently-viewed | — | **Keep — exit** | Standard. |

**Net:** nothing gets cut outright. The move is **re-sequencing into 6
chapters + demoting reference material behind reveals**, so the spine a buyer
scrolls is the ladder, and the encyclopedia is still there for whoever wants
it. Missing today and worth adding: an explicit **partner / WhatsApp-community**
moment — the thing that turns one purchase into a repeat relationship.

---

## 5. The V-Tech Journey — 6 chapters

Each chapter = one ladder rung, one full-viewport "beat," a background that
scrubs on scroll, and a short transition morph into the next. Reduced-motion
collapses each chapter back to its current static block(s).

| Ch | Name | Rung | Content (reuses existing data) | Keyframe image the owner supplies |
|---|---|---|---|---|
| **1** | **The Arrival** | Unaware | Hero + value triad + trusted-by. Packaging revealed. | Product packaging, hero-lit, on the brand's deep `#08080a`. |
| **2** | **Your Client's Plateau** | Problem | Benefits reframed as client problems + key facts + indications. | A "before" client / concern close-up (respectful, clinical). |
| **3** | **How It Works** | Solution | System steps + 3 hero actives + mechanism stats. Deep formula behind a reveal. | Exosome / mechanism visual (abstract cellular is fine). |
| **4** | **In Your Hands** | Product | Kit + protocol steps. Aftercare/safety folded in. | The kit laid out / product in-use on a treatment tray. |
| **5** | **The Proof** | Most-aware | Before/after (promoted) + clinical results + proof stats. | Best real before/after pair. |
| **6** | **Join the Table** | Most-aware→Partner | Economics + training + protocol-kit cross-sell + WhatsApp-community CTA. | A "community / partner" image — clinicians, or the WhatsApp group vibe. |

The transitions between chapters are the "gif between blocks" the owner
described — a keyframe→keyframe morph with the product as the constant hero
(working name: **"Morph Beats"**), generated by the pipeline in §6, not
hand-drawn per product.

---

## 6. Build phases (cinematics) — summary

Settled here so the doc is self-contained; the actual engineering lands in
later commits, gated on owner go-ahead for new dependencies.

- **Render = hybrid, web-native.** GSAP `ScrollTrigger` pins each chapter and
  scrubs a background layer (parallax image stack or a short scroll-scrubbed
  `<video>`), cross-fading into the next through the transition clip. Lighter
  than a live `@remotion/player`, editable without re-rendering a monolith,
  and it degrades to today's static blocks under `prefers-reduced-motion`.
- **Assets = collaborative.** Owner supplies one keyframe image per chapter
  (table in §5). We generate the between-chapter morphs.
- **Pipeline = "Morph Beats", in-repo first.** A Remotion project renders a
  short webm/mp4 transition from two keyframe images + params, driven per
  product from a `journeys/<slug>.json` config. n8n/Make automation (the
  proven "Remotion + Claude + TTS" workflow) is a later, owner-run phase —
  it can't run from this environment.
- **NotebookLM** belongs on the *content* side (turn product docs into the
  chapter script / narration), not the web renderer.

Concretely, the code phases:

1. **P1 — Journey engine (pilot V-Tech).** New `ProductJourney` component +
   `journeys/v-tech.json` config; PDP renders the Journey when a config
   exists, else today's page. New dep: `gsap`. Reuse `Reveal`, the
   `HeroReveal` masking technique, `HoverVideoMedia`, existing reduced-motion
   guards. *(Named "Journey" to avoid colliding with the existing
   `admin/stories` namespace.)*
2. **P2 — Morph Beats pipeline.** `/remotion` project + `scripts/render-journey.mjs`.
   Dev deps `remotion`, `@remotion/cli`. Then the n8n/Make workflow spec.
3. **P3 — Roll out** to each product via its own `journeys/<slug>.json` +
   keyframe images under `public/products/<slug>/journey/`.

---

## 7. What I need from the owner to start P1

1. **Green light on new dependencies** (`gsap` now; `remotion` at P2).
2. The **6 keyframe images for V-Tech** (§5, last column) — or approval to
   stand up the engine with the existing hero image as placeholder and drop
   real keyframes in later.
3. Confirm the **6-chapter order** above, or adjust.

Nothing here rewrites product *copy* (per owner constraint #1) — it
**re-sequences** existing content and adds structural chapter slots. Copy
edits, if any, are the owner's call.
