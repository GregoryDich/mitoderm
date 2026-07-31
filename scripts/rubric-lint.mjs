// Gate 0 of the production pipeline: statically lint storyboards in
// src/data/ugc-scripts.json against docs/virality-rubric.md — no LLM, no
// network. Cheap checks run BEFORE any money is spent on generation
// (Decision Gates principle, docs/creative-decision-os.md).
//
// Usage:
//   node scripts/rubric-lint.mjs [scriptId] [--file path/to/scripts.json]
// Exit 0 when every checked script passes; 1 otherwise.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const fileIdx = args.indexOf('--file');
const file =
  fileIdx >= 0 ? args[fileIdx + 1] : 'src/data/ugc-scripts.json';
const onlyId = args.find((a) => !a.startsWith('--') && a !== args[fileIdx + 1]);

const data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const LOCALES = ['en', 'ru', 'he'];
const TRANSITIONS = ['cut', 'dissolve', 'slide-left', 'wipe-up'];
const FPS = data.meta?.fps ?? 30;
const END_SEC = 2.5;
const TRANS_SEC = 12 / FPS;

let failed = false;

const scripts = data.scripts.filter((s) => !onlyId || s.id === onlyId);
if (scripts.length === 0) {
  console.error(`no script matching "${onlyId}" in ${file}`);
  process.exit(1);
}

for (const s of scripts) {
  const issues = [];
  const warn = [];

  // pt 4 — pacing: beats 1.5–3s, hard ceiling 4s for any static shot
  for (const sc of s.scenes) {
    if (sc.dur > 4) issues.push(`${sc.id}: scene ${sc.dur}s > 4s hard cap (rubric pt 4)`);
    else if (sc.dur < 1.5 || sc.dur > 3)
      warn.push(`${sc.id}: beat ${sc.dur}s outside 1.5–3s target`);
  }

  // pt 3 — total length 7–30s for product reels
  const nonCut = s.scenes.filter((sc) => (sc.transition ?? 'cut') !== 'cut').length;
  const total =
    s.scenes.reduce((a, sc) => a + sc.dur, 0) + END_SEC - nonCut * TRANS_SEC;
  if (total < 7 || total > 30)
    issues.push(`total ${total.toFixed(1)}s outside 7–30s band (rubric pt 3)`);

  // pt 1 — hook must exist in all locales, ≤12 words (2-second proxy)
  for (const loc of LOCALES) {
    const hook = s.hook?.[loc];
    if (!hook) issues.push(`hook missing for ${loc}`);
    else if (hook.trim().split(/\s+/).length > 12)
      issues.push(`hook (${loc}) ${hook.trim().split(/\s+/).length} words > 12 (rubric pt 1)`);
  }

  // pt 6 — camera grammar: present, single move (no chained instructions)
  for (const sc of s.scenes) {
    if (!sc.camera?.trim()) issues.push(`${sc.id}: missing camera instruction (rubric pt 6)`);
    else if (/;| then | and then /.test(sc.camera))
      issues.push(`${sc.id}: camera "${sc.camera}" chains moves — one move per clip (rubric pt 6)`);
    if (!sc.visual?.trim()) issues.push(`${sc.id}: missing visual prompt`);
    if (!TRANSITIONS.includes(sc.transition ?? 'cut'))
      issues.push(`${sc.id}: unknown transition "${sc.transition}"`);
    for (const loc of LOCALES)
      if (!sc.onScreen?.[loc]) issues.push(`${sc.id}: onScreen missing ${loc}`);
  }

  // pt 9 — caption: exists per locale, ≤5 hashtags (IG Dec-2025 hard cap)
  for (const loc of LOCALES) {
    const cap = s.caption?.[loc];
    if (!cap) {
      issues.push(`caption missing for ${loc}`);
      continue;
    }
    const tags = (cap.match(/#[^\s#]+/g) || []).length;
    if (tags > 5) issues.push(`caption (${loc}) has ${tags} hashtags > 5 (rubric pt 9)`);
    if (tags === 0) warn.push(`caption (${loc}) has no hashtags`);
  }

  // pt 11 — CTA lives in caption/cta fields, present per locale
  for (const loc of LOCALES)
    if (!s.cta?.[loc]) issues.push(`cta missing for ${loc} (rubric pt 11)`);

  const status = issues.length === 0 ? 'PASS' : 'FAIL';
  if (issues.length > 0) failed = true;
  console.log(
    `${status === 'PASS' ? '✓' : '✗'} ${s.id} — ${status} (${total.toFixed(1)}s, ${s.scenes.length} beats${warn.length ? `, ${warn.length} warn` : ''})`
  );
  for (const i of issues) console.log(`    FAIL ${i}`);
  for (const w of warn) console.log(`    warn ${w}`);
}

process.exit(failed ? 1 : 0);
