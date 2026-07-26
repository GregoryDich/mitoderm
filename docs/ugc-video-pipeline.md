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
