# MCP setup — image / video generation servers

> **Why this file exists.** Phase 3 §B of the plan calls for image
> generation to fill the nine slots already wired in code (Bio-Spicules
> line hero, homepage ambient, 4 science pillars, 3 blog headers — see
> `docs/image-prompts.md`). The Adobe MCP wired in this environment only
> does image *editing* (inpaint, color, masks). To generate images from
> text we need a different MCP. This doc lists the realistic options
> and the install snippets so you can wire one without searching.
>
> Once any of the servers below is online, point me at it and I'll
> resume §B without further changes to the plan.

## How to install an MCP server in Claude Code

Two routes — pick whichever fits your workflow:

**CLI (one-shot):**

```bash
# Pattern: claude mcp add <name> --command "<exec>" [--arg key=val ...]
claude mcp add <server-name> --command "<command-the-vendor-publishes>"
```

**Config file (`~/.claude.json` on macOS/Linux, or per-project
`.mcp.json`):**

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "npx",
      "args": ["-y", "<vendor-package>"],
      "env": {
        "<VENDOR>_API_KEY": "your-key-here"
      }
    }
  }
}
```

After editing, run `claude mcp list` to confirm the server registered,
then restart the session so the schemas load.

---

## Image generation — pick one

The three I'd recommend, in order of "least friction to working
output for our nine slots":

### 1. **Hugging Face MCP** (already partially wired in this env)

The `mcp__901c54eb-*` server is already mounted in this environment.
The `dynamic_space` tool can invoke any text-to-image Space — FLUX.1
schnell, SDXL, Stable Diffusion 3, Playground, etc. — without
installing anything new. The only reason §B didn't run today is that
each call hits the same "MCP tool call requires approval" gate as
Ahrefs.

**Action required:** approve the HF MCP once in your harness. After
that I can iterate through the prompt pack without further prompts.

- Vendor docs: <https://huggingface.co/docs/hub/spaces>
- MCP entry point: `huggingface.co/mcp` (the server URL already
  registered in your environment).

### 2. **Glif MCP**

Glif (<https://glif.app>) hosts named pipelines (a "glif") that combine
image generation, prompt rewriting, and post-processing. Good for our
case because you can publish one "Mitoderm hero" glif with the art-
direction guardrails pre-baked and call it by id from the chat.

**Suggested config snippet** (verify the exact package name on the
Glif docs page — Glif publishes its current MCP entry point under
"Developers / MCP"):

```json
{
  "mcpServers": {
    "glif": {
      "command": "npx",
      "args": ["-y", "@glif/mcp-server"],
      "env": { "GLIF_API_KEY": "glif_..." }
    }
  }
}
```

- Vendor: <https://glif.app>
- Pricing: free tier, then per-generation credits.

### 3. **OpenArt MCP**

OpenArt (<https://openart.ai>) wraps FLUX, SDXL and several fine-tunes
behind a single API. Good for batch generation against a brief.

```json
{
  "mcpServers": {
    "openart": {
      "command": "npx",
      "args": ["-y", "@openart/mcp-server"],
      "env": { "OPENART_API_KEY": "oa_..." }
    }
  }
}
```

- Vendor: <https://openart.ai>
- Pricing: free tier with daily quota, paid plans for batch.

### What I'd skip for this site

- **Google Gemini MCP / Imagen.** You already have a Google image
  generator on your side per the brief — adding a second one in the
  agent loop is duplication.
- **Adobe Firefly text-to-image.** Not exposed in the current Adobe
  MCP (it offers only editing operations).

---

## Video generation — defer

The plan has **no video slots** today. Hero is typography + an ambient
image, product cards use the existing `HoverVideoMedia` component which
plays user-uploaded MP4s, and the journal is text + headers. Wiring a
video-gen MCP would be net-new content surface, not unblocking the
roadmap. Listing the leading options for the record so you can decide:

### Higgsfield MCP

- Vendor: <https://higgsfield.ai>
- Strengths: 4K, up to 15 s clips, multiple models (Kling, Nano Banana,
  Dance 2). Useful if we later add a hero reel.
- Config skeleton (verify the entry point on Higgsfield's developer
  docs):

```json
{
  "mcpServers": {
    "higgsfield": {
      "command": "npx",
      "args": ["-y", "@higgsfield/mcp-server"],
      "env": { "HIGGSFIELD_API_KEY": "hf_..." }
    }
  }
}
```

### Pollo MCP

- Vendor: <https://pollo.ai>
- Strengths: aggregator over many video-gen models; convenient for
  prototyping different looks against one prompt.
- Config skeleton: same shape as above, swap names.

**Recommendation:** revisit when there's a concrete video slot on the
roadmap (e.g. a homepage hero reel or a per-line behind-the-scenes
clip). Don't wire either today.

---

## Automation / workflow MCPs

For the marketing-asset workflows you mentioned (Figma/Canva-style
templates, carousel renders, screenshot pipelines):

### Filesystem MCP

The reference filesystem MCP (`@modelcontextprotocol/server-filesystem`)
lets agents read/write files outside the project working directory —
useful if generated assets land in a separate workspace folder before
being copied into `public/`.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/path/to/generated-assets"]
    }
  }
}
```

- Source: <https://github.com/modelcontextprotocol/servers> (the
  official reference repo lists this and other vetted servers).

### Puppeteer MCP

Lets an agent open a browser, navigate, and screenshot a page — useful
for rendering an HTML carousel template to PNG/PDF.

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

- Source: <https://github.com/modelcontextprotocol/servers>

### Vercel / Netlify

Deploy hooks are already on the project. Adding the **Vercel** MCP
(it's wired in this env but approval-gated — same as Ahrefs / HF)
would surface deployment state, runtime logs, env-var presence
(`NEXT_PUBLIC_GOOGLE_ID`!) directly from the chat. **Approving it once
unblocks the §C "deploy reality check" from the plan.**

---

## Recommended minimum to unblock the plan

1. **Approve the HF MCP** (already wired) → unblocks image generation
   for the nine slots without installing anything new.
2. **Approve the Vercel MCP** (already wired) → unblocks the deploy
   reality check.
3. **Approve the Ahrefs MCP** (already wired) → unblocks §A
   data-driven content planning.

If you want a dedicated image-gen MCP separate from HF (Glif or
OpenArt), install one and tell me which — the prompt pack at
`docs/image-prompts.md` is generator-agnostic.

Everything in this doc is additive to the plan. It does not change
what's already shipped on this branch or queued in `STATE.md`.
