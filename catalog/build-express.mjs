// Transform the print-model catalog (mitoderm-catalog-16.html) into slide-model HTML
// for Adobe Express import: each top-level .book child becomes a fixed-canvas .slide.
// Reuses the built HTML + inlined fonts/CSS as-is; the print build is untouched.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const __dir = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dir, 'mitoderm-catalog-16.html');
const OUT = join(__dir, 'mitoderm-catalog-express.html');

const CANVAS_W = 794;   // A4 width @96dpi
const PAD = 53;         // 14mm side/top margin -> content width 794-106 = 688px == PDF content box
const COVER_H = 1123;   // A4 height @96dpi (cover is full-bleed 297mm)

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: CANVAS_W, height: 1200, deviceScaleFactor: 1 } });
await page.goto('file://' + SRC, { waitUntil: 'networkidle' });
await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });

const info = await page.evaluate(({ CANVAS_W, PAD, COVER_H }) => {
  // 1. slide-model CSS overrides (win over the print CSS that precedes them)
  const st = document.createElement('style');
  st.textContent = `
    html,body{background:#fff;margin:0;padding:0}
    .run-foot{display:none!important}
    .section{break-before:auto!important}
    .book{position:static;z-index:auto}
    .slide{width:${CANVAS_W}px;margin:0 auto;position:relative;overflow:hidden;background:var(--paper)}
    .slide-pad{padding:${PAD}px ${PAD}px ${PAD + 6}px}
    .slide-cover{padding:0}
  `;
  document.head.appendChild(st);

  // 2. tell the importer which containers are slides
  const m = document.createElement('meta');
  m.setAttribute('name', 'hz:slide-selector');
  m.setAttribute('content', '.slide');
  document.head.appendChild(m);
  document.title = 'MITODERM — קטלוג טכנולוגיה ומוצרים';

  // 3. wrap each top-level .book child in a fixed-canvas slide
  const book = document.querySelector('.book');
  for (const el of Array.from(book.children)) {
    const isCover = el.classList.contains('cover');
    const wrap = document.createElement('div');
    wrap.className = 'slide ' + (isCover ? 'slide-cover' : 'slide-pad');
    book.insertBefore(wrap, el);
    wrap.appendChild(el);
  }

  // 4. measure each slide's content height, then pin canvas dims
  const slides = Array.from(document.querySelectorAll('.slide'));
  return slides.map((s) => {
    const isCover = s.classList.contains('slide-cover');
    const h = isCover ? COVER_H : Math.ceil(s.scrollHeight);
    s.style.height = h + 'px';
    s.setAttribute('data-canvas-width', String(CANVAS_W));
    s.setAttribute('data-canvas-height', String(h));
    const label = (s.querySelector('h1,.sec-title,.product-latin,.cover-wm') || {}).textContent || '';
    return { h, label: label.trim().slice(0, 22) };
  });
}, { CANVAS_W, PAD, COVER_H });

const htmlOut = await page.content();
writeFileSync(OUT, htmlOut);
await browser.close();

console.log(`Express HTML written: ${info.length} slides -> ${OUT}`);
for (const [i, s] of info.entries()) console.log(String(i).padStart(2), String(s.h).padStart(5) + 'px', s.label);
