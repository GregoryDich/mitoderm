# Virality rubric — short-form (IG Reels / TikTok), beauty & med-aesthetic

> Encoded from a July-2026 research sweep (OpusClip hook data, Socialinsider
> 140K-Reel length study, Kling/Higgsfield prompt guides, Later/ManyChat
> hashtag updates, HeyOrca/Buffer cadence benchmarks, ClinicGrower med-spa
> cases, BoF PDRN/exosome trend reporting). This is the scoring gate for
> every script in `src/data/ugc-scripts.json`: **score each point 0/1, ship
> at ≥ 10/12.**

## The 12 points

1. **Hook ≤ 2s, works on mute.** One of four proven archetypes: bold/
   contrarian claim · curiosity-gap question (not yes/no) · pattern
   interrupt (unexpected visual/sound) · proof-first (result/before-after
   up front). High-contrast text overlay carries it without sound.
   *Benchmark: videos holding >65% of viewers at 3s get 4–7× impressions.*
2. **No logo intro.** First frame is transformation, needle-to-bottle
   contrast, texture macro, or another interrupt — never branding.
3. **Length by job:** 7–30s product/demo reels; 30–60s educational
   (45–60s is the top *engagement* bracket on business accounts); never
   >3min. Watch-time × completion is what ranks.
4. **Pacing:** a cut or visual change every **1.5–3s**; no static shot
   longer than **4s**; jump cuts + b-roll inserts over fancy transitions.
5. **Retention architecture:** open loop stated by second 3; payoff
   withheld to the last second; ending loops back to the start.
6. **Camera grammar (AI clips):** exactly **one named move per clip**,
   camera instruction **last** in the prompt, always with a "slow"
   modifier; orbits ≤30°. Vocabulary = Higgsfield preset names
   (higgsfield.ai/camera-controls): for skincare the workhorses are
   *Crash Zoom In, Super Dolly In, 360 Orbit, Glam, Timelapse Glam,
   Focus Change, Through Object*. Kling phrasing that works: "slow
   push-in over 5 seconds", "slow orbit clockwise (max 30 degrees)",
   "locked-off macro close-up", "slight handheld drift".
7. **Proven med-aesthetic container.** Use one of: before/after wrapped
   in a client story or voiceover · expectation-vs-reality ·
   "clinic-grade ingredient, explained" · X-vs-Y comparison. (PDRN /
   exosomes are a hot trend arc — celebrity catalysts, "salmon-sperm
   facial" framing; comparison content self-sustains.)
8. **Authority without claims.** Clinician/derm framing, raw UGC feel
   over polish, zero hard medical claims (also an IL regulatory issue).
9. **Caption as SEO.** First line re-hooks; body carries natural-language
   search phrases ("what exosomes do to your skin barrier"); **exactly
   3–5 niche hashtags** (IG hard-capped hashtags at 5 in Dec 2025) mixing
   ingredient + procedure + audience — never generic #beauty #viral.
10. **Audio:** a *rising* trending sound adopted within 24–48h of
    detection (~33% reach lift, directional), or original ASMR/texture
    sound for skincare. Business accounts must use licensed/original
    audio — bake music in at render (Pixabay free / Epidemic ~$25/mo).
11. **CTA lives in the caption/comments**, not spoken in the video body.
12. **Cadence + iteration:** 3–5 reels/week; any video that beats the
    account median gets 2–3 variations (outlier-remix: source ideas from
    reels doing >5–10× a similar-size account's median views — keep the
    container, swap the topic).

## How the pipeline uses this

- **Script writing** (`ugc-scripts.json`): scenes are 1.5–3s beats; every
  scene's `camera` follows point 6; hooks follow point 1; captions follow
  point 9. Score before committing a new script.
- **Trend input** (`scripts/trends-scrape.mjs`): transcripts of outlier
  reels feed point 12 — extract the *container* (hook wording, structure,
  beat timing), never the content.
- **Render** (`remotion/`): music baked per point 10; caption pop timing
  matches the cut cadence per point 4.
