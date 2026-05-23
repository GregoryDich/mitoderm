/**
 * Heuristic lead qualification.
 *
 * Pure-function, no LLM — runs on the message + clinic field at submission
 * time and on demand from /admin/leads. Detects:
 *  - language (en / ru / he / other)
 *  - intent (pricing | training | partnership | research | support | other)
 *  - clinic size hint (solo | small | mid | chain | unknown)
 *  - score 0..100 (intent strength × signal volume)
 *
 * Owner-readable, easy to tune as new patterns show up in real lead data.
 */

export type LeadLang = 'en' | 'ru' | 'he' | 'other';
export type LeadIntent =
  | 'pricing'
  | 'training'
  | 'partnership'
  | 'research'
  | 'support'
  | 'other';
export type LeadSize = 'solo' | 'small' | 'mid' | 'chain' | 'unknown';

export interface LeadSignals {
  lang: LeadLang;
  intent: LeadIntent;
  size: LeadSize;
  /** 0..100 — higher = more likely a serious clinic buyer. */
  score: number;
  /** Concise human-readable badges the admin renders as chips. */
  tags: string[];
}

const INTENT: Array<{ kind: LeadIntent; re: RegExp }> = [
  {
    kind: 'pricing',
    re: /\b(price|cost|quote|pricing|wholesale|discount|шек|цена|цены|стоимость|прайс|оптовая|опт|מחיר|מחירון|הצעת מחיר|סיטונאי)\b/i,
  },
  {
    kind: 'training',
    re: /\b(training|workshop|seminar|certif|course|обучение|тренинг|сертифик|курс|семинар|הדרכה|סדנה|הכשרה|קורס)\b/i,
  },
  {
    kind: 'partnership',
    re: /\b(distributor|reseller|partnership|partner|дистриб|партн|сотрудни|реселл|מפיץ|שותפות|שותף)\b/i,
  },
  {
    kind: 'research',
    re: /\b(study|paper|publication|clinical trial|исследован|публикация|клиническ|מחקר|פרסום|ניסוי)\b/i,
  },
  {
    kind: 'support',
    re: /\b(support|issue|problem|broken|complain|жалоб|поддержк|проблем|неполадк|תמיכה|בעיה|תקלה)\b/i,
  },
];

const SIZE: Array<{ kind: LeadSize; re: RegExp }> = [
  {
    kind: 'chain',
    re: /\b(chain|network|group|multi[-\s]?clinic|сеть\s+клиник|многофилиальн|сеть|רשת)\b/i,
  },
  {
    kind: 'mid',
    re: /\b((10|1[2-9]|2\d|3\d)\s*(doctors|cosmetologists|specialists|врач|косметолог))\b/i,
  },
  {
    kind: 'small',
    re: /\b(small clinic|boutique|2-?5\s*(doctors|cosmetologists|specialists|врач|косметолог)|small\s+practice|небольшая\s+клиника|кабинет)\b/i,
  },
  {
    kind: 'solo',
    re: /\b(solo|i am a (doctor|cosmetologist|practitioner)|i'm a (doctor|cosmetologist|practitioner)|я\s+(врач|косметолог|сама|сам)|я\s+работаю одна|אני\s+(רופא|רופאה|קוסמטיקאית))\b/i,
  },
];

const LANG_HE = /[֐-׿]/;
const LANG_RU = /[А-яЁё]/;
const LANG_EN = /[A-Za-z]/;

function detectLang(text: string): LeadLang {
  if (LANG_HE.test(text)) return 'he';
  if (LANG_RU.test(text)) return 'ru';
  if (LANG_EN.test(text)) return 'en';
  return 'other';
}

function detectIntent(text: string): LeadIntent {
  for (const m of INTENT) if (m.re.test(text)) return m.kind;
  return 'other';
}

function detectSize(text: string): LeadSize {
  for (const m of SIZE) if (m.re.test(text)) return m.kind;
  return 'unknown';
}

const HOT_SIGNALS = [
  // High-intent phrases that strongly hint at a purchase decision
  /\bready to (buy|order|start)\b/i,
  /\b(asap|urgent|immediately|asap?)\b/i,
  /\bopen(ing)? (a )?(new )?clinic\b/i,
  /\border\s+now\b/i,
  /\bстартую\b|\bоткрыва(ю|ем)\s+клиник/i,
  /\bהזמנה\s+דחופה/i,
];

const COLD_SIGNALS = [
  // Hobbyist / consumer / spam markers
  /\bfor (my|me|home use|personal)\b/i,
  /\b(student|just curious|curiosity)\b/i,
  /\bдля\s+(себя|дома|личного)/i,
  /\b(test|spam|asdf|qwerty)\b/i,
];

interface LeadInput {
  message?: string;
  clinic?: string;
  email?: string;
}

export function classifyLead(input: LeadInput): LeadSignals {
  const text = `${input.message ?? ''} ${input.clinic ?? ''}`.trim();
  if (!text) {
    return { lang: 'other', intent: 'other', size: 'unknown', score: 0, tags: [] };
  }

  const lang = detectLang(text);
  const intent = detectIntent(text);
  const size = detectSize(text);

  let score = 30; // base — there's a lead at all
  if (intent !== 'other') score += 25;
  if (size !== 'unknown') score += 15;
  if ((input.clinic ?? '').trim().length > 3) score += 10;
  if (HOT_SIGNALS.some((re) => re.test(text))) score += 20;
  if (COLD_SIGNALS.some((re) => re.test(text))) score -= 30;
  // Free-mail domain heuristic — clinics usually have a domain, but
  // don't penalise too hard, plenty of legit micro-clinics use gmail.
  if (
    /@(gmail|yahoo|hotmail|outlook|mail\.ru|yandex|icloud)\./i.test(
      input.email ?? ''
    )
  ) {
    score -= 5;
  }
  if (text.length < 30) score -= 10;
  if (text.length > 200) score += 5;
  score = Math.max(0, Math.min(100, score));

  const tags: string[] = [];
  if (intent !== 'other') tags.push(intent);
  if (size !== 'unknown') tags.push(size);
  if (HOT_SIGNALS.some((re) => re.test(text))) tags.push('hot');
  if (COLD_SIGNALS.some((re) => re.test(text))) tags.push('cold');

  return { lang, intent, size, score, tags };
}
