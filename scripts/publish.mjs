// Publish a rendered short to IG Reels + TikTok via upload-post.com — the
// cheapest reliable unified posting API (free 10 uploads/mo, Basic $24/mo;
// official audited TikTok Content Posting API + IG REELS under the hood).
// Caption comes from the script's JSON (rubric pt 9: first line re-hooks,
// <=5 niche hashtags; pt 11: CTA lives here, not in the video).
//
// Usage:
//   UPLOADPOST_KEY=... UPLOADPOST_USER=<profile> node scripts/publish.mjs \
//     <scriptId> <locale> [--platforms instagram,tiktok] [--tiktok-draft]
//   e.g. node scripts/publish.mjs vtech-mechanism en --tiktok-draft
//
// --tiktok-draft posts to the TikTok inbox for in-app review before going
// public (recommended for the first runs). Without keys: dry-run.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const scriptId = positional[0] || 'vtech-mechanism';
const locale = positional[1] || 'en';
const platIdx = args.indexOf('--platforms');
const platforms = (platIdx >= 0 ? args[platIdx + 1] : 'instagram,tiktok')
  .split(',')
  .map((s) => s.trim());
const tiktokDraft = args.includes('--tiktok-draft');

const KEY = process.env.UPLOADPOST_KEY;
const USER = process.env.UPLOADPOST_USER;

const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) {
  console.error(`no script ${scriptId}`);
  process.exit(1);
}
const caption = script.caption?.[locale] ?? script.caption?.en ?? '';
const hashtagCount = (caption.match(/#[^\s#]+/g) || []).length;
if (hashtagCount > 5)
  console.warn(
    `[warn] caption has ${hashtagCount} hashtags — IG hard-caps at 5 (Dec 2025); trim in ugc-scripts.json`
  );

const video = path.join(root, 'out', `ugc-${scriptId}-${locale}.mp4`);
const exists = fs.existsSync(video);

console.log(`[publish] ${scriptId} (${locale}) -> ${platforms.join(', ')}`);
console.log(`[video] ${path.relative(root, video)} ${exists ? 'OK' : 'MISSING — run npm run remotion:render first'}`);
console.log(`[caption] ${caption}`);

if (!KEY || !USER) {
  console.log('\n[dry] UPLOADPOST_KEY / UPLOADPOST_USER not set. Would send:');
  console.log('  POST https://api.upload-post.com/api/upload');
  console.log('  Authorization: Apikey ***');
  console.log(
    '  multipart: video=<mp4>, title=<caption>, user=<profile>, ' +
      platforms.map((p) => `platform[]=${p}`).join(', ') +
      (tiktokDraft ? ', post_mode=draft (tiktok)' : '')
  );
  process.exit(0);
}
if (!exists) process.exit(1);

const form = new FormData();
form.append(
  'video',
  new Blob([fs.readFileSync(video)], { type: 'video/mp4' }),
  path.basename(video)
);
form.append('title', caption);
form.append('user', USER);
for (const p of platforms) form.append('platform[]', p);
if (tiktokDraft && platforms.includes('tiktok'))
  form.append('post_mode', 'draft');

const r = await fetch('https://api.upload-post.com/api/upload', {
  method: 'POST',
  headers: { Authorization: `Apikey ${KEY}` },
  body: form,
});
const body = await r.text();
if (!r.ok) {
  console.error(`[fail] ${r.status}: ${body}`);
  process.exit(1);
}
console.log(`[done] ${body}`);
