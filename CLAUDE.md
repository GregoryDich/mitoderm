# Mitoderm — project memory

> **Scope: Mitoderm only** (`gregorydich/mitoderm`,
> `/home/user/mitoderm`). Conventions, tokens, skills and the roadmap
> below apply to this repo only. **Do not import them into other
> projects** (e.g. fitscan) — those live in separate working
> directories with their own CLAUDE.md / STATE.md. If `pwd` is not
> `/home/user/mitoderm`, this file does not apply.

> **Read `STATE.md` first** for the current state, open questions and
> the prioritised roadmap. This file holds durable Claude memory:
> stack, conventions and reusable techniques.

Next.js (App Router) + TypeScript marketing site for professional
exosome skincare. i18n via `next-intl`, locales **`en` / `ru` / `he`**.
Hebrew (`he`) renders **RTL** — `dir` is set on `<body>` in
`src/app/[lang]/layout.tsx`.

All new UI must be:

- **RTL-safe** — logical CSS (`margin-inline`, `inset-inline-*`), mirror
  directional glyphs via `:global([dir='rtl']) .arrow { transform: scaleX(-1) }`
- **Fluid / responsive** — prefer `clamp()` over fixed px for type and
  spacing
- **Accessible** — `aria-pressed` on filter toggles, focus-visible
  rings, `prefers-reduced-motion` for animations. The site must satisfy
  **IS 5568 / WCAG 2.1 AA** (Israeli accessibility law)

## Where things live

- Locale strings: `messages/{en,ru,he}.json`. Always add a key to all
  three files together.
- Product data: `src/data/products.json` — the canonical store. Edited
  through `/admin/products`; do NOT inline-author products inside
  `src/products.ts` (that file is just a typed wrapper).
- Family / doctors data: `src/data/doctors.json` — managed at
  `/admin/doctors`, feeds the public `TrustedByStrip`.
- Leads: `data/leads.json` (gitignored), public `/api/leads`, admin at
  `/admin/leads`.
- Design tokens: deep `#08080a` background, `#f5f2f0` text, glass
  `rgba(255,255,255,0.035)` + `1px rgba(255,255,255,0.08)` border, per-
  product `--accent` (teal `#6fb7ba` / gold `#dfba74` / rose `#b4607e`).
- Admin auth: single `ADMIN_PASSWORD` env, HMAC-signed HttpOnly cookie
  via `src/lib/admin-auth.ts`.
- Storage adapter: `src/lib/admin-store.ts` writes locally in dev,
  commits via GitHub Contents API when `GITHUB_*` env vars are set.

## Owner constraints (carry across sessions)

1. The owner is sensitive to **copy edits**. Prefer adding structural
   slots / schema / interactions. Don't rewrite product copy unless
   explicitly asked.
2. Block reordering is welcome. Layout iterations are fair game.
3. Admin manages **data records only** (catalog / family / leads). No
   site-copy CMS inside admin.
4. The catalog ships V-Tech / Exotech / Exosignal (live mitoderm.com
   line). Legacy EXOXE / EXOCELL / EXO-NAD preserved at
   `src/data/products.legacy.json` and at the branch / tag
   `cycle-0-snapshot`.

## SKILL: extract images from the conversation (do this automatically)

When the user pastes images in chat and they're needed as files
(product photos, screenshots, references), **DO NOT ask the user to
re-upload or for a URL** — extract them yourself from the session
transcript and proceed:

1. Find the latest transcript:
   `ls -t ~/.claude/projects/-home-user-mitoderm/*.jsonl | head -1`
2. Stream-parse each JSONL line; recurse the JSON looking for any
   object with `source.type === "base64"` (or a `media_type` + long
   `data` string). Decode `data` (base64) to bytes, dedupe by md5,
   write with the right extension from `media_type`. Reference impl:
   `/tmp/extract.js` (Node `readline` + `crypto`); re-create it if
   missing.
3. `Read` the extracted files to visually identify the relevant ones,
   then place them where needed (e.g. `public/products/<slug>/`).

This is the standing approach for "вытащи фото из диалога" — use it
proactively whenever inline images must become files, without asking.

## SKILL: take ship-now actions without poking the owner

Don't stall on owner questions that the roadmap (`STATE.md` § 5) has
flagged as **text-stable: Y**. Those items add structure / schema /
interactivity that lights up the moment the owner fills the
corresponding content slot (e.g. `clinicalResults`, `bundle`,
ambassador roster). Ship the slot empty — render it conditionally — and
move on.

## SKILL: dev server lifecycle

- **Do not `pkill -f "next dev"`** — the pattern matches the bash you
  ran the command from and kills your own shell (exit 144). To restart
  dev, find the pid via `ps -ef | grep next-server` and `kill <pid>`.
- The container reclaims long-idle processes; expect to restart dev a
  few times per session.
- `ADMIN_PASSWORD=devpass nohup npm run dev > /tmp/devN.log 2>&1 &`
  then `until grep -q "Ready in" /tmp/devN.log; do sleep 2; done`.

## SKILL: probing the running site

After a dev restart, hit critical routes to confirm 200s before moving on:

```
for u in en/catalog he/catalog ru/products/v-tech-serum en/about en/form \
         sitemap.xml admin/products admin/leads admin/doctors; do
  echo "$u -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/$u)"
done
```

JSON-LD presence (use grep, not browser):

```
curl -s http://localhost:3000/en/products/v-tech-serum | \
  grep -oE '"@type":"[A-Za-z]+"' | sort -u
```
