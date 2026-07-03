import type { Localized } from "../i18n/i18n";

const L = (en: string, ru: string, he: string): Localized => ({ en, ru, he });

export type ArticleCategory = "science" | "protocols" | "business" | "longevity";

export type Article = {
  id: string;
  category: ArticleCategory;
  readMinutes: number;
  date: Localized;
  image: string;
  title: Localized;
  excerpt: Localized;
  body: Localized[];
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200`;

export const articles: Article[] = [
  {
    id: "exosomes-in-aesthetic-medicine",
    category: "science",
    readMinutes: 8,
    date: L("June 2026", "Июнь 2026", "יוני 2026"),
    image: img("1748543669178-efd3de4e64e0"),
    title: L(
      "Exosomes in Aesthetic Medicine: What Every Cosmetologist Should Know",
      "Экзосомы в эстетической медицине: что важно знать каждому косметологу",
      "אקסוזומים ברפואה אסתטית: מה שכל קוסמטיקאי צריך לדעת"
    ),
    excerpt: L(
      "A practical overview of how exosome signaling drives skin regeneration — and how to integrate it into your treatment menu with confidence.",
      "Практический обзор того, как сигналинг экзосом запускает регенерацию кожи — и как уверенно внедрить его в своё меню процедур.",
      "סקירה מעשית על האופן שבו איתות אקסוזומים מניע התחדשות עור — וכיצד לשלב אותו בתפריט הטיפולים שלכם בביטחון."
    ),
    body: [
      L(
        "Exosomes are nano-sized vesicles that carry biological signals between cells. In aesthetic medicine, they instruct skin cells to repair, regenerate and rebalance — making them one of the most promising tools for visible skin renewal.",
        "Экзосомы — это нановезикулы, переносящие биологические сигналы между клетками. В эстетической медицине они побуждают клетки кожи к восстановлению, регенерации и балансировке, что делает их одним из самых перспективных инструментов обновления кожи.",
        "אקסוזומים הם שלפוחיות בגודל ננו הנושאות אותות ביולוגיים בין תאים. ברפואה אסתטית הם מורים לתאי העור להשתקם, להתחדש ולאזן — מה שהופך אותם לאחד הכלים המבטיחים ביותר לחידוש עור נראה לעין."
      ),
      L(
        "For practitioners, the key is delivery: combining a concentrated exosome formula with an optimized delivery method dramatically improves uptake. This is exactly the principle behind the V Tech System.",
        "Для специалиста ключ — доставка: сочетание концентрированной формулы экзосом с оптимизированным методом доставки заметно повышает усвоение. Именно на этом принципе построена система V Tech.",
        "עבור המטפלים, המפתח הוא ההחדרה: שילוב פורמולת אקסוזומים מרוכזת עם שיטת החדרה ממוטבת משפר משמעותית את הספיגה. זהו בדיוק העיקרון שמאחורי מערכת V Tech."
      ),
    ],
  },
  {
    id: "v-tech-protocol-mature-skin",
    category: "protocols",
    readMinutes: 6,
    date: L("June 2026", "Июнь 2026", "יוני 2026"),
    image: img("1745159338135-39f6b462b382"),
    title: L(
      "Building the Perfect V Tech System Protocol for Mature Skin",
      "Идеальный протокол V Tech System для зрелой кожи",
      "בניית פרוטוקול V Tech System מושלם לעור בוגר"
    ),
    excerpt: L(
      "Step-by-step guidance for sequencing the V Tech System to maximize firmness, luminosity and client retention.",
      "Пошаговое руководство по последовательности V Tech System для максимальной упругости, сияния и удержания клиентов.",
      "הדרכה שלב-אחר-שלב לרצף מערכת V Tech למקסום מוצקות, זוהר ושימור לקוחות."
    ),
    body: [
      L(
        "Mature skin benefits most from a layered approach: preparation, delivery, and recovery. Begin with a gentle cleanse and a Mitoscan reading to set a baseline you can revisit.",
        "Зрелой коже больше всего подходит многоэтапный подход: подготовка, доставка и восстановление. Начните с мягкого очищения и снимка Mitoscan, чтобы зафиксировать исходную точку.",
        "עור בוגר מפיק את המרב מגישה שכבתית: הכנה, החדרה והתאוששות. התחילו בניקוי עדין ובסריקת Mitoscan לקביעת קו בסיס שאליו תוכלו לחזור."
      ),
      L(
        "Follow with the concentrated ampoule and V-Tech delivery, then seal results with the Exocell Mask to soothe and lock in hydration. Space sessions over four to six weeks for compounding results.",
        "Затем — концентрированная ампула и доставка V-Tech, после чего закрепите результат маской Exocell для успокоения и удержания влаги. Распределите сеансы на 4–6 недель для накопительного эффекта.",
        "המשיכו עם האמפולה המרוכזת והחדרת V-Tech, ואז אטמו את התוצאות עם מסכת Exocell להרגעה ונעילת לחות. פזרו את המפגשים על פני ארבעה עד שישה שבועות לתוצאה מצטברת."
      ),
    ],
  },
  {
    id: "nad-cellular-longevity",
    category: "longevity",
    readMinutes: 10,
    date: L("May 2026", "Май 2026", "מאי 2026"),
    image: img("1775526634433-9108351b38c9"),
    title: L(
      "NAD+ and Cellular Longevity: The Next Frontier of Skincare",
      "NAD+ и клеточное долголетие: новый рубеж ухода за кожей",
      "NAD+ ואריכות ימים תאית: החזית הבאה של טיפוח העור"
    ),
    excerpt: L(
      "Why NAD+ peeling is reshaping anti-aging conversations, and how to position the Exonad protocol for premium clients.",
      "Почему NAD+-пилинг меняет разговор об антивозрастном уходе и как позиционировать протокол Exonad для премиум-клиентов.",
      "מדוע פילינג NAD+ משנה את השיח על הזדקנות, וכיצד למצב את פרוטוקול Exonad ללקוחות פרימיום."
    ),
    body: [
      L(
        "NAD+ is central to cellular energy. As it declines with age, skin repair slows. Targeted NAD+ peeling supports renewal at the source rather than only at the surface.",
        "NAD+ играет ключевую роль в клеточной энергии. С возрастом его уровень падает, и восстановление кожи замедляется. Направленный NAD+-пилинг поддерживает обновление у источника, а не только на поверхности.",
        "NAD+ מרכזי לאנרגיה התאית. ככל שהוא יורד עם הגיל, שיקום העור מואט. פילינג NAD+ ממוקד תומך בהתחדשות במקור ולא רק על פני השטח."
      ),
      L(
        "Position Exonad as a longevity investment, not a one-off treatment. Clients respond to the narrative of renewing skin from within over a considered course.",
        "Позиционируйте Exonad как инвестицию в долголетие, а не разовую процедуру. Клиенты откликаются на идею обновления кожи изнутри в рамках продуманного курса.",
        "מצבו את Exonad כהשקעה באריכות ימים, לא כטיפול חד-פעמי. לקוחות מגיבים לנרטיב של חידוש העור מבפנים לאורך קורס מחושב."
      ),
    ],
  },
  {
    id: "pricing-premium-treatments",
    category: "business",
    readMinutes: 7,
    date: L("May 2026", "Май 2026", "מאי 2026"),
    image: img("1778584396250-93044daeeefe"),
    title: L(
      "Pricing Premium Treatments Without Losing Clients",
      "Как назначать цену на премиум-процедуры и не терять клиентов",
      "תמחור טיפולי פרימיום בלי לאבד לקוחות"
    ),
    excerpt: L(
      "A pricing framework that communicates the value of advanced regeneration treatments and grows your clinic revenue.",
      "Схема ценообразования, которая доносит ценность передовых регенеративных процедур и увеличивает выручку клиники.",
      "מסגרת תמחור שמתקשרת את הערך של טיפולי התחדשות מתקדמים ומגדילה את הכנסות הקליניקה."
    ),
    body: [
      L(
        "Value-based pricing starts with outcomes, not ingredients. Frame each protocol around the transformation it delivers and the expertise required to deliver it.",
        "Ценообразование по ценности начинается с результата, а не с состава. Стройте каждый протокол вокруг трансформации, которую он даёт, и экспертизы, необходимой для этого.",
        "תמחור מבוסס-ערך מתחיל בתוצאות, לא ברכיבים. מסגרו כל פרוטוקול סביב הטרנספורמציה שהוא מספק והמומחיות הנדרשת לו."
      ),
      L(
        "Offer tiered courses rather than single sessions. Bundling professional protocols with home-care products increases both results and lifetime value.",
        "Предлагайте курсы с уровнями, а не разовые сеансы. Объединение профессиональных протоколов с домашним уходом повышает и результат, и пожизненную ценность клиента.",
        "הציעו קורסים מדורגים במקום מפגשים בודדים. שילוב פרוטוקולים מקצועיים עם מוצרי טיפוח ביתי מגדיל גם את התוצאות וגם את הערך לאורך זמן."
      ),
    ],
  },
  {
    id: "scalp-health-exosignal",
    category: "protocols",
    readMinutes: 5,
    date: L("April 2026", "Апрель 2026", "אפריל 2026"),
    image: img("1748543668646-e81cda0890f3"),
    title: L(
      "Scalp Health 101: Getting Started with the Exosignal Hair Line",
      "Здоровье кожи головы: старт с линейкой Exosignal Hair",
      "בריאות הקרקפת: מתחילים עם קו Exosignal Hair"
    ),
    excerpt: L(
      "From client consultation to home maintenance — a complete primer on signaling treatments for hair and scalp.",
      "От консультации до домашнего ухода — полный гид по сигнальным средствам для волос и кожи головы.",
      "מהייעוץ ללקוח ועד לתחזוקה ביתית — מדריך מלא לטיפולי איתות לשיער ולקרקפת."
    ),
    body: [
      L(
        "Healthy hair starts at the scalp. Begin every plan by assessing scalp condition and setting realistic expectations for density improvements over time.",
        "Здоровые волосы начинаются с кожи головы. Начинайте любой план с оценки её состояния и постановки реалистичных ожиданий по плотности со временем.",
        "שיער בריא מתחיל בקרקפת. התחילו כל תוכנית בהערכת מצב הקרקפת ובהצבת ציפיות ריאליות לשיפור בצפיפות לאורך זמן."
      ),
      L(
        "Pair in-clinic Exosignal Hair ampoules with the home-use spray so clients maintain momentum between visits — the fastest route to visible, lasting results.",
        "Сочетайте клинические ампулы Exosignal Hair с домашним спреем, чтобы клиенты сохраняли динамику между визитами — это быстрый путь к видимому и стойкому результату.",
        "שלבו אמפולות Exosignal Hair במרפאה עם הספריי הביתי כדי שהלקוחות ישמרו על רצף בין ביקורים — הדרך המהירה לתוצאות נראות ומתמשכות."
      ),
    ],
  },
  {
    id: "mitoscan-consultations",
    category: "science",
    readMinutes: 9,
    date: L("April 2026", "Апрель 2026", "אפריל 2026"),
    image: img("1745159338135-39f6b462b382"),
    title: L(
      "Reading the Skin: How Mitoscan Data Transforms Consultations",
      "Читая кожу: как данные Mitoscan меняют консультации",
      "לקרוא את העור: כיצד נתוני Mitoscan משנים את הייעוץ"
    ),
    excerpt: L(
      "Turn diagnostic insight into trust. Learn how to present Mitoscan results to convert consultations into treatment plans.",
      "Превратите диагностику в доверие. Узнайте, как представлять результаты Mitoscan, чтобы консультации становились планами лечения.",
      "הפכו תובנה אבחונית לאמון. למדו כיצד להציג תוצאות Mitoscan כדי להפוך ייעוצים לתוכניות טיפול."
    ),
    body: [
      L(
        "A consultation backed by data feels objective and personal at once. Mitoscan gives clients a clear picture of what their skin needs — and why your recommendation makes sense.",
        "Консультация, подкреплённая данными, воспринимается одновременно объективной и личной. Mitoscan даёт клиенту ясную картину потребностей кожи — и обоснование ваших рекомендаций.",
        "ייעוץ הנתמך בנתונים מרגיש אובייקטיבי ואישי בו-זמנית. Mitoscan נותן ללקוחות תמונה ברורה של מה שהעור שלהם צריך — ומדוע ההמלצה שלכם הגיונית."
      ),
      L(
        "Save each scan to show progress over the course. Visible improvement is the most persuasive reason for clients to continue and to refer others.",
        "Сохраняйте каждый скан, чтобы показывать прогресс за курс. Видимое улучшение — самый убедительный повод продолжить и рекомендовать вас другим.",
        "שמרו כל סריקה כדי להציג התקדמות לאורך הקורס. שיפור נראה לעין הוא הסיבה המשכנעת ביותר ללקוחות להמשיך ולהפנות אחרים."
      ),
    ],
  },
];

export function getArticle(id: string) {
  return articles.find((a) => a.id === id);
}
