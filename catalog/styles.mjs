export const CSS = String.raw`
:root{
  --paper:#fbfaf7; --panel:#ffffff; --ink:#191b20; --ink2:#33363d; --muted:#5c606a;
  --hair:#e7e2d8; --hair2:#d9d3c6;
  --acc:#a9781f; --deep:#7f5a13; --tint:#f4ecd7; --soft:#faf5e9;
  --serif:'Frank Ruhl Libre', Georgia, serif;
  --sans:'Heebo','Assistant', system-ui, sans-serif;
  --label:'Assistant','Heebo', system-ui, sans-serif;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family:var(--sans); color:var(--ink); background:var(--paper);
  font-size:10.3pt; line-height:1.6; -webkit-print-color-adjust:exact; print-color-adjust:exact;
  text-rendering:optimizeLegibility; font-feature-settings:"kern" 1;
}
p{margin:0 0 .62em}
h1,h2,h3,h4{margin:0; font-weight:700; line-height:1.18; text-wrap:balance}

/* ---- print pages ---- */
@page{ size:A4; margin:14mm 14mm 15mm; }
@page cover{ margin:0; }
.section{ break-before:page; }
.section:first-child{ break-before:auto; }
.avoid-break{ break-inside:avoid; }

/* running footer (repeats each printed page) */
.run-foot{
  position:fixed; left:0; right:0; bottom:7mm; display:flex; justify-content:space-between;
  padding:0 15mm; font-family:var(--label); font-size:7pt; letter-spacing:.14em; text-transform:uppercase;
  color:#a6a093; z-index:0;
}
.book{ position:relative; z-index:1; }

/* ---- shared heading ---- */
.eyebrow{ font-family:var(--label); font-weight:700; font-size:8pt; letter-spacing:.26em; text-transform:uppercase; color:var(--acc); margin-bottom:5mm; }
.sec-head{ margin-bottom:6mm; }
.latin-name{ font-family:var(--label); font-weight:700; letter-spacing:.12em; color:var(--ink2); font-size:11pt; margin-bottom:2mm; }
.sec-title{ font-family:var(--serif); font-size:29pt; font-weight:900; color:var(--ink); letter-spacing:-.01em; }
.sub-en{ font-family:var(--label); font-size:10pt; letter-spacing:.04em; color:var(--muted); margin-top:2.5mm; }
.head-rule{ height:2px; width:34mm; background:var(--acc); margin-top:6mm; border-radius:2px; }

/* ---- cover ---- */
.cover{ page:cover; background:radial-gradient(135% 100% at 50% 20%, #fdfcfa 0%, #f5f2ec 60%, #ece5da 100%); color:#2a2723; height:297mm; display:flex; padding:11mm; }
.cover-frame{ flex:1; border:1px solid rgba(140,120,70,.30); display:flex; flex-direction:column; justify-content:space-between; padding:16mm 14mm; position:relative; }
.cover-frame::before,.cover-frame::after{ content:""; position:absolute; width:16px; height:16px; border:2px solid var(--acc); }
.cover-frame::before{ top:-1px; right:-1px; border-left:0; border-bottom:0; }
.cover-frame::after{ bottom:-1px; left:-1px; border-right:0; border-top:0; }
.cover-top,.cover-bottom{ font-family:var(--label); font-size:8.5pt; letter-spacing:.28em; text-transform:uppercase; color:#9a8f79; }
.cover-bottom{ display:flex; justify-content:space-between; }
.cover-center{ text-align:center; }
.cover-logo{ display:block; width:118mm; max-width:82%; margin:0 auto; mix-blend-mode:multiply; }
.cover-wm{ font-family:var(--serif); font-weight:900; font-size:52pt; letter-spacing:.06em; color:#2b2822; }
.cover-rule{ width:56mm; height:2px; background:linear-gradient(90deg,transparent,var(--acc),transparent); margin:7mm auto 9mm; }
.cover-title{ font-family:var(--serif); font-weight:700; font-size:23pt; color:#3a352d; }
.cover-sub{ margin-top:6mm; font-size:11pt; color:#6b6353; letter-spacing:.02em; }
.cover-sub-en{ margin-top:2mm; font-family:var(--label); font-size:8.5pt; letter-spacing:.22em; text-transform:uppercase; color:#a89c82; }

/* ---- toc ---- */
.toc-list{ list-style:none; margin:0; padding:0; counter-reset:none; }
.toc-list li{ display:flex; align-items:baseline; gap:5mm; padding:3.1mm 0; border-bottom:1px solid var(--hair); }
.toc-n{ font-family:var(--label); font-weight:700; color:var(--acc); font-size:10pt; min-width:9mm; }
.toc-t{ font-family:var(--serif); font-size:13pt; font-weight:700; color:var(--ink); }
.toc-en{ margin-inline-start:auto; font-family:var(--label); font-size:8pt; letter-spacing:.16em; text-transform:uppercase; color:#a49d8e; }

/* ---- product hero ---- */
.product-hero{ background:var(--soft); border:1px solid var(--hair); border-inline-start:4px solid var(--acc); border-radius:3px; padding:6.5mm 8mm; margin-bottom:5.5mm; }
.product-latin{ font-family:var(--serif); font-weight:900; font-size:30pt; color:var(--ink); letter-spacing:-.01em; line-height:1.05; }
.product-he{ font-family:var(--serif); font-weight:700; font-size:16pt; color:var(--deep); margin-top:1.5mm; }
.product-suben{ font-family:var(--label); font-size:9.5pt; letter-spacing:.05em; color:var(--muted); margin-top:2.5mm; }
.product-tag{ font-family:var(--serif); font-style:italic; font-size:12pt; color:var(--ink2); margin-top:4mm; margin-bottom:0; }
.product-intro{ font-size:10.6pt; color:var(--ink2); margin-bottom:5mm; }
.product-intro.dc p:first-child::first-letter{ font-family:var(--serif); font-weight:900; font-size:27pt; float:inline-start; line-height:.86; padding-inline-end:2.2mm; color:var(--acc); }

/* ---- usage designation badges ---- */
.usage-row{ display:flex; gap:2mm; margin:2.5mm 0 0; flex-wrap:wrap; }
.ubadge{ font-family:var(--label); font-size:7.5pt; font-weight:600; letter-spacing:.05em; text-transform:uppercase; padding:1.1mm 3mm; border-radius:999px; border:1px solid; white-space:nowrap; display:inline-flex; align-items:center; gap:1.4mm; }
.ubadge::before{ content:""; width:1.8mm; height:1.8mm; border-radius:50%; background:currentColor; }
.ubadge-pro{ color:var(--deep); border-color:var(--acc); background:var(--tint); }
.ubadge-home{ color:#2f6d55; border-color:#7bb79c; background:#e8f3ed; }
.legend{ display:flex; gap:5mm; flex-wrap:wrap; margin-top:5mm; font-family:var(--label); font-size:8pt; letter-spacing:.03em; color:var(--muted); }
.legend b{ display:inline-flex; align-items:center; gap:1.6mm; font-weight:600; color:var(--ink2); }
.legend .dot{ width:2mm; height:2mm; border-radius:50%; display:inline-block; }
.legend .dot-pro{ background:var(--acc); }
.legend .dot-home{ background:#5aa385; }

/* ---- science 2-col editorial ---- */
.science{ column-count:2; column-gap:8mm; margin-bottom:5mm; }
.sci-block{ break-inside:avoid; margin-bottom:4mm; }
.sci-block h3{ font-family:var(--serif); font-size:12.5pt; font-weight:700; color:var(--deep); margin-bottom:1.6mm; }
.sci-block h3::before{ content:""; display:inline-block; width:9px; height:2px; background:var(--acc); vertical-align:middle; margin-inline-end:2.4mm; }
.sci-block p{ font-size:9.9pt; color:var(--ink2); }

/* ---- spec strip ---- */
.spec-strip{ display:grid; grid-template-columns:repeat(2,1fr); gap:0; border:1px solid var(--hair2); border-radius:4px; overflow:hidden; margin:1mm 0 5.5mm; background:var(--panel); }
.spec-cell{ padding:6mm 6mm 5.5mm; border-inline-start:1px solid var(--hair); border-top:1px solid var(--hair); }
.spec-cell:nth-child(-n+2){ border-top:0; }
.spec-cell:nth-child(odd){ border-inline-start:0; }
.spec-ic{ width:20px; height:20px; color:var(--acc); margin-bottom:3mm; }
.spec-ic svg{ width:100%; height:100%; }
.spec-t{ font-family:var(--label); font-weight:700; font-size:8pt; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); margin-bottom:3mm; }
.spec-list{ list-style:none; margin:0; padding:0; font-size:9pt; color:var(--ink2); }
.spec-list li{ padding:1.1mm 0; border-bottom:1px dotted var(--hair); }
.spec-list li:last-child{ border-bottom:0; }
.spec-list .k{ color:var(--muted); min-width:22mm; display:inline-block; }
.spec-list .v{ color:var(--ink); font-weight:500; }
.spec-list b{ color:var(--ink); }
.chips{ display:flex; flex-wrap:wrap; gap:2mm; }
.chip{ font-family:var(--label); font-size:8pt; font-weight:600; color:var(--deep); background:var(--tint); border:1px solid var(--hair2); border-radius:20px; padding:1mm 3mm; }

/* ---- lists / benefits ---- */
.two-col{ display:grid; grid-template-columns:1fr 1fr; gap:8mm; margin-bottom:5mm; }
.list-block h4,.ben-panel h4,.faq-item h4,.proto-card h4{ font-family:var(--label); font-weight:700; font-size:8.5pt; letter-spacing:.16em; text-transform:uppercase; color:var(--deep); margin-bottom:3.5mm; }
.ticks{ list-style:none; margin:0; padding:0; }
.ticks li{ position:relative; padding-inline-start:6mm; margin-bottom:2.2mm; font-size:9.6pt; color:var(--ink2); }
.ticks li::before{ content:""; position:absolute; inset-inline-start:0; top:2.6mm; width:3.4mm; height:3.4mm; border:1.5px solid var(--acc); border-radius:50%; }
.ben-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6mm; margin-bottom:5mm; }
.ben-panel{ background:var(--soft); border:1px solid var(--hair); border-radius:4px; padding:6mm; }

/* ---- closing ---- */
.closing{ text-align:center; margin-top:4mm; padding-top:6mm; border-top:1px solid var(--hair); }
.closing span{ font-family:var(--serif); font-style:italic; font-size:13pt; color:var(--deep); }
.pullquote{ font-family:var(--serif); font-style:italic; font-size:14pt; color:var(--deep); text-align:center; margin-top:7mm; padding:7mm 12mm; border-block:1px solid var(--hair); }

/* ---- comparison table ---- */
.table-wrap{ overflow-x:auto; }
.cmp{ width:100%; border-collapse:collapse; font-size:9pt; }
.cmp th{ background:var(--ink); color:#fff; font-family:var(--label); font-weight:700; font-size:8.5pt; letter-spacing:.06em; padding:3.5mm 3mm; text-align:start; }
.cmp td{ padding:3.2mm 3mm; border-bottom:1px solid var(--hair); color:var(--ink2); vertical-align:top; }
.cmp tr:nth-child(even) td{ background:var(--soft); }
.cmp td.c0{ font-weight:700; color:var(--deep); font-family:var(--label); }

/* ---- protocols ---- */
.proto-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
.proto-card{ background:var(--panel); border:1px solid var(--hair); border-inline-start:3px solid var(--acc); border-radius:3px; padding:5.5mm 6mm; position:relative; }
.proto-num{ font-family:var(--serif); font-weight:900; font-size:15pt; color:var(--tint); position:absolute; inset-inline-end:5mm; top:3mm; }
.proto-card h4{ color:var(--deep); margin-bottom:2.5mm; }
.proto-card p{ font-size:9.4pt; color:var(--ink2); margin:0; }

/* ---- before/after ---- */
.ba-note{ font-size:10pt; color:var(--muted); margin-bottom:7mm; max-width:150mm; }
.ba-grid{ display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
.ba-slot{ border:1px solid var(--hair); border-radius:4px; overflow:hidden; }
.ba-ph{ display:grid; grid-template-columns:1fr 1fr; height:38mm; background:repeating-linear-gradient(45deg,var(--soft),var(--soft) 6px,var(--panel) 6px,var(--panel) 12px); }
.ba-ph span{ display:flex; align-items:center; justify-content:center; font-family:var(--label); font-size:8pt; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); border-inline-start:1px dashed var(--hair2); }
.ba-ph span:first-child{ border-inline-start:0; }
.ba-cap{ padding:2.6mm 4mm; font-family:var(--label); font-weight:600; font-size:9pt; color:var(--deep); }

/* ---- faq ---- */
.faq-item{ padding:4.5mm 0; border-bottom:1px solid var(--hair); }
.faq-item h4{ font-family:var(--serif); font-size:12pt; color:var(--ink); letter-spacing:normal; text-transform:none; margin-bottom:2mm; }
.faq-item p{ font-size:9.8pt; color:var(--ink2); margin:0; }

/* ---- contacts ---- */
.ct-card{ background:var(--soft); border:1px solid var(--hair); border-radius:4px; padding:8mm; max-width:130mm; }
.ct-row{ display:flex; gap:6mm; padding:3mm 0; border-bottom:1px solid var(--hair); }
.ct-row:last-child{ border-bottom:0; }
.ct-l{ font-family:var(--label); font-weight:700; font-size:8.5pt; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); min-width:24mm; }
.ct-v{ font-size:11pt; color:var(--ink); font-weight:500; }
.copyright{ margin-top:8mm; font-size:8.5pt; color:var(--muted); }
`;
