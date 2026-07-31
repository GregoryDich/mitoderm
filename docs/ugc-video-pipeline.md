# UGC / Video content pipeline — reality audit & plan

> Scope: Mitoderm marketing content (V-Tech / Exotech / Exosignal lines).
> Written from a **headless Claude Code session** — it cannot run OAuth,
> approve per-call MCP prompts, or install MCP servers. Those are your
> (interactive) actions; this doc gives the exact commands and the chain.

---

## 0. The three hard truths

1. **This session can't install MCPs or authorize connectors.** Installs
   happen interactively on your machine (`claude mcp add …`) or in
   claude.ai connector settings. I can only (a) use what's already
   connected, (b) build code in this repo, (c) hand you the commands.
2. **Adobe Express/Firefly is connected but every call needs manual
   approval** → unusable in an autonomous/headless run, fine when you
   drive it live in the desktop/web app.
3. **No connected tool makes talking-head "UGC" (a person to camera).**
   That's what ugcdrop / higgsfield / arcads / heygen do — external SaaS,
   not connectable by me. I feed them scripts; they render the face.

---

## 1. What is ACTUALLY connected to me right now

| Server | Status | Useful for the pipeline |
|---|---|---|
| **Zapier** (9,000+ apps bridge) | ✅ live | **The real "chain closer"** — publish/schedule to Buffer, Metricool, IG/TikTok/YT via enabled Zaps |
| **Ahrefs** (full API) | ✅ live | Keyword/topic/SERP research, content gaps, social-media posts data |
| **Klaviyo** | ✅ live | Email/SMS flows, turn video landers into campaigns |
| **HubSpot** | ✅ live | CRM, campaign attribution, lead capture from content |
| **Figma** | ✅ live | Thumbnails, storyboards, motion context, `export_video` |
| **Shopify** | ✅ live | If commerce is added — product feeds for shoppable video |
| **Vercel** | ✅ live | Deploy landers / host rendered MP4s + HTML |
| **Notion** | ✅ live | Content calendar / script database |
| **Google Calendar** | ✅ live | Posting schedule |
| **Hugging Face** (as `Gregory1214`) | ✅ live | Run Spaces — some open video/TTS/caption models |
| **Lucid**, **three.js**, **GitHub** | ✅ live | Diagrams, 3D, repo |
| **Adobe Express / Firefly** | ⚠️ connected, **per-call approval** | Image gen/edit, `animate_design`, `video_*` — only when you drive live |
| 8 more servers | 🔐 **need your OAuth** | Unknown until you authorize in claude.ai / `/mcp` |

**Playwright/Chromium** is available in this repo (`@playwright/test` +
`/opt/pw-browsers/chromium`) — real browser automation & screenshots.

---

## 2. Your named tools → honest status

**Video generation**
- `remotion` — ✅ **I can build this in the repo now.** Code→MP4, free,
  deterministic, 9:16 shorts with burned captions + product b-roll from
  V-Tech data. This is the node that needs no external account.
- `ugcdrop.com/studio`, `higgsfield`, `HyperFrames`, `klap.ai`,
  `submagic.ai`, `opencut`, `animate` — external SaaS / self-host. **Not
  connectable by me.** I produce the scripts + shot lists that go in.
- `fal.ai` — usable **from code with your API key** (image/video models).
  Not an MCP; I can wire a script if you drop a key in env.

**Research / scraping**
- `Ahrefs` — ✅ connected (use this, not scrapers, for topic/keyword/SERP).
- `instagram reels scraper`, `firecrawl`, `curl_cffi`, `cloackbrowser`,
  `vidiQ`, `trendsee.io`, `graphify` — not connected. IG scraping is
  login-walled + ToS-gray; do it via **Apify (through Zapier)** or a
  dedicated tool, not raw Playwright.
- `Metricool mcp` — not connected; reachable indirectly via Zapier.

**Publishing / scheduling / CRM**
- `smmplaner`, `postmypost.io`, `postoro.app/mcp`, `salesforge`,
  `Metricool` — external schedulers. Route through **Zapier** (connected)
  or connect one directly.
- `Klaviyo`, `HubSpot` — ✅ connected.

**Design & the skill names** (`frontend-design`, `ui-ux-pro-max`,
`top-design`, `refactoring-ui`, `page-cro`, `*-cro`, `copywriting`,
`hooked-ux`, `web-typography`, `microinteractions`, …) — these are
**marketplace plugin/skills you install into Cowork**, not things I have
here. In THIS session I have: `canvas-design`, `theme-factory`,
`brand-guidelines`, `dataviz`, `web-artifacts-builder`, plus the Adobe
`create_visual_design_express_skill`. The rest you add via Cowork.

**Platforms** (`langflow`, `openhands`, `coolify`, `MAXUN`, `open web UI`,
`browser use`, `palmier`, `devtools`, `headroom`, `riflo`, `givon ai`,
`understand-anything`, `polytail`, `kimi`, `zyn`, `recrete`,
`lazy lines`, `claude in chrome`) — self-hosted apps or separate agents;
none wired to this session. `palmier` (you downloaded it) is a Claude Code
MCP manager — use IT to add the servers below.

---

## 3. Which mode for what

- **Terminal (here / Claude Code)** → the code-video engine (**Remotion**),
  the site, the Journey Phase 2, anything that renders MP4 from data. Keep
  code + render here.
- **Cowork** → the marketing operating table: connect the schedulers,
  scrapers, avatar-UGC tools, CRO/copy skills; run batch generation and
  publishing. This is where 80% of your named list belongs.
- **Design mode** → one-off thumbnails / storyboards / brand frames.

Rule of thumb: **build the engine in Terminal, run the campaign in Cowork.**

---

## 4. The realistic chain (using what's connectable)

```
[1 RESEARCH]  Ahrefs (topics/keywords/SERP)  +  Apify-via-Zapier (top reels)
      │              (connected)                     (you enable)
      ▼
[2 SCRIPT]    Claude → 8–12 UGC scripts (hook/scenes/VO/on-screen/CTA)
      │        en·ru·he, from real V-Tech data + brand tokens   ← I do this
      ▼
[3 VIDEO]  ┌─ FREE code path:  Remotion engine in repo → 9:16 MP4 + captions  ← I build
           └─ AVATAR path:     ugcdrop / higgsfield (your account)            ← you run, I feed
      ▼
[4 POLISH]    submagic/klap captions  OR  Remotion burns them free
      ▼
[5 PUBLISH]   Zapier → Metricool/Buffer → IG·TikTok·YT   (connected bridge)
      ▼
[6 MEASURE]   Metricool + Ahrefs social  →  HubSpot/Klaviyo attribution
```

The two nodes I can fully own today: **[2] scripts** and **[3] the free
Remotion engine**. Everything else is either connected-but-yours-to-drive
(Zapier, Ahrefs, Klaviyo, HubSpot) or external-and-yours-to-install.

---

## 5. Install commands for the missing MCPs (run these yourself)

```bash
# Firecrawl (web scraping/crawl) — needs FIRECRAWL_API_KEY
claude mcp add firecrawl -e FIRECRAWL_API_KEY=... -- npx -y firecrawl-mcp

# Apify (Instagram/TikTok reels scrapers as actors) — APIFY_TOKEN
claude mcp add apify -e APIFY_TOKEN=... -- npx -y @apify/actors-mcp-server

# Metricool (schedule + analytics) — check their MCP docs / URL
#   → add as a remote/HTTP MCP in claude.ai connectors, or via `claude mcp add --transport http`

# glif (workflows/image), higgsfield, etc. → their own MCP URLs as HTTP connectors
```
For anything with only a hosted URL (postoro.app/mcp, ai.metricool.com/mcp,
glif): add it as an **HTTP connector in claude.ai settings**, then it shows
up in Cowork. Use **palmier** to manage the local ones.

---

## 6. Immediate next action (pick one, I'll execute)

- **A — Build the Remotion engine** in this repo: `Short9x16` composition,
  brand tokens, burned captions, product-still b-roll, one V-Tech short
  rendered to MP4 as proof. Free, testable here. *(biggest leverage)*
- **B — Write the script + storyboard pack**: 8–12 UGC scripts across
  en/ru/he from real product data, drop-in for any tool. *(fastest value)*
- **C — Both**, B first (scripts) then A (engine renders them).

---

## 7. Breaking the MCP / localhost wall — why it happens & how people fix it

**Can I edit my own MCP JSON?** Yes — nothing blocks the file write. I can
run `claude mcp add …` or author `.mcp.json`. What editing JSON does *not*
do is bridge this session to your machine. Three separate reasons the wall
exists here:

1. **This is an isolated cloud container** (Claude Code on the web). Its
   `127.0.0.1` is the container's own loopback, **not your laptop**. That's
   why `curl http://127.0.0.1:19789/mcp` (palmier) returns *"couldn't
   connect"* — palmier runs on *your* machine, invisible to this sandbox.
2. **MCP servers load at session start**, not hot. A server added mid-run
   isn't callable until the session restarts.
3. **Web sessions are platform-managed.** `claude mcp list` here shows
   *"No MCP servers configured"* — the Adobe/Figma/Zapier/etc. tools are
   injected by the platform, so my local config edits aren't even the
   source of truth for what *this* session loads.

So editing JSON helps a **local** Claude Code, not this web sandbox reaching
your localhost. Confirmed by the community: *"When using Claude.ai there's
no way to reach local MCP servers."*

### The fixes people actually use (two planes)

- **Plane A — run Claude Code LOCALLY** (`claude` in your terminal on your
  machine). Then `127.0.0.1` = your machine, palmier is reachable,
  `claude mcp add` works on restart, filesystem + localhost are yours. This
  is where heavy MCP/automation power lives. Committed `.mcp.json` (below)
  makes palmier auto-load there.
- **Plane B — for web/claude.ai, expose things over public HTTPS.** A cloud
  session can only reach the public internet (through the proxy), so:
  - **Tunnel local tools**: `cloudflared tunnel` / `ngrok` / **Tailscale
    Funnel** turns `127.0.0.1:19789` into a real `https://…` URL, then add
    that as a **Custom Connector** in claude.ai settings. TLS is mandatory;
    self-signed certs are refused.
  - **Use hosted automation as the bridge**: **n8n (cloud) / Make / Zapier**
    expose public webhooks my container *can* call. Claude does the
    reasoning + generation; the webhook does the app-specific steps.

### The dominant community pattern for exactly your goal

Claude = brain, **n8n/Make = hands**. The widely-shared IG→UGC pipeline:

```
Apify Instagram Scraper  →  faster-whisper / AssemblyAI (transcribe)
   (top reels + captions)          │
                                    ▼
        Notion / Google Sheets  ←  store transcripts + metrics
                                    │
                                    ▼
   Claude (script writing) ── webhook ──►  n8n orchestrates render + publish
```

This works from **any** Claude (web or local) because n8n/Make/Zapier
webhooks are public HTTPS — it sidesteps the localhost problem entirely.
n8n even has an **n8n-MCP** so Claude can build/trigger the workflows.

### IG-scrape replacement that works without those SaaS tools

- **Terminal-native**: `yt-dlp` (downloads public reels/TikToks/YT by URL) +
  `faster-whisper` (transcribe). Discovery/ranking of "best reels" still
  needs an API (Apify) or manual URL curation. Note: from a datacenter IP
  (this container) IG often blocks or demands cookies — so run the scrape
  via **n8n+Apify**, and let Claude take the transcripts from there.

### Notion

Notion **is** connected to this session — I can stand up a content-calendar
/ script database now (scripts, status, language, target reel, publish
date) and write the generated scripts straight into it. Say the word.

### Are the tools you listed "the best"? (honest take)

- **Talking-head UGC**: Arcads / Creatify / HeyGen are stronger for ad-style
  UGC than ugcdrop; ugcdrop is fine for cheap bulk.
- **Captions / long→short**: Submagic and **Opus Clip** (klap alternative)
  lead.
- **Code video**: **Remotion** is the best free/deterministic option — it's
  what we're building here.
- **Scheduling**: Metricool + Buffer are proven; postoro is newer.
- **Scrape**: Apify (managed) or yt-dlp+faster-whisper (free).
- **Automation glue**: n8n (self-host/cloud) or Make; Zapier for breadth.

Sources: community reports on Claude localhost/MCP limits and tunnels, and
n8n/Make IG-scrape-transcribe workflows — see chat for links.

---

## 8. FINAL STACK (locked July 2026 — 5-agent research sweep)

Full research: prices/API-vs-MCP verified per tool. Rubric that gates every
script: `docs/virality-rubric.md`. Repo nodes: `scripts/trends-scrape.mjs`
(Apify+Groq), `remotion/generate-clips.mjs` (fal routing),
`remotion/render.mjs` (assembly+music), `scripts/publish.mjs` (upload-post),
`automation/n8n-*.json` (owner's n8n).

| Решение | Инструмент | Цена | Роль |
|---|---|---|---|
| ✅ купить | [fal.ai](https://fal.ai/pricing) | ~$10 депозит, pay-as-you-go | Kling 2.5 Turbo Pro **$0.35/5s** (лучший для кожи/сывороток); Veo 3.1 Fast $0.50 hero; LTX-2 $0.20 драфты |
| ✅ бесплатно | [Apify](https://apify.com/apify/instagram-scraper) | $5 кредита/мес free | Скрейп топ-рилсов 10 креаторов ≈ $3–5/прогон |
| ✅ бесплатно | [Groq](https://console.groq.com) | $0.04/час аудио | Транскрипты: 100 рилсов ≈ $0.05 |
| ✅ бесплатно | [upload-post.com](https://upload-post.com) | 10 постов/мес free → $24/мес | Автопост IG Reels + TikTok (официальный audited API) |
| ⏸ позже | [HeyGen API](https://www.heygen.com/api-pricing) | кошелёк от $5, ~$0.5–2/30s | Говорящие головы (avatar UGC) |
| ⏸ позже | [Metricool](https://metricool.com) MCP | ~€43/мес Advanced | Аналитика + расписание (MCP реальный, ~28 тулов) |
| ⏸ позже | [Arcads](https://arcads.ai) | $110/мес | Только hero-ads: самые живые AI-актёры |
| ❌ скинуть | Higgsfield подписка | $15–99/мес | Наценка над теми же моделями; **словарь камер берём бесплатно** ([camera-controls](https://higgsfield.ai/camera-controls)); их MCP `mcp.higgsfield.ai/mcp` — опция для ручного режима |
| ❌ скинуть | postoro (vaporware-waitlist) · trendsee (нет API) · klap/submagic (Remotion жжёт субтитры бесплатно) · Buffer/Later (API мертвы) · vidIQ MCP (YouTube-only, Max) · браузерные скрейперы (ручные) | — | — |

**Себестоимость ролика ≈ $1.5–2** (5 клипов × $0.35 + сборка/субтитры $0).
Музыка: лицензионная только (бизнес-аккаунты не могут брать трендовые
коммерческие треки) — Pixabay free сейчас, Epidemic ~$25/мес позже.

### Проверенные блюпринты-источники
- Front half: [n8n #12045 — Viral IG Reels → scripts (Apify+Whisper+LLM)](https://n8n.io/workflows/12045-transform-viral-instagram-reels-into-original-scripts-with-ai-perplexity-and-apify/)
- Back half: [n8n #3501 — GPT-4 + Kling + автопост (Dr. Firas)](https://n8n.io/workflows/3501-generate-and-auto-post-social-videos-to-multiple-platforms-with-gpt-4-and-kling-ai/), #5035/#10358 (Veo3 daily)
- Наши версии: `automation/n8n-trends.json`, `automation/n8n-produce.json`
  (только встроенные ноды, `$env`-креды, без vendor lock-in)

### 🔓 Разблокировка (шаги владельца, в порядке ценности)
1. **FAL_KEY** — https://fal.ai → Keys → прислать (env). Я генерю Kling-клипы
   по раскадровкам и собираю первый кинематографичный reel.
2. **Публичный URL n8n** (домен из Coolify) — проверяю доступность, импортируешь
   два JSON из `automation/`.
3. **APIFY_TOKEN** — https://console.apify.com → Integrations.
4. **UPLOADPOST_KEY + профиль** — https://upload-post.com (free tier).
5. *(опция)* **GROQ_API_KEY** — https://console.groq.com (free).
6. *(опция)* Higgsfield MCP коннектором в claude.ai: `mcp.higgsfield.ai/mcp`.

---

## 9. Production Core v1 — единая точка входа

Полная карта решений: `docs/creative-decision-os.md`. Кратко:

```
Gate 0 (rubric-lint, бесплатно) → draft render (stills/LTX-2) → превью-кадры
   → Gate 1 (человек) → HQ клипы (Kling 2.5) → Gate 2 (ffprobe QA)
   → ЭКСПОРТ-ПАК: reel.mp4 + thumbnail + caption + hashtags + SRT + storyboard
```

```bash
npm run ugc:lint                                        # проверить раскадровки
node scripts/produce.mjs vtech-mechanism en --yes       # бесплатный полный пак
FAL_KEY=... node scripts/produce.mjs vtech-mechanism en --hq  # кинематографичный
```

Знания системы: `src/data/patterns.json` (Pattern Genome) ·
`src/data/decision-journal.jsonl` (журнал решений) ·
`docs/virality-rubric.md` (пороги). Telegram-вход:
`automation/n8n-telegram.json` (см. README-ноду внутри — нужен cloudflared-
туннель для вебхуков Telegram при локальном n8n).
