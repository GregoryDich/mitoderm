import { LocaleType } from './types';

export type ProductCategory = 'exosome' | 'mask' | 'peel' | 'bio-spicules';
export type ProductStatus = 'available' | 'coming-soon';
export type ProductAccent = 'teal' | 'gold' | 'rose';

export interface BenefitItem {
  title: string;
  text: string;
}

export interface StepItem {
  num: string;
  title: string;
  text: string;
}

export interface PackItem {
  qty: string;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ProductContent {
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  shortDescription: string;
  stats: StatItem[];
  benefits: BenefitItem[];
  ingredientsIntro: string;
  ingredients: string[];
  stepsTitle?: string;
  steps?: StepItem[];
  packTitle?: string;
  pack?: PackItem[];
  chipsTitle: string;
  chips: string[];
  ctaTitle: string;
  ctaText: string;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  status: ProductStatus;
  accent: ProductAccent;
  /** Path under /public, e.g. /products/exocell-mask/hero.png. Falls back to a branded placeholder when missing. */
  image?: string;
  /** Additional product photos shown in the gallery section. */
  gallery?: string[];
  content: Record<LocaleType, ProductContent>;
}

const exocellMask: Product = {
  slug: 'exocell-mask',
  category: 'mask',
  status: 'available',
  accent: 'teal',
  image: '/products/exocell-mask/hero.png',
  content: {
    en: {
      name: 'EXOCELL Mask',
      eyebrow: 'PROFESSIONAL EXOSOME MASK',
      tagline: 'Your Second Skin for Exo Bio-Regeneration',
      description:
        'An ultra-fine biocellulose mask with synthetic exosome technology. It surpasses the epidermal barrier to deliver deep hydration, an immediate lifting effect and advanced skin repair — the ideal finish after professional aesthetic procedures.',
      shortDescription:
        'Ultra-fine biocellulose mask with synthetic exosomes — your second skin for bio-regeneration.',
      stats: [
        { value: '5', label: 'Face masks per box' },
        { value: '5×25 ml', label: 'Net content' },
        { value: '45 min', label: 'Application time' },
        { value: 'Biocellulose', label: 'Second-skin matrix' },
      ],
      benefits: [
        {
          title: 'Deep penetration',
          text: 'Micrometric structure and hydro-lipophilic balance carry actives beyond the epidermal barrier.',
        },
        {
          title: 'Bio-restructuring',
          text: 'Accelerates cellular metabolism and promotes cell reproduction for visible renewal.',
        },
        {
          title: 'Instant lifting',
          text: 'Active lifting agents deliver an immediate tightening and smoothing effect.',
        },
        {
          title: 'Recovery booster',
          text: 'Soothes and regenerates the skin after invasive aesthetic treatments.',
        },
      ],
      ingredientsIntro:
        'Bio-restructuring actives work in synergy to accelerate metabolism and cell renewal.',
      ingredients: [
        'Low molecular weight polynucleotides in exosome structure',
        'Exosome mimetic peptides',
        'Low molecular weight hyaluronic acids',
        'Active lifting agents',
        'Biocellulose second-skin matrix',
      ],
      stepsTitle: 'How It Works',
      steps: [
        {
          num: '01',
          title: 'Apply',
          text: 'Place the biocellulose mask on cleansed skin after the professional procedure.',
        },
        {
          num: '02',
          title: 'Absorb',
          text: 'Leave on for at least 45 minutes — the second-skin matrix drives deep penetration.',
        },
        {
          num: '03',
          title: 'Regenerate',
          text: 'Exosome-mimetic actives stimulate metabolism, hydration and a lifting effect.',
        },
      ],
      chipsTitle: 'Best Used After',
      chips: [
        'Peeling',
        'Fractional laser',
        'Filler',
        'Microneedling',
        'Mesotherapy',
        'LED therapy',
      ],
      ctaTitle: 'Bring EXOCELL Mask to your clinic',
      ctaText:
        'For professional use only. Our specialist will reach out with pricing and protocol.',
    },
    ru: {
      name: 'EXOCELL Mask',
      eyebrow: 'ПРОФЕССИОНАЛЬНАЯ ЭКЗОСОМНАЯ МАСКА',
      tagline: 'Ваша вторая кожа для экзо-биорегенерации',
      description:
        'Ультратонкая биоцеллюлозная маска с технологией синтетических экзосом. Она преодолевает эпидермальный барьер, обеспечивая глубокое увлажнение, мгновенный лифтинг-эффект и продвинутое восстановление кожи — идеальное завершение профессиональных эстетических процедур.',
      shortDescription:
        'Ультратонкая биоцеллюлозная маска с синтетическими экзосомами — ваша вторая кожа для биорегенерации.',
      stats: [
        { value: '5', label: 'Масок в упаковке' },
        { value: '5×25 мл', label: 'Объём' },
        { value: '45 мин', label: 'Время аппликации' },
        { value: 'Биоцеллюлоза', label: 'Матрица «вторая кожа»' },
      ],
      benefits: [
        {
          title: 'Глубокое проникновение',
          text: 'Микрометрическая структура и гидро-липофильный баланс доставляют активы за эпидермальный барьер.',
        },
        {
          title: 'Биореструктуризация',
          text: 'Ускоряет клеточный метаболизм и стимулирует обновление клеток для видимого результата.',
        },
        {
          title: 'Мгновенный лифтинг',
          text: 'Активные лифтинг-компоненты дают немедленный эффект подтяжки и разглаживания.',
        },
        {
          title: 'Ускорение восстановления',
          text: 'Успокаивает и регенерирует кожу после инвазивных эстетических процедур.',
        },
      ],
      ingredientsIntro:
        'Биореструктурирующие активы работают синергично, ускоряя метаболизм и обновление клеток.',
      ingredients: [
        'Низкомолекулярные полинуклеотиды в экзосомной структуре',
        'Экзосомо-миметические пептиды',
        'Низкомолекулярные гиалуроновые кислоты',
        'Активные лифтинг-компоненты',
        'Матрица «вторая кожа» из биоцеллюлозы',
      ],
      stepsTitle: 'Как это работает',
      steps: [
        {
          num: '01',
          title: 'Нанесение',
          text: 'Поместите биоцеллюлозную маску на очищенную кожу после профессиональной процедуры.',
        },
        {
          num: '02',
          title: 'Впитывание',
          text: 'Оставьте минимум на 45 минут — матрица «вторая кожа» обеспечивает глубокое проникновение.',
        },
        {
          num: '03',
          title: 'Регенерация',
          text: 'Экзосомо-миметические активы стимулируют метаболизм, увлажнение и лифтинг.',
        },
      ],
      chipsTitle: 'Лучше всего после',
      chips: [
        'Пилинг',
        'Фракционный лазер',
        'Филлеры',
        'Микронидлинг',
        'Мезотерапия',
        'LED-терапия',
      ],
      ctaTitle: 'Добавьте EXOCELL Mask в свою клинику',
      ctaText:
        'Только для профессионального использования. Наш специалист свяжется с вами по цене и протоколу.',
    },
    he: {
      name: 'EXOCELL Mask',
      eyebrow: 'מסכת אקסוזומים מקצועית',
      tagline: 'העור השני שלך לביו-התחדשות אקסו',
      description:
        'מסכת ביו-תאית אולטרה-דקה עם טכנולוגיית אקסוזומים סינתטיים. היא חוצה את מחסום האפידרמיס ומספקת לחות עמוקה, אפקט מתיחה מיידי ושיקום עור מתקדם — הסיום האידיאלי לאחר טיפולים אסתטיים מקצועיים.',
      shortDescription:
        'מסכת ביו-תאית אולטרה-דקה עם אקסוזומים סינתטיים — העור השני שלך לביו-התחדשות.',
      stats: [
        { value: '5', label: 'מסכות בקופסה' },
        { value: '5×25 מ"ל', label: 'תכולה' },
        { value: '45 דק׳', label: 'זמן יישום' },
        { value: 'ביו-תאית', label: 'מטריצת עור שני' },
      ],
      benefits: [
        {
          title: 'חדירה עמוקה',
          text: 'מבנה מיקרומטרי ואיזון הידרו-ליפופילי נושאים את הפעילים אל מעבר למחסום האפידרמיס.',
        },
        {
          title: 'ביו-רסטרוקטורינג',
          text: 'מאיץ את חילוף החומרים התאי ומקדם התחדשות תאים לתוצאה נראית לעין.',
        },
        {
          title: 'מתיחה מיידית',
          text: 'רכיבי מתיחה פעילים מעניקים אפקט הידוק והחלקה מיידי.',
        },
        {
          title: 'זרז התאוששות',
          text: 'מרגיע ומחדש את העור לאחר טיפולים אסתטיים פולשניים.',
        },
      ],
      ingredientsIntro:
        'פעילים ביו-רסטרוקטורינג פועלים בסינרגיה להאצת חילוף החומרים והתחדשות התאים.',
      ingredients: [
        'פולינוקלאוטידים במשקל מולקולרי נמוך במבנה אקסוזומי',
        'פפטידים מימטיים לאקסוזומים',
        'חומצות היאלורוניות במשקל מולקולרי נמוך',
        'רכיבי מתיחה פעילים',
        'מטריצת עור שני מביו-תאית',
      ],
      stepsTitle: 'איך זה עובד',
      steps: [
        {
          num: '01',
          title: 'יישום',
          text: 'הניחו את המסכה הביו-תאית על עור נקי לאחר הטיפול המקצועי.',
        },
        {
          num: '02',
          title: 'ספיגה',
          text: 'השאירו לפחות 45 דקות — מטריצת העור השני מאפשרת חדירה עמוקה.',
        },
        {
          num: '03',
          title: 'התחדשות',
          text: 'פעילים מימטיים לאקסוזומים מעוררים חילוף חומרים, לחות ואפקט מתיחה.',
        },
      ],
      chipsTitle: 'מומלץ במיוחד לאחר',
      chips: [
        'פילינג',
        'לייזר פרקציוני',
        'פילר',
        'מיקרונידלינג',
        'מזותרפיה',
        'טיפול LED',
      ],
      ctaTitle: 'הביאו את EXOCELL Mask למרפאה שלכם',
      ctaText:
        'לשימוש מקצועי בלבד. המומחה שלנו יחזור אליכם עם מחיר ופרוטוקול.',
    },
  },
};

const exoNad: Product = {
  slug: 'exo-nad',
  category: 'peel',
  status: 'available',
  accent: 'gold',
  image: '/products/exo-nad/hero.jpg',
  gallery: [
    '/products/exo-nad/g1.jpg',
    '/products/exo-nad/g2.jpg',
    '/products/exo-nad/g3.jpg',
    '/products/exo-nad/g4.jpg',
    '/products/exo-nad/g6.jpg',
    '/products/exo-nad/g5.png',
  ],
  content: {
    en: {
      name: 'EXO-NAD',
      eyebrow: 'MEDICAL-GRADE LONGEVITY PEEL',
      tagline: 'Skin Longevity Peeling',
      description:
        'A next-generation 3-step exfoliating system pairing cutting-edge exosome technology with NAD+ to drive cellular renewal — visibly improving tone, texture and firmness for a longevity effect.',
      shortDescription:
        '3-step longevity peeling system pairing exosomes with NAD+ for cellular renewal.',
      stats: [
        { value: '3-step', label: 'Intelligent system' },
        { value: '15 ml', label: 'Exo Peel vial' },
        { value: '5×5 ml', label: 'Normalizer + Serum' },
        { value: 'NAD+', label: 'Longevity actives' },
      ],
      benefits: [
        {
          title: 'Even tone & texture',
          text: 'Visibly uniform tone and refined surface after the controlled peel.',
        },
        {
          title: 'Radiant complexion',
          text: 'A refreshed, luminous look with restored suppleness.',
        },
        {
          title: 'Fewer fine lines',
          text: 'Reduces the visibility of fine lines and wrinkles.',
        },
        {
          title: 'Restored firmness',
          text: 'NAD+ and peptides support collagen and cellular repair.',
        },
      ],
      ingredientsIntro:
        'Biomimetic actives work in synergy to renew, repair and revitalise the skin.',
      ingredients: [
        'Epitalon peptide',
        'NAD+ complex',
        'GHK-Cu peptide',
        'Biomimetic growth factors',
        'Glycolic acid complex',
        'Gold-infused pH normalizer',
      ],
      stepsTitle: 'The 3-Step System',
      steps: [
        {
          num: '01',
          title: 'Intelligent Exfoliation',
          text: 'Dual-phase peel combining the Epitalon peptide with a glycolic complex for controlled renewal.',
        },
        {
          num: '02',
          title: 'Barrier Recovery',
          text: 'A gold-infused pH normalizer soothes and rebalances the skin for maximum absorption.',
        },
        {
          num: '03',
          title: 'Deep Renewal',
          text: 'A longevity serum with NAD+ and GHK-Cu stimulates collagen and cellular repair.',
        },
      ],
      packTitle: "What's in the Box",
      pack: [
        {
          qty: '1×',
          title: 'Exo Peel',
          text: '15 ml biphasic peel — Epitalon + glycolic complex.',
        },
        {
          qty: '5×',
          title: 'pH Normalizer',
          text: '5 ml each — gold-infused, soothes & rebalances.',
        },
        {
          qty: '5×',
          title: 'Longevity Serum',
          text: '5 ml each — NAD+ & biomimetic peptides.',
        },
      ],
      chipsTitle: 'Targets',
      chips: [
        'Aging signs',
        'Dullness',
        'Texture irregularities',
        'Loss of firmness',
      ],
      ctaTitle: 'Bring EXO-NAD to your clinic',
      ctaText:
        'For professional use only. Our specialist will reach out with pricing and protocol.',
    },
    ru: {
      name: 'EXO-NAD',
      eyebrow: 'ПИЛИНГ ДОЛГОЛЕТИЯ КОЖИ МЕДИЦИНСКОГО КЛАССА',
      tagline: 'Пилинг для долголетия кожи',
      description:
        'Трёхэтапная отшелушивающая система нового поколения, объединяющая передовую технологию экзосом с NAD+ для запуска клеточного обновления — заметно улучшает тон, текстуру и упругость кожи для эффекта долголетия.',
      shortDescription:
        'Трёхэтапная система пилинга долголетия: экзосомы + NAD+ для клеточного обновления.',
      stats: [
        { value: '3 этапа', label: 'Интеллектуальная система' },
        { value: '15 мл', label: 'Флакон Exo Peel' },
        { value: '5×5 мл', label: 'Нормализатор + сыворотка' },
        { value: 'NAD+', label: 'Активы долголетия' },
      ],
      benefits: [
        {
          title: 'Ровный тон и текстура',
          text: 'Заметно ровный тон и улучшенная поверхность кожи после контролируемого пилинга.',
        },
        {
          title: 'Сияющий цвет лица',
          text: 'Свежий, сияющий вид и восстановленная эластичность.',
        },
        {
          title: 'Меньше мелких морщин',
          text: 'Уменьшает выраженность мелких морщин и линий.',
        },
        {
          title: 'Восстановление упругости',
          text: 'NAD+ и пептиды поддерживают синтез коллагена и репарацию клеток.',
        },
      ],
      ingredientsIntro:
        'Биомиметические активы работают синергично, обновляя, восстанавливая и оживляя кожу.',
      ingredients: [
        'Пептид Эпиталон',
        'Комплекс NAD+',
        'Пептид GHK-Cu',
        'Биомиметические факторы роста',
        'Комплекс гликолевой кислоты',
        'pH-нормализатор с золотом',
      ],
      stepsTitle: 'Трёхэтапная система',
      steps: [
        {
          num: '01',
          title: 'Интеллектуальное отшелушивание',
          text: 'Двухфазный пилинг с пептидом Эпиталон и гликолевым комплексом для контролируемого обновления.',
        },
        {
          num: '02',
          title: 'Восстановление барьера',
          text: 'pH-нормализатор с золотом успокаивает и восстанавливает баланс кожи для максимального впитывания.',
        },
        {
          num: '03',
          title: 'Глубокое обновление',
          text: 'Сыворотка долголетия с NAD+ и GHK-Cu стимулирует коллаген и репарацию клеток.',
        },
      ],
      packTitle: 'Что в коробке',
      pack: [
        {
          qty: '1×',
          title: 'Exo Peel',
          text: 'Двухфазный пилинг 15 мл — Эпиталон + гликолевый комплекс.',
        },
        {
          qty: '5×',
          title: 'pH-нормализатор',
          text: 'По 5 мл — с золотом, успокаивает и балансирует.',
        },
        {
          qty: '5×',
          title: 'Сыворотка долголетия',
          text: 'По 5 мл — NAD+ и биомиметические пептиды.',
        },
      ],
      chipsTitle: 'Воздействует на',
      chips: [
        'Признаки старения',
        'Тусклость',
        'Неровности текстуры',
        'Потеря упругости',
      ],
      ctaTitle: 'Добавьте EXO-NAD в свою клинику',
      ctaText:
        'Только для профессионального использования. Наш специалист свяжется с вами по цене и протоколу.',
    },
    he: {
      name: 'EXO-NAD',
      eyebrow: 'פילינג לאריכות חיי העור — דרגה רפואית',
      tagline: 'פילינג לאריכות חיי העור',
      description:
        'מערכת פילינג תלת-שלבית מהדור הבא המשלבת טכנולוגיית אקסוזומים מתקדמת עם NAD+ להנעת התחדשות תאית — משפרת באופן נראה את הגוון, המרקם והמוצקות לאפקט אריכות חיים.',
      shortDescription:
        'מערכת פילינג תלת-שלבית לאריכות חיי העור: אקסוזומים + NAD+ להתחדשות תאית.',
      stats: [
        { value: '3 שלבים', label: 'מערכת חכמה' },
        { value: '15 מ"ל', label: 'בקבוקון Exo Peel' },
        { value: '5×5 מ"ל', label: 'נורמלייזר + סרום' },
        { value: 'NAD+', label: 'פעילי אריכות חיים' },
      ],
      benefits: [
        {
          title: 'גוון ומרקם אחידים',
          text: 'גוון אחיד ומרקם מעודן באופן נראה לאחר הפילינג המבוקר.',
        },
        {
          title: 'מראה זוהר',
          text: 'מראה רענן וזוהר עם גמישות משוקמת.',
        },
        {
          title: 'פחות קווים דקים',
          text: 'מפחית את נראות הקווים הדקים והקמטוטים.',
        },
        {
          title: 'מוצקות משוקמת',
          text: 'NAD+ ופפטידים תומכים בקולגן ובתיקון תאי.',
        },
      ],
      ingredientsIntro:
        'פעילים ביו-מימטיים פועלים בסינרגיה לחידוש, תיקון והחייאת העור.',
      ingredients: [
        'פפטיד אפיטלון',
        'קומפלקס NAD+',
        'פפטיד GHK-Cu',
        'גורמי גדילה ביו-מימטיים',
        'קומפלקס חומצה גליקולית',
        'נורמלייזר pH עם זהב',
      ],
      stepsTitle: 'המערכת בת 3 השלבים',
      steps: [
        {
          num: '01',
          title: 'פילינג חכם',
          text: 'פילינג דו-פאזי המשלב את פפטיד האפיטלון עם קומפלקס גליקולי לחידוש מבוקר.',
        },
        {
          num: '02',
          title: 'שיקום מחסום',
          text: 'נורמלייזר pH עם זהב מרגיע ומאזן את העור לספיגה מרבית.',
        },
        {
          num: '03',
          title: 'חידוש עמוק',
          text: 'סרום אריכות חיים עם NAD+ ו-GHK-Cu מעורר קולגן ותיקון תאי.',
        },
      ],
      packTitle: 'מה בקופסה',
      pack: [
        {
          qty: '1×',
          title: 'Exo Peel',
          text: 'פילינג דו-פאזי 15 מ"ל — אפיטלון + קומפלקס גליקולי.',
        },
        {
          qty: '5×',
          title: 'נורמלייזר pH',
          text: '5 מ"ל כל אחד — עם זהב, מרגיע ומאזן.',
        },
        {
          qty: '5×',
          title: 'סרום אריכות חיים',
          text: '5 מ"ל כל אחד — NAD+ ופפטידים ביו-מימטיים.',
        },
      ],
      chipsTitle: 'מטפל ב',
      chips: [
        'סימני הזדקנות',
        'עמעום',
        'אי-סדירות מרקם',
        'אובדן מוצקות',
      ],
      ctaTitle: 'הביאו את EXO-NAD למרפאה שלכם',
      ctaText:
        'לשימוש מקצועי בלבד. המומחה שלנו יחזור אליכם עם מחיר ופרוטוקול.',
    },
  },
};

function bioSpicule(n: number): Product {
  const en: ProductContent = {
    name: `Bio-Spicule 0${n}`,
    eyebrow: 'SPONGILLA BIO-SPICULES',
    tagline: 'Natural micro-spicule skin renewal',
    description:
      'A Spongilla-based micro-spicule treatment that creates micro-channels for active delivery and stimulates skin renewal. Full details coming soon.',
    shortDescription:
      'Spongilla micro-spicule treatment for skin renewal and active delivery.',
    stats: [
      { value: 'Spongilla', label: 'Natural source' },
      { value: 'Micro', label: 'Spicule technology' },
      { value: 'Pro', label: 'Professional use' },
      { value: 'Soon', label: 'Availability' },
    ],
    benefits: [
      {
        title: 'Skin renewal',
        text: 'Micro-spicules stimulate natural cellular turnover.',
      },
      {
        title: 'Active delivery',
        text: 'Micro-channels enhance penetration of paired actives.',
      },
      {
        title: 'Natural origin',
        text: 'Derived from freshwater Spongilla for a biocompatible action.',
      },
      {
        title: 'Professional protocol',
        text: 'Designed for in-clinic use by trained practitioners.',
      },
    ],
    ingredientsIntro: 'Full ingredient list will be published at launch.',
    ingredients: ['Spongilla spicules', 'Supporting actives — TBA'],
    chipsTitle: 'Targets',
    chips: ['Texture', 'Dullness', 'Renewal'],
    ctaTitle: `Get notified about Bio-Spicule 0${n}`,
    ctaText:
      'This product is launching soon. Contact us to be the first to know.',
  };
  const ru: ProductContent = {
    name: `Bio-Spicule 0${n}`,
    eyebrow: 'БИОСПИКУЛЫ SPONGILLA',
    tagline: 'Натуральное обновление кожи микроспикулами',
    description:
      'Средство на основе микроспикул Spongilla, которое формирует микроканалы для доставки активов и стимулирует обновление кожи. Подробности скоро.',
    shortDescription:
      'Средство с микроспикулами Spongilla для обновления кожи и доставки активов.',
    stats: [
      { value: 'Spongilla', label: 'Натуральный источник' },
      { value: 'Микро', label: 'Технология спикул' },
      { value: 'Pro', label: 'Профессиональное' },
      { value: 'Скоро', label: 'Доступность' },
    ],
    benefits: [
      {
        title: 'Обновление кожи',
        text: 'Микроспикулы стимулируют естественное обновление клеток.',
      },
      {
        title: 'Доставка активов',
        text: 'Микроканалы усиливают проникновение сопутствующих активов.',
      },
      {
        title: 'Натуральное происхождение',
        text: 'Получено из пресноводной Spongilla для биосовместимого действия.',
      },
      {
        title: 'Профессиональный протокол',
        text: 'Разработано для применения в клинике обученными специалистами.',
      },
    ],
    ingredientsIntro: 'Полный состав будет опубликован к запуску.',
    ingredients: ['Спикулы Spongilla', 'Сопутствующие активы — уточняется'],
    chipsTitle: 'Воздействует на',
    chips: ['Текстура', 'Тусклость', 'Обновление'],
    ctaTitle: `Узнать о запуске Bio-Spicule 0${n}`,
    ctaText:
      'Продукт скоро выходит. Свяжитесь с нами, чтобы узнать первыми.',
  };
  const he: ProductContent = {
    name: `Bio-Spicule 0${n}`,
    eyebrow: 'ביו-ספיקולות SPONGILLA',
    tagline: 'התחדשות עור טבעית באמצעות מיקרו-ספיקולות',
    description:
      'טיפול מבוסס מיקרו-ספיקולות Spongilla היוצר מיקרו-תעלות להעברת פעילים ומעורר התחדשות עור. פרטים מלאים בקרוב.',
    shortDescription:
      'טיפול מיקרו-ספיקולות Spongilla להתחדשות העור והעברת פעילים.',
    stats: [
      { value: 'Spongilla', label: 'מקור טבעי' },
      { value: 'מיקרו', label: 'טכנולוגיית ספיקולות' },
      { value: 'Pro', label: 'שימוש מקצועי' },
      { value: 'בקרוב', label: 'זמינות' },
    ],
    benefits: [
      {
        title: 'התחדשות עור',
        text: 'מיקרו-ספיקולות מעוררות התחדשות תאית טבעית.',
      },
      {
        title: 'העברת פעילים',
        text: 'מיקרו-תעלות משפרות את חדירת הפעילים הנלווים.',
      },
      {
        title: 'מקור טבעי',
        text: 'מופק מ-Spongilla של מים מתוקים לפעולה ביו-תואמת.',
      },
      {
        title: 'פרוטוקול מקצועי',
        text: 'מיועד לשימוש במרפאה על ידי מטפלים מוסמכים.',
      },
    ],
    ingredientsIntro: 'רשימת הרכיבים המלאה תפורסם בהשקה.',
    ingredients: ['ספיקולות Spongilla', 'פעילים נלווים — יפורסם'],
    chipsTitle: 'מטפל ב',
    chips: ['מרקם', 'עמעום', 'התחדשות'],
    ctaTitle: `קבלו עדכון על Bio-Spicule 0${n}`,
    ctaText: 'המוצר יושק בקרוב. צרו קשר כדי להיות הראשונים לדעת.',
  };
  return {
    slug: `bio-spicule-0${n}`,
    category: 'bio-spicules',
    status: 'coming-soon',
    accent: 'rose',
    content: { en, ru, he },
  };
}

export const products: Product[] = [
  exocellMask,
  exoNad,
  bioSpicule(1),
  bioSpicule(2),
  bioSpicule(3),
  bioSpicule(4),
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export interface CatalogItem {
  slug: string;
  href: string;
  category: ProductCategory;
  status: ProductStatus;
  accent: ProductAccent;
  image?: string;
  name: string;
  shortDescription: string;
}

const exoxeName: Record<LocaleType, string> = {
  en: 'EXOXE Exosome',
  ru: 'Экзосомы EXOXE',
  he: 'אקסוזום EXOXE',
};

const exoxeShort: Record<LocaleType, string> = {
  en: 'Pure lyophilized exosome powder + sterilized solution for professional skin rejuvenation.',
  ru: 'Чистый лиофилизированный порошок экзосом + стерильный раствор для профессионального омоложения кожи.',
  he: 'אבקת אקסוזומים מיובשת בהקפאה + תמיסה סטרילית להתחדשות עור מקצועית.',
};

export const getCatalogItems = (locale: LocaleType): CatalogItem[] => [
  {
    slug: 'exoxe',
    href: '/',
    category: 'exosome',
    status: 'available',
    accent: 'teal',
    image: '/products/exoxe/hero.png',
    name: exoxeName[locale],
    shortDescription: exoxeShort[locale],
  },
  ...products.map((p) => ({
    slug: p.slug,
    href: `/products/${p.slug}`,
    category: p.category,
    status: p.status,
    accent: p.accent,
    image: p.image,
    name: p.content[locale].name,
    shortDescription: p.content[locale].shortDescription,
  })),
];
