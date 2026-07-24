// Build the CONDENSED 16-page MITODERM Hebrew catalog: content-16/*.json -> self-contained RTL HTML + MD.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CSS } from './styles.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(__dir, 'content-16');
const FONTS = join(__dir, 'fonts.css');
const LOGO = join(__dir, 'assets', 'mitoderm-logo.png');
const logoUri = existsSync(LOGO) ? `data:image/png;base64,${readFileSync(LOGO).toString('base64')}` : '';

const ORDER = [
  { key: 'about', file: 'about.json', kind: 'about' },
  { key: 'exosomes', file: 'exosomes.json', kind: 'exosomes' },
  // ── Chapter 1 · קרקפת (Scalp / trichology) ──
  { key: 'ch-scalp', file: 'chapter-1-scalp.json', kind: 'chapter' },
  { key: 'exosignal-hair', file: 'hair.json', kind: 'product' },
  { key: 'mitoscan', file: 'mitoscan.json', kind: 'device' },
  // ── Chapter 2 · מעצבי שיער (Hair stylists / salons) ──
  { key: 'ch-stylists', file: 'chapter-2-stylists.json', kind: 'chapter' },
  { key: 'exosignal-spray', file: 'spray.json', kind: 'product' },
  // ── Chapter 3 · קוסמטולוגים (Cosmetologists / estheticians) ──
  { key: 'ch-cosmetology', file: 'chapter-3-cosmetology.json', kind: 'chapter' },
  { key: 'v-tech', file: 'vtech.json', kind: 'product' },
  { key: 'exo-nad', file: 'exonad.json', kind: 'product' },
  { key: 'exotech-gel', file: 'exotech.json', kind: 'product' },
  { key: 'exocell-mask', file: 'exocell.json', kind: 'product' },
  { key: 'biospicule-serum', file: 'biospicule-serum.json', kind: 'product' },
  { key: 'derma-cream', file: 'derma-cream.json', kind: 'product' },
  { key: 'mitopen', file: 'mitopen.json', kind: 'device' },
  // ── Back matter ──
  { key: 'comparison', file: 'comparison.json', kind: 'comparison' },
  { key: 'protocols', file: 'protocols.json', kind: 'protocols' },
  { key: 'faq', file: 'faq.json', kind: 'faq' },
  { key: 'contacts', file: 'contacts.json', kind: 'contacts' },
];

const PAL = {
  gold:     { acc: '#a9781f', deep: '#7f5a13', tint: '#f4ecd7', soft: '#faf5e9' },
  copper:   { acc: '#a85f2e', deep: '#824823', tint: '#f5e6d9', soft: '#fbf1e9' },
  teal:     { acc: '#2f8083', deep: '#215c5e', tint: '#dbeceb', soft: '#ecf6f5' },
  plum:     { acc: '#7c4f86', deep: '#5c3a64', tint: '#eee1f1', soft: '#f7eff8' },
  rose:     { acc: '#a2537a', deep: '#7c3d5c', tint: '#f3e0ea', soft: '#faeef3' },
  graphite: { acc: '#3f5f78', deep: '#2d4658', tint: '#e0e8ef', soft: '#eef3f7' },
  forest:   { acc: '#3f6b4a', deep: '#2b4a33', tint: '#dbe9de', soft: '#edf4ee' },
  sage:     { acc: '#6d8a5e', deep: '#4a6440', tint: '#e6efdf', soft: '#f1f6eb' },
};

const load = (f) => {
  const p = join(CONTENT, f);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { console.error(`! JSON parse failed: ${f} — ${e.message}`); return null; }
};
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paras = (b = '') => String(b).split(/\n{2,}/).map(t => t.trim()).filter(Boolean);
const arr = (x) => Array.isArray(x) ? x : (x ? [x] : []);

function usageBadge(u) {
  const pro = '<span class="ubadge ubadge-pro">לשימוש מקצועי בלבד</span>';
  const home = '<span class="ubadge ubadge-home">לטיפוח ביתי</span>';
  if (u === 'both') return `<div class="usage-row"><span class="ubadge ubadge-pro">לשימוש מקצועי</span>${home}</div>`;
  if (u === 'home') return `<div class="usage-row">${home}</div>`;
  if (u === 'device') return '<div class="usage-row"><span class="ubadge ubadge-pro">מכשור מקצועי</span></div>';
  if (u === 'pro') return `<div class="usage-row">${pro}</div>`;
  return '';
}
const usageLabel = (u) => ({ pro: 'לשימוש מקצועי בלבד', home: 'לטיפוח ביתי', both: 'לשימוש מקצועי + טיפוח ביתי', device: 'מכשור מקצועי' }[u] || '');
const LEGEND_HTML = '<div class="legend"><b><span class="dot dot-pro"></span>לשימוש מקצועי בלבד</b><b><span class="dot dot-home"></span>לטיפוח ביתי</b><b><span class="dot dot-pro"></span><span class="dot dot-home"></span>מקצועי + ביתי</b></div>';

const IC = {
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3"/><path d="M7.5 15h9"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/></svg>',
  device: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 3l7 7-9 9-4 1 1-4 9-9z"/><path d="M12 5l5 5"/></svg>',
  spec: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
};

function sectionHead(eyebrow, titleHe, subEn) {
  return `<header class="sec-head">
    ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
    <h2 class="sec-title">${esc(titleHe)}</h2>
    ${subEn ? `<div class="sub-en">${esc(subEn)}</div>` : ''}
    <div class="head-rule"></div>
  </header>`;
}

const specCell = (icon, title, inner) => `<div class="spec-cell"><div class="spec-ic">${icon}</div><div class="spec-t">${title}</div>${inner}</div>`;
const chips = (items) => `<div class="chips">${arr(items).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>`;

function cSpecStrip(d, isDevice) {
  const cells = [];
  if (isDevice) {
    const specs = arr(d.specs);
    if (specs.length) cells.push(specCell(IC.spec, 'מאפיינים טכניים', `<ul class="spec-list">${specs.map(a => `<li><span class="k">${esc(a.k)}</span><span class="v">${esc(a.v)}</span></li>`).join('')}</ul>`));
  } else {
    if (arr(d.actives).length) cells.push(specCell(IC.flask, 'רכיבים פעילים', chips(d.actives)));
    if (d.use) cells.push(specCell(IC.clock, 'שימוש ופרוטוקול', `<p class="spec-p">${esc(d.use)}</p>`));
    if (d.pack) cells.push(specCell(IC.box, 'אריזה', `<p class="spec-p">${esc(d.pack)}${d.origin ? ` · ${esc(d.origin)}` : ''}</p>`));
    if (d.contra) cells.push(specCell(IC.spec, 'התוויות נגד', `<p class="spec-p">${esc(d.contra)}</p>`));
  }
  if (arr(d.combos).length) cells.push(specCell(IC.device, 'שילוב במכשור', chips(d.combos)));
  return cells.length ? `<div class="spec-strip avoid-break">${cells.join('')}</div>` : '';
}

const cBullets = (d) => arr(d.bullets).length ? `<ul class="c-bullets">${arr(d.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
const cPhases = (d) => arr(d.phases).length ? `<div class="phases avoid-break">${arr(d.phases).map(p => `<div class="phase"><h4>${p.vol ? `<span class="vol">${esc(p.vol)}</span>` : ''}${esc(p.name)}</h4><p>${esc(p.body)}</p></div>`).join('')}</div>` : '';
const cInd = (d) => arr(d.indications).length ? `<div class="ind-block avoid-break"><h4>אינדיקציות</h4>${chips(d.indications)}</div>` : '';
function cClinical(d) {
  const c = d.clinical;
  if (!c) return '';
  const metrics = arr(c.metrics).map(m => `<div class="cl-metric"><div class="cl-v">${esc(m.v)}</div><div class="cl-k">${esc(m.k)}</div></div>`).join('');
  const ncol = Math.min(3, arr(c.metrics).length || 3);
  return `<div class="clinical avoid-break">
    <div class="cl-head"><span class="cl-badge">${esc(c.badge || 'מחקר קליני')}</span>${c.scope ? `<span class="cl-scope">${esc(c.scope)}</span>` : ''}</div>
    ${metrics ? `<div class="cl-metrics" style="grid-template-columns:repeat(${ncol},1fr)">${metrics}</div>` : ''}
    ${c.note ? `<div class="cl-note">${esc(c.note)}</div>` : ''}
  </div>`;
}

function renderProductC(d, meta) {
  const a = PAL[d.accent] || PAL.gold;
  const isDevice = meta.kind === 'device';
  return `<section class="section product pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    <div class="product-hero">
      ${d.eyebrow ? `<div class="eyebrow">${esc(d.eyebrow)}</div>` : ''}
      ${usageBadge(d.usage)}
      <h1 class="product-latin">${esc(d.latinName || '')}</h1>
      <div class="product-he">${esc(d.hebrewName || '')}</div>
      ${d.subtitleEn ? `<div class="product-suben">${esc(d.subtitleEn)}</div>` : ''}
      ${d.tagline ? `<p class="product-tag">${esc(d.tagline)}</p>` : ''}
    </div>
    ${d.intro ? `<div class="product-intro${/^[֐-׿]/.test(String(d.intro).trim()) ? ' dc' : ''}">${paras(d.intro).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    ${cPhases(d)}
    ${cBullets(d)}
    ${cSpecStrip(d, isDevice)}
    ${cInd(d)}
    ${cClinical(d)}
    ${d.closingTagline ? `<div class="closing"><span>${esc(d.closingTagline)}</span></div>` : ''}
  </section>`;
}

function renderChapter(d, products) {
  const a = PAL[d.accent] || PAL.gold;
  const idx = arr(products).map(p => `<li class="chidx-item">
      <span class="chidx-he">${esc(p.hebrewName || p.latinName || '')}</span>
      <span class="chidx-lat">${esc(p.latinName || '')}</span>
      ${p.usage ? `<span class="chidx-u">${esc(usageLabel(p.usage))}</span>` : ''}
    </li>`).join('');
  return `<section class="section chapter" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    <div class="chapter-inner">
      ${d.eyebrow ? `<div class="chapter-eyebrow">${esc(d.eyebrow)}</div>` : ''}
      <div class="chapter-num">פרק ${esc(d.number || '')}</div>
      <h1 class="chapter-title">${esc(d.titleHe || '')}</h1>
      ${d.subEn ? `<div class="chapter-suben">${esc(d.subEn)}</div>` : ''}
      <div class="chapter-rule"></div>
      ${d.blurb ? `<p class="chapter-blurb">${esc(d.blurb)}</p>` : ''}
      ${idx ? `<div class="chidx-lead">בפרק זה</div><ul class="chidx">${idx}</ul>` : ''}
    </div>
  </section>`;
}

const blocksFlow = (blocks) => `<div class="science science-2">${arr(blocks).map(bl => `<section class="sci-block"><h3>${esc(bl.h)}</h3>${paras(bl.b).map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div>`;

function renderAboutC(d) {
  const a = PAL.gold;
  return `<section class="section about pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead(d.eyebrow || 'MITODERM', d.title || 'MITODERM', d.subtitleEn)}
    ${d.intro ? `<div class="product-intro">${paras(d.intro).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    ${blocksFlow(d.blocks)}
    ${d.origin ? `<div class="closing"><span>${esc(d.origin)}</span></div>` : ''}
  </section>`;
}

function renderExosomesC(d) {
  const a = PAL.plum;
  return `<section class="section exosomes pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead(d.eyebrow || 'TECHNOLOGY', d.title || 'אקסוזומים סינתטיים', d.subtitleEn)}
    ${d.intro ? `<div class="product-intro">${paras(d.intro).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    ${blocksFlow(d.blocks)}
    ${d.closing ? `<div class="pullquote">${esc(d.closing)}</div>` : ''}
  </section>`;
}

function renderComparison(d) {
  const a = PAL.gold, cols = arr(d.columns), rows = arr(d.rows);
  return `<section class="section comparison pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('OVERVIEW', d.title || 'טבלת השוואת מוצרים', d.subtitleEn)}
    <div class="table-wrap"><table class="cmp"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${arr(r).map((c, i) => `<td${i === 0 ? ' class="c0"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    ${LEGEND_HTML}
  </section>`;
}
function renderProtocols(d) {
  const a = PAL.teal;
  return `<section class="section protocols pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('CLINICAL', d.title || 'פרוטוקולי טיפול', d.subtitleEn)}
    <div class="proto-grid">${arr(d.items).map((it, i) => `<div class="proto-card avoid-break"><div class="proto-num">${String(i + 1).padStart(2, '0')}</div><h4>${esc(it.name)}</h4><p>${esc(it.body)}</p></div>`).join('')}</div>
  </section>`;
}
function renderFaq(d) {
  const a = PAL.graphite;
  return `<section class="section faq pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('SUPPORT', d.title || 'שאלות נפוצות', d.subtitleEn)}
    <div class="faq-list">${arr(d.items).map(it => `<div class="faq-item avoid-break"><h4>${esc(it.q)}</h4><p>${esc(it.a)}</p></div>`).join('')}</div>
  </section>`;
}
function renderContacts(d) {
  const a = PAL.gold;
  const row = (label, val) => val ? `<div class="ct-row"><span class="ct-l">${label}</span><span class="ct-v">${esc(val)}</span></div>` : '';
  return `<section class="section contacts pc" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('CONTACT', d.title || 'צור קשר', 'Get in touch')}
    <div class="ct-card avoid-break">${row('אתר', d.site)}${row('דוא"ל', d.email)}${row('טלפון', d.phone)}${row('כתובת', d.address)}</div>
    ${d.copyright ? `<div class="copyright">${esc(d.copyright)}</div>` : ''}
  </section>`;
}

function renderCover() {
  return `<section class="section cover" style="--acc:#a9781f">
    <div class="cover-frame"><div class="cover-top">MITODERM · ISRAEL</div>
      <div class="cover-center">
        ${logoUri ? `<img class="cover-logo" src="${logoUri}" alt="MITODERM — Where Science Meets Beauty">` : `<div class="cover-wm">MITODERM</div>`}
        <div class="cover-rule"></div>
        <h1 class="cover-title">קטלוג טכנולוגיה ומוצרים</h1>
        <div class="cover-sub">אקסוזומים סינתטיים · פולינוקלאוטידים · רפואה רגנרטיבית</div>
        <div class="cover-sub-en">Synthetic Exosomes · PDRN · Regenerative Aesthetics</div>
      </div>
      <div class="cover-bottom"><span>לשימוש מקצועי בלבד · Made in Italy</span><span>מהדורת 2026</span></div>
    </div>
  </section>`;
}
function renderToc(entries) {
  const rows = entries.map(e => {
    if (e.type === 'chapter') return `<li class="toc-chap"><span class="toc-cn">פרק ${esc(e.num)}</span><span class="toc-ct">${esc(e.he)}</span><span class="toc-en">${esc(e.en || '')}</span></li>`;
    const cls = e.type === 'product' ? 'toc-sub' : '';
    return `<li class="${cls}"><span class="toc-t">${esc(e.he)}</span><span class="toc-en">${esc(e.en || '')}</span></li>`;
  }).join('');
  return `<section class="section toc">
    ${sectionHead('CATALOG', 'תוכן העניינים', 'Contents')}
    <ul class="toc-list">${rows}</ul>
  </section>`;
}

// ---- compact CSS overrides ----
const COMPACT = `
.section{padding:0}
.spec-cell{padding:4.6mm 5mm}
.spec-strip{margin:1mm 0 4mm}
.pc .product-hero{padding:4.2mm 6mm 3.6mm;margin-bottom:3mm}
.pc .product-latin{font-size:26pt}
.pc .product-he{font-size:13.5pt;margin-top:1mm}
.pc .product-suben{margin-top:1.8mm}
.pc .product-tag{font-size:11pt;margin-top:3mm}
.pc .product-intro{font-size:9.9pt;margin-bottom:3.2mm;line-height:1.5}
.c-bullets{list-style:none;margin:0 0 3mm;padding:0;display:grid;gap:1.8mm}
.c-bullets li{position:relative;padding-inline-start:5.5mm;font-size:9.7pt;line-height:1.46;color:var(--ink2)}
.c-bullets li::before{content:"";position:absolute;inset-inline-start:0;top:2.1mm;width:2.1mm;height:2.1mm;background:var(--acc);border-radius:50%}
.phases{display:grid;gap:2.2mm;margin:0 0 3.6mm}
.phase{border:1px solid var(--hair2);border-inline-start:3px solid var(--acc);border-radius:3px;padding:2.6mm 3.6mm;background:var(--panel)}
.phase h4{font-family:var(--serif);font-weight:700;font-size:11pt;color:var(--deep);margin:0 0 1mm}
.phase .vol{font-family:var(--label);font-size:8pt;letter-spacing:.04em;color:var(--acc);float:inline-start;margin-top:1mm}
.phase p{font-size:9.2pt;line-height:1.45;margin:0;color:var(--ink2)}
.spec-p{margin:0;font-size:9.3pt;line-height:1.45;color:var(--ink2)}
.ind-block{margin-top:1mm}
.ind-block h4{font-family:var(--label);font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:0 0 2.5mm}
.science-2{column-count:2;column-gap:8mm}
.science-2 .sci-block{break-inside:avoid;margin-bottom:4mm}

/* ---- chapter divider (full page) ---- */
.section.chapter{min-height:255mm;display:flex;flex-direction:column;justify-content:center}
.chapter-inner{position:relative;overflow:hidden;border:1px solid var(--hair2);border-radius:5px;background:linear-gradient(155deg,var(--soft) 0%,var(--panel) 70%);padding:24mm 20mm}
.chapter-inner::before{content:"";position:absolute;inset-inline-start:0;top:0;bottom:0;width:6px;background:var(--acc)}
.chapter-eyebrow{font-family:var(--label);font-weight:700;font-size:8.5pt;letter-spacing:.28em;text-transform:uppercase;color:var(--acc);margin-bottom:8mm}
.chapter-num{font-family:var(--serif);font-weight:900;font-size:26pt;color:var(--acc);opacity:.32;line-height:1;margin-bottom:1mm}
.chapter-title{font-family:var(--serif);font-weight:900;font-size:42pt;color:var(--ink);letter-spacing:-.01em;line-height:1.04}
.chapter-suben{font-family:var(--label);font-size:10.5pt;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-top:4mm}
.chapter-rule{height:2px;width:42mm;background:var(--acc);margin:8mm 0;border-radius:2px}
.chapter-blurb{font-size:11.2pt;line-height:1.62;color:var(--ink2);max-width:150mm;margin:0 0 10mm}
.chidx-lead{font-family:var(--label);font-weight:700;font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:2mm}
.chidx{list-style:none;margin:0;padding:0}
.chidx-item{display:flex;align-items:baseline;gap:4mm;padding:3.2mm 0;border-top:1px solid var(--hair)}
.chidx-item:last-child{border-bottom:1px solid var(--hair)}
.chidx-he{font-family:var(--serif);font-weight:700;font-size:12.5pt;color:var(--deep)}
.chidx-lat{font-family:var(--label);font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.chidx-u{margin-inline-start:auto;font-family:var(--label);font-size:7pt;letter-spacing:.05em;color:var(--acc);border:1px solid var(--hair2);border-radius:999px;padding:.5mm 2.4mm;white-space:nowrap}

/* ---- clinical results block ---- */
.clinical{border:1px solid var(--hair2);border-radius:4px;background:var(--soft);padding:4.5mm 5mm;margin:1mm 0 3.6mm}
.cl-head{display:flex;align-items:center;gap:3mm;flex-wrap:wrap;margin-bottom:3mm}
.cl-badge{font-family:var(--label);font-weight:700;font-size:7.5pt;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:var(--acc);border-radius:999px;padding:1mm 3mm}
.cl-scope{font-size:8.6pt;color:var(--muted)}
.cl-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.cl-metric{background:var(--panel);border:1px solid var(--hair);border-radius:3px;padding:3mm 3.2mm}
.cl-v{font-family:var(--serif);font-weight:900;font-size:13pt;color:var(--deep);line-height:1.05;text-align:right;unicode-bidi:plaintext}
.cl-k{font-size:7.8pt;color:var(--muted);margin-top:1.6mm;line-height:1.32}
.cl-note{font-size:8.2pt;color:var(--muted);margin-top:3mm;font-style:italic}

/* ---- chapter-aware TOC ---- */
.toc-chap{margin-top:3mm;padding-top:4mm!important;border-bottom:1.5px solid var(--hair2)!important}
.toc-chap:first-child{margin-top:0}
.toc-cn{font-family:var(--label);font-weight:700;font-size:8pt;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);min-width:15mm}
.toc-ct{font-family:var(--serif);font-size:15pt;font-weight:900;color:var(--ink)}
.toc-sub{padding-inline-start:9mm!important}
.toc-sub .toc-t{font-size:11.5pt;font-weight:400;color:var(--ink2)}
`;

// ================= ASSEMBLE =================
const loaded = ORDER.map(m => ({ meta: m, data: m.file ? load(m.file) : {} })).filter(x => x.data !== null);

// group product/device pages under the chapter that precedes them (for divider index + TOC)
const chapterProducts = new Map(); // loaded-index of a chapter -> [product data, ...]
{
  let curChap = -1;
  loaded.forEach((x, i) => {
    if (x.meta.kind === 'chapter') { curChap = i; chapterProducts.set(i, []); }
    else if ((x.meta.kind === 'product' || x.meta.kind === 'device') && curChap >= 0) chapterProducts.get(curChap).push(x.data);
  });
}

const tocEntries = [];
{
  let inChapter = false;
  for (const { meta, data } of loaded) {
    if (meta.kind === 'chapter') { inChapter = true; tocEntries.push({ type: 'chapter', num: data.number || '', he: data.titleHe || '', en: data.subEn || '' }); continue; }
    let he, en;
    if (meta.kind === 'about') { he = 'אודות MITODERM'; en = 'About'; }
    else if (meta.kind === 'exosomes') { he = data.title || 'אקסוזומים סינתטיים'; en = 'Exosome Technology'; }
    else if (meta.kind === 'comparison') { he = 'טבלת השוואת מוצרים'; en = 'Comparison'; inChapter = false; }
    else if (meta.kind === 'protocols') { he = 'פרוטוקולי טיפול'; en = 'Protocols'; }
    else if (meta.kind === 'faq') { he = 'שאלות נפוצות'; en = 'FAQ'; }
    else if (meta.kind === 'contacts') { he = 'צור קשר'; en = 'Contact'; }
    else { he = data.hebrewName || data.latinName || meta.key; en = data.latinName || ''; }
    tocEntries.push({ type: inChapter ? 'product' : 'item', he, en });
  }
}

const render = ({ meta, data }, i) => {
  if (meta.kind === 'chapter') return renderChapter(data, chapterProducts.get(i) || []);
  if (meta.kind === 'about') return renderAboutC(data);
  if (meta.kind === 'exosomes') return renderExosomesC(data);
  if (meta.kind === 'product' || meta.kind === 'device') return renderProductC(data, meta);
  if (meta.kind === 'comparison') return renderComparison(data);
  if (meta.kind === 'protocols') return renderProtocols(data);
  if (meta.kind === 'faq') return renderFaq(data);
  if (meta.kind === 'contacts') return renderContacts(data);
  return '';
};

if (process.env.ONLY) {
  const idx = loaded.findIndex(x => x.meta.file === process.env.ONLY);
  const item = loaded[idx];
  const fc = existsSync(FONTS) ? readFileSync(FONTS, 'utf8') : '';
  writeFileSync(join(__dir, 'preview.html'),
    `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${fc}${CSS}${COMPACT}\n.section{break-before:auto;padding:14mm 15mm}body{background:#fff}</style></head><body><main class="book">${item ? render(item, idx) : ''}</main></body></html>`);
  console.log(`preview.html written for ${process.env.ONLY}`);
  process.exit(0);
}

const bodyHtml = [renderCover(), renderToc(tocEntries), ...loaded.map(render)];
const fontsCss = existsSync(FONTS) ? readFileSync(FONTS, 'utf8') : '';
const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>MITODERM — קטלוג (מהדורה מתומצתת)</title>
<style>${fontsCss}${CSS}${COMPACT}</style></head><body>
<div class="run-foot"><span>MITODERM · קטלוג טכנולוגיה ומוצרים</span><span>לשימוש מקצועי בלבד · Made in Italy · 2026</span></div>
<main class="book">${bodyHtml.join('\n')}</main></body></html>`;
writeFileSync(join(__dir, 'mitoderm-catalog-16.html'), html);

// ---- Markdown ----
const tocMd = tocEntries.map(e => {
  if (e.type === 'chapter') return `\n**פרק ${e.num} — ${e.he}**`;
  return `- ${e.he}`;
}).join('\n');
let md = `# MITODERM — קטלוג טכנולוגיה ומוצרים (מהדורה מתומצתת)\n\n**אקסוזומים סינתטיים · פולינוקלאוטידים (PDRN) · רפואה רגנרטיבית · Made in Italy**\n\n*מהדורת 2026 · לשימוש מקצועי בלבד*\n\n## תוכן העניינים\n${tocMd}\n`;
const mdBlocks = (blocks) => arr(blocks).map(bl => `\n## ${bl.h}\n\n${paras(bl.b).join('\n\n')}\n`).join('');
for (const { meta, data } of loaded) {
  if (meta.kind === 'chapter') md += `\n\n---\n\n# פרק ${data.number || ''} · ${data.titleHe || ''}\n${data.subEn ? `\n*${data.subEn}*\n` : ''}${data.blurb ? `\n${data.blurb}\n` : ''}`;
  else if (meta.kind === 'about') md += `\n\n---\n\n# ${data.title || 'אודות MITODERM'}\n${data.intro ? `\n${paras(data.intro).join('\n\n')}\n` : ''}${mdBlocks(data.blocks)}${data.origin ? `\n*${data.origin}*\n` : ''}`;
  else if (meta.kind === 'exosomes') md += `\n\n---\n\n# ${data.title}\n${data.intro ? `\n${paras(data.intro).join('\n\n')}\n` : ''}${mdBlocks(data.blocks)}${data.closing ? `\n> ${data.closing}\n` : ''}`;
  else if (meta.kind === 'product' || meta.kind === 'device') {
    md += `\n\n---\n\n# ${data.latinName}${data.hebrewName ? ` — ${data.hebrewName}` : ''}\n${data.subtitleEn ? `\n*${data.subtitleEn}*\n` : ''}${data.usage ? `\n**סיווג שימוש:** ${usageLabel(data.usage)}\n` : ''}${data.tagline ? `\n> ${data.tagline}\n` : ''}${data.intro ? `\n${paras(data.intro).join('\n\n')}\n` : ''}`;
    for (const p of arr(data.phases)) md += `\n**${p.name}${p.vol ? ` (${p.vol})` : ''}** — ${p.body}\n`;
    if (arr(data.bullets).length) md += `\n${arr(data.bullets).map(b => `- ${b}`).join('\n')}\n`;
    if (arr(data.actives).length) md += `\n**רכיבים פעילים:** ${arr(data.actives).join(' · ')}\n`;
    if (arr(data.specs).length) md += `\n**מאפיינים טכניים:** ${arr(data.specs).map(s => `${s.k}: ${s.v}`).join(' · ')}\n`;
    if (data.use) md += `\n**שימוש:** ${data.use}\n`;
    if (data.pack) md += `\n**אריזה:** ${data.pack}${data.origin ? ` · ${data.origin}` : ''}\n`;
    if (data.contra) md += `\n**התוויות נגד:** ${data.contra}\n`;
    if (arr(data.combos).length) md += `\n**שילוב במכשור:** ${arr(data.combos).join(' · ')}\n`;
    if (arr(data.indications).length) md += `\n**אינדיקציות:** ${arr(data.indications).join(' · ')}\n`;
    if (data.clinical) {
      const c = data.clinical;
      md += `\n**${c.badge || 'מחקר קליני'}:** ${c.scope || ''}\n`;
      for (const m of arr(c.metrics)) md += `- ${m.v} — ${m.k}\n`;
      if (c.note) md += `\n*${c.note}*\n`;
    }
    if (data.closingTagline) md += `\n*${data.closingTagline}*\n`;
  }
  else if (meta.kind === 'comparison') md += `\n\n---\n\n# ${data.title}\n\n| ${arr(data.columns).join(' | ')} |\n| ${arr(data.columns).map(() => '---').join(' | ')} |\n${arr(data.rows).map(r => `| ${arr(r).join(' | ')} |`).join('\n')}\n\n**מקרא:** לשימוש מקצועי בלבד · לטיפוח ביתי · מקצועי + ביתי\n`;
  else if (meta.kind === 'protocols') { md += `\n\n---\n\n# ${data.title}\n`; for (const it of arr(data.items)) md += `\n## ${it.name}\n\n${it.body}\n`; }
  else if (meta.kind === 'faq') { md += `\n\n---\n\n# ${data.title}\n`; for (const it of arr(data.items)) md += `\n**ש: ${it.q}**\n\nת: ${it.a}\n`; }
  else if (meta.kind === 'contacts') md += `\n\n---\n\n# ${data.title}\n\n- אתר: ${data.site}\n- דוא"ל: ${data.email}\n- טלפון: ${data.phone}\n- כתובת: ${data.address}\n\n${data.copyright}\n`;
}
writeFileSync(join(__dir, 'mitoderm-catalog-16.md'), md);

const words = md.replace(/[#*>|_-]/g, ' ').split(/\s+/).filter(Boolean).length;
console.log(`Built condensed HTML (${(html.length / 1024).toFixed(0)} KB) + MD (~${words} words). Sections: ${loaded.length}.`);
