// Programmatic Remotion render — closes the chain: ugc-scripts.json -> MP4.
// Usage: node remotion/render.mjs <scriptId> <locale>
//   node remotion/render.mjs vtech-mechanism en
// Renders 1080x1920 H.264 to out/ugc-<scriptId>-<locale>.mp4
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const root = process.cwd();
const scriptId = process.argv[2] || 'vtech-mechanism';
const locale = process.argv[3] || 'en';

// Reuse the pre-installed headless-shell (Remotion needs old-headless mode,
// which the full Chromium binary dropped) instead of downloading one.
function findHeadlessShell() {
  if (process.env.REMOTION_BROWSER && fs.existsSync(process.env.REMOTION_BROWSER))
    return process.env.REMOTION_BROWSER;
  const base = '/opt/pw-browsers';
  try {
    for (const dir of fs.readdirSync(base)) {
      if (!dir.includes('headless_shell')) continue;
      const p = path.join(base, dir, 'chrome-linux', 'headless_shell');
      if (fs.existsSync(p)) return p;
    }
  } catch {}
  return null; // fall back to Remotion's own (may download)
}
const browserExecutable = findHeadlessShell();

console.log(`[render] script=${scriptId} locale=${locale} browser=${browserExecutable ?? 'remotion-default'}`);

const bundleLocation = await bundle({
  entryPoint: path.join(root, 'remotion/index.ts'),
  publicDir: path.join(root, 'public'),
  onProgress: (p) => process.stdout.write(`\r[bundle] ${p}%   `),
});
process.stdout.write('\n');

const inputProps = { scriptId, locale };
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: 'Short',
  inputProps,
  browserExecutable,
});

fs.mkdirSync(path.join(root, 'out'), { recursive: true });
const outputLocation = path.join(root, 'out', `ugc-${scriptId}-${locale}.mp4`);

await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation,
  inputProps,
  browserExecutable,
  chromiumOptions: { gl: 'angle' },
  onProgress: ({ progress }) =>
    process.stdout.write(`\r[render] ${Math.round(progress * 100)}%   `),
});
process.stdout.write('\n');

const { size } = fs.statSync(outputLocation);
console.log(`[done] ${outputLocation} (${(size / 1e6).toFixed(2)} MB)`);
