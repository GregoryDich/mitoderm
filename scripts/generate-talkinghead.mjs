// HeyGen talking-photo node: наш мастер-портрет + наш VO mp3 = та же
// женщина, тот же голос, НАСТОЯЩИЙ липсинк. Клип пишется прямо в
// public/ugc-clips/<scriptId>/<sceneId>.mp4 — движок подхватывает, его
// звук заменяет VO-дорожку (render.mjs пробивает аудио).
// Usage: HEYGEN_API_KEY=... node scripts/generate-talkinghead.mjs <scriptId> <sceneId> <locale>
import fs from 'node:fs';
import path from 'node:path';
import { sleep, downloadWithRetry } from '../remotion/fal-utils.mjs';

const root = process.cwd();
const [scriptId = 'mitoderm-doc-ugc', sceneId = 's1', locale = 'ru'] =
  process.argv.slice(2);
const KEY = process.env.HEYGEN_API_KEY;
if (!KEY) { console.error('HEYGEN_API_KEY missing'); process.exit(1); }

const H = { 'x-api-key': KEY };

async function uploadTalkingPhoto(file) {
  const r = await fetch('https://upload.heygen.com/v1/talking_photo', {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'image/png' },
    body: fs.readFileSync(file),
  });
  const j = await r.json();
  if (!j.data?.talking_photo_id) throw new Error(`tp upload: ${JSON.stringify(j).slice(0, 200)}`);
  return j.data.talking_photo_id;
}
async function uploadAudio(file) {
  const r = await fetch('https://upload.heygen.com/v1/asset', {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'audio/mpeg' },
    body: fs.readFileSync(file),
  });
  const j = await r.json();
  if (!j.data?.id) throw new Error(`audio upload: ${JSON.stringify(j).slice(0, 200)}`);
  return j.data.id;
}

// Кэш загрузок, чтобы не заливать портрет заново на каждую сцену.
const cachePath = path.join(root, '.heygen-cache.json');
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};

const portrait = path.join(root, 'public/ugc-frames', scriptId, 'master-portrait.png');
if (!cache[portrait]) {
  process.stdout.write('[upload] portrait ... ');
  cache[portrait] = await uploadTalkingPhoto(portrait);
  console.log(cache[portrait]);
}
const mp3 = path.join(root, 'public/ugc-vo', scriptId, locale, `${sceneId}.mp3`);
if (!cache[mp3]) {
  process.stdout.write(`[upload] ${sceneId} audio ... `);
  cache[mp3] = await uploadAudio(mp3);
  console.log(cache[mp3]);
}
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

process.stdout.write('[heygen] generate ... ');
const gen = await fetch('https://api.heygen.com/v2/video/generate', {
  method: 'POST',
  headers: { ...H, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    video_inputs: [{
      character: { type: 'talking_photo', talking_photo_id: cache[portrait] },
      voice: { type: 'audio', audio_asset_id: cache[mp3] },
      background: { type: 'color', value: '#f4f1ec' },
    }],
    dimension: { width: 720, height: 1280 },
  }),
});
const gj = await gen.json();
const videoId = gj.data?.video_id;
if (!videoId) throw new Error(`generate: ${JSON.stringify(gj).slice(0, 300)}`);
console.log(`video_id=${videoId}`);

const deadline = Date.now() + 12 * 60 * 1000;
let url = null;
for (;;) {
  if (Date.now() > deadline) throw new Error('poll timeout');
  await sleep(8000);
  const st = await (await fetch(
    `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, { headers: H }
  )).json();
  const s = st.data?.status;
  if (s === 'completed') { url = st.data.video_url; break; }
  if (s === 'failed') throw new Error(`heygen failed: ${JSON.stringify(st.data?.error).slice(0, 200)}`);
  process.stdout.write('.');
}
const out = path.join(root, 'public/ugc-clips', scriptId, `${sceneId}.mp4`);
fs.mkdirSync(path.dirname(out), { recursive: true });
const buf = await downloadWithRetry(url);
fs.writeFileSync(out, buf);
console.log(`\n[done] ${(buf.length / 1e6).toFixed(2)} MB -> ${path.relative(root, out)}`);
