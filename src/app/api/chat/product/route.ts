import { NextResponse } from 'next/server';
import { getProduct } from '@/products';
import type { LocaleType } from '@/types';
import { rateLimited } from '@/lib/chat-rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 350;

const LOCALE_INSTRUCTION: Record<LocaleType, string> = {
  en: 'Reply in English.',
  ru: 'Отвечай по-русски (Reply in Russian).',
  he: 'ענה בעברית (Reply in Hebrew).',
};

function buildSystemPrompt(
  slug: string,
  locale: LocaleType
): string | null {
  const product = getProduct(slug);
  if (!product) return null;
  const c = product.content[locale];

  const facts: string[] = [
    `Product name: ${c.name}`,
    `Tagline: ${c.tagline}`,
    `Description: ${c.description}`,
  ];
  if (c.keyFacts?.length) {
    facts.push('Key facts: ' + c.keyFacts.map((f) => `- ${f}`).join('\n'));
  }
  if (c.benefits?.length) {
    facts.push(
      'Benefits:\n' +
        c.benefits.map((b) => `- ${b.title}: ${b.text}`).join('\n')
    );
  }
  if (c.ingredients?.length) {
    facts.push('Active ingredients: ' + c.ingredients.join('; '));
  }
  if (c.protocol) {
    facts.push(
      `Application protocol (${c.protocol.title}):\n` +
        c.protocol.items.map((i) => `- ${i}`).join('\n')
    );
  }
  if (c.aftercare) {
    facts.push(
      `Aftercare (${c.aftercare.title}):\n` +
        c.aftercare.items.map((i) => `- ${i}`).join('\n')
    );
  }
  if (c.contraindications) {
    facts.push(
      `Contraindications (${c.contraindications.title}):\n` +
        c.contraindications.items.map((i) => `- ${i}`).join('\n')
    );
  }
  if (c.faq?.items?.length) {
    facts.push(
      'Known Q&A:\n' +
        c.faq.items.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')
    );
  }

  return [
    'You are a Mitoderm product specialist assistant on the public product page.',
    'Mitoderm is a professional, B2B-only Israeli distributor of clinical-grade exosome-based skincare for aesthetic clinics and cosmetologists.',
    `The visitor is reading about a single product: "${c.name}".`,
    'STRICT RULES:',
    '1. Only answer questions about this exact product, its protocol, ingredients, indications, aftercare, safety, and how a clinic would use it.',
    '2. If the question is off-topic, about a different product, about pricing, about ordering, about competitors, or about anything you cannot answer from the facts below — politely decline and suggest the visitor contact a Mitoderm specialist on WhatsApp.',
    '3. Never invent clinical claims, dosages, ingredient percentages, study results, or pricing.',
    '4. Keep replies short and concrete — 2-4 sentences when possible.',
    '5. This is for professional clinical use — write to a doctor or cosmetologist, not a consumer.',
    `6. ${LOCALE_INSTRUCTION[locale] ?? LOCALE_INSTRUCTION.en}`,
    '',
    `FACTS ABOUT "${c.name}":`,
    facts.join('\n\n'),
  ].join('\n');
}

interface Body {
  slug: string;
  locale: LocaleType;
  message: string;
  /** Last few exchanges so the model has short context. */
  history?: { role: 'user' | 'assistant'; content: string }[];
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Frontend will fall back to its built-in fuzzy matcher.
    return NextResponse.json({ error: 'not_configured' }, { status: 501 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const message = (body.message || '').trim().slice(0, 1000);
  const slug = String(body.slug || '');
  const locale = (body.locale ?? 'en') as LocaleType;
  if (!message) return NextResponse.json({ error: 'empty_message' }, { status: 400 });

  const system = buildSystemPrompt(slug, locale);
  if (!system) {
    return NextResponse.json({ error: 'product_not_found' }, { status: 404 });
  }

  // Per-IP rate limit — 10 requests / minute. Tight enough to make cost
  // abuse expensive, loose enough for a real conversation.
  const fwd = req.headers.get('x-forwarded-for') || '';
  const ip =
    fwd.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const rl = rateLimited(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'rate_limited', retryInMs: rl.retryInMs },
      { status: 429 }
    );
  }

  const messages: AnthropicMessage[] = [];
  const history = Array.isArray(body.history) ? body.history : [];
  // Take the last 6 turns (3 user + 3 assistant) max
  for (const m of history.slice(-6)) {
    if (m.role === 'user' || m.role === 'assistant') {
      messages.push({
        role: m.role,
        content: String(m.content || '').slice(0, 1000),
      });
    }
  }
  messages.push({ role: 'user', content: message });

  let res: Response;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages,
      }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'upstream_error', detail: (err as Error).message },
      { status: 502 }
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    // eslint-disable-next-line no-console
    console.warn('[chat] anthropic error', res.status, detail);
    return NextResponse.json(
      { error: 'upstream_error', status: res.status },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
    stop_reason?: string;
  };
  const text = (data.content || [])
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text as string)
    .join('\n')
    .trim();

  if (!text) {
    return NextResponse.json(
      { error: 'empty_response' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, text, stopReason: data.stop_reason });
}
