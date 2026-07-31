// Production Core v1 orchestrator — one command from storyboard to a
// publish-ready EXPORT PACK, with Decision Gates so money is only spent on
// proven scenes (docs/creative-decision-os.md).
//
//   Gate 0  rubric-lint (free, static)          -> stop on violation
//   Stage 1 frames      (image key, optional)
//   Stage 2 draft clips (FAL_KEY --draft route) -> stills fallback, free
//           draft render + 3 preview frames
//   Gate 1  human look at previews              -> --yes skips, --hq continues
//   Stage 3 HQ clips    (Kling 2.5)             -> final render
//   Gate 2  programmatic QA (ffprobe vs computed duration/format)
//   Stage 4 export pack: reel.mp4 + thumbnail + caption + hashtags + srt +
//           storyboard.md   ("Done = pack, not mp4")
//
// Usage:
//   node scripts/produce.mjs <scriptId> <locale> [--hq] [--yes]
//   node scripts/produce.mjs vtech-mechanism en --yes        # free e2e (stills)
//   FAL_KEY=... node scripts/produce.mjs vtech-mechanism en --hq --yes
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith('--'));
const scriptId = pos[0] || 'vtech-mechanism';
const locale = pos[1] || 'en';
const HQ = args.includes('--hq');
const YES = args.includes('--yes') || HQ;

const FPS = 30;
const TRANSITION = 12; // frames, must match remotion/Short.tsx
const END = 75;
const BIN = path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu');
const FFMPEG = path.join(BIN, 'ffmpeg');
const FFPROBE = path.join(BIN, 'ffprobe');

const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) {
  console.error(`[produce] no script "${scriptId}"`);
  process.exit(1);
}

const run = (label, cmd, argv) => {
  console.log(`\n━━ ${label}`);
  execFileSync(cmd, argv, { stdio: 'inherit', cwd: root });
};

// ---- Gate 0: rubric lint (free) -----------------------------------------
run('Gate 0 — rubric lint', 'node', ['scripts/rubric-lint.mjs', scriptId]);

// ---- Stage 1/2: generation (key-gated, graceful without) ----------------
const hasImageKey = !!(
  process.env.FAL_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY
);
if (hasImageKey)
  run('Stage 1 — keyframes', 'node', ['remotion/generate-frames.mjs', scriptId]);
else console.log('\n━━ Stage 1 — keyframes: no image key, using product stills');

if (process.env.FAL_KEY)
  run('Stage 2 — draft clips (LTX-2)', 'node', [
    'remotion/generate-clips.mjs', scriptId, '--draft',
  ]);
else console.log('━━ Stage 2 — draft clips: no FAL_KEY, stills-only draft');

run('Stage 2 — draft render', 'node', ['remotion/render.mjs', scriptId, locale]);

const mp4 = path.join(root, 'out', `ugc-${scriptId}-${locale}.mp4`);
if (!fs.existsSync(mp4)) {
  console.error('[produce] render produced no file');
  process.exit(1);
}

// ---- Timing math (mirrors remotion/Short.tsx) ---------------------------
const durFrames = script.scenes.map((sc) => Math.round(sc.dur * FPS));
const starts = [];
let acc = 0;
script.scenes.forEach((sc, i) => {
  if (i > 0) {
    const prev = script.scenes[i - 1];
    acc += durFrames[i - 1] - ((prev.transition ?? 'cut') !== 'cut' ? TRANSITION : 0);
  }
  starts.push(acc);
});
const last = script.scenes.length - 1;
const expectedFrames =
  starts[last] + durFrames[last] -
  ((script.scenes[last].transition ?? 'cut') !== 'cut' ? TRANSITION : 0) + END;
const expectedSec = expectedFrames / FPS;

// ---- Previews + Gate 1 --------------------------------------------------
const packDir = path.join(root, 'out', `pack-${scriptId}-${locale}`);
fs.mkdirSync(path.join(packDir, 'previews'), { recursive: true });
for (const p of [0.2, 0.5, 0.8]) {
  execFileSync(FFMPEG, [
    '-y', '-ss', String((expectedSec * p).toFixed(2)), '-i', mp4,
    '-frames:v', '1', path.join(packDir, 'previews', `at-${Math.round(p * 100)}pct.png`),
  ], { stdio: 'pipe' });
}
console.log(`\n━━ Gate 1 — previews at ${path.relative(root, packDir)}/previews/`);
if (!YES) {
  console.log(
    'Draft stopped for review. Approve with:\n' +
      `  node scripts/produce.mjs ${scriptId} ${locale} --yes        # keep draft quality\n` +
      `  FAL_KEY=... node scripts/produce.mjs ${scriptId} ${locale} --hq   # upgrade to Kling 2.5`
  );
  process.exit(0);
}

// ---- Stage 3: HQ --------------------------------------------------------
if (HQ) {
  if (!process.env.FAL_KEY) {
    console.log('━━ Stage 3 — HQ requested but no FAL_KEY; keeping draft visuals');
  } else {
    run('Stage 3 — HQ clips (Kling 2.5 Turbo Pro)', 'node', [
      'remotion/generate-clips.mjs', scriptId,
    ]);
    run('Stage 3 — final render', 'node', ['remotion/render.mjs', scriptId, locale]);
  }
}

// ---- Gate 2: programmatic QA -------------------------------------------
console.log('\n━━ Gate 2 — QA (ffprobe)');
const probe = execFileSync(FFPROBE, [
  '-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height,codec_name,duration',
  '-of', 'json', mp4,
]).toString();
const st = JSON.parse(probe).streams[0];
const qa = [];
if (st.width !== 1080 || st.height !== 1920) qa.push(`resolution ${st.width}x${st.height} != 1080x1920`);
if (st.codec_name !== 'h264') qa.push(`codec ${st.codec_name} != h264`);
if (Math.abs(parseFloat(st.duration) - expectedSec) > 0.25)
  qa.push(`duration ${st.duration}s != expected ${expectedSec.toFixed(2)}s`);
if (qa.length) {
  console.error('QA FAIL:\n  ' + qa.join('\n  '));
  process.exit(1);
}
console.log(`QA PASS — 1080x1920 h264, ${parseFloat(st.duration).toFixed(2)}s (expected ${expectedSec.toFixed(2)}s)`);

// ---- Stage 4: export pack ("Done = pack") -------------------------------
console.log('\n━━ Stage 4 — export pack');
fs.copyFileSync(mp4, path.join(packDir, 'reel.mp4'));

// thumbnail = hook frame (~0.8s in)
execFileSync(FFMPEG, ['-y', '-ss', '0.8', '-i', mp4, '-frames:v', '1',
  path.join(packDir, 'thumbnail.png')], { stdio: 'pipe' });

fs.writeFileSync(path.join(packDir, 'caption.txt'),
  (script.caption?.[locale] ?? script.caption?.en ?? '') + '\n');
fs.writeFileSync(path.join(packDir, 'hashtags.txt'),
  (script.hashtags ?? []).join(' ') + '\n');

// SRT from scene timings (exact Short.tsx math)
const ts = (frames) => {
  const ms = Math.round((frames / FPS) * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const mm = String(ms % 1000).padStart(3, '0');
  return `${h}:${m}:${s},${mm}`;
};
const srt = script.scenes.map((sc, i) =>
  `${i + 1}\n${ts(starts[i])} --> ${ts(starts[i] + durFrames[i])}\n${sc.onScreen[locale] ?? sc.onScreen.en}\n`
).join('\n');
fs.writeFileSync(path.join(packDir, 'captions.srt'), srt);

// human-readable storyboard
const sb = [
  `# ${script.title} — ${scriptId} (${locale})`,
  '',
  `Hook: ${script.hook[locale] ?? script.hook.en}`,
  `CTA: ${script.cta[locale] ?? script.cta.en}`,
  `Duration: ${expectedSec.toFixed(1)}s · ${script.scenes.length} beats · audience: ${script.audience} · rung: ${script.awareness}`,
  '',
  '| # | dur | camera | on-screen | visual |',
  '|---|-----|--------|-----------|--------|',
  ...script.scenes.map((sc, i) =>
    `| ${i + 1} | ${sc.dur}s | ${sc.camera} | ${(sc.onScreen[locale] ?? sc.onScreen.en).replace(/\|/g, '/')} | ${sc.visual.slice(0, 80)}… |`),
  '',
  `Caption: ${script.caption?.[locale] ?? ''}`,
].join('\n');
fs.writeFileSync(path.join(packDir, 'storyboard.md'), sb + '\n');

console.log(`[done] ${path.relative(root, packDir)}/`);
for (const f of fs.readdirSync(packDir)) console.log(`   ${f}`);
