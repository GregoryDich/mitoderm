// Storyboard -> AI video clips (the higgsfield-class node). For each scene it
// animates the scene's product still (or generated frame) into a short
// cinematic clip via fal.ai image-to-video, writing
// public/ugc-clips/<scriptId>/<sceneId>.mp4 — which the Remotion engine then
// assembles with transitions, captions and branding.
//
// Why fal: higgsfield has no MCP/API I can reach headless; fal.ai hosts
// higgsfield-class video models (Kling, Veo, LTX, MiniMax) behind one HTTPS
// key. Prefer this over the UI when you want the pipeline fully automated.
// (Or drive higgsfield's UI yourself and drop the exports into
// public/ugc-clips/<id>/<sceneId>.mp4 — the engine picks them up either way.)
//
// Usage:
//   FAL_KEY=... node remotion/generate-clips.mjs <scriptId> [--all] [--hero|--draft]
//     (default route: Kling 2.5 Turbo Pro; --hero: Veo 3.1 Fast;
//      --draft: LTX-2; FAL_VIDEO_MODEL env overrides the route)
//
// No key -> prints the plan and exits (this headless session has no key).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const style = data.meta.style;
const args = process.argv.slice(2);
const all = args.includes('--all');
const ids = all
  ? data.scripts.map((s) => s.id)
  : [args.find((a) => !a.startsWith('--')) || 'vtech-mechanism'];

// Model routing (July 2026, per docs/ugc-video-pipeline.md research):
//   default — Kling 2.5 Turbo Pro: community-best for skin texture / serum
//             macro at ~$0.35 per 5s 9:16 clip
//   --hero  — Veo 3.1 Fast: cinematic language + native audio, ~$0.50/5s
//   --draft — LTX-2: cheap volume drafts, ~$0.20-0.25/5s
const ROUTES = {
  default: 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video',
  hero: 'fal-ai/veo3.1/fast/image-to-video',
  draft: 'fal-ai/ltx-video-v2/image-to-video',
};
const route = args.includes('--hero')
  ? 'hero'
  : args.includes('--draft')
  ? 'draft'
  : 'default';
const MODEL = process.env.FAL_VIDEO_MODEL || ROUTES[route];
const KEY = process.env.FAL_KEY;

const MIME = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

// Prefer a generated frame as the source still; else the product still.
function sourceStill(scriptId, scene) {
  const frame = path.join(root, 'public/ugc-frames', scriptId, `${scene.id}.png`);
  if (fs.existsSync(frame)) return frame;
  return path.join(root, 'public', scene.media.replace(/^\//, ''));
}

function dataUri(file) {
  const ext = path.extname(file).toLowerCase();
  const b64 = fs.readFileSync(file).toString('base64');
  return `data:${MIME[ext] || 'image/png'};base64,${b64}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Queue API + polling: video models run for minutes — a held sync
// connection through a proxy is fragile, the queue survives it. Per fal
// billing docs, validation failures and 5xx are never charged.
async function falImageToVideo(prompt, imageUri) {
  const submit = await fetch(`https://queue.fal.run/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_url: imageUri,
      duration: '5',
      aspect_ratio: '9:16',
    }),
  });
  if (!submit.ok) throw new Error(`fal submit ${submit.status}: ${await submit.text()}`);
  const { request_id, status_url, response_url } = await submit.json();
  process.stdout.write(`req=${request_id} `);

  const deadline = Date.now() + 10 * 60 * 1000;
  for (;;) {
    if (Date.now() > deadline) throw new Error('fal: 10min poll timeout');
    await sleep(6000);
    let st;
    try {
      const r = await fetch(status_url, { headers: { Authorization: `Key ${KEY}` } });
      st = await r.json();
    } catch {
      continue; // transient proxy hiccup — keep polling
    }
    if (st.status === 'COMPLETED') break;
    if (st.status === 'FAILED' || st.status === 'CANCELLED')
      throw new Error(`fal: ${st.status}`);
    process.stdout.write('.');
  }
  const res = await fetch(response_url, { headers: { Authorization: `Key ${KEY}` } });
  const j = await res.json();
  const url = j.video?.url || j.videos?.[0]?.url;
  if (!url) throw new Error(`fal: no video url: ${JSON.stringify(j).slice(0, 200)}`);
  return downloadWithRetry(url);
}

// The clip is already PAID FOR by the time we download it — never lose it
// to a transient proxy 503. Node-fetch through the agent proxy flakes where
// curl succeeds (seen live with Apify), so fall back to curl, with backoff.
async function downloadWithRetry(url, attempts = 4) {
  const { execFileSync } = await import('node:child_process');
  const os = await import('node:os');
  for (let i = 0; i < attempts; i++) {
    if (i > 0) await sleep(2000 * 2 ** i);
    try {
      const v = await fetch(url);
      if (v.ok) return Buffer.from(await v.arrayBuffer());
      process.stdout.write(`[dl ${v.status}] `);
    } catch (e) {
      process.stdout.write('[dl err] ');
    }
    try {
      const tmp = path.join(os.tmpdir(), `fal-dl-${i}.bin`);
      execFileSync('curl', ['-sS', '-f', '-m', '120', '-o', tmp, url], { stdio: 'pipe' });
      const buf = fs.readFileSync(tmp);
      fs.rmSync(tmp, { force: true });
      if (buf.length > 1000) return buf;
    } catch {
      process.stdout.write('[curl err] ');
    }
  }
  throw new Error(`download failed after ${attempts} attempts: ${url.slice(0, 80)}`);
}

for (const id of ids) {
  const script = data.scripts.find((s) => s.id === id);
  if (!script) continue;
  const outDir = path.join(root, 'public/ugc-clips', id);
  fs.mkdirSync(outDir, { recursive: true });
  // --only s1  → generate a single scene (cheap probe before batching)
  const onlyIdx = args.indexOf('--only');
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
  const scenes = only
    ? script.scenes.filter((s) => s.id === only)
    : script.scenes;
  console.log(`\n=== ${id} (${scenes.length} scenes, model ${MODEL}) ===`);
  for (const scene of scenes) {
    const still = sourceStill(id, scene);
    // Kling grammar (docs/virality-rubric.md pt 6): subject/style first,
    // exactly ONE named camera move, stated LAST.
    // Reframe (real product) scenes get MOTION-ONLY prompts: describing
    // objects that aren't in the source frame makes i2v hallucinate them
    // (a phantom jar appeared in a hand scene — owner caught it live).
    const camera = scene.camera || 'slow push-in over 5 seconds';
    const prompt =
      scene.keyframe === 'reframe'
        ? `Subtle cinematic motion over this exact product shot. Do not add, remove, or transform any objects, packaging, or text. ${style.look}. Camera: ${camera}.`
        : `${scene.visual}. ${style.look}. Camera: ${camera}.`;
    const out = path.join(outDir, `${scene.id}.mp4`);
    // Money guard: each clip costs real dollars — never regenerate an
    // existing one unless explicitly forced.
    if (fs.existsSync(out) && !args.includes('--force')) {
      console.log(`[skip] ${scene.id}: clip exists (--force to regenerate)`);
      continue;
    }
    if (!KEY) {
      console.log(`[dry] ${scene.id}: still=${path.relative(root, still)}\n        prompt="${prompt}"`);
      continue;
    }
    try {
      process.stdout.write(`[fal] ${scene.id} ... `);
      const buf = await falImageToVideo(prompt, dataUri(still));
      fs.writeFileSync(out, buf);
      console.log(`saved ${(buf.length / 1e6).toFixed(2)} MB -> ${path.relative(root, out)}`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
    }
  }
}

if (!KEY) {
  console.log(
    '\nNo FAL_KEY set — printed the clip plan only. Set FAL_KEY (optionally FAL_VIDEO_MODEL) to generate, then `npm run remotion:render -- <id> <locale>` assembles the clips.'
  );
}
