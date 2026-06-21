# Mitoderm — image generation prompt pack

> **Purpose.** This is the runnable prompt pack for the Google image
> generator. Generate each slot below, then either drop the file at the
> listed destination path or paste it into the Claude Code chat — it
> will be extracted and placed automatically (per the transcript
> extraction skill in `CLAUDE.md`).
>
> **Lean essentials set (9 images):** Bio-Spicules line hero, homepage
> ambient, 4 science pillar visuals, 3 bespoke blog headers.

---

## Global art direction (prepend to every prompt)

Every image must read as one system, so each prompt below already
includes these guardrails — keep them verbatim:

> Premium clinical-luxury aesthetic for a professional aesthetics brand.
> Deep near-black background (#08080a). A single soft accent glow per
> image. Soft volumetric lighting, fine grain, generous negative space,
> shallow depth of field. Macro / abstract science visual — no text, no
> logos, no watermarks, no recognisable human faces, no UI. Photoreal or
> refined 3D render, editorial and restrained (think a luxury skincare
> campaign, not stock photography). Optimised to sit behind or beside
> light text on a dark interface.

**Accent palette (use the one named per slot):**
teal `#6fb7ba` · gold `#dfba74` · rose `#b4607e`

**Export:** WebP if available (else PNG → I'll convert). No upscaling
artefacts. Aspect ratio is given per slot — generate at that ratio,
high resolution (≥ 2000px on the long edge).

---

## 1. Bio-Spicules line hero — `public/lines/bio-spicules/hero.webp` · 4:3 · ROSE

> [GLOBAL ART DIRECTION] Accent: rose #b4607e. Extreme macro of
> crystalline botanical micro-spicules — fine, needle-like silica
> structures suspended in a clear serum, catching a soft rose-gold rim
> light against the near-black field. Delicate, almost frost-like
> geometry; a sense of microscopic precision and natural origin. Cosmetic
> science beauty, 4:3, dark, luxurious, lots of empty space top-left for
> a possible label.

## 2. Homepage hero ambient — `public/home/hero.webp` · 16:9 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. A vast, very dark,
> low-contrast field of softly glowing exosome vesicles — translucent
> spheres of varying size drifting in deep space-like black, lit by a
> faint warm gold bloom from the lower right. Must be subtle and muted
> enough that large light-coloured headline text laid over the centre-left
> stays fully legible. Cinematic, abstract, atmospheric, 16:9. Think a
> dark luxury hero backdrop, not a busy illustration. Keep the upper-left
> two-thirds calm and near-empty.

## 3a. Science pillar — Exosomes — `public/science/exosomes.webp` · 1:1 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. Single hero exosome
> vesicle — a translucent lipid sphere carrying faint glowing cargo
> (proteins, RNA strands) inside, rendered like a refined scientific 3D
> visualisation, floating centred on near-black with a soft gold halo.
> Square 1:1, minimal, elegant, one object, deep negative space around it.

## 3b. Science pillar — Polynucleotides — `public/science/polynucleotides.webp` · 1:1 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. A single elegant strand of
> coiled nucleotide chain / double-helix fragment, glowing softly, binding
> tiny beads of water around it, suspended centred on near-black with a
> gold rim light. Refined 3D science render, square 1:1, one object, calm
> and luxurious, deep negative space.

## 3c. Science pillar — NAD+ — `public/science/nad.webp` · 1:1 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. A single stylised
> mitochondrion glowing from within with warm energy, fine cristae
> visible, rendered as an abstract luminous cell-energy object centred on
> near-black with a soft gold glow. Square 1:1, one object, elegant
> scientific 3D, deep negative space, sense of cellular vitality.

## 3d. Science pillar — Delivery (microneedling) — `public/science/delivery.webp` · 1:1 · TEAL

> [GLOBAL ART DIRECTION] Accent: teal #6fb7ba. Abstract macro of fine
> micro-channels opening in a translucent surface, with a glowing teal
> serum droplet descending into one channel — precision, controlled
> delivery, refined 3D science visual centred on near-black with a teal
> rim light. Square 1:1, one focal idea, minimal, deep negative space.

## 4a. Blog header — "What are exosomes" — `public/blog/what-are-exosomes-in-skin-care.webp` · 16:9 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. Editorial header image: a
> drifting cloud of translucent exosome vesicles receding into dark depth,
> one in sharp macro focus foreground, warm gold bloom. Cinematic 16:9,
> lots of dark negative space on the right for a headline overlay.

## 4b. Blog header — "NAD+ peeling" — `public/blog/nad-peeling-when-to-use-it.webp` · 16:9 · GOLD

> [GLOBAL ART DIRECTION] Accent: gold #dfba74. Editorial header image:
> abstract luminous cellular-energy field — softly glowing mitochondria-
> like forms dissolving into near-black, warm gold light, a sense of
> renewal and longevity. Cinematic 16:9, calm dark negative space on the
> right for a headline overlay.

## 4c. Blog header — "Microneedling depth" — `public/blog/microneedling-depth-guide.webp` · 16:9 · TEAL

> [GLOBAL ART DIRECTION] Accent: teal #6fb7ba. Editorial header image:
> abstract macro of a precision micro-needle array meeting a translucent
> skin-like surface, fine teal-lit micro-channels, clinical precision and
> control. Cinematic 16:9, dark, restrained, negative space on the right
> for a headline overlay.

---

## After you generate

1. Name each file exactly as the destination above (`hero.webp`,
   `exosomes.webp`, etc.).
2. Drop them at the listed paths, **or** just paste them into chat and
   say "вытащи фото из диалога" — they'll be extracted and placed.
3. I then wire them: science pillars + homepage ambient + bespoke blog
   headers + the Bio-Spicules line tile. All slots are progressive —
   the site already works with zero images, so these only ever upgrade.

## Notes

- OG share images are generated dynamically (`/api/og`), so there's
  nothing to make there.
- If a slot comes back too busy/bright behind text (homepage ambient
  especially), regenerate with "darker, lower contrast, more empty space"
  appended — legibility of overlaid copy is the hard constraint.
