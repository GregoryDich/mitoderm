# Remotion UGC engine

Code-driven vertical (1080×1920) short-form video for Mitoderm. Turns
`src/data/ugc-scripts.json` into branded MP4s — no external SaaS, free,
deterministic, versioned in git. This is the free "video" node of
`docs/ugc-video-pipeline.md` and the render foundation for the Journey
Phase 2 (morph transitions).

## Render

```bash
# node remotion/render.mjs <scriptId> <locale>
npm run remotion:render -- vtech-mechanism en
npm run remotion:render -- vtech-mechanism he     # RTL, right-aligned
npm run remotion:render -- vtech-pro-economics ru
```

Output → `out/ugc-<scriptId>-<locale>.mp4` (gitignored). Locales: `en`,
`ru`, `he`. Script ids are the `id`s in `ugc-scripts.json`.

## Preview / edit interactively

```bash
npm run remotion:studio      # opens Remotion Studio on localhost:3000
```

## How it renders headless here

`render.mjs` points Remotion at the pre-installed Playwright
`headless_shell` (`/opt/pw-browsers/chromium_headless_shell-*`), because the
full Chromium binary dropped the old-headless mode Remotion needs — so no
`chrome-headless-shell` download is required. Override with
`REMOTION_BROWSER=/path/to/headless_shell`.

## Files

- `index.ts` — registers the root
- `Root.tsx` — the `Short` composition; duration derived from the script
- `Short.tsx` — scene renderer: Ken-Burns media, legibility veil, kinetic
  lower-third, accent chip, top progress bar, end CTA card; RTL-aware
- `render.mjs` — programmatic bundle + render to MP4

## Extending

- New script → add an object to `ugc-scripts.json` (`scenes[].media` must be
  a path under `public/`). No code change to render it.
- Better b-roll → drop clips/stills in `public/` and reference them; the
  engine `objectFit: cover`s any still. (For real motion b-roll, add an
  `<OffthreadVideo>` branch in `Short.tsx`.)
- Voiceover → `scenes[].vo.en` holds the spoken track to record/dub; wire a
  TTS step (e.g. ElevenLabs) + `<Audio>` when ready.
