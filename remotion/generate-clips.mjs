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
//   FAL_KEY=... node remotion/generate-clips.mjs <scriptId> [--all]
//   FAL_VIDEO_MODEL=fal-ai/kling-video/v1.6/standard/image-to-video (default)
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
const ids = all ? data.scripts.map((s) => s.id) : [args[0] || 'vtech-mechanism'];
const MODEL =
  process.env.FAL_VIDEO_MODEL ||
  'fal-ai/kling-video/v1.6/standard/image-to-video';
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

async function falImageToVideo(prompt, imageUri) {
  const r = await fetch(`https://fal.run/${MODEL}`, {
    method: 'POST',
    headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_url: imageUri,
      duration: '5',
      aspect_ratio: '9:16',
    }),
  });
  if (!r.ok) throw new Error(`fal ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const url = j.video?.url || j.videos?.[0]?.url;
  if (!url) throw new Error('fal: no video url in response');
  const v = await fetch(url);
  return Buffer.from(await v.arrayBuffer());
}

for (const id of ids) {
  const script = data.scripts.find((s) => s.id === id);
  if (!script) continue;
  const outDir = path.join(root, 'public/ugc-clips', id);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`\n=== ${id} (${script.scenes.length} scenes, model ${MODEL}) ===`);
  for (const scene of script.scenes) {
    const still = sourceStill(id, scene);
    const prompt = `${scene.visual}. Camera: subtle ${scene.motion || 'push-in'} move. ${style.look}.`;
    const out = path.join(outDir, `${scene.id}.mp4`);
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
