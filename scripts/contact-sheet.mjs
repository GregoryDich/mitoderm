// Контактный лист: START/END кадры каждой сцены копируются в
// out/contact-<scriptId>/ с корректным расширением (fal отдаёт jpeg с
// именем .png) — владелец утверждает кадры ДО трат на видео.
// Usage: node scripts/contact-sheet.mjs <scriptId>
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scriptId = process.argv[2] || 'vtech-pdrn-pov';

const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/ugc-scripts.json'), 'utf8'));
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) { console.error('no script'); process.exit(1); }

const dir = path.join(root, 'public/ugc-frames', scriptId);
const outDir = path.join(root, 'out', `contact-${scriptId}`);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const extOf = (buf) =>
  buf[0] === 0x89 && buf[1] === 0x50 ? 'png' : buf[0] === 0xff && buf[1] === 0xd8 ? 'jpg' : 'bin';

let n = 0;
for (const sc of script.scenes) {
  for (const [tag, suffix] of [['A-start', '-start'], ['B-end', '-end']]) {
    const src = path.join(dir, `${sc.id}${suffix}.png`);
    if (!fs.existsSync(src)) continue;
    const buf = fs.readFileSync(src);
    fs.writeFileSync(path.join(outDir, `${sc.id}-${tag}.${extOf(buf)}`), buf);
    n++;
  }
}
console.log(`[contact] ${path.relative(root, outDir)}/ (${n} кадров)`);
