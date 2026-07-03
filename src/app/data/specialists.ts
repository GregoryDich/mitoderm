import type { Localized } from "../i18n/i18n";

const L = (en: string, ru: string, he: string): Localized => ({ en, ru, he });

export type Specialist = {
  id: string;
  name: string;
  clinic: string;
  city: Localized;
  country: Localized;
  specialties: string[];
  image: string;
  verified: boolean;
  bio: Localized;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;

export const specialists: Specialist[] = [
  {
    id: "elena-vasquez",
    name: "Dr. Elena Vasquez",
    clinic: "Lumière Aesthetic Clinic",
    city: L("London", "Лондон", "לונדון"),
    country: L("United Kingdom", "Великобритания", "בריטניה"),
    specialties: ["V Tech System", "Exonad"],
    image: img("1659353888906-adb3e0041693"),
    verified: true,
    bio: L(
      "With over 15 years in aesthetic medicine, Dr. Vasquez specializes in exosome-based regeneration and NAD longevity protocols for mature skin.",
      "Более 15 лет в эстетической медицине: доктор Васкес специализируется на экзосомной регенерации и протоколах долголетия NAD для зрелой кожи.",
      "עם ניסיון של יותר מ-15 שנה ברפואה אסתטית, ד\"ר וסקז מתמחה בהתחדשות מבוססת אקסוזומים ובפרוטוקולי אריכות ימים NAD לעור בוגר."
    ),
  },
  {
    id: "marco-bellini",
    name: "Dr. Marco Bellini",
    clinic: "Bellini Dermatology",
    city: L("Milan", "Милан", "מילאנו"),
    country: L("Italy", "Италия", "איטליה"),
    specialties: ["Exosignal Hair", "Mitopen"],
    image: img("1767175620484-1ed37931a0d1"),
    verified: true,
    bio: L(
      "A dermatologist focused on hair and scalp restoration, Dr. Bellini integrates the Exosignal system with precision microchanneling.",
      "Дерматолог, специализирующийся на восстановлении волос и кожи головы: доктор Беллини сочетает систему Exosignal с прецизионным микроканалингом.",
      "רופא עור המתמקד בשיקום שיער וקרקפת, ד\"ר בליני משלב את מערכת Exosignal עם מיקרו-תיעול מדויק."
    ),
  },
  {
    id: "sofia-andersson",
    name: "Sofia Andersson",
    clinic: "Nordic Skin Studio",
    city: L("Stockholm", "Стокгольм", "שטוקהולם"),
    country: L("Sweden", "Швеция", "שוודיה"),
    specialties: ["Exocell Mask", "V Tech System"],
    image: img("1594824476967-48c8b964273f"),
    verified: true,
    bio: L(
      "Sofia is known for her gentle, results-driven facials combining post-treatment recovery with deep regeneration.",
      "София известна деликатными процедурами для лица, сочетающими восстановление после процедур с глубокой регенерацией.",
      "סופיה ידועה בטיפולי הפנים העדינים וממוקדי-התוצאה שלה, המשלבים התאוששות שלאחר טיפול עם התחדשות עמוקה."
    ),
  },
  {
    id: "yael-cohen",
    name: "Dr. Yael Cohen",
    clinic: "TLV Longevity Center",
    city: L("Tel Aviv", "Тель-Авив", "תל אביב"),
    country: L("Israel", "Израиль", "ישראל"),
    specialties: ["Exonad", "V Tech System"],
    image: img("1673865641073-4479f93a7776"),
    verified: true,
    bio: L(
      "Dr. Cohen leads a longevity-focused practice, pairing diagnostic mapping with NAD peeling for personalized skin renewal.",
      "Доктор Коэн ведёт практику, ориентированную на долголетие, сочетая диагностику с NAD-пилингом для персонального обновления кожи.",
      "ד\"ר כהן מובילה קליניקה ממוקדת אריכות ימים, המשלבת מיפוי אבחוני עם פילינג NAD לחידוש עור אישי."
    ),
  },
  {
    id: "anton-weber",
    name: "Dr. Anton Weber",
    clinic: "Weber Ästhetik",
    city: L("Berlin", "Берлин", "ברלין"),
    country: L("Germany", "Германия", "גרמניה"),
    specialties: ["Mitoscan", "Mitopen"],
    image: img("1764546899196-b53061b1b609"),
    verified: true,
    bio: L(
      "A technology-driven practitioner, Dr. Weber uses Mitoscan diagnostics to build precise, device-led treatment plans.",
      "Приверженец технологий, доктор Вебер использует диагностику Mitoscan для точных, аппаратных планов лечения.",
      "מטפל מבוסס טכנולוגיה, ד\"ר weber משתמש באבחון Mitoscan לבניית תוכניות טיפול מדויקות מבוססות מכשירים."
    ),
  },
  {
    id: "camille-laurent",
    name: "Camille Laurent",
    clinic: "Maison de la Peau",
    city: L("Paris", "Париж", "פריז"),
    country: L("France", "Франция", "צרפת"),
    specialties: ["V Tech System", "Exocell Mask"],
    image: img("1706565029539-d09af5896340"),
    verified: true,
    bio: L(
      "Camille blends French skincare artistry with advanced regeneration for a signature luminous-skin result.",
      "Камиль сочетает французское искусство ухода за кожей с передовой регенерацией ради фирменного сияния кожи.",
      "קמיל משלבת אמנות טיפוח צרפתית עם התחדשות מתקדמת לתוצאת עור זוהר ייחודית."
    ),
  },
];

export function getSpecialist(id: string) {
  return specialists.find((s) => s.id === id);
}
