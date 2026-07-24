// Fetch Google Fonts (Hebrew + Latin subsets) and inline them as data-URI @font-face
// rules so the catalog renders Hebrew correctly in headless Chromium with zero
// network dependency. Output: fonts.css
import { writeFileSync } from 'node:fs';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FAMILIES = [
  'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&display=swap',
];

// We only need Hebrew + Latin (+ latin-ext) subsets; skip nothing — keep whatever
// Google returns but drop cyrillic/greek/vietnamese to save weight.
const SKIP_SUBSETS = ['cyrillic', 'greek', 'vietnamese', 'cyrillic-ext', 'greek-ext'];

async function get(url, asBuffer = false) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

let out = `/* MITODERM catalog fonts — inlined data-URI (Heebo, Frank Ruhl Libre, Assistant) */\n`;
let total = 0, faces = 0;

for (const famUrl of FAMILIES) {
  const css = await get(famUrl);
  // Split into @font-face blocks
  const blocks = css.split('@font-face').slice(1).map(b => '@font-face' + b.split('}')[0] + '}');
  // track subset comments: css2 output prepends `/* hebrew */` before each block
  const commented = css.split('@font-face');
  // Rebuild with subset detection using the preceding comment
  let idx = 0;
  const raw = css.match(/\/\*\s*[a-z-]+\s*\*\/\s*@font-face\s*{[^}]*}/g) || [];
  for (const chunk of raw) {
    const subsetMatch = chunk.match(/\/\*\s*([a-z-]+)\s*\*\//);
    const subset = subsetMatch ? subsetMatch[1] : 'latin';
    if (SKIP_SUBSETS.includes(subset)) continue;
    const face = chunk.slice(chunk.indexOf('@font-face'));
    const urlMatch = face.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!urlMatch) continue;
    const woff2 = await get(urlMatch[1], true);
    total += woff2.length;
    faces++;
    const dataUri = `url(data:font/woff2;base64,${woff2.toString('base64')}) format('woff2')`;
    const newFace = face.replace(/url\(https:\/\/[^)]+\.woff2\)\s*format\('woff2'\)/, dataUri);
    out += `/* ${subset} */\n${newFace}\n`;
  }
}

writeFileSync(new URL('./fonts.css', import.meta.url), out);
console.log(`Wrote fonts.css — ${faces} faces, ${(total / 1024).toFixed(0)} KB raw woff2 (before base64).`);
