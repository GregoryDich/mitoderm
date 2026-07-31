// Приём реального сырья (гибридный конвейер): проверка, нормализация в
// 1080x1920@30, раскладка в слоты сцен. Движок дальше работает как обычно —
// реальный клип живёт в том же public/ugc-clips/<scriptId>/<sceneId>.mp4.
//
// Вход: public/footage/incoming/<scriptId>/  файлы s1.*, s2.*, ... (mov/mp4)
// Usage: node scripts/ingest-footage.mjs <scriptId>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const scriptId = process.argv[2] || 'mitoderm-hybrid-01';
const BIN = path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu');
const FFMPEG = path.join(BIN, 'ffmpeg');
const FFPROBE = path.join(BIN, 'ffprobe');

const data = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8')
);
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) {
  console.error(`нет сценария ${scriptId}`);
  process.exit(1);
}

const inDir = path.join(root, 'public/footage/incoming', scriptId);
const outDir = path.join(root, 'public/ugc-clips', scriptId);
fs.mkdirSync(inDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const files = fs.existsSync(inDir) ? fs.readdirSync(inDir) : [];
const covered = [];
const missing = [];

for (const sc of script.scenes) {
  const src = files.find((f) => f.toLowerCase().startsWith(sc.id + '.'));
  if (!src) {
    missing.push(sc.id);
    continue;
  }
  const input = path.join(inDir, src);
  const probe = execFileSync(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,duration', '-of', 'csv=p=0', input,
  ]).toString().trim().split(',');
  const [w, h] = [parseInt(probe[0]), parseInt(probe[1])];
  const vertical = h >= w;
  // Нормализация: кроп до 9:16 + масштаб 1080x1920, 30fps, без звука (VO
  // отдельно; звук исходника сохраняем рядом на случай живой речи).
  const out = path.join(outDir, `${sc.id}.mp4`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(FFMPEG, [
    '-y', '-i', input,
    '-vf', 'crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=1080:1920',
    '-r', '30',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
    '-c:a', 'aac', '-b:a', '128k',
    out,
  ], { stdio: 'pipe' });
  covered.push(`${sc.id} <- ${src} (${w}x${h}${vertical ? '' : ' ⚠ горизонталь, кропнул центр'})`);
}

console.log(`=== ingest ${scriptId} ===`);
for (const c of covered) console.log('  ✓', c);
for (const m of missing) console.log('  ✗ нет файла для', m, '(останется AI/стилл-фоллбэк)');
console.log(missing.length === 0
  ? 'Полное покрытие — можно собирать: node scripts/produce.mjs ' + scriptId + ' ru --yes'
  : `Покрыто ${covered.length}/${script.scenes.length}.`);
