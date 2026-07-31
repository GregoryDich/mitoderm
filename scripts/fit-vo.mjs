// VO-fit: измеряет длительность каждой VO-реплики (ffprobe) и растягивает
// dur сцены так, чтобы озвучка НИКОГДА не обрезалась (замечание владельца:
// «текст прерывается»). Пишет обновлённые dur в ugc-scripts.json и ставит
// pacing:"doc" (лимиты линтера для док-формата шире).
// Usage: node scripts/fit-vo.mjs <scriptId> <locale>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const [scriptId = 'mitoderm-doc-ugc', locale = 'ru'] = process.argv.slice(2);
const FFPROBE = path.join(root, 'node_modules/@remotion/compositor-linux-x64-gnu/ffprobe');

const p = path.join(root, 'src/data/ugc-scripts.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const script = data.scripts.find((s) => s.id === scriptId);
if (!script) { console.error('no script'); process.exit(1); }

let changed = false;
for (const sc of script.scenes) {
  for (const loc of [locale, 'en']) {
    const mp3 = path.join(root, 'public/ugc-vo', scriptId, loc, `${sc.id}.mp3`);
    if (!fs.existsSync(mp3)) continue;
    const dur = parseFloat(execFileSync(FFPROBE, [
      '-v','error','-show_entries','format=duration','-of','csv=p=0', mp3,
    ]).toString());
    const need = Math.ceil((dur + 0.4) * 10) / 10; // +0.4s дыхание
    if (need > sc.dur) {
      console.log(`${sc.id}: dur ${sc.dur}s -> ${need}s (vo ${dur.toFixed(1)}s)`);
      sc.dur = need;
      changed = true;
    } else {
      console.log(`${sc.id}: dur ${sc.dur}s ok (vo ${dur.toFixed(1)}s)`);
    }
    break;
  }
}
if (changed || script.pacing !== 'doc') {
  script.pacing = 'doc';
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  const total = script.scenes.reduce((a, s) => a + s.dur, 0);
  console.log(`[saved] total beats ${total.toFixed(1)}s (+2.5s endcard)`);
} else console.log('[no changes]');
