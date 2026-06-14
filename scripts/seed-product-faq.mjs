#!/usr/bin/env node
/**
 * One-shot seed: adds an faq block to each product on src/data/products.json
 * in all three locales. Idempotent — re-running overwrites the seeded faq
 * but preserves any fields you've edited in admin.
 *
 * Pulled from the live mitoderm.com Q-list + science of each ingredient,
 * written for a clinician audience. Tone is concise and practical.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, '..', 'src/data/products.json');

const FAQ = {
  'v-tech-serum': {
    en: {
      title: 'Frequently asked questions',
      intro: 'Common questions from clinics evaluating V-Tech Serum for the first time.',
      items: [
        {
          q: 'How many sessions in a standard course?',
          a: '4–6 sessions, spaced 2 weeks apart. Maintenance every 4–8 weeks depending on indication and skin condition.',
        },
        {
          q: 'Can it be combined with microneedling or fractional laser?',
          a: 'Yes — V-Tech Serum is designed for post-procedure application on controlled microchannels. Apply immediately after the device pass for maximum penetration of the PDRN payload.',
        },
        {
          q: "How is V-Tech Serum different from the V-Tech Gel Mask?",
          a: 'Serum carries high-molecular-weight PDRN (2%, 20 mg/ml) plus biomimetic peptides as the active step. The Gel Mask carries low-MW PDRN (1%) for barrier restoration and is applied right after the serum to seal and soothe.',
        },
        {
          q: 'When can the patient return to makeup and active skincare?',
          a: 'Mineral makeup the next day. Resume retinoids and acids after 5–7 days. Avoid direct sun and saunas for 48 hours.',
        },
        {
          q: 'Is it suitable for sensitive or rosacea-prone skin?',
          a: 'Yes — the PDRN + peptide payload is non-inflammatory. Patch-test on rosacea cases and start with a single ampoule on a half-face protocol.',
        },
      ],
    },
    ru: {
      title: 'Частые вопросы',
      intro: 'Что чаще всего спрашивают клиники, оценивающие V-Tech Serum впервые.',
      items: [
        {
          q: 'Сколько сессий в стандартном курсе?',
          a: '4–6 сессий с интервалом 2 недели. Поддержка раз в 4–8 недель в зависимости от показаний и состояния кожи.',
        },
        {
          q: 'Можно ли совмещать с микронидлингом или фракционным лазером?',
          a: 'Да — V-Tech Serum рассчитан на нанесение после процедуры на контролируемые микроканалы. Наносить сразу после прохода устройства для максимального проникновения PDRN.',
        },
        {
          q: 'Чем V-Tech Serum отличается от V-Tech Gel-Mask?',
          a: 'Серум содержит высокомолекулярный PDRN (2%, 20 мг/мл) и биомиметические пептиды — это активная фаза. Маска содержит низкомолекулярный PDRN (1%) для восстановления барьера и наносится сразу после серума, чтобы запечатать и успокоить.',
        },
        {
          q: 'Когда пациент может вернуться к макияжу и активному уходу?',
          a: 'Минеральный макияж — на следующий день. Ретиноиды и кислоты — через 5–7 дней. Избегать прямого солнца и сауны 48 часов.',
        },
        {
          q: 'Подходит ли чувствительной коже / при розацеа?',
          a: 'Да — PDRN с пептидами не провоспалительный. На розацеа делайте patch-test и начинайте с одной ампулы по протоколу half-face.',
        },
      ],
    },
    he: {
      title: 'שאלות נפוצות',
      intro: 'מה שואלים הכי הרבה מרפאות שמעריכות את V-Tech Serum בפעם הראשונה.',
      items: [
        {
          q: 'כמה טיפולים בקורס סטנדרטי?',
          a: '4–6 טיפולים בהפרשי שבועיים. תחזוקה כל 4–8 שבועות בהתאם להתוויה ולמצב העור.',
        },
        {
          q: 'אפשר לשלב עם מיקרונידלינג או לייזר פרקציונלי?',
          a: 'כן — V-Tech Serum מתוכנן ליישום אחרי פרוצדורה על מיקרו-תעלות מבוקרות. למרוח מיד אחרי המעבר של המכשיר לחדירה מקסימלית של ה-PDRN.',
        },
        {
          q: 'מה ההבדל בין V-Tech Serum ל-V-Tech Gel-Mask?',
          a: 'הסרום נושא PDRN במשקל מולקולרי גבוה (2%, 20 מ"ג/מ"ל) ופפטידים ביומימטיים — שלב פעיל. המסכה נושאת PDRN במשקל מולקולרי נמוך (1%) לשיקום מחסום ומוחלת מיד אחרי הסרום כדי לאטום ולהרגיע.',
        },
        {
          q: 'מתי המטופל יכול לחזור לאיפור ולטיפוח אקטיבי?',
          a: 'איפור מינרלי — ביום שלמחרת. רטינואידים וחומצות — אחרי 5–7 ימים. להימנע משמש ישירה וסאונה למשך 48 שעות.',
        },
        {
          q: 'מתאים לעור רגיש / רוזציאה?',
          a: 'כן — PDRN עם פפטידים אינו מעורר דלקת. ברוזציאה לבצע פאץ׳-טסט ולהתחיל מאמפולה אחת בפרוטוקול חצי-פנים.',
        },
      ],
    },
  },
  'v-tech-gel-mask': {
    en: {
      title: 'Frequently asked questions',
      intro: 'Practical questions about the V-Tech Gel Mask layer.',
      items: [
        {
          q: 'When is the Gel Mask applied in the protocol?',
          a: 'Immediately after V-Tech Serum and any device pass. The mask seals the actives in, calms inflammation and tops up barrier function.',
        },
        {
          q: 'How long does the mask stay on?',
          a: '15–25 minutes per session, removed without rinse so the residual film continues to work on the skin.',
        },
        {
          q: 'Can patients use it as home care between sessions?',
          a: 'It is a professional-use product, but a sealed ampoule can be sent home for one-off post-procedure recovery use under written aftercare guidance.',
        },
        {
          q: 'Any sensitivity to snail extract concerns?',
          a: 'Snail mucin is well-tolerated but check patient history. Replace with V-Tech Serum alone for confirmed allergy cases.',
        },
        {
          q: 'How does the gold-carrier peptide (Acetyl Heptapeptide-9) deliver?',
          a: 'The gold particle acts as a microcarrier — improves topical penetration and helps the peptide reach fibroblasts in the upper dermis without degradation.',
        },
      ],
    },
    ru: {
      title: 'Частые вопросы',
      intro: 'Практические вопросы по слою V-Tech Gel-Mask.',
      items: [
        {
          q: 'На каком этапе протокола наносится маска?',
          a: 'Сразу после V-Tech Serum и работы устройством. Маска запечатывает активы, успокаивает воспаление и восстанавливает барьер.',
        },
        {
          q: 'Сколько маска находится на лице?',
          a: '15–25 минут за сессию. Снимается без смывания — остаточная плёнка продолжает работать.',
        },
        {
          q: 'Можно ли давать пациенту для домашнего использования между сессиями?',
          a: 'Это профессиональный продукт, но запечатанную ампулу можно выдать на одно постпроцедурное восстановление дома с письменным регламентом ухода.',
        },
        {
          q: 'Что с реакциями на улиточный экстракт?',
          a: 'Муцин улитки переносится хорошо, но проверьте анамнез. При подтверждённой аллергии замените только серумом.',
        },
        {
          q: 'Как работает пептид с золотым носителем (Acetyl Heptapeptide-9)?',
          a: 'Частица золота выступает микроносителем — улучшает проникновение и помогает пептиду достичь фибробластов верхней дермы без деградации.',
        },
      ],
    },
    he: {
      title: 'שאלות נפוצות',
      intro: 'שאלות מעשיות על שכבת V-Tech Gel-Mask.',
      items: [
        {
          q: 'מתי המסכה מוחלת בפרוטוקול?',
          a: 'מיד אחרי V-Tech Serum ומעבר המכשיר. המסכה אוטמת את הרכיבים הפעילים, מרגיעה דלקת ומשיבה מחסום.',
        },
        {
          q: 'כמה זמן המסכה נשארת?',
          a: '15–25 דקות לטיפול. מוסרים בלי שטיפה — שכבת השאריות ממשיכה לעבוד.',
        },
        {
          q: 'אפשר לתת למטופל לשימוש ביתי בין טיפולים?',
          a: 'זהו מוצר מקצועי, אך אמפולה אטומה ניתנת לשחרור לשימוש חד-פעמי בהתאוששות פוסט-פרוצדורה תחת הוראות בכתב.',
        },
        {
          q: 'מה עם רגישות לתמצית חילזון?',
          a: 'מוצין חילזון נסבל היטב — בדקו את ההיסטוריה הרפואית. במקרה של אלרגיה מאומתת — להשתמש בסרום בלבד.',
        },
        {
          q: 'איך עובד הפפטיד עם נשא הזהב (Acetyl Heptapeptide-9)?',
          a: 'חלקיק הזהב משמש כמיקרו-נשא — משפר חדירה ועוזר לפפטיד להגיע לפיברובלסטים בדרמיס העליון בלי דגרדציה.',
        },
      ],
    },
  },
  'exotech-gel': {
    en: {
      title: 'Frequently asked questions',
      intro: 'Common questions about Exotech Gel.',
      items: [
        {
          q: 'What conditions does Exotech Gel address?',
          a: 'Skin renewal, hydration restoration, post-procedure recovery on the face and body. Works well as a finisher after laser, RF or microneedling.',
        },
        {
          q: 'How is it different from V-Tech?',
          a: 'V-Tech is the structured serum + mask system for treatment sessions. Exotech is a single-step gel optimised for hydration and post-procedure soothing — often used in tandem on the same patient.',
        },
        {
          q: 'Standard session length?',
          a: '10–15 minutes of contact time after the active step. Single-use only.',
        },
        {
          q: 'Can it be layered under makeup the next day?',
          a: 'Yes — Exotech leaves no residue once absorbed and is compatible with mineral foundation.',
        },
      ],
    },
    ru: {
      title: 'Частые вопросы',
      intro: 'Что чаще всего спрашивают по Exotech Gel.',
      items: [
        {
          q: 'Какие задачи решает Exotech Gel?',
          a: 'Обновление кожи, восстановление гидратации, постпроцедурное восстановление на лице и теле. Хороший финиш после лазера, RF или микронидлинга.',
        },
        {
          q: 'Чем отличается от V-Tech?',
          a: 'V-Tech — структурированная система серум + маска для процедурных сессий. Exotech — одношаговый гель, оптимизированный под гидратацию и постпроцедурное успокоение. Часто используются в связке на одном пациенте.',
        },
        {
          q: 'Стандартная длительность сессии?',
          a: '10–15 минут контактного времени после активной фазы. Однократное применение.',
        },
        {
          q: 'Можно ли наносить макияж на следующий день?',
          a: 'Да — Exotech не оставляет следов после впитывания и совместим с минеральным тональным.',
        },
      ],
    },
    he: {
      title: 'שאלות נפוצות',
      intro: 'שאלות נפוצות על Exotech Gel.',
      items: [
        {
          q: 'אילו מצבים Exotech Gel נותן להם מענה?',
          a: 'התחדשות עור, שיקום הידרציה, התאוששות פוסט-פרוצדורה בפנים ובגוף. מצוין כשלב סיום אחרי לייזר, RF או מיקרונידלינג.',
        },
        {
          q: 'במה שונה מ-V-Tech?',
          a: 'V-Tech היא מערכת מובנית של סרום + מסכה לטיפולי שולחן. Exotech הוא ג׳ל חד-שלבי שמותאם להידרציה והרגעה פוסט-פרוצדורה. לעיתים קרובות משלבים אותם על אותו מטופל.',
        },
        {
          q: 'אורך טיפול סטנדרטי?',
          a: '10–15 דקות זמן מגע אחרי השלב הפעיל. שימוש חד-פעמי.',
        },
        {
          q: 'אפשר להניח איפור ביום שלמחרת?',
          a: 'כן — Exotech לא משאיר שאריות אחרי ספיגה ומסתדר עם מייקאפ מינרלי.',
        },
      ],
    },
  },
  'exosignal-hair': {
    en: {
      title: 'Frequently asked questions',
      intro: 'Hair-loss and scalp protocol questions.',
      items: [
        {
          q: 'How many sessions for a hair restoration course?',
          a: '4 sessions every 2–3 weeks, then maintenance every 6–8 weeks. Visible thickness improvement is typically reported from session 3.',
        },
        {
          q: 'What concerns does Exosignal Hair address?',
          a: 'Androgenetic alopecia (early/moderate stages), telogen effluvium, post-PRP combination, and reactive shedding after stress / post-partum.',
        },
        {
          q: 'Application technique?',
          a: 'Apply directly on the scalp on cleansed skin, work in with a stamp / dermaroller / mesotherapy device. Massage for 60 seconds and leave on. Patient washes hair 4 hours later.',
        },
        {
          q: 'Can it be combined with PRP / mesotherapy / oral finasteride?',
          a: 'Yes — Exosignal Hair stacks well with all three. Many practitioners alternate PRP and Exosignal Hair on biweekly cadence for synergistic effect.',
        },
      ],
    },
    ru: {
      title: 'Частые вопросы',
      intro: 'Вопросы по протоколу для волос и кожи головы.',
      items: [
        {
          q: 'Сколько сессий для курса восстановления волос?',
          a: '4 сессии раз в 2–3 недели, затем поддержка раз в 6–8 недель. Заметное увеличение плотности обычно фиксируется с 3-й сессии.',
        },
        {
          q: 'Какие задачи решает Exosignal Hair?',
          a: 'Андрогенная алопеция (ранние/умеренные стадии), телогеновое выпадение, комбинация с PRP, реактивное выпадение после стресса / послеродового периода.',
        },
        {
          q: 'Техника нанесения?',
          a: 'Наносится на чистую кожу головы, прорабатывается стампом / дермароллером / мезоинжектором. Массаж 60 секунд, остаётся на коже. Мытьё головы — через 4 часа.',
        },
        {
          q: 'Можно ли комбинировать с PRP / мезотерапией / финастеридом?',
          a: 'Да — Exosignal Hair хорошо стекируется со всеми тремя. Многие специалисты чередуют PRP и Exosignal Hair раз в 2 недели для синергии.',
        },
      ],
    },
    he: {
      title: 'שאלות נפוצות',
      intro: 'שאלות על פרוטוקול שיער וקרקפת.',
      items: [
        {
          q: 'כמה טיפולים בקורס שיקום שיער?',
          a: '4 טיפולים כל 2–3 שבועות, ולאחר מכן תחזוקה כל 6–8 שבועות. שיפור עובי השיער מורגש בדרך כלל מהטיפול השלישי.',
        },
        {
          q: 'אילו מצבים Exosignal Hair נותן להם מענה?',
          a: 'אלופציה אנדרוגנטית (שלבים מוקדמים/בינוניים), טלוגן אפלוביום, שילוב עם PRP, נשירה ראקטיבית אחרי לחץ / לאחר לידה.',
        },
        {
          q: 'טכניקת יישום?',
          a: 'מורחים על קרקפת נקייה, מעבדים עם סטמפ / דרמרולר / מזותרפיה. עיסוי 60 שניות, להשאיר על העור. חפיפה — אחרי 4 שעות.',
        },
        {
          q: 'אפשר לשלב עם PRP / מזותרפיה / פינסטריד?',
          a: 'כן — Exosignal Hair משתלב היטב עם שלושתם. הרבה מטפלים מחליפים PRP ו-Exosignal Hair בתדירות דו-שבועית לסינרגיה.',
        },
      ],
    },
  },
  'exosignal-hair-spray': {
    en: {
      title: 'Frequently asked questions',
      intro: 'Home-use questions for patients between professional sessions.',
      items: [
        {
          q: 'How often should patients use the spray at home?',
          a: 'Twice daily — morning and evening — on the dry scalp. Massage in with the fingertips and leave on. No rinse.',
        },
        {
          q: 'How long until visible result?',
          a: '8–12 weeks for visible density improvement when paired with professional sessions. Continuous use is required to maintain the effect.',
        },
        {
          q: 'Can it be used between professional Exosignal Hair sessions?',
          a: 'Yes — that is exactly the design. The spray bridges the gap between in-clinic protocols so the regenerative signalling is continuous.',
        },
        {
          q: 'Suitable for patients on finasteride or minoxidil?',
          a: 'Yes — Exosignal Hair Spray works through a different mechanism and does not interfere with either. Many patients run them simultaneously.',
        },
      ],
    },
    ru: {
      title: 'Частые вопросы',
      intro: 'Вопросы по домашнему использованию между процедурами.',
      items: [
        {
          q: 'Как часто использовать спрей дома?',
          a: 'Дважды в день — утром и вечером — на сухую кожу головы. Распределить кончиками пальцев, оставить. Не смывать.',
        },
        {
          q: 'Когда виден результат?',
          a: '8–12 недель при сочетании с профессиональными сессиями. Эффект поддерживается только при регулярном применении.',
        },
        {
          q: 'Можно ли использовать между сессиями Exosignal Hair?',
          a: 'Да — именно для этого спрей и создан. Закрывает промежутки между процедурами в клинике, чтобы регенеративный сигнал был непрерывным.',
        },
        {
          q: 'Совместим ли с финастеридом / миноксидилом?',
          a: 'Да — Exosignal Hair Spray работает через другой механизм и не мешает им. Многие пациенты применяют параллельно.',
        },
      ],
    },
    he: {
      title: 'שאלות נפוצות',
      intro: 'שאלות לשימוש ביתי בין טיפולים מקצועיים.',
      items: [
        {
          q: 'באיזו תדירות מטופלים ישתמשו בתרסיס בבית?',
          a: 'פעמיים ביום — בוקר וערב — על קרקפת יבשה. לעסות עם קצות האצבעות ולהשאיר. ללא שטיפה.',
        },
        {
          q: 'מתי רואים תוצאה?',
          a: '8–12 שבועות לשיפור עובי גלוי בשילוב עם טיפולים מקצועיים. שימוש קבוע נדרש לשמירה על האפקט.',
        },
        {
          q: 'אפשר להשתמש בין סשנים של Exosignal Hair?',
          a: 'כן — בדיוק לזה התרסיס נועד. סוגר את הפערים בין הטיפולים במרפאה כדי שהאיתות הרגנרטיבי יהיה רציף.',
        },
        {
          q: 'מתאים למטופלים על פינסטריד או מינוקסידיל?',
          a: 'כן — Exosignal Hair Spray פועל במנגנון שונה ואינו מפריע. הרבה מטופלים מפעילים את שניהם במקביל.',
        },
      ],
    },
  },
};

const products = JSON.parse(readFileSync(file, 'utf8'));
let touched = 0;
for (const product of products) {
  const slug = product.slug;
  const faq = FAQ[slug];
  if (!faq) continue;
  for (const loc of ['en', 'ru', 'he']) {
    if (!product.content?.[loc]) continue;
    product.content[loc].faq = faq[loc];
  }
  touched++;
}
writeFileSync(file, JSON.stringify(products, null, 2) + '\n', 'utf8');
console.log(`[seed-faq] updated ${touched} product(s)`);
