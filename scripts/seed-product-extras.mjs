#!/usr/bin/env node
/**
 * Seed light placeholder content for the structural slots we built but
 * which depend on owner-supplied numbers (clinicalResults, economics).
 * We only seed sections that don't already have content — so this is
 * safe to re-run.
 *
 * Numbers are intentionally illustrative (with TODO markers in the
 * 'source' / 'sub' lines) — owner must replace with real figures before
 * publishing. Until then the slot still renders, which makes it easy to
 * preview the layout in production.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'src/data/products.json');

const CLINICAL = {
  'v-tech-serum': {
    en: {
      title: 'Clinical observations',
      intro: 'Reported by partner clinics in Israel and EU. Replace with your own internal numbers before publishing.',
      items: [
        { value: '92%', label: 'Patients reporting visible firming at session 4', source: 'TODO: source / sample size' },
        { value: '4–6', label: 'Sessions for a full course', source: 'TODO: tighten by indication' },
        { value: '2 weeks', label: 'Interval between sessions' },
      ],
    },
    ru: {
      title: 'Клинические наблюдения',
      intro: 'По данным клиник-партнёров в Израиле и ЕС. Замените на свои внутренние цифры перед публикацией.',
      items: [
        { value: '92%', label: 'Пациентов отмечают видимый лифтинг к 4-й сессии', source: 'TODO: источник / выборка' },
        { value: '4–6', label: 'Сессий в полном курсе', source: 'TODO: уточнить по показаниям' },
        { value: '2 недели', label: 'Интервал между сессиями' },
      ],
    },
    he: {
      title: 'תצפיות קליניות',
      intro: 'דווח על-ידי מרפאות שותפות בישראל ובאירופה. החליפו במספרים פנימיים לפני פרסום.',
      items: [
        { value: '92%', label: 'מטופלים מדווחים על מתיחות נראית לעין בטיפול הרביעי', source: 'TODO: מקור / גודל מדגם' },
        { value: '4–6', label: 'טיפולים בקורס מלא', source: 'TODO: לעדן לפי התוויה' },
        { value: 'שבועיים', label: 'מרווח בין טיפולים' },
      ],
    },
  },
  'exosignal-hair': {
    en: {
      title: 'Clinical observations',
      intro: 'Field observations from partner clinics — replace with your own controlled numbers before publishing.',
      items: [
        { value: 'Session 3', label: 'When density improvement is typically reported', source: 'TODO: aggregate data' },
        { value: '4', label: 'Sessions to baseline course' },
        { value: '6–8 weeks', label: 'Maintenance cadence' },
      ],
    },
    ru: {
      title: 'Клинические наблюдения',
      intro: 'Полевые наблюдения клиник-партнёров — замените внутренними контролируемыми данными перед публикацией.',
      items: [
        { value: 'Сессия 3', label: 'С какой сессии обычно отмечают увеличение плотности', source: 'TODO: агрегированные данные' },
        { value: '4', label: 'Сессий в базовом курсе' },
        { value: '6–8 недель', label: 'Цикл поддержки' },
      ],
    },
    he: {
      title: 'תצפיות קליניות',
      intro: 'תצפיות שטח ממרפאות שותפות — להחליף במספרים מבוקרים פנימיים לפני פרסום.',
      items: [
        { value: 'טיפול 3', label: 'מאיזה טיפול בדרך כלל מדווח על שיפור בעובי השיער', source: 'TODO: נתונים מצטברים' },
        { value: '4', label: 'טיפולים בקורס בסיסי' },
        { value: '6–8 שבועות', label: 'מחזור תחזוקה' },
      ],
    },
  },
};

const ECONOMICS = {
  'v-tech-serum': {
    en: {
      title: 'Clinic economics',
      intro: 'Illustrative numbers — replace with your wholesale price and recommended session charge.',
      items: [
        { value: '₪ TODO', label: 'Cost per session (wholesale ÷ amp/session)', sub: 'TODO: your wholesale price' },
        { value: '₪ TODO', label: 'Suggested patient charge per session' },
        { value: '~60–70%', label: 'Typical gross margin', sub: 'Replace with your figure' },
      ],
      disclaimer: 'Numbers are placeholders for layout preview. Replace via /admin/products before publishing.',
    },
    ru: {
      title: 'Экономика для клиники',
      intro: 'Иллюстративные цифры — замените на вашу оптовую цену и рекомендованную стоимость сессии.',
      items: [
        { value: '₪ TODO', label: 'Себестоимость сессии (опт ÷ амп/сессия)', sub: 'TODO: ваша оптовая цена' },
        { value: '₪ TODO', label: 'Рекомендованная цена для пациента' },
        { value: '~60–70%', label: 'Типичная валовая маржа', sub: 'Замените своей цифрой' },
      ],
      disclaimer: 'Цифры — заглушки для предпросмотра вёрстки. Замените через /admin/products перед публикацией.',
    },
    he: {
      title: 'כלכלת המרפאה',
      intro: 'מספרים להמחשה — החליפו במחיר הסיטונאי שלכם ובמחיר מומלץ לטיפול.',
      items: [
        { value: '₪ TODO', label: 'עלות לטיפול (סיטונאי ÷ אמפ׳/טיפול)', sub: 'TODO: המחיר הסיטונאי שלכם' },
        { value: '₪ TODO', label: 'מחיר מומלץ למטופל לטיפול' },
        { value: '~60–70%', label: 'שולי רווח גולמי טיפוסיים', sub: 'החליפו במספר שלכם' },
      ],
      disclaimer: 'המספרים הם מציבים זמניים לתצוגה. החליפו ב-/admin/products לפני פרסום.',
    },
  },
};

const products = JSON.parse(readFileSync(file, 'utf8'));
let touched = 0;
for (const product of products) {
  const slug = product.slug;
  for (const loc of ['en', 'ru', 'he']) {
    const c = product.content?.[loc];
    if (!c) continue;
    if (CLINICAL[slug] && !c.clinicalResults) {
      c.clinicalResults = CLINICAL[slug][loc];
      touched++;
    }
    if (ECONOMICS[slug] && !c.economics) {
      c.economics = ECONOMICS[slug][loc];
      touched++;
    }
  }
}
writeFileSync(file, JSON.stringify(products, null, 2) + '\n', 'utf8');
console.log(`[seed-extras] wrote ${touched} slot(s)`);
