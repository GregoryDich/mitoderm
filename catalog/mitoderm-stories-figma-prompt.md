# MITODERM — Instagram Stories Deck · единый промпт для Figma

> **Что это.** Готовый к вставке промпт для генерации презентации-сторис в **Figma Make**
> (или как бриф для дизайнера). Формат — **Instagram Stories 1080×1920 (9:16)**. Один слайд =
> одна страница каталога. Копирайт слайдов — **на иврите (RTL)**, т.к. это язык бренда и
> аудитории; к каждому слайду есть строка **«Тема (RU)»** для понимания. Ниже: (1) мастер-промпт,
> (2) дизайн-система, (3) анатомия слайда, (4) 22 слайда с контентом, (5) правила, (6) арт-дирекшн.
> Это **отдельная «модель в бок»** — самостоятельный ассет, не связанный с вашей основной презентацией.
> Копирайт легко переключить на RU/EN — структура одна.

---

## 1) МАСТЕР-ПРОМПТ (вставить в Figma Make)

> Generate a premium **Instagram Stories** set (**1080×1920 px, 9:16**) for **MITODERM**, a
> professional exosome-based medical-aesthetics brand (Israel · Italy · Korea). **22 vertical
> slides**, dark editorial luxe. Base background `#08080a`, primary text `#f5f2f0`, one **accent
> per slide** from the brand palette. Display headlines in a Hebrew serif (**Frank Ruhl Libre**),
> body/eyebrow in a clean Hebrew sans (**Heebo**). **All copy is Hebrew, right-to-left**; isolate
> Latin/numbers as LTR. **One idea per slide**, generous negative space, big type, thin 1.5px line
> icons, subtle accent glow on `#08080a`, fine film grain, small MITODERM wordmark + 22-dot progress
> indicator. Respect Instagram safe zones (keep text out of top 250px and bottom 340px). Use only
> the copy and numbers given per slide below — do not invent claims. Optional motion: 400ms ease
> fade-up per element, gentle particle drift on the science slides.

---

## 2) Дизайн-система

**Canvas & safe zone**
- Artboard: `1080 × 1920`. Content safe box: `x 96–984`, `y 300–1580` (top 250px + bottom 340px kept clear of IG UI).
- Grid: single column, right-aligned (RTL). Vertical rhythm 8px.

**Цвет (deep luxe base)**
- Base `#08080a` · Panel/glass `rgba(255,255,255,0.04)` + 1px `rgba(255,255,255,0.08)`, radius 28.
- Text primary `#f5f2f0` · muted `#a7a29b` · hairline `rgba(255,255,255,0.10)`.
- Accents (one per slide): gold `#dfba74` · teal `#6fb7ba` · rose `#b4607e` · plum `#b48fd0` · copper `#d59a6a` · forest `#7fc08a` · sage `#a6c48f` · graphite `#9fb8d4`.
- Accent usage: **one element only** (headline underline, stat number, icon, or glow) — never everything.

**Типографика**
- Display / headline: **Frank Ruhl Libre**, 700–900. Headline 96–120px, line-height 1.05, ≤6 words.
- Sub-headline: Heebo 600, 40–46px.
- Eyebrow (kicker): Heebo 600, 28–30px, letter-spacing +0.18em, UPPERCASE (Latin) / normal (Hebrew), in accent.
- Body / points: Heebo 400–500, 34px, line-height 1.4, line ≤ ~34 chars.
- Stat number: Frank Ruhl Libre 900, 130–160px, in accent (LTR-isolated).
- Footer / wordmark: Heebo 500, 24px, muted.

**Компоненты**
- *Eyebrow chip* → *Headline* → *1–3 points* (или *1 stat*) → *CTA* → *footer wordmark + progress dots*.
- Points as short lines with a thin accent tick/`·` marker on the right (RTL).
- Stat card: glass panel, big accent number + small Hebrew label beneath.
- Section divider slides: oversized chapter number (outline) + Hebrew title + EN subline + hairline rule.

**Движение (если анимируем)**
- Element fade-up 400ms ease-out, stagger 80ms. Science slides: slow drifting nano-particles/network lines in accent at 6% opacity.

---

## 3) Анатомия слайда (RTL)

```
┌───────────────────────────── 1080 ─────────────────────────────┐
│  [MITODERM wordmark]                       ●●●○○○ progress dots │  ← y<300 safe
│                                                                 │
│                                        ‹EYEBROW / kicker›  (acc)│
│                                        ‹HEADLINE — serif, big›  │
│                                        ‹sub-headline (muted)›   │
│                                                                 │
│                                        · point one              │
│                                        · point two              │
│                                        · point three            │
│                                                                 │
│                    [ stat card / proof chip — optional ]        │
│                                                                 │
│                                        ‹CTA›            (acc)   │  ← y>1580 safe below
└─────────────────────────────────────────────────────────────────┘
```
All text hugs the **right** edge; reading flows right→left; imagery/graphic sits left or behind.

---

## 4) Слайды (22) — по странице каталога

> Формат каждого: **роль · accent** → *Тема (RU)* → **HE-копирайт** (Eyebrow / Headline / Sub / Points / Stat / CTA) + Visual.

### S1 — Обложка / хук · **gold**
*Тема (RU): крючок — «сигнал к обновлению клетки», бренд-заставка.*
- Eyebrow: `MITODERM · WHERE SCIENCE MEETS BEAUTY`
- Headline: `האות לחידוש התא`
- Sub: `אקסוזומים סינתטיים · פולינוקלאוטידים · רפואה רגנרטיבית`
- CTA: `החליקו לגלות ←`
- Visual: чёрный фон, золотое свечение-«экзосома», логотип MITODERM по центру, крупная засечка-сериф.

### S2 — О бренде · **gold**
*Тема (RU): кто мы — Корея × Италия × Израиль, регенеративная медицина.*
- Eyebrow: `מי אנחנו`
- Headline: `קוריאה × איטליה × ישראל`
- Points: `· פורטפוליו נבחר של אסתטיקה רפואית מתקדמת` · `· מבוסס מחקר ברפואה רגנרטיבית` · `· כלים מדעיים למטפלים לחידוש והצערת העור`
- Visual: три тонкие линии-«меридиана», сходящиеся в золотую точку.

### S3 — Наука: синтетические экзосомы · **teal**
*Тема (RU): что такое синтетические экзосомы (главный научный хук).*
- Eyebrow: `הטכנולוגיה במרכז הקו`
- Headline: `מהם אקסוזומים סינתטיים?`
- Points: `· שלפוחיות ננומטריות — "שליחים" בין תאים` · `· גרסה ביו-מימטית: יציבה ובטוחה` · `· נושאות את המטען הפעיל אל תוך התא`
- Visual: сеть светящихся наносфер teal на чёрном, дрейф частиц.

### S4 — Механизм: цепочка восстановления · **teal**
*Тема (RU): экзосомы + PDRN + пептиды = одна цепочка клеточного восстановления.*
- Eyebrow: `מנגנון הפעולה`
- Headline: `שרשרת אחת של שיקום תאי`
- Points: `· אקסוזומים — נשא וסיגנל` · `· PDRN — דלק להתחדשות` · `· פפטידים ביו-מימטיים — ההוראות לתא`
- Visual: 3 звена-иконки, соединённые тонкой teal-линией справа налево.

### S5 — Раздел 01 · **plum**
*Тема (RU): дивайдер главы «Кожа головы».*
- Eyebrow: `פרק 01`
- Headline: `קרקפת`
- Sub: `טריכולוגיה · אבחון · צמיחת שיער`
- Visual: гигантская контурная «01», hairline-разделитель.

### S6 — EXOSIGNAL HAIR · **plum**
*Тема (RU): проф. система против выпадения / для роста волос.*
- Eyebrow: `לשימוש מקצועי`
- Headline: `EXOSIGNAL HAIR`
- Sub: `ביו-האקינג לזקיק השערה`
- Points: `· אקסוזומים + PDRN + 8 פפטידים` · `· מפחית נשירה, תומך בצמיחה` · `· עם מזופן — חדירה עמוקה לקרקפת`
- CTA: `למרפאות שיער`
- Visual: макро зоны роста / фолликул, plum rim-light.

### S7 — MITOSCAN · **teal**
*Тема (RU): AI-диагностика кожи головы, доказательство результата.*
- Eyebrow: `אבחון · בינה מלאכותית`
- Headline: `MITOSCAN`
- Sub: `הדמיית קרקפת ושיער מבוססת AI`
- Points: `· מדידה אובייקטיבית: צפיפות · זקיקים · קוטר שערה` · `· לפני/אחרי — הוכחת תוצאה` · `· מזהה מה שהעין לא רואה`
- Stat/tagline: `Measure what matters`
- Visual: HD-скан-сетка над кожей головы, teal UI-оверлей с цифрами.

### S8 — Раздел 02 · **copper**
*Тема (RU): дивайдер главы «Парикмахеры / салоны».*
- Eyebrow: `פרק 02`
- Headline: `מעצבי שיער`
- Sub: `טיפוח שיער מקצועי לסלון`
- Visual: контурная «02».

### S9 — EXOSIGNAL SPRAY · **teal**
*Тема (RU): домашний спрей для кожи головы — продолжение терапии.*
- Eyebrow: `טיפוח ביתי`
- Headline: `EXOSIGNAL SPRAY`
- Sub: `ספריי קרקפת יומי — המשך הטיפול בבית`
- Points: `· פולינוקלאוטידים · פפטידים · תמציות צמח` · `· מרגיע קרקפת ותומך בסביבת הזקיק` · `· בקבוק 15 מ"ל לשימוש ביתי`
- CTA: `לרכישה בסלון`
- Visual: флакон-спрей, лёгкая дымка-туман teal.

### S10 — Раздел 03 · **gold**
*Тема (RU): дивайдер главы «Косметологи».*
- Eyebrow: `פרק 03`
- Headline: `קוסמטולוגים`
- Sub: `טיפולי פנים ועור מתקדמים`
- Visual: контурная «03».

### S11 — V-TECH SYSTEM · **gold**
*Тема (RU): флагман — регенерация кожи, экзосомы + 2% PDRN.*
- Eyebrow: `לשימוש מקצועי`
- Headline: `V-TECH SYSTEM`
- Sub: `אקסוזומים + 2% PDRN — רגנרציה קלינית`
- Points: `· סרום ביו-ליפטינג + מסכת ג'ל דו-שלבית` · `· בשילוב מיקרונידלינג / RF / לייזר`
- Stat chip: `לחות 108→120 · עובי עור +6.8%`
- CTA: `הפרוטוקול המוביל שלנו`
- Visual: капля сыворотки макро, золотой ободок света.

### S12 — Доказательство (клиника) · **gold**
*Тема (RU): отдельный «proof»-слайд с цифрами исследования V-Tech.*
- Eyebrow: `מחקר קליני · 62 מטופלים (40–68)`
- Headline: `התוצאה, במספרים`
- Stats (три карточки): `108→120 — לחות עור` · `+6.8% — עובי עור (12 שב')` · `רפיון ↓ — מדד PRIMOS`
- Footer: `Corneometer CM825 · VM Corporation`
- Visual: три glass-карточки со-крупными золотыми числами.

### S13 — EXO-NAD · **teal**
*Тема (RU): пилинг «клеточного долголетия», NAD⁺.*
- Eyebrow: `לשימוש מקצועי`
- Headline: `EXO-NAD`
- Sub: `Skin Longevity Peeling — פילינג אריכות תאית`
- Points: `· NAD⁺ · אקסוזומים · אפיטלון · GHK-Cu` · `· פילינג תלת-שלבי לאנטי-אייג'ינג עמוק` · `· אחת ל-4 שבועות`
- Stat chip: `קמטים −21% · אלסטיות +47% · נתוני יצרן`
- Visual: 3 фазы-флакона, teal-градиент.

### S14 — EXOTECH GEL · **copper**
*Тема (RU): лифтинг и био-реструктуризация, гель с золотым носителем.*
- Eyebrow: `מקצועי + ביתי`
- Headline: `EXOTECH GEL`
- Sub: `ליפטינג וביו-רסטרוקטורינג`
- Points: `· פפטיד נשא-זהב — פעיל תוך שעות` · `· מוצין חלזון מקוטע + חומצה היאלורונית` · `· מרקם ג'ל נספג — לשימוש יומי`
- CTA: `לפנים · צוואר · מחשוף`
- Visual: янтарно-медный гель, тягучая текстура макро.

### S15 — EXOCELL MASK · **rose**
*Тема (RU): био-целлюлозная маска — мгновенное восстановление после процедур.*
- Eyebrow: `מקצועי + ביתי`
- Headline: `EXOCELL MASK`
- Sub: `מסכת ביו-צלולוז — שיקום מיידי`
- Points: `· אקסוזומים סינתטיים בבד ביו-צלולוז` · `· אחרי פילינג / מיקרונידלינג / לייזר` · `· 30 דקות — ואין לשטוף`
- CTA: `הרגעה וזוהר מיידי`
- Visual: полупрозрачная маска на коже, rose-подсветка.

### S16 — BIOSPICULE SERUM · **forest**
*Тема (RU): микро-спикулы — «микронидлинг без иглы».*
- Eyebrow: `מקצועי + ביתי`
- Headline: `BIOSPICULE SERUM`
- Sub: `מיקרו-ספיקולות — מיקרונידלינג ללא מחט`
- Points: `· מחטיות סיליקה טבעיות פותחות מיקרו-תעלות` · `· 3 ריכוזים: 1.5% / 2.5% / 10% מקצועי` · `· ערב · SPF למחרת חובה`
- CTA: `חידוש מרקם וזוהר`
- Visual: кристаллические спикулы макро, forest-блик.

### S17 — DERMA RECOVERY CREAM · **sage**
*Тема (RU): дневной питательный коллагеновый крем.*
- Eyebrow: `טיפוח יומי`
- Headline: `DERMA RECOVERY`
- Sub: `קרם קולגן מזין ליום`
- Points: `· קולגן + מוצין חלזון` · `· מרגיע ומחזק מחסום` · `· נוחות לאחר פרוצדורות`
- CTA: `לכל סוגי העור`
- Visual: кремовая текстура, мягкий sage-свет.

### S18 — MITOPEN · **graphite**
*Тема (RU): проф. беспроводной микронидлинг-пен — доставка активов.*
- Eyebrow: `מכשור מקצועי`
- Headline: `MITOPEN`
- Sub: `עט מיקרונידלינג אלחוטי`
- Points: `· עומק מחט מבוקר 0–2.5 מ"מ` · `· מגביר חדירת אקסוזומים ו-PDRN` · `· משתלב עם כל קו MITODERM`
- CTA: `העברה מדויקת, תוצאה עמוקה`
- Visual: перо-девайс на графитовом фоне, стальной блик.

### S19 — Быстрый гид «что для чего» · **gold**
*Тема (RU): saveable-слайд — какой продукт под какую задачу.*
- Eyebrow: `מדריך מהיר`
- Headline: `איזה מוצר, למה?`
- Points: `· אנטי-אייג'ינג → V-TECH · EXO-NAD` · `· שיער → EXOSIGNAL · MITOSCAN` · `· שיקום עור → EXOCELL · DERMA` · `· מרקם וזוהר → BIOSPICULE`
- CTA: `שמרו לעצמכם ↓`
- Visual: 2×2 матрица иконок с золотыми подписями.

### S20 — Протоколы по цели · **teal**
*Тема (RU): протоколы лечения по задачам.*
- Eyebrow: `פרוטוקולי טיפול`
- Headline: `טיפול לפי מטרה`
- Points: `· אנטי-אייג'ינג · פיגמנטציה · פוסט-אקנה` · `· שיער · רגנרציה לאחר לייזר/RF` · `· תחזוקה לאחר מיקרונידלינג`
- CTA: `נבנה לכם פרוטוקול`
- Visual: тонкая тайм-линия шагов teal.

### S21 — 3 факта / развеиваем мифы · **graphite**
*Тема (RU): FAQ-слайд, отлично работает в сторис.*
- Eyebrow: `שאלות נפוצות`
- Headline: `3 דברים שחשוב לדעת`
- Points: `· אקסוזומים סינתטיים — בטוחים, ללא רקמה אנושית` · `· התוצאות מצטברות לאורך הסדרה` · `· מתאים לכל סוגי העור`
- CTA: `יש שאלה? הודעה פרטית`
- Visual: три «✓» тонкой линией.

### S22 — CTA / контакт · **gold**
*Тема (RU): финальный призыв к действию.*
- Eyebrow: `MITODERM`
- Headline: `מוכנים להתחיל?`
- Points: `· mitoderm.com` · `· לשימוש מקצועי בלבד · Made in Italy`
- CTA: `פנו אלינו — קישור בביו`
- Visual: логотип по центру, золотое свечение, стрелка-«вверх/link».

---

## 5) Правила (по всем правилам — чек-лист)

**Обязательно**
- Одна мысль на слайд. Headline ≤ 6 слов. Максимум **3 пункта**, каждый ≤ ~7 слов.
- Только **один** акцентный элемент на слайд. Максимум 2 конкурирующих размера шрифта.
- RTL: весь иврит выровнен вправо; числа/латиница (PDRN, V-TECH, 108→120, %) — LTR-изолированы, чтобы стрелки/знаки не переворачивались.
- Держать текст в safe-зоне (верх 250px и низ 340px — под UI Instagram оставить пустыми).
- Единый нижний колонтитул: маленький логотип MITODERM + прогресс-точки на всех слайдах.
- Цифры и заявления — **только** приведённые здесь (V-Tech: 108→120, +6.8%; EXO-NAD: −21% / +47% с пометкой «נתוני יצרן / manufacturer data»). Ничего не выдумывать.

**Нельзя**
- Не забивать слайд текстом (никаких абзацев — только тезисы).
- Не смешивать несколько акцентных цветов на одном слайде.
- Не ставить критичный текст/логотип в верхние 250px и нижние 340px.
- Не использовать заявления о «лечении/медицинском эффекте» сверх формулировок каталога.

**Серии для публикации (по 4–7 слайдов)**
- *Наука:* S1 · S3 · S4 · S12 (proof).
- *Волосы:* S5 · S6 · S7 · S9.
- *Косметология:* S10 · S11 · S13 · S15 · S16.
- *Гид/CTA:* S19 · S20 · S21 · S22.

---

## 6) Арт-дирекшн (визуал)

- **Свет:** глубокий чёрный `#08080a`, один тёплый/холодный акцентный ободок света на объекте; много негативного пространства.
- **Фото:** макро-текстуры (сыворотка, гель, капли, кожа крупным планом), лабораторные флаконы/виалы, приборы MITODERM; клинично, но люксово.
- **Графика для «науки»:** наносферы/сеть частиц (экзосомы), тонкие соединительные линии, 1.5px иконки.
- **Стиль:** редакционный люкс а-ля high-end derma-brand; ничего «аптечного» и пёстрого.
- **Согласованность:** одинаковые отступы, позиция логотипа и точек-прогресса на всех 22 слайдах.

---

### Локализация
Копирайт дан на иврите (RTL). Для RU/EN варианта — переведите поля *Headline / Sub / Points / CTA*,
сохранив длину и правило «≤3 пункта». Структура, дизайн-система и порядок слайдов не меняются.
