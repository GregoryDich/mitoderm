#!/usr/bin/env node
/**
 * Seed the `bundle` slot on each product so /protocols actually has
 * content the moment we ship — instead of an empty state. Each anchor
 * product gets a sensible 3-step protocol pulled from the existing
 * five-SKU catalog.
 *
 * Idempotent: skips a product if a bundle is already authored.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const file = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src/data/products.json'
);

const BUNDLES = {
  'v-tech-serum': {
    en: {
      title: 'V-Tech anti-aging facial protocol',
      intro: 'The full V-Tech session — biostimulation, sealing and post-procedure recovery — in three steps.',
      items: [
        { slug: 'v-tech-serum', role: 'Step 1 — Active' },
        { slug: 'v-tech-gel-mask', role: 'Step 2 — Seal & soothe' },
        { slug: 'exotech-gel', role: 'Step 3 — Recovery finish' },
      ],
    },
    ru: {
      title: 'Антивозрастной протокол V-Tech',
      intro: 'Полная сессия V-Tech — биостимуляция, запечатывание и постпроцедурное восстановление — в три шага.',
      items: [
        { slug: 'v-tech-serum', role: 'Шаг 1 — Активная фаза' },
        { slug: 'v-tech-gel-mask', role: 'Шаг 2 — Запечатывание' },
        { slug: 'exotech-gel', role: 'Шаг 3 — Восстановление' },
      ],
    },
    he: {
      title: 'פרוטוקול אנטי-אייג׳ינג של V-Tech',
      intro: 'הסשן המלא של V-Tech — ביוסטימולציה, אטימה והתאוששות פוסט-פרוצדורה — בשלושה שלבים.',
      items: [
        { slug: 'v-tech-serum', role: 'שלב 1 — פעיל' },
        { slug: 'v-tech-gel-mask', role: 'שלב 2 — אטימה והרגעה' },
        { slug: 'exotech-gel', role: 'שלב 3 — סיום והתאוששות' },
      ],
    },
  },
  'exosignal-hair': {
    en: {
      title: 'Hair restoration protocol',
      intro: 'In-clinic Exosignal Hair sessions backed by Exosignal Hair Spray at home — continuous regenerative signalling.',
      items: [
        { slug: 'exosignal-hair', role: 'Step 1 — In-clinic ampoule' },
        { slug: 'exosignal-hair-spray', role: 'Step 2 — Daily home care' },
      ],
    },
    ru: {
      title: 'Протокол восстановления волос',
      intro: 'Клиническая сессия Exosignal Hair + домашний Exosignal Hair Spray — непрерывный регенеративный сигнал.',
      items: [
        { slug: 'exosignal-hair', role: 'Шаг 1 — Сессия в клинике' },
        { slug: 'exosignal-hair-spray', role: 'Шаг 2 — Домашний уход' },
      ],
    },
    he: {
      title: 'פרוטוקול שיקום שיער',
      intro: 'טיפול Exosignal Hair במרפאה עם Exosignal Hair Spray בבית — איתות רגנרטיבי רציף.',
      items: [
        { slug: 'exosignal-hair', role: 'שלב 1 — אמפולה במרפאה' },
        { slug: 'exosignal-hair-spray', role: 'שלב 2 — טיפוח יומי בבית' },
      ],
    },
  },
};

const products = JSON.parse(readFileSync(file, 'utf8'));
let touched = 0;
for (const product of products) {
  const slug = product.slug;
  const bundle = BUNDLES[slug];
  if (!bundle) continue;
  for (const loc of ['en', 'ru', 'he']) {
    if (!product.content?.[loc]) continue;
    if (product.content[loc].bundle) continue; // don't overwrite owner edits
    product.content[loc].bundle = bundle[loc];
    touched++;
  }
}
writeFileSync(file, JSON.stringify(products, null, 2) + '\n', 'utf8');
console.log(`[seed-bundles] wrote ${touched} slot(s)`);
