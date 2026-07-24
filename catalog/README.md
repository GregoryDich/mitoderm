# MITODERM — Hebrew technology & products catalog

A standalone, print-ready **Hebrew (RTL)** brand catalog for MITODERM's own line,
built to an international-brand editorial standard (Skymedic / SkinCeuticals level).
Delivered as a **PDF** (~55 A4 pages, ~18k words of professional medical Hebrew).

## Files

- `content/*.json` — catalog content, one file per section (canonical source of text).
- `source-he.md` — owner-supplied source facts used to author the content.
- `styles.mjs` — the light-editorial print stylesheet (RTL, A4, per-family accents).
- `build-catalog.mjs` — merges `content/*.json` → `mitoderm-catalog-he.html` + `.md`.
- `fetch-fonts.mjs` → `fonts.css` — Hebrew fonts (Heebo, Frank Ruhl Libre, Assistant)
  inlined as data-URIs so Hebrew renders in headless Chromium with no network.
- `render.sh` — headless-Chromium HTML → `mitoderm-catalog-he.pdf`.
- `mitoderm-catalog-he.{html,md,pdf}` — generated artifacts.

## Rebuild

```bash
cd catalog
node fetch-fonts.mjs      # only if fonts.css is missing (needs network)
node build-catalog.mjs    # -> mitoderm-catalog-he.html + .md
bash render.sh            # -> mitoderm-catalog-he.pdf (needs Chromium)
```

## Structure (15 sections)

Cover · Contents · About MITODERM · Exosome technology · V-TECH SYSTEM (4pp) ·
EXO-NAD (4pp) · EXOSIGNAL HAIR (4pp) · EXOSIGNAL SPRAY · EXOTECH GEL · EXOCELL MASK ·
MITOPEN · MITOSCAN · Comparison table · Treatment protocols · Before/After · FAQ · Contact.

## Notes

- **Text-first edition.** Product/before-after photography is deferred; the layout
  reserves slots for it. A dark-theme variant can be produced from the same content.
- No invented clinical figures — claims are kept qualitative and defensible.
- To edit copy, change `content/*.json` and rebuild.
