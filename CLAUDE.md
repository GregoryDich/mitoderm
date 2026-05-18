# Mitoderm — project memory

Next.js (App Router) + TypeScript marketing site for professional exosome
skincare. i18n via `next-intl`, locales `en` / `ru` / `he`. Hebrew (`he`)
renders **RTL** — `dir` is set on `<body>` in `src/app/[lang]/layout.tsx`.
All new UI must be RTL-safe (use logical CSS, mirror directional glyphs) and
fluid/responsive (prefer `clamp()` over fixed px for type and spacing).

Strings live in `messages/{en,ru,he}.json`. Product data is in
`src/products.ts`. Premium-dark design system: deep `#08080a`, glass cards,
per-product `--accent` (teal / gold / rose), editorial numbered sections.

## SKILL: extract images from the conversation (do this automatically)

When the user pastes images in chat and they're needed as files (product
photos, screenshots, references), DO NOT ask the user to re-upload or for a
URL — extract them yourself from the session transcript and proceed:

1. Find the latest transcript:
   `ls -t ~/.claude/projects/-home-user-mitoderm/*.jsonl | head -1`
2. Stream-parse each JSONL line; recurse the JSON looking for any object
   with `source.type === "base64"` (or a `media_type` + long `data`
   string). Decode `data` (base64) to bytes, dedupe by md5, write with the
   right extension from `media_type`. Reference impl: `/tmp/extract.js`
   (Node `readline` + `crypto`); re-create it if missing.
3. `Read` the extracted files to visually identify the relevant ones, then
   place them where needed (e.g. `public/products/<slug>/`).

This is the standing approach for "вытащи фото из диалога" — use it
proactively whenever inline images must become files, without asking.
