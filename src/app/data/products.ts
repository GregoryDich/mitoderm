import type { Localized } from "../i18n/i18n";
import vtech from "../../imports/12.png";
import exocell from "../../imports/Screenshot_2026-03-06_at_18.37.00.png";
import exotech from "../../imports/Gel_Packege2.png";
import exonad from "../../imports/NAD_.png";
import exosignalHair from "../../imports/Exosignal_Hair_photo.png";
import exosignalSpray from "../../imports/55.png";
import mitoscan from "../../imports/Big_Size_RGB.png";
import mitopen from "../../imports/Mitopen_2.png";

const L = (en: string, ru: string, he: string): Localized => ({ en, ru, he });

export type LineId = "face" | "hair" | "biospicules" | "peeling" | "devices" | "liposomes";

export type ProductLine = {
  id: LineId;
  name: Localized;
  kicker: Localized;
  description: Localized;
  comingSoon?: boolean;
};

export const productLines: ProductLine[] = [
  {
    id: "face",
    name: L("Facial Regeneration", "Регенерация лица", "התחדשות הפנים"),
    kicker: L("Exosomes + Exotech Gel", "Экзосомы + Exotech Gel", "אקסוזומים + Exotech Gel"),
    description: L(
      "Our exosome-powered facial line — concentrated regeneration paired with the conductive medium that delivers it.",
      "Наша экзосомная линейка для лица — концентрированная регенерация в паре с проводящей средой для её доставки.",
      "קו הפנים מבוסס האקסוזומים שלנו — התחדשות מרוכזת לצד המדיום המוליך שמחדיר אותה."
    ),
  },
  {
    id: "hair",
    name: L("Hair & Scalp", "Волосы и кожа головы", "שיער וקרקפת"),
    kicker: L("Exosignal System", "Система Exosignal", "מערכת Exosignal"),
    description: L(
      "Professional and home-use signaling treatments that revitalize the scalp and strengthen hair from the root.",
      "Профессиональные и домашние сигнальные средства, которые оздоравливают кожу головы и укрепляют волосы от корня.",
      "טיפולי איתות מקצועיים וביתיים שמחיים את הקרקפת ומחזקים את השיער מהשורש."
    ),
  },
  {
    id: "peeling",
    name: L("NAD Longevity Peeling", "NAD-пилинг долголетия", "פילינג NAD לאריכות ימים"),
    kicker: L("Cellular Renewal", "Клеточное обновление", "חידוש תאי"),
    description: L(
      "A dedicated NAD+ peeling protocol targeting skin energy, tone and the visible signs of cellular aging.",
      "Специальный протокол NAD+-пилинга для энергии кожи, тонуса и видимых признаков клеточного старения.",
      "פרוטוקול פילינג NAD+ ייעודי לאנרגיית העור, לגוון ולסימני ההזדקנות התאית הנראים."
    ),
  },
  {
    id: "devices",
    name: L("Devices", "Устройства", "מכשירים"),
    kicker: L("Diagnostics & Delivery", "Диагностика и доставка", "אבחון והחדרה"),
    description: L(
      "Precision instruments that read the skin and deliver actives exactly where they are needed.",
      "Прецизионные приборы, которые считывают кожу и доставляют активы точно туда, где они нужны.",
      "מכשירים מדויקים שקוראים את העור ומחדירים חומרים פעילים בדיוק לאן שצריך."
    ),
  },
  {
    id: "biospicules",
    name: L("Biospicules", "Биоспикулы", "ביוספיקולות"),
    kicker: L("Marine Micro-Channeling", "Морской микроканалинг", "מיקרו-תיעול ימי"),
    description: L(
      "A natural micro-channeling line that boosts cell turnover and active penetration without devices.",
      "Натуральная линейка микроканалинга, ускоряющая обновление клеток и проникновение активов без устройств.",
      "קו מיקרו-תיעול טבעי שמאיץ את התחדשות התאים וחדירת החומרים הפעילים ללא מכשירים."
    ),
    comingSoon: true,
  },
  {
    id: "liposomes",
    name: L("Liposomes", "Липосомы", "ליפוזומים"),
    kicker: L("Next Generation", "Новое поколение", "הדור הבא"),
    description: L(
      "An upcoming encapsulated-delivery line engineered for deeper, time-released active performance.",
      "Будущая линейка инкапсулированной доставки для более глубокого действия активов с пролонгированным высвобождением.",
      "קו עתידי של החדרה מבוססת אנקפסולציה לביצועים עמוקים ומשוחררים לאורך זמן."
    ),
    comingSoon: true,
  },
];

export type Product = {
  id: string;
  name: string; // brand name — identical across languages
  subtitle: Localized;
  line: LineId;
  tagline: Localized;
  description: Localized;
  highlights: Localized[];
  image: string;
  surface: "dark" | "light" | "gold";
  badge?: Localized;
};

export const products: Product[] = [
  {
    id: "v-tech-system",
    name: "V Tech System",
    line: "face",
    subtitle: L("Exosome Regeneration Protocol", "Протокол экзосомной регенерации", "פרוטוקול התחדשות אקסוזומלי"),
    tagline: L("The flagship of skin renewal.", "Флагман обновления кожи.", "הדגל של חידוש העור."),
    description: L(
      "A professional in-clinic protocol combining concentrated exosome ampoules with the V-Tech delivery method to accelerate cellular regeneration, restore density, and reveal luminous, resilient skin.",
      "Профессиональный протокол для клиники: концентрированные экзосомные ампулы и метод доставки V-Tech ускоряют клеточную регенерацию, восстанавливают плотность и дарят сияющую, упругую кожу.",
      "פרוטוקול מקצועי למרפאה המשלב אמפולות אקסוזומים מרוכזות עם שיטת ההחדרה V-Tech להאצת ההתחדשות התאית, השבת צפיפות ועור זוהר ואיתן."
    ),
    highlights: [
      L("Concentrated exosome ampoules", "Концентрированные экзосомные ампулы", "אמפולות אקסוזומים מרוכזות"),
      L("Clinically guided 4-step protocol", "Клинический протокол из 4 шагов", "פרוטוקול קליני בן 4 שלבים"),
      L("Visible firmness & luminosity", "Заметная упругость и сияние", "מוצקות וזוהר נראים לעין"),
    ],
    image: vtech,
    surface: "dark",
    badge: L("Flagship", "Флагман", "דגל"),
  },
  {
    id: "exocell-mask",
    name: "Exocell Mask",
    line: "face",
    subtitle: L("Post-Treatment Bio Regeneration", "Биорегенерация после процедур", "ביו-התחדשות שלאחר טיפול"),
    tagline: L("Recovery, reimagined.", "Восстановление по-новому.", "התאוששות מחדש."),
    description: L(
      "A second-skin biocellulose mask engineered to soothe, hydrate and support skin recovery after advanced treatments. Infused with regenerative actives for immediate comfort and lasting glow.",
      "Биоцеллюлозная маска «вторая кожа», созданная успокаивать, увлажнять и поддерживать восстановление кожи после интенсивных процедур. Регенерирующие активы дарят мгновенный комфорт и стойкое сияние.",
      "מסכת ביו-תאית במרקם 'עור שני' שתוכננה להרגיע, ללחלח ולתמוך בהתאוששות העור לאחר טיפולים מתקדמים. מועשרת בחומרים מתחדשים לנוחות מיידית וזוהר מתמשך."
    ),
    highlights: [
      L("Biocellulose second-skin fit", "«Вторая кожа» из биоцеллюлозы", "התאמת 'עור שני' ביו-תאית"),
      L("Soothing post-procedure relief", "Успокоение после процедур", "הקלה מרגיעה אחרי טיפול"),
      L("Deep regenerative hydration", "Глубокое регенерирующее увлажнение", "לחות מתחדשת עמוקה"),
    ],
    image: exocell,
    surface: "light",
  },
  {
    id: "exotech-gel",
    name: "Exotech Gel",
    line: "face",
    subtitle: L("Conductive Treatment Gel", "Проводящий гель для процедур", "ג'ל מוליך לטיפול"),
    tagline: L("The medium of every result.", "Среда каждого результата.", "המדיום של כל תוצאה."),
    description: L(
      "A premium conductive gel formulated to optimize the delivery of devices and actives, gliding effortlessly while enhancing absorption and treatment comfort.",
      "Премиальный проводящий гель, оптимизирующий доставку устройств и активов: легко скользит, усиливает впитывание и комфорт процедуры.",
      "ג'ל מוליך פרימיום שתוכנן למטב את החדרת המכשירים והחומרים הפעילים, מחליק בקלות ומשפר ספיגה ונוחות טיפול."
    ),
    highlights: [
      L("Optimized active delivery", "Оптимальная доставка активов", "החדרת חומרים פעילים ממוטבת"),
      L("Effortless, frictionless glide", "Лёгкое скольжение без трения", "החלקה חלקה וללא חיכוך"),
      L("Device-ready conductivity", "Проводимость для устройств", "מוליכות מותאמת למכשירים"),
    ],
    image: exotech,
    surface: "light",
  },
  {
    id: "exosignal-hair",
    name: "Exosignal Hair",
    line: "hair",
    subtitle: L("Scalp & Hair Regeneration", "Регенерация кожи головы и волос", "התחדשות קרקפת ושיער"),
    tagline: L("Signal the roots to thrive.", "Сигнал корням — расти.", "אות לשורשים לפרוח."),
    description: L(
      "A precision ampoule treatment that nourishes the scalp and follicles with bioactive signals, supporting stronger, denser and healthier hair from the root.",
      "Прецизионное ампульное средство питает кожу головы и фолликулы биоактивными сигналами, поддерживая более крепкие, густые и здоровые волосы от корня.",
      "טיפול אמפולות מדויק שמזין את הקרקפת והזקיקים באותות ביו-אקטיביים, ותומך בשיער חזק, צפוף ובריא יותר מהשורש."
    ),
    highlights: [
      L("Bioactive follicle signaling", "Биоактивный сигналинг фолликулов", "איתות ביו-אקטיבי לזקיקים"),
      L("Single-dose sterile ampoules", "Стерильные ампулы на одну дозу", "אמפולות סטריליות למנה בודדת"),
      L("Denser, healthier hair", "Более густые и здоровые волосы", "שיער צפוף ובריא יותר"),
    ],
    image: exosignalHair,
    surface: "dark",
  },
  {
    id: "exosignal-spray",
    name: "Exosignal Spray Home",
    line: "hair",
    subtitle: L("Deep Nourishing Scalp Serum", "Питательная сыворотка для кожи головы", "סרום מזין עמוק לקרקפת"),
    tagline: L("Continue the ritual at home.", "Продолжите ритуал дома.", "המשיכו את הטקס בבית."),
    description: L(
      "A daily home-use scalp serum that extends professional results between sessions — delivering deep nourishment to maintain a balanced, revitalized scalp environment.",
      "Ежедневная домашняя сыворотка для кожи головы продлевает профессиональный результат между сеансами, обеспечивая глубокое питание и сбалансированную, оздоровлённую кожу головы.",
      "סרום קרקפת לשימוש ביתי יומי שמאריך את התוצאות המקצועיות בין מפגשים — מספק הזנה עמוקה לשמירה על קרקפת מאוזנת ומחודשת."
    ),
    highlights: [
      L("Daily home-use serum", "Ежедневная домашняя сыворотка", "סרום ביתי יומי"),
      L("Deep scalp nourishment", "Глубокое питание кожи головы", "הזנה עמוקה לקרקפת"),
      L("Maintains clinical results", "Сохраняет клинический результат", "שומר על תוצאות קליניות"),
    ],
    image: exosignalSpray,
    surface: "dark",
  },
  {
    id: "exonad",
    name: "Exonad",
    line: "peeling",
    subtitle: L("Exo-NAD Skin Longevity Peeling", "Пилинг долголетия Exo-NAD", "פילינג Exo-NAD לאריכות ימים"),
    tagline: L("Longevity at the cellular level.", "Долголетие на клеточном уровне.", "אריכות ימים ברמה התאית."),
    description: L(
      "A NAD+ powered longevity peeling system pairing a normalizer and longevity serum to renew skin from within — targeting energy, tone and the visible signs of cellular aging.",
      "Система пилинга долголетия на основе NAD+ объединяет нормализатор и сыворотку долголетия, обновляя кожу изнутри — энергия, тонус и видимые признаки клеточного старения.",
      "מערכת פילינג לאריכות ימים מבוססת NAD+ המשלבת נורמלייזר וסרום אריכות ימים לחידוש העור מבפנים — אנרגיה, גוון וסימני ההזדקנות התאית."
    ),
    highlights: [
      L("NAD+ longevity complex", "Комплекс долголетия NAD+", "קומפלקס אריכות ימים NAD+"),
      L("Normalizer + longevity serum", "Нормализатор + сыворотка долголетия", "נורמלייזר + סרום אריכות ימים"),
      L("Renews tone & vitality", "Обновляет тонус и жизненную силу", "מחדש גוון וחיוניות"),
    ],
    image: exonad,
    surface: "gold",
    badge: L("Longevity", "Долголетие", "אריכות ימים"),
  },
  {
    id: "mitoscan",
    name: "Mitoscan",
    line: "devices",
    subtitle: L("AI Skin Diagnostic System", "ИИ-система диагностики кожи", "מערכת אבחון עור מבוססת AI"),
    tagline: L("See beneath the surface.", "Загляните под поверхность.", "ראו מתחת לפני השטח."),
    description: L(
      "An advanced diagnostic device that scans and analyzes skin condition in depth, transforming data into a precise, personalized treatment roadmap for every client.",
      "Передовое диагностическое устройство сканирует и глубоко анализирует состояние кожи, превращая данные в точную персональную карту лечения для каждого клиента.",
      "מכשיר אבחון מתקדם שסורק ומנתח לעומק את מצב העור, והופך נתונים למפת טיפול מדויקת ואישית לכל לקוח."
    ),
    highlights: [
      L("In-depth skin analysis", "Глубокий анализ кожи", "ניתוח עור מעמיק"),
      L("Personalized treatment mapping", "Персональная карта лечения", "מיפוי טיפול אישי"),
      L("Intuitive clinical dashboard", "Интуитивная клиническая панель", "לוח בקרה קליני אינטואיטיבי"),
    ],
    image: mitoscan,
    surface: "dark",
    badge: L("Technology", "Технология", "טכנולוגיה"),
  },
  {
    id: "mitopen",
    name: "Mitopen",
    line: "devices",
    subtitle: L("Precision Microchanneling Device", "Прецизионное устройство микроканалинга", "מכשיר מיקרו-תיעול מדויק"),
    tagline: L("Precision, in your hand.", "Точность в вашей руке.", "דיוק, בכף ידכם."),
    description: L(
      "An ergonomic microchanneling pen engineered for controlled, comfortable treatments — creating optimal micro-pathways to maximize the absorption of Mitoderm actives.",
      "Эргономичная ручка для микроканалинга обеспечивает контролируемые и комфортные процедуры, создавая оптимальные микроканалы для максимального впитывания активов Mitoderm.",
      "עט מיקרו-תיעול ארגונומי שתוכנן לטיפולים מבוקרים ונוחים — יוצר מיקרו-נתיבים אופטימליים למיצוי ספיגת החומרים הפעילים של Mitoderm."
    ),
    highlights: [
      L("Ergonomic precision control", "Эргономичный точный контроль", "שליטה ארגונומית מדויקת"),
      L("Adjustable depth settings", "Регулируемая глубина", "הגדרות עומק מתכווננות"),
      L("Maximized active uptake", "Максимальное усвоение активов", "מיצוי מרבי של חומרים פעילים"),
    ],
    image: mitopen,
    surface: "gold",
  },
];

export function productsByLine(line: LineId) {
  return products.filter((p) => p.line === line);
}
