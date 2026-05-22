import { LocaleType } from '@/types';

/** Build a wa.me deep-link with a pre-filled message. Returns null when
 *  the brand WhatsApp number isn't configured (env var unset). */
export function whatsappHref(message: string): string | null {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!num) return null;
  const cleaned = num.replace(/[^\d]/g, '');
  if (!cleaned) return null;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

const TEMPLATES: Record<LocaleType, (name: string) => string> = {
  en: (name) =>
    `Hello! I'd like to receive professional pricing and protocol for ${name} for my clinic.`,
  ru: (name) =>
    `Здравствуйте! Я бы хотел(а) получить профессиональные условия и протокол по ${name} для своей клиники.`,
  he: (name) =>
    `שלום! אשמח לקבל הצעת מחיר ופרוטוקול מקצועי עבור ${name} למרפאה שלי.`,
};

export function productInquiryMessage(name: string, locale: LocaleType): string {
  return (TEMPLATES[locale] ?? TEMPLATES.en)(name);
}

const GENERIC_TEMPLATES: Record<LocaleType, string> = {
  en: 'Hello! I run an aesthetic clinic and would like to learn about Mitoderm products and pricing.',
  ru: 'Здравствуйте! Я представляю эстетическую клинику и хотел(а) бы узнать о продуктах Mitoderm и условиях.',
  he: 'שלום! אני מנהל/ת מרפאת אסתטיקה ואשמח לקבל מידע על מוצרי Mitoderm ועל התנאים.',
};

export function genericInquiryMessage(locale: LocaleType): string {
  return GENERIC_TEMPLATES[locale] ?? GENERIC_TEMPLATES.en;
}
