# UGC script pack — V-Tech (drafts)

Render-ready shorts. **Drafts — copy is yours to edit** (owner is
copy-sensitive). Source of truth: `src/data/ugc-scripts.json` (the Remotion
engine renders straight from it). On-screen text is trilingual (en/ru/he);
`vo` is the spoken track to record or dub. Each maps to a rung of the
awareness ladder from `docs/product-funnel.md`.

Render any of these:
`npm run remotion:render -- <id> <en|ru|he>`

| # | id | audience | rung | hook (en) |
|---|----|----------|------|-----------|
| 1 | `vtech-unaware-hook` | patient | Unaware | "Your skin cells send messages. This is the messenger." |
| 2 | `vtech-problem-plateau` | patient | Problem | "If your serum stopped working, it's not you." |
| 3 | `vtech-mechanism` | patient | Solution | "One ampoule. Three ways it rebuilds skin." |
| 4 | `vtech-proof-firstsession` | patient | Product | "92% saw visible firming by session four." |
| 5 | `vtech-pro-economics` | practitioner | Solution | "The treatment your clients ask for by name." |
| 6 | `vtech-pro-protocol` | practitioner | Product | "Serum plus mask. One plus one equals three." |

## Audiences
- **patient** (1–4) — demand generation; practitioners can repost to their
  own audience. Explains exosomes, reframes the plateau, shows the
  mechanism and the proof.
- **practitioner** (5–6) — the B2B buy: margins/partnership and the exact
  in-clinic protocol (the "1+1=3" serum + gel mask).

## Notes
- All numbers come from the real V-Tech data (`2% PDRN`, `92% by session 4`,
  `4–6 sessions`, `~60–70% margin`). The `TODO` economics figures are
  filtered out, same as the live PDP.
- b-roll currently reuses product stills in `public/products/*`. Swap in
  real footage per scene by changing `scenes[].media`. (Heads-up: the
  `v-tech-gel-mask/hero.png` asset actually shows an EXOCELL mask — worth
  correcting at the source.)
- Captions + hashtags per script live in the JSON, ready for the publish
  step (Zapier → scheduler, per the pipeline doc).
