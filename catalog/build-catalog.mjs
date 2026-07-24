// Build the MITODERM Hebrew catalog: content JSON -> self-contained RTL HTML (for PDF) + Markdown.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CSS } from './styles.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(__dir, 'content');
const FONTS = join(__dir, 'fonts.css');

// Section order + file map
const ORDER = [
  { key: 'about', file: 'about.json', kind: 'about' },
  { key: 'exosomes', file: 'exosomes.json', kind: 'exosomes' },
  { key: 'v-tech', file: 'vtech.json', kind: 'product' },
  { key: 'exo-nad', file: 'exonad.json', kind: 'product' },
  { key: 'exosignal-hair', file: 'hair.json', kind: 'product' },
  { key: 'exosignal-spray', file: 'spray.json', kind: 'product' },
  { key: 'exotech-gel', file: 'exotech.json', kind: 'product' },
  { key: 'exocell-mask', file: 'exocell.json', kind: 'product' },
  { key: 'mitopen', file: 'mitopen.json', kind: 'device' },
  { key: 'mitoscan', file: 'mitoscan.json', kind: 'device' },
  { key: 'comparison', file: 'comparison.json', kind: 'comparison' },
  { key: 'protocols', file: 'protocols.json', kind: 'protocols' },
  { key: '_beforeafter', file: null, kind: 'beforeafter' },
  { key: 'faq', file: 'faq.json', kind: 'faq' },
  { key: 'contacts', file: 'contacts.json', kind: 'contacts' },
];

const ACCENTS = {
  'v-tech':          { acc: '#a9781f', deep: '#7f5a13', tint: '#f4ecd7', soft: '#faf5e9' },
  'exo-nad':         { acc: '#a85f2e', deep: '#824823', tint: '#f5e6d9', soft: '#fbf1e9' },
  'exosignal-hair':  { acc: '#7c4f86', deep: '#5c3a64', tint: '#eee1f1', soft: '#f7eff8' },
  'exosignal-spray': { acc: '#2f8083', deep: '#215c5e', tint: '#dbeceb', soft: '#ecf6f5' },
  'exotech-gel':     { acc: '#2f8083', deep: '#215c5e', tint: '#dbeceb', soft: '#ecf6f5' },
  'exocell-mask':    { acc: '#a2537a', deep: '#7c3d5c', tint: '#f3e0ea', soft: '#faeef3' },
  'mitopen':         { acc: '#3f5f78', deep: '#2d4658', tint: '#e0e8ef', soft: '#eef3f7' },
  'mitoscan':        { acc: '#3f5f78', deep: '#2d4658', tint: '#e0e8ef', soft: '#eef3f7' },
  'default':         { acc: '#a9781f', deep: '#7f5a13', tint: '#f4ecd7', soft: '#faf5e9' },
};

const load = (f) => {
  const p = join(CONTENT, f);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { console.error(`! JSON parse failed: ${f} — ${e.message}`); return null; }
};

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paras = (body = '') => String(body).split(/\n{2,}/).map(t => t.trim()).filter(Boolean);
const arr = (x) => Array.isArray(x) ? x : (x ? [x] : []);

// ---------------- SVG icons for spec strip ----------------
const IC = {
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3"/><path d="M7.5 15h9"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 3v18M4 7.5l8 4.5 8-4.5"/></svg>',
  device: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 3l7 7-9 9-4 1 1-4 9-9z"/><path d="M12 5l5 5"/></svg>',
  spec: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
};

// ================= HTML RENDERERS =================
function h(tag, cls, inner) { return `<${tag}${cls ? ` class="${cls}"` : ''}>${inner}</${tag}>`; }

function sectionHead(eyebrow, titleHe, subEn, latin) {
  return `<header class="sec-head">
    ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
    ${latin ? `<div class="latin-name">${esc(latin)}</div>` : ''}
    <h2 class="sec-title">${esc(titleHe)}</h2>
    ${subEn ? `<div class="sub-en">${esc(subEn)}</div>` : ''}
    <div class="head-rule"></div>
  </header>`;
}

function specStrip(d, isDevice) {
  const cells = [];
  const actives = isDevice ? arr(d.specs) : arr(d.actives);
  if (actives.length) {
    const rows = actives.map(a => isDevice
      ? `<li><span class="k">${esc(a.k)}</span><span class="v">${esc(a.v)}</span></li>`
      : `<li><b>${esc(a.name)}</b>${a.role ? ` — ${esc(a.role)}` : ''}</li>`).join('');
    cells.push(`<div class="spec-cell"><div class="spec-ic">${isDevice ? IC.spec : IC.flask}</div><div class="spec-t">${isDevice ? 'מאפיינים טכניים' : 'רכיבים פעילים'}</div><ul class="spec-list">${rows}</ul></div>`);
  }
  if (d.protocol) {
    const pr = d.protocol;
    const rows = [
      pr.amount && `<li><span class="k">כמות</span><span class="v">${esc(pr.amount)}</span></li>`,
      pr.series && `<li><span class="k">סדרה</span><span class="v">${esc(pr.series)}</span></li>`,
      pr.maintenance && `<li><span class="k">תחזוקה</span><span class="v">${esc(pr.maintenance)}</span></li>`,
      pr.zones && `<li><span class="k">אזורים</span><span class="v">${esc(pr.zones)}</span></li>`,
    ].filter(Boolean).join('');
    if (rows) cells.push(`<div class="spec-cell"><div class="spec-ic">${IC.clock}</div><div class="spec-t">שימוש ופרוטוקול</div><ul class="spec-list">${rows}</ul></div>`);
  }
  const packBits = [d.volume && `נפח: ${d.volume}`, d.packaging, d.origin && `ארץ ייצור: ${d.origin}`].filter(Boolean);
  if (packBits.length) cells.push(`<div class="spec-cell"><div class="spec-ic">${IC.box}</div><div class="spec-t">מאפיינים ואריזה</div><ul class="spec-list">${packBits.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`);
  const combos = arr(d.combos);
  if (combos.length) cells.push(`<div class="spec-cell"><div class="spec-ic">${IC.device}</div><div class="spec-t">שילוב במכשור</div><div class="chips">${combos.map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div></div>`);
  if (!cells.length) return '';
  return `<div class="spec-strip avoid-break">${cells.join('')}</div>`;
}

function benefitPanels(d) {
  const pro = arr(d.benefitsPro), pat = arr(d.benefitsPatient);
  if (!pro.length && !pat.length) return '';
  const panel = (title, items) => items.length ? `<div class="ben-panel"><h4>${title}</h4><ul class="ticks">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : '';
  return `<div class="ben-grid avoid-break">${panel('יתרונות לקוסמטיקאי/ת', pro)}${panel('יתרונות למטופל/ת', pat)}</div>`;
}

function listBlock(title, items, cls = '') {
  const a = arr(items); if (!a.length) return '';
  return `<div class="list-block ${cls}"><h4>${title}</h4><ul class="ticks">${a.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
}

function scienceFlow(blocks) {
  const b = arr(blocks); if (!b.length) return '';
  return `<div class="science">${b.map(bl => `<section class="sci-block"><h3>${esc(bl.heading)}</h3>${paras(bl.body).map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div>`;
}

function renderProduct(d, meta) {
  const a = ACCENTS[d.slug] || ACCENTS[meta.key] || ACCENTS.default;
  const isDevice = meta.kind === 'device';
  return `<section class="section product" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    <div class="product-hero">
      ${d.eyebrow ? `<div class="eyebrow">${esc(d.eyebrow)}</div>` : ''}
      <h1 class="product-latin">${esc(d.latinName || '')}</h1>
      <div class="product-he">${esc(d.hebrewName || '')}</div>
      ${d.subtitleEn ? `<div class="product-suben">${esc(d.subtitleEn)}</div>` : ''}
      ${d.tagline ? `<p class="product-tag">${esc(d.tagline)}</p>` : ''}
    </div>
    ${d.intro ? `<div class="product-intro${/^[֐-׿]/.test(String(d.intro).trim()) ? ' dc' : ''}">${paras(d.intro).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    ${scienceFlow(d.scienceBlocks)}
    ${specStrip(d, isDevice)}
    <div class="two-col avoid-break">
      ${listBlock('אינדיקציות', d.indications)}
      ${listBlock('יתרונות קליניים', d.clinicalBenefits)}
    </div>
    ${benefitPanels(d)}
    ${d.closingTagline ? `<div class="closing"><span>${esc(d.closingTagline)}</span></div>` : ''}
  </section>`;
}

function renderAbout(d) {
  const a = ACCENTS.default;
  return `<section class="section about" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('MITODERM', d.title || 'אודות MITODERM', d.subtitleEn)}
    <div class="science">${arr(d.blocks).map(bl => `<section class="sci-block"><h3>${esc(bl.heading)}</h3>${paras(bl.body).map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div>
  </section>`;
}

function renderExosomes(d) {
  const a = ACCENTS['exosignal-hair'];
  return `<section class="section exosomes" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('TECHNOLOGY', d.title || 'סדרת האקסוזומים', d.subtitleEn)}
    ${d.intro ? `<div class="product-intro">${paras(d.intro).map(p => `<p>${esc(p)}</p>`).join('')}</div>` : ''}
    ${scienceFlow(d.mechanism)}
    ${d.closing ? `<div class="pullquote">${esc(d.closing)}</div>` : ''}
  </section>`;
}

function renderComparison(d) {
  const a = ACCENTS.default;
  const cols = arr(d.columns), rows = arr(d.rows);
  return `<section class="section comparison" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('OVERVIEW', d.title || 'טבלת השוואת מוצרים', d.subtitleEn)}
    <div class="table-wrap"><table class="cmp"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${arr(r).map((c, i) => `<td${i === 0 ? ' class="c0"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  </section>`;
}

function renderProtocols(d) {
  const a = ACCENTS['exo-nad'];
  return `<section class="section protocols" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('CLINICAL', d.title || 'פרוטוקולי טיפול', d.subtitleEn)}
    <div class="proto-grid">${arr(d.items).map((it, i) => `<div class="proto-card avoid-break"><div class="proto-num">${String(i + 1).padStart(2, '0')}</div><h4>${esc(it.name)}</h4><p>${esc(it.body)}</p></div>`).join('')}</div>
  </section>`;
}

function renderBeforeAfter() {
  const a = ACCENTS['exocell-mask'];
  return `<section class="section beforeafter" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('RESULTS', 'לפני / אחרי', 'Before / After')}
    <p class="ba-note">מומלץ לתעד כל מטופל/ת באור, זווית ותאורה עקביים, בהפרש של לפחות 3 חודשים בין הצילומים, כדי להמחיש נאמנה שיפור במרקם, בגוון ובצפיפות העור. אזור לתיעוד קליני יתווסף במהדורה המצולמת של הקטלוג.</p>
    <div class="ba-grid">${['פנים · אנטי-אייג\'ינג', 'פיגמנטציה', 'פוסט-אקנה', 'צפיפות שיער'].map(t => `<div class="ba-slot avoid-break"><div class="ba-ph"><span>לפני</span><span>אחרי</span></div><div class="ba-cap">${esc(t)}</div></div>`).join('')}</div>
  </section>`;
}

function renderFaq(d) {
  const a = ACCENTS['mitopen'];
  return `<section class="section faq" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('SUPPORT', d.title || 'שאלות נפוצות', d.subtitleEn)}
    <div class="faq-list">${arr(d.items).map(it => `<div class="faq-item avoid-break"><h4>${esc(it.q)}</h4><p>${esc(it.a)}</p></div>`).join('')}</div>
  </section>`;
}

function renderContacts(d) {
  const a = ACCENTS.default;
  const row = (label, val) => val ? `<div class="ct-row"><span class="ct-l">${label}</span><span class="ct-v">${esc(val)}</span></div>` : '';
  return `<section class="section contacts" style="--acc:${a.acc};--deep:${a.deep};--tint:${a.tint};--soft:${a.soft}">
    ${sectionHead('CONTACT', d.title || 'צור קשר', 'Get in touch')}
    <div class="ct-card avoid-break">
      ${row('אתר', d.site)}${row('דוא"ל', d.email)}${row('טלפון', d.phone)}${row('כתובת', d.address)}
    </div>
    ${d.copyright ? `<div class="copyright">${esc(d.copyright)}</div>` : ''}
  </section>`;
}

// -------- cover + toc --------
function renderCover() {
  return `<section class="section cover">
    <div class="cover-frame">
      <div class="cover-top">MITODERM · ISRAEL</div>
      <div class="cover-center">
        <div class="cover-wm">MITODERM</div>
        <div class="cover-rule"></div>
        <h1 class="cover-title">קטלוג טכנולוגיה ומוצרים</h1>
        <div class="cover-sub">אקסוזומים סינתטיים · פולינוקלאוטידים · רפואה רגנרטיבית</div>
        <div class="cover-sub-en">Synthetic Exosomes · PDRN · Regenerative Aesthetics</div>
      </div>
      <div class="cover-bottom"><span>לשימוש מקצועי בלבד</span><span>מהדורת 2026</span></div>
    </div>
  </section>`;
}

function renderToc(items) {
  return `<section class="section toc">
    ${sectionHead('CATALOG', 'תוכן העניינים', 'Contents')}
    <ol class="toc-list">${items.map((it, i) => `<li><span class="toc-n">${String(i + 1).padStart(2, '0')}</span><span class="toc-t">${esc(it.he)}</span><span class="toc-en">${esc(it.en || '')}</span></li>`).join('')}</ol>
  </section>`;
}

// ================= MARKDOWN RENDERERS =================
const mdParas = (b) => paras(b).join('\n\n');
function mdList(title, items) { const a = arr(items); return a.length ? `**${title}**\n\n${a.map(i => `- ${i}`).join('\n')}\n\n` : ''; }
function mdProduct(d) {
  let s = `\n\n---\n\n# ${d.latinName || ''}${d.hebrewName ? ` — ${d.hebrewName}` : ''}\n`;
  if (d.subtitleEn) s += `\n*${d.subtitleEn}*\n`;
  if (d.tagline) s += `\n> ${d.tagline}\n`;
  if (d.intro) s += `\n${mdParas(d.intro)}\n`;
  for (const bl of arr(d.scienceBlocks)) s += `\n## ${bl.heading}\n\n${mdParas(bl.body)}\n`;
  const actives = arr(d.actives), specs = arr(d.specs);
  if (actives.length) s += `\n## רכיבים פעילים\n\n${actives.map(a => `- **${a.name}**${a.role ? ` — ${a.role}` : ''}`).join('\n')}\n`;
  if (specs.length) s += `\n## מאפיינים טכניים\n\n${specs.map(a => `- **${a.k}:** ${a.v}`).join('\n')}\n`;
  s += `\n${mdList('אינדיקציות', d.indications)}${mdList('יתרונות קליניים', d.clinicalBenefits)}${mdList('יתרונות לקוסמטיקאי/ת', d.benefitsPro)}${mdList('יתרונות למטופל/ת', d.benefitsPatient)}`;
  if (d.protocol) { const p = d.protocol; s += `**פרוטוקול טיפול**\n\n${[p.amount && `- כמות: ${p.amount}`, p.series && `- סדרה: ${p.series}`, p.maintenance && `- תחזוקה: ${p.maintenance}`, p.zones && `- אזורים: ${p.zones}`].filter(Boolean).join('\n')}\n\n`; }
  if (arr(d.combos).length) s += `**שילוב במכשור:** ${arr(d.combos).join(' · ')}\n\n`;
  const pk = [d.volume && `נפח: ${d.volume}`, d.packaging, d.origin && `ארץ ייצור: ${d.origin}`].filter(Boolean);
  if (pk.length) s += `**אריזה:** ${pk.join(' · ')}\n\n`;
  if (d.closingTagline) s += `*${d.closingTagline}*\n`;
  return s;
}

// ================= ASSEMBLE =================
const loaded = ORDER.map(m => ({ meta: m, data: m.file ? load(m.file) : {} }));
const present = loaded.filter(x => x.data !== null);

const tocItems = present.map(({ meta, data }) => {
  if (meta.kind === 'about') return { he: data.title || 'אודות MITODERM', en: 'About' };
  if (meta.kind === 'exosomes') return { he: data.title || 'סדרת האקסוזומים', en: 'Exosome Technology' };
  if (meta.kind === 'comparison') return { he: 'טבלת השוואת מוצרים', en: 'Comparison' };
  if (meta.kind === 'protocols') return { he: 'פרוטוקולי טיפול', en: 'Protocols' };
  if (meta.kind === 'beforeafter') return { he: 'לפני / אחרי', en: 'Before / After' };
  if (meta.kind === 'faq') return { he: 'שאלות נפוצות', en: 'FAQ' };
  if (meta.kind === 'contacts') return { he: 'צור קשר', en: 'Contact' };
  return { he: data.hebrewName || data.latinName || meta.key, en: data.latinName || '' };
});

// -- HTML --
const bodyHtml = [renderCover(), renderToc(tocItems)];
for (const { meta, data } of present) {
  if (meta.kind === 'about') bodyHtml.push(renderAbout(data));
  else if (meta.kind === 'exosomes') bodyHtml.push(renderExosomes(data));
  else if (meta.kind === 'product' || meta.kind === 'device') bodyHtml.push(renderProduct(data, meta));
  else if (meta.kind === 'comparison') bodyHtml.push(renderComparison(data));
  else if (meta.kind === 'protocols') bodyHtml.push(renderProtocols(data));
  else if (meta.kind === 'beforeafter') bodyHtml.push(renderBeforeAfter());
  else if (meta.kind === 'faq') bodyHtml.push(renderFaq(data));
  else if (meta.kind === 'contacts') bodyHtml.push(renderContacts(data));
}

// QA preview mode: ONLY=vtech.json renders just that section to preview.html (screen, no page breaks)
if (process.env.ONLY) {
  const m = ORDER.find(o => o.file === process.env.ONLY);
  const data = load(process.env.ONLY);
  let frag = '';
  if (m && data) {
    if (m.kind === 'about') frag = renderAbout(data);
    else if (m.kind === 'exosomes') frag = renderExosomes(data);
    else if (m.kind === 'product' || m.kind === 'device') frag = renderProduct(data, m);
    else if (m.kind === 'comparison') frag = renderComparison(data);
    else if (m.kind === 'protocols') frag = renderProtocols(data);
    else if (m.kind === 'faq') frag = renderFaq(data);
    else if (m.kind === 'contacts') frag = renderContacts(data);
  }
  const fc = existsSync(FONTS) ? readFileSync(FONTS, 'utf8') : '';
  writeFileSync(join(__dir, 'preview.html'),
    `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>${fc}${CSS}\n.section{break-before:auto;padding:14mm 15mm}body{background:#fff}</style></head><body><main class="book">${frag}</main></body></html>`);
  console.log(`preview.html written for ${process.env.ONLY}`);
  process.exit(0);
}

const fontsCss = existsSync(FONTS) ? readFileSync(FONTS, 'utf8') : '';
const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>MITODERM — קטלוג טכנולוגיה ומוצרים</title>
<style>
${fontsCss}
${CSS}
</style></head><body>
<div class="run-foot"><span>MITODERM · קטלוג טכנולוגיה ומוצרים</span><span>לשימוש מקצועי בלבד · 2026</span></div>
<main class="book">${bodyHtml.join('\n')}</main>
</body></html>`;
writeFileSync(join(__dir, 'mitoderm-catalog-he.html'), html);

// -- Markdown --
let md = `# MITODERM — קטלוג טכנולוגיה ומוצרים\n\n**אקסוזומים סינתטיים · פולינוקלאוטידים (PDRN) · רפואה רגנרטיבית**\n\n*מהדורת 2026 · לשימוש מקצועי בלבד*\n\n## תוכן העניינים\n\n${tocItems.map((it, i) => `${i + 1}. ${it.he}`).join('\n')}\n`;
for (const { meta, data } of present) {
  if (meta.kind === 'about') { md += `\n\n---\n\n# ${data.title || 'אודות MITODERM'}\n`; for (const bl of arr(data.blocks)) md += `\n## ${bl.heading}\n\n${mdParas(bl.body)}\n`; }
  else if (meta.kind === 'exosomes') { md += `\n\n---\n\n# ${data.title || 'סדרת האקסוזומים'}\n`; if (data.intro) md += `\n${mdParas(data.intro)}\n`; for (const bl of arr(data.mechanism)) md += `\n## ${bl.heading}\n\n${mdParas(bl.body)}\n`; if (data.closing) md += `\n> ${data.closing}\n`; }
  else if (meta.kind === 'product' || meta.kind === 'device') md += mdProduct(data);
  else if (meta.kind === 'comparison') { md += `\n\n---\n\n# ${data.title || 'טבלת השוואת מוצרים'}\n\n| ${arr(data.columns).join(' | ')} |\n| ${arr(data.columns).map(() => '---').join(' | ')} |\n${arr(data.rows).map(r => `| ${arr(r).join(' | ')} |`).join('\n')}\n`; }
  else if (meta.kind === 'protocols') { md += `\n\n---\n\n# ${data.title || 'פרוטוקולי טיפול'}\n`; for (const it of arr(data.items)) md += `\n## ${it.name}\n\n${it.body}\n`; }
  else if (meta.kind === 'beforeafter') md += `\n\n---\n\n# לפני / אחרי\n\nמומלץ לתעד כל מטופל/ת באור, זווית ותאורה עקביים, בהפרש של לפחות 3 חודשים.\n`;
  else if (meta.kind === 'faq') { md += `\n\n---\n\n# ${data.title || 'שאלות נפוצות'}\n`; for (const it of arr(data.items)) md += `\n**ש: ${it.q}**\n\nת: ${it.a}\n`; }
  else if (meta.kind === 'contacts') { md += `\n\n---\n\n# ${data.title || 'צור קשר'}\n\n- אתר: ${data.site || ''}\n- דוא"ל: ${data.email || ''}\n- טלפון: ${data.phone || ''}\n- כתובת: ${data.address || ''}\n\n${data.copyright || ''}\n`; }
}
writeFileSync(join(__dir, 'mitoderm-catalog-he.md'), md);

const words = md.replace(/[#*>|_-]/g, ' ').split(/\s+/).filter(Boolean).length;
console.log(`Built HTML (${(html.length / 1024).toFixed(0)} KB) + MD (~${words} words). Sections present: ${present.length}/${ORDER.length}.`);
const missing = ORDER.filter(m => m.file && !existsSync(join(CONTENT, m.file)));
if (missing.length) console.log(`Missing content files: ${missing.map(m => m.file).join(', ')}`);
