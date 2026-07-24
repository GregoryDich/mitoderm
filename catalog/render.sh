#!/usr/bin/env bash
# Render the self-contained catalog HTML to A4 PDF via headless Chromium.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
PROFILE="$(mktemp -d)"
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --user-data-dir="$PROFILE" \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=20000 \
  --print-to-pdf="$DIR/mitoderm-catalog-he.pdf" \
  "file://$DIR/mitoderm-catalog-he.html" 2>&1 | grep -vi 'devtools\|listening\|GPU\|Fontconfig' || true
rm -rf "$PROFILE"
ls -la "$DIR/mitoderm-catalog-he.pdf"
