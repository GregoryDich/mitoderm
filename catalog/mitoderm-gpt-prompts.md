# MITODERM — промпты для GPT: каталог постранично

Один промпт = одна страница каталога. 17 страниц (по одному средству на страницу).

## Как пользоваться
1. **Текст.** Генераторы картинок (GPT-4o / DALL·E / Midjourney) **плохо и с ошибками рисуют иврит и длинные абзацы.** Поэтому в каждом промпте текст на странице задан **латиницей/английским** (его модель рисует чисто). Для каждой страницы ниже отдельно дан **точный ивритский текст** — наложи его сам в Canva/Photoshop поверх сгенерённого макета, либо, если хочешь рискнуть, вставь иврит прямо в промпт (готовься править).
2. **Единый стиль.** В начало **каждого** промпта вставляй блок `STYLE` (ниже) — тогда все страницы будут выглядеть одной серией. Ещё лучше — прикрепи как reference первую сгенерённую обложку и/или файл логотипа.
3. **Формат.** A4 книжная, соотношение 3:4 (`--ar 3:4`), 300 dpi для печати.
4. **Реальные флаконы.** Для BIOSPICULE Serum и Derma Recovery Cream у тебя есть фото — прикрепи их как reference, чтобы флакон совпал 1:1. Для линии VM (V-Tech, EXO-NAD, Exosignal, Exotech, Exocell) фото приложи свои, иначе модель нарисует премиальный дженерик в стиле бренда.

---

## STYLE (вставлять в начало каждого промпта)

```
Ultra-premium medical-aesthetic skincare catalogue page, A4 portrait, 3:4.
Light editorial layout on a warm porcelain background (#f6f2ec) with a faint paper grain.
Brand MITODERM. Top-centre logo: the word "MITODERM" in an elegant thin serif, the letter
"I" replaced by a fine gold DNA double-helix with a small faceted black diamond above it,
and the slogan "Where Science Meets Beauty" in a light sans beneath.
Typography: high-contrast elegant serif for headlines (Didot / Frank Ruhl Libre feel),
clean humanist sans for the small text. Lots of white space, thin hairline rules,
one single metallic accent colour per page. Photoreal studio product render with soft
shadows and gentle reflections. All text crisp, correctly spelled, perfectly legible.
Calm, expensive, clinical — SkinCeuticals / Augustinus Bader level. No clutter.
--ar 3:4 --style raw
```

---

## Стр. 1 — Обложка (Cover)

**Prompt:**
```
[STYLE] Cover page. Centre: the large MITODERM logo with the DNA-helix "I", faceted
diamond and slogan "Where Science Meets Beauty". Below a thin gold rule, an elegant serif
title "TECHNOLOGY & PRODUCT CATALOGUE". Small caps line "Synthetic Exosomes · PDRN ·
Regenerative Aesthetics". Bottom corners: "For professional use only · Made in Italy /
Korea" and "Edition 2026". Thin gold corner brackets framing the page. Accent: warm gold.
Nothing else — pure, breathing, luxurious.
```
**Иврит для наложения:** заголовок «קטלוג טכנולוגיה ומוצרים» · подзаголовок «אקסוזומים סינתטיים · פולינוקלאוטידים · רפואה רגנרטיבית» · низ «לשימוש מקצועי בלבד · מהדורת 2026».

---

## Стр. 2 — О компании MITODERM (About)

**Prompt:**
```
[STYLE] About page, accent gold. Left column: heading "MITODERM" then four short
sub-blocks with headings "WHO WE ARE", "OUR TECHNOLOGY", "WHY MITODERM",
"KOREA × ITALY × ISRAEL", each with 2 short lines of placeholder body text. Right side:
a soft, faint scientific illustration — golden exosome nano-vesicles and a DNA strand,
very subtle, low opacity, decorative. Footer: "Made in Italy · VM Corporation".
Editorial two-column grid, airy.
```
**Иврит:** מי אנחנו · הטכנולוגיה שלנו · למה MITODERM · קוריאה × איטליה × ישראל. (Полный текст — в `mitoderm-catalog-16.md`, раздел «אודות MITODERM».)

---

## Стр. 3 — Технология экзосом (Exosome Technology)

**Prompt:**
```
[STYLE] Science explainer page, accent muted plum/violet. Centre hero: a clean 3D render
of a synthetic exosome — a translucent spherical lipid nano-vesicle carrying tiny glowing
molecules, with fine surface detail, floating over skin-cell layers shown as a soft
cross-section. Three short labelled callouts around it: "DELIVERY VEHICLE",
"DEEPER WITH MICRONEEDLING", "BATCH-CONSISTENT & STABLE". Elegant, semi-scientific,
premium infographic look.
```
**Иврит:** заголовок «אקסוזומים סינתטיים — כיצד הם פועלים» · подписи: «מערכת נשא ביולוגית» · «חדירה לעומק בשילוב מכשור» · «יציבות ואחידות מנה».

---

## Стр. 4 — V-TECH SYSTEM

**Prompt:**
```
[STYLE] Product page, accent warm gold (#a9781f). Hero render: a professional aesthetic
serum system — a slim 5 ml glass ampoule and a foil gel-mask sachet, minimalist white-and-
gold labels reading "V-TECH". Product on the right third, text on the left. Headline serif
"V-TECH SYSTEM", sub "Synthetic Exosomes + 2% PDRN — Clinical Regeneration". Four short
benefit lines with tiny gold bullet dots: "PDRN activates the A2A receptor → fibroblasts,
collagen, elastin", "Synthetic exosomes carry actives; depth via microneedling",
"High-MW hyaluronic acid — hydration & barrier", "Visible glow from session one".
A small gold pill badge "PROFESSIONAL USE ONLY". Bottom tagline "V-TECH. Regeneration,
delivered."
```
**Иврит:** «מערכת V-TECH» · подзаголовок «אקסוזומים סינתטיים + 2% PDRN — התחדשות קלינית» · бейдж «לשימוש מקצועי בלבד». Буллеты и полный текст — в `mitoderm-catalog-16.md`.

---

## Стр. 5 — EXO-NAD Skin Longevity

**Prompt:**
```
[STYLE] Product page, accent teal (#2f8083). Hero render: a 3-piece professional peeling
system — a 15 ml dropper bottle plus two small ampoule boxes, clean white/teal labels
"EXO-NAD". Below the hero, three numbered tier cards: "1 · BIPHASIC EXO PEEL",
"2 · PH NORMALIZER", "3 · LONGEVITY SERUM". Headline "EXO-NAD — SKIN LONGEVITY PEELING",
sub "3-Phase Professional System · NAD⁺". Benefit lines: "Supports the cellular NAD⁺
pathway & energy", "AHA acids renew & even tone", "Epitalon & peptides — longevity
support". Teal pill badge "PROFESSIONAL USE ONLY".
```
**Иврит:** «EXO-NAD — פילינג אריכות תאית» · шаги: «שלב 1 · Biphasic EXO Peel», «שלב 2 · PH Normalizer», «שלב 3 · Longevity Serum» · бейдж «לשימוש מקצועי בלבד».

---

## Стр. 6 — EXOSIGNAL HAIR

**Prompt:**
```
[STYLE] Product page, accent plum (#7c4f86). Hero render: a 5 ml hair-treatment ampoule
with a plum-and-white "EXOSIGNAL HAIR" label, beside a subtle scalp/hair-follicle motif.
Headline "EXOSIGNAL HAIR", sub "Follicular Biohacking & Hair Regeneration". Benefit lines:
"Boosts endogenous VEGF & peri-follicular angiogenesis", "Synthetic exosomes + PDRN,
delivered via scalp microneedling", "8 biomimetic peptides incl. Copper Tripeptide-1 &
Oligopeptide-20", "For androgenetic & areata alopecia, density, shine". Plum pill badge
"PROFESSIONAL USE ONLY".
```
**Иврит:** «מערכת EXOSIGNAL HAIR» · подзаголовок «אקסוזומים · PDRN · VEGF · 8 פפטידים» · бейдж «לשימוש מקצועי בלבד».

---

## Стр. 7 — EXOSIGNAL SPRAY

**Prompt:**
```
[STYLE] Product page, accent plum (#7c4f86), lighter and airier (home-care mood).
Hero render: a slim white fine-mist spray bottle with plum "EXOSIGNAL" label.
Headline "EXOSIGNAL SPRAY", sub "Home-Care Scalp & Hair Support". Benefit lines:
"Soothes daily irritation, protects sensitive scalp", "Light hydration, pH balance,
healthy follicle environment", "Maintains results between clinic sessions". A soft
green pill badge "HOME CARE".
```
**Иврит:** «ספריי EXOSIGNAL HAIR» · подзаголовок «תחזוקת קרקפת ושיער בבית» · бейдж «לטיפוח ביתי».

---

## Стр. 8 — EXOTECH GEL

**Prompt:**
```
[STYLE] Product page, accent slate/graphite (#3f5f78). Hero render: a frosted airless
gel pump bottle, minimalist "EXOTECH GEL" label, with a glossy clear gel swatch beside it.
Headline "EXOTECH GEL", sub "Post-Procedure Recovery & Barrier Repair". Benefit lines:
"Low-MW PDRN supports healing (topical effect gentle & cumulative)", "Snail mucin +
hyaluronic acid — hydration, lower TEWL", "Calms redness after laser, peel, microneedling".
Two pill badges side by side: gold "PROFESSIONAL" + green "HOME CARE".
```
**Иврит:** «EXOTECH GEL» · подзаголовок «שיקום ולחות לאחר פרוצדורות» · бейджи «לשימוש מקצועי» + «לטיפוח ביתי».

---

## Стр. 9 — EXOCELL MASK

**Prompt:**
```
[STYLE] Product page, accent rose (#a2537a). Hero render: a translucent biocellulose sheet
mask draped elegantly, plus its foil sachet with a rose "EXOCELL" label; a subtle macro of
ultra-fine biocellulose fibres in a corner. Headline "EXOCELL MASK", sub "Biocellulose
Biotech Recovery Mask". Benefit lines: "Biocellulose fibres 20–50 nm — precise epidermal
adhesion", "Synthetic exosome system (~100 nm) delivery", "Hexapeptide-8 (in-vitro:
collagen I/IV, elastin, catalase)", "Antioxidants Q10, Nannochloropsis, Spilanthes".
Rose + green pill badges "PROFESSIONAL / HOME CARE". "5 individually sealed masks".
```
**Иврит:** «מסכת EXOCELL» · подзаголовок «מסכת ביו-צלולוז · שיקום מיידי» · бейджи «לשימוש מקצועי» + «לטיפוח ביתי».

---

## Стр. 10 — BIOSPICULE Spicule Serum (Korea)

**Prompt (прикрепи фото белого флакона как reference):**
```
[STYLE] Product page, accent forest green (#3f6b4a). Hero render: the real MITODERM white
airless pump serum bottle, side text "MITODERM BIOSPICULE SYSTEM", front label
"BIOSPICULE SERUM · CELL RENEW 1.5% · ADVANCED BIOSPICULE TECHNOLOGY · MADE IN KOREA ·
30 ml". Beside it, a striking macro of a clear gel drop full of fine green micro-spicules
(needle-like marine sponge spicules). Below, three tier chips: "CELL RENEW 1.5% · HOME",
"CELLULAR AGE DEFENSE 2.5% · HOME", "MICRO BOOST 10% · PROFESSIONAL". Headline
"BIOSPICULE SPICULE SERUM", sub "Micro Spicule Technology · Made in Korea". Benefit lines:
"Marine spicules create micro-channels — needle-free micro-needling", "Boosts penetration
& cell renewal", "Rice PDRN, niacinamide, bakuchiol, 5 peptides". Badges gold "PROFESSIONAL"
+ green "HOME CARE".
```
**Иврит:** «סרום ביוספיקול» · «טכנולוגיית מיקרו-ספיקולות» · тиры: «CELL RENEW 1.5% · ביתי», «CELLULAR AGE DEFENSE 2.5% · ביתי», «MICRO BOOST 10% · מקצועי».

---

## Стр. 11 — DERMA RECOVERY CREAM (Korea)

**Prompt (прикрепи фото матовой банки как reference):**
```
[STYLE] Product page, accent sage green (#6d8a5e). Hero render: the real frosted-glass jar
with a black airless pump top, label "MITODERM BIOSPICULE SYSTEM · DERMA RECOVERY CREAM ·
SNAIL COLLAGEN · 50 ml", plus a soft swirl of rich white cream beside it. Headline
"DERMA RECOVERY CREAM", sub "Snail Collagen · Daily Nourishing Cream". Benefit lines:
"Hydrolyzed collagen + snail mucin — hydration & elasticity", "Galactomyces + niacinamide —
even tone & glow", "Madecassoside, allantoin, panthenol — soothing barrier care",
"Supports skin comfort after professional treatments". Badges sage "HOME CARE" +
gold "POST-PROCEDURE".
```
**Иврит:** «קרם דרמה ריקוברי» · подзаголовок «Snail Collagen · קרם קולגן מזין יומי» · бейджи «לטיפוח ביתי» + «לאחר טיפול».

---

## Стр. 12 — MITOPEN (устройство)

**Prompt:**
```
[STYLE] Device page, accent slate/graphite (#3f5f78). Hero render: a sleek white cordless
microneedling pen lying at an elegant angle, minimalist, medical-grade, with a subtle
disposable needle cartridge beside it. Headline "MITOPEN", sub "Professional Cordless
Microneedling Pen". Spec chips: "Needle depth 0–2.5 mm", "Adjustable speed", "Cordless,
rechargeable", "Disposable tips". Benefit line: "Opens micro-channels to drive exosomes &
PDRN into the dermis". Graphite pill badge "PROFESSIONAL DEVICE".
```
**Иврит:** «עט מיקרונידלינג מקצועי» · характеристики «עומק מחט 0–2.5 מ״מ · מהירות מתכווננת · אלחוטי · ראשים חד-פעמיים» · бейдж «מכשור מקצועי».

---

## Стр. 13 — MITOSCAN (устройство)

**Prompt:**
```
[STYLE] Device page, accent teal-slate. Hero render: a handheld AI scalp-imaging scope
device next to a tablet screen showing a magnified scalp with hair-density analysis
overlays (follicle counts, diameter graph). Headline "MITOSCAN", sub "AI Hair & Scalp
Diagnostic Imaging". Spec chips: "HD magnification", "AI analysis", "Density · follicles ·
diameter", "Before/after tracking". Benefit line: "Objective measurement — diagnose, track,
prove results". Teal pill badge "PROFESSIONAL DEVICE".
```
**Иврит:** «מערכת אבחון שיער וקרקפת» · характеристики «הגדלה HD · ניתוח AI · צפיפות/זקיקים/קוטר · מעקב» · бейдж «מכשור מקצועי».

---

## Стр. 14 — Сравнительная таблица (Comparison)

**Prompt:**
```
[STYLE] Overview page, accent gold. A clean, elegant comparison TABLE with a dark header
row and alternating porcelain/cream rows. Columns: "Product | Main purpose | For whom |
Frequency | Combines with". Rows for V-TECH, EXO-NAD, EXOSIGNAL HAIR, EXOSIGNAL SPRAY,
EXOTECH GEL, EXOCELL MASK, BIOSPICULE SERUM, DERMA RECOVERY CREAM (product names in gold).
Below the table a small colour-dot legend: gold = professional, green = home care.
Editorial, precise, no product photos.
```
**Иврит:** заголовок «טבלת השוואת מוצרים», колонки «מוצר · ייעוד מרכזי · אוכלוסיית יעד · תדירות · שילובים», легенда «מקצועי / ביתי». (Таблица целиком — в `.md`.)

---

## Стр. 15 — Протоколы лечения (Protocols)

**Prompt:**
```
[STYLE] Clinical page, accent teal. A grid of six numbered protocol cards (01–06), each a
short titled block: "Anti-ageing", "Pigmentation", "Post-acne & scars", "Hair", "Regeneration
/ post laser-RF", "Post-microneedling". Thin numbered markers, hairline card borders, calm
clinical layout. No photos.
```
**Иврит:** «פרוטוקולי טיפול» · карточки: אנטי-אייג'ינג · פיגמנטציה · פוסט-אקנה · שיער · רגנרציה/לאחר לייזר-RF · לאחר Microneedling.

---

## Стр. 16 — FAQ

**Prompt:**
```
[STYLE] Support page, accent slate. Clean single-column list of 5–6 question/answer blocks,
each with a bold short question and 2 lines of answer, separated by hairline rules. Calm,
readable, generous spacing. No photos.
```
**Иврит:** «שאלות נפוצות» · вопросы: בטיחות · מהם אקסוזומים סינתטיים · תוצאות · סוגי עור · תופעות לוואי · השגת המוצרים. (Ответы — в `.md`.)

---

## Стр. 17 — Контакты (Contacts)

**Prompt:**
```
[STYLE] Closing contact page, accent gold. Centre: the MITODERM logo with slogan again.
Below, an elegant contact card with rows: Website · Email · Phone · Address. Footer line
"© 2026 MITODERM · Made in Italy / Korea · For professional use only". Very minimal,
lots of space, a thin gold frame.
```
**Иврит/данные:** «צור קשר» · אתר: mitoderm.com · דוא״ל: Mitoderm@gmail.com · טלפון: +972 54-326-2182 · כתובת: דרך רפאל איתן 38, רמת גן · «© 2026 MITODERM — כל הזכויות שמורות».

---

## Совет по единообразию
Сгенерируй сначала **стр. 4 (V-TECH)** как эталон стиля. Понравится — прикрепляй её как reference-image к остальным промптам («match the layout, typography and logo of the attached reference») + держи один и тот же STYLE-блок и, если инструмент позволяет, один `--seed`. Тогда все 17 страниц выйдут как единый каталог.
