// Storyboard -> AI keyframes. Reads src/data/ugc-scripts.json and generates
// one 9:16 image per scene into public/ugc-frames/<scriptId>/<sceneId>.png,
// which the Remotion engine then animates. Pluggable backend, chosen by which
// API key is in the environment (no MCP approval needed — plain HTTPS):
//
//   FAL_KEY      -> fal.ai FLUX            (recommended, native 1080x1920)
//   OPENAI_API_KEY -> OpenAI gpt-image-1   (1024x1536, upscaled at render)
//   GEMINI_API_KEY -> Gemini image         (nano-banana)
//
// Usage:
//   node remotion/generate-frames.mjs <scriptId> [--all]
//   FAL_KEY=... node remotion/generate-frames.mjs vtech-mechanism
//
// Without any key it prints the prompts it WOULD send and exits 0, so the
// storyboard is reviewable even here (this headless session has no key and
// cannot approve the Firefly/HF MCP image tools).
import fs from 'node:fs';
import path from 'node:path';
import { falQueue, downloadWithRetry } from './fal-utils.mjs';

const root = process.cwd();
const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const style = data.meta.style;
const args = process.argv.slice(2);
const all = args.includes('--all');
const ids = all
  ? data.scripts.map((s) => s.id)
  : [args[0] || 'vtech-mechanism'];

const backend = process.env.FAL_KEY
  ? 'fal'
  : process.env.OPENAI_API_KEY
  ? 'openai'
  : process.env.GEMINI_API_KEY
  ? 'gemini'
  : null;

const fullPrompt = (scene) =>
  `${scene.visual}. Style: ${style.look}. ${style.aspect}. No text or logos. Avoid: ${style.negative}.`;

// Text-to-image keyframe. Default flux/dev ($0.025/img, proven look);
// override with FAL_IMAGE_MODEL (e.g. a stronger model) without code edits.
const IMAGE_MODEL = process.env.FAL_IMAGE_MODEL || 'fal-ai/flux/dev';
async function genFal(prompt) {
  const j = await falQueue(
    IMAGE_MODEL,
    { prompt, image_size: { width: 1080, height: 1920 }, num_images: 1 },
    process.env.FAL_KEY,
    { timeoutMin: 5 }
  );
  const url = j.images?.[0]?.url;
  if (!url) throw new Error(`no image url: ${JSON.stringify(j).slice(0, 160)}`);
  return downloadWithRetry(url);
}

// Real product still -> native 9:16 FULL-BLEED via generative expand.
// Bria expand ($0.04) grows the actual ENVIRONMENT around the real
// packaging (no letterbox voids — the owner read those as "square video").
// Fallback: Ideogram v3 reframe ($0.03, black-void look).
const MIME = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
async function genReframe(stillPath, envPrompt) {
  const ext = path.extname(stillPath).toLowerCase();
  const dataUri = `data:${MIME[ext] || 'image/png'};base64,${fs.readFileSync(stillPath).toString('base64')}`;
  try {
    const j = await falQueue(
      'fal-ai/bria/expand',
      {
        image_url: dataUri,
        canvas_size: [1080, 1920],
        aspect_ratio: '9:16',
        prompt: envPrompt,
      },
      process.env.FAL_KEY,
      { timeoutMin: 5 }
    );
    const url = j.images?.[0]?.url ?? j.image?.url;
    if (!url) throw new Error(`bria: no url: ${JSON.stringify(j).slice(0, 160)}`);
    return await downloadWithRetry(url);
  } catch (e) {
    process.stdout.write(`[bria failed: ${String(e.message).slice(0, 60)}; ideogram] `);
    const j = await falQueue(
      'fal-ai/ideogram/v3/reframe',
      { image_url: dataUri, image_size: { width: 1080, height: 1920 } },
      process.env.FAL_KEY,
      { timeoutMin: 5 }
    );
    const url = j.images?.[0]?.url;
    if (!url) throw new Error(`no image url: ${JSON.stringify(j).slice(0, 160)}`);
    return downloadWithRetry(url);
  }
}

async function genOpenAI(prompt) {
  const r = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1536',
      n: 1,
    }),
  });
  if (!r.ok) throw new Error(`openai ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return Buffer.from(j.data[0].b64_json, 'base64');
}

async function genGemini(prompt) {
  const model = 'gemini-2.5-flash-image-preview';
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!r.ok) throw new Error(`gemini ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const part = j.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error('gemini: no image in response');
  return Buffer.from(part.inlineData.data, 'base64');
}

const generate = { fal: genFal, openai: genOpenAI, gemini: genGemini };

for (const id of ids) {
  const script = data.scripts.find((s) => s.id === id);
  if (!script) {
    console.error(`no script ${id}`);
    continue;
  }
  const outDir = path.join(root, 'public/ugc-frames', id);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`\n=== ${id} (${script.scenes.length} scenes) ===`);
  for (const scene of script.scenes) {
    const prompt = fullPrompt(scene);
    const out = path.join(outDir, `${scene.id}.png`);
    if (!backend) {
      console.log(`[dry] ${scene.id}: ${prompt}`);
      continue;
    }
    // Money guard: don't regenerate an existing frame unless forced.
    if (fs.existsSync(out) && !process.argv.includes('--force')) {
      console.log(`[skip] ${scene.id}: frame exists (--force to regenerate)`);
      continue;
    }
    try {
      // Product scenes carry "keyframe": "reframe" — the REAL still gets
      // outpainted to native 9:16 instead of a t2i model inventing a fake
      // product. Everything else is generated from the visual prompt.
      // 'character' scenes share ONE master portrait — the same face across
      // the whole reel (t2i would invent a new woman per scene). First
      // character scene generates the master; the rest reuse it; i2v then
      // animates each scene differently.
      if (scene.keyframe === 'character') {
        const master = path.join(outDir, 'master-portrait.png');
        if (!fs.existsSync(master)) {
          process.stdout.write(`[master] ${scene.id} ... `);
          const buf = await generate[backend](prompt);
          fs.writeFileSync(master, buf);
          console.log(`saved master ${(buf.length / 1e3).toFixed(0)} KB`);
        }
        fs.copyFileSync(master, out);
        console.log(`[character] ${scene.id}: reuses master portrait`);
        continue;
      }
      if (scene.keyframe === 'reframe') {
        const still = path.join(root, 'public', scene.media.replace(/^\//, ''));
        process.stdout.write(`[reframe] ${scene.id} ... `);
        const buf = await genReframe(still, `${scene.visual}. ${style.look}`);
        fs.writeFileSync(out, buf);
        console.log(`saved ${(buf.length / 1e3).toFixed(0)} KB -> ${path.relative(root, out)}`);
        continue;
      }
      process.stdout.write(`[${backend}] ${scene.id} ... `);
      const buf = await generate[backend](prompt);
      fs.writeFileSync(out, buf);
      console.log(`saved ${(buf.length / 1e3).toFixed(0)} KB -> ${path.relative(root, out)}`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }
}

if (!backend) {
  console.log(
    '\nNo image API key set — printed prompts only. Set FAL_KEY / OPENAI_API_KEY / GEMINI_API_KEY to generate, then `npm run remotion:render -- <id> <locale>`.'
  );
}
