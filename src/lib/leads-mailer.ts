import { reportError } from './report-error';

/** Tri-locale auto-reply sent to the visitor right after a successful
 *  lead capture. Confirms receipt and sets response-time expectations.
 *  Fires only when RESEND_API_KEY + LEADS_FROM_EMAIL are set; otherwise
 *  the function returns quietly so dev / unconfigured prod doesn't fail. */

type Locale = 'en' | 'ru' | 'he';

interface AutoReplyParams {
  to: string;
  name: string;
  locale: Locale;
}

const TEMPLATES: Record<
  Locale,
  { subject: string; greeting: (name: string) => string; body: string }
> = {
  en: {
    subject: 'We received your message — Mitoderm',
    greeting: (name) =>
      name ? `Hi ${name},` : 'Hi,',
    body: [
      'Thank you for reaching out to Mitoderm. We received your message and',
      "a member of our team will reply within one business day.",
      '',
      'If your question is time-sensitive, you can also reach us on WhatsApp',
      'via the chat button on the site.',
      '',
      'Best regards,',
      'The Mitoderm team',
      'exoskin.co.il',
    ].join('\n'),
  },
  ru: {
    subject: 'Мы получили ваше сообщение — Mitoderm',
    greeting: (name) => (name ? `Здравствуйте, ${name}.` : 'Здравствуйте.'),
    body: [
      'Спасибо за обращение в Mitoderm. Мы получили ваше сообщение,',
      'наш специалист ответит в течение одного рабочего дня.',
      '',
      'Если вопрос срочный — напишите нам в WhatsApp через кнопку чата',
      'на сайте.',
      '',
      'С уважением,',
      'Команда Mitoderm',
      'exoskin.co.il',
    ].join('\n'),
  },
  he: {
    subject: 'קיבלנו את הפנייה שלכם — מיטודרם',
    greeting: (name) => (name ? `שלום ${name},` : 'שלום,'),
    body: [
      'תודה שפניתם למיטודרם. קיבלנו את ההודעה ונשיב בתוך יום עסקים אחד.',
      '',
      'אם זה דחוף — ניתן ליצור איתנו קשר ב-WhatsApp דרך כפתור הצ׳אט באתר.',
      '',
      'בברכה,',
      'צוות מיטודרם',
      'exoskin.co.il',
    ].join('\n'),
  },
};

/** Sends the auto-reply through Resend. Never throws — failures are
 *  reported and swallowed so they cannot affect the lead response. */
export async function sendAutoReply({
  to,
  name,
  locale,
}: AutoReplyParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  // Without a sender we can't send. Without the API key we also can't.
  if (!apiKey || !from) return;
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return;

  const tpl = TEMPLATES[locale] ?? TEMPLATES.en;
  const text = `${tpl.greeting(name)}\n\n${tpl.body}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: tpl.subject,
        text,
      }),
    });
    if (!res.ok) {
      reportError(new Error(`auto-reply HTTP ${res.status}`), {
        where: 'leads.autoReply',
        meta: { status: res.status, locale },
      });
    }
  } catch (err) {
    reportError(err, { where: 'leads.autoReply', meta: { locale } });
  }
}
