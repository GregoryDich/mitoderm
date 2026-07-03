import type { Localized } from "../i18n/i18n";

const L = (en: string, ru: string, he: string): Localized => ({ en, ru, he });

export type EventStatus = "open" | "soldout";

export type MitoEvent = {
  id: string;
  title: Localized;
  type: Localized;
  date: Localized;
  location: Localized;
  description: Localized;
  image: string;
  status: EventStatus;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200`;

export const events: MitoEvent[] = [
  {
    id: "vtech-masterclass-london",
    title: L(
      "Mitoderm Masterclass: The V Tech System",
      "Мастер-класс Mitoderm: V Tech System",
      "מאסטרקלאס Mitoderm: מערכת V Tech"
    ),
    type: L("Hands-on Training", "Практический тренинг", "הדרכה מעשית"),
    date: L("12 September 2026", "12 сентября 2026", "12 בספטמבר 2026"),
    location: L("London, United Kingdom", "Лондон, Великобритания", "לונדון, בריטניה"),
    description: L(
      "A full-day certified masterclass covering exosome theory and live V Tech System protocol demonstrations.",
      "Однодневный сертифицированный мастер-класс: теория экзосом и живые демонстрации протокола V Tech System.",
      "מאסטרקלאס מוסמך ליום שלם המכסה תיאוריית אקסוזומים והדגמות חיות של פרוטוקול V Tech System."
    ),
    image: img("1561489404-42f13a2f09a2"),
    status: "open",
  },
  {
    id: "skin-longevity-summit",
    title: L("Skin Longevity Summit 2026", "Саммит долголетия кожи 2026", "פסגת אריכות ימים לעור 2026"),
    type: L("Conference", "Конференция", "כנס"),
    date: L("4–5 October 2026", "4–5 октября 2026", "4–5 באוקטובר 2026"),
    location: L("Milan, Italy", "Милан, Италия", "מילאנו, איטליה"),
    description: L(
      "Two days of keynotes, panels and live demos on the future of regenerative aesthetics and NAD+ science.",
      "Два дня докладов, панелей и живых демонстраций о будущем регенеративной эстетики и науки NAD+.",
      "יומיים של הרצאות מפתח, פאנלים והדגמות חיות על עתיד האסתטיקה המתחדשת ומדע ה-NAD+."
    ),
    image: img("1730134322176-862f1cf9bc9f"),
    status: "open",
  },
  {
    id: "exosignal-hair-certification",
    title: L(
      "Exosignal Hair Certification Workshop",
      "Сертификационный воркшоп Exosignal Hair",
      "סדנת הסמכה Exosignal Hair"
    ),
    type: L("Certification", "Сертификация", "הסמכה"),
    date: L("18 November 2026", "18 ноября 2026", "18 בנובמבר 2026"),
    location: L("Berlin, Germany", "Берлин, Германия", "ברלין, גרמניה"),
    description: L(
      "Become certified in the Exosignal Hair line with intensive theory and supervised practical sessions.",
      "Получите сертификат по линейке Exosignal Hair: интенсивная теория и практика под наблюдением.",
      "קבלו הסמכה בקו Exosignal Hair עם תיאוריה אינטנסיבית ומפגשים מעשיים בהנחיה."
    ),
    image: img("1695866648612-5beb05a42ee5"),
    status: "soldout",
  },
];

export const pastEvents: { id: string; title: Localized; date: Localized; location: Localized }[] = [
  {
    id: "launch-gala",
    title: L("Mitoderm Launch Gala", "Гала-запуск Mitoderm", "גאלת ההשקה של Mitoderm"),
    date: L("March 2026", "Март 2026", "מרץ 2026"),
    location: L("Tel Aviv", "Тель-Авив", "תל אביב"),
  },
  {
    id: "innovation-forum",
    title: L("Aesthetic Innovation Forum", "Форум эстетических инноваций", "פורום חדשנות אסתטית"),
    date: L("February 2026", "Февраль 2026", "פברואר 2026"),
    location: L("Paris", "Париж", "פריז"),
  },
  {
    id: "exosome-roundtable",
    title: L("Exosome Science Roundtable", "Круглый стол по науке экзосом", "שולחן עגול למדע האקסוזומים"),
    date: L("December 2025", "Декабрь 2025", "דצמבר 2025"),
    location: L("Dubai", "Дубай", "דובאי"),
  },
];

export function getEvent(id: string) {
  return events.find((e) => e.id === id);
}
