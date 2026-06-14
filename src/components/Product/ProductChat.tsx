'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProductChat.module.scss';

interface QA {
  q: string;
  a: string;
}

interface Props {
  productName: string;
  /** Product slug — used to call the server LLM endpoint with the
   *  per-product system prompt. */
  productSlug: string;
  /** Visitor locale — passed to the LLM so it answers in the right
   *  language. */
  locale: 'en' | 'ru' | 'he';
  items: QA[];
  /** wa.me link with the productInquiryMessage already baked in. The
   *  widget will append the typed question when escalating. */
  whatsappBase?: string | null;
  /** /form link as a fallback when WhatsApp isn't configured. */
  formHref: string;
  /** UI strings — owner-controlled via translations. */
  strings: {
    title: string;
    intro?: string;
    askPlaceholder: string;
    askButton: string;
    escalateOnWhatsApp: string;
    escalateOnForm: string;
    suggestions: string;
    noMatch: string;
    thinking: string;
  };
}

/** Lightweight semantic match: cheap tokenisation + Jaccard similarity.
 *  Good enough for "does the user's typed question look like one of the
 *  preset Q&As?" — not trying to replace an LLM, just fast and offline. */
function score(query: string, q: string): number {
  const toks = (s: string): Record<string, true> => {
    const out: Record<string, true> = {};
    const cleaned = s.toLowerCase().replace(/[^a-zа-яё0-9֐-׿\s]+/gi, ' ');
    for (const w of cleaned.split(/\s+/)) {
      if (w.length > 2) out[w] = true;
    }
    return out;
  };
  const a = toks(query);
  const b = toks(q);
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length === 0 || bKeys.length === 0) return 0;
  let inter = 0;
  for (const t of aKeys) if (b[t]) inter++;
  return inter / Math.sqrt(aKeys.length * bKeys.length);
}

const ProductChat: FC<Props> = ({
  productName,
  productSlug,
  locale,
  items,
  whatsappBase,
  formHref,
  strings,
}) => {
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);
  // After the first LLM endpoint failure we stop trying for this session
  // and fall back to the local fuzzy matcher silently.
  const [llmAvailable, setLlmAvailable] = useState(true);
  const [log, setLog] = useState<
    { kind: 'user' | 'bot'; text: string; idx?: number }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Best match ≥ threshold = useful match. Anything below = "no match".
  const best = useMemo(() => {
    if (!query.trim()) return null;
    let bi = -1;
    let bs = 0;
    for (let i = 0; i < items.length; i++) {
      const s = score(query, items[i].q);
      if (s > bs) {
        bs = s;
        bi = i;
      }
    }
    return bi >= 0 && bs >= 0.3 ? { idx: bi, s: bs } : null;
  }, [query, items]);

  useEffect(() => {
    // Auto-scroll the conversation pane as new messages come in.
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [log]);

  const fuzzyAnswer = (q: string): string => {
    if (best) return items[best.idx].a;
    return strings.noMatch;
  };

  const llmAnswer = async (
    q: string,
    history: typeof log
  ): Promise<string | null> => {
    try {
      const res = await fetch('/api/chat/product', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug: productSlug,
          locale,
          message: q,
          history: history
            .filter((m) => m.kind === 'user' || m.kind === 'bot')
            .map((m) => ({
              role: m.kind === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
        }),
      });
      if (!res.ok) {
        // 501 = not configured → disable for the rest of the session.
        if (res.status === 501) setLlmAvailable(false);
        return null;
      }
      const data = (await res.json()) as { ok?: boolean; text?: string };
      return data.ok && data.text ? data.text : null;
    } catch {
      return null;
    }
  };

  const ask = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q || thinking) return;
    setQuery('');
    setLog((cur) => [...cur, { kind: 'user', text: q }]);

    if (!llmAvailable) {
      setLog((cur) => [...cur, { kind: 'bot', text: fuzzyAnswer(q) }]);
      inputRef.current?.focus();
      return;
    }

    setThinking(true);
    // Snapshot of history *before* the new user message would be redundant —
    // we already pushed it. Compute history excluding the just-added one.
    const histForApi = log;
    const llmText = await llmAnswer(q, histForApi);
    setThinking(false);
    setLog((cur) => [
      ...cur,
      { kind: 'bot', text: llmText ?? fuzzyAnswer(q) },
    ]);
    inputRef.current?.focus();
  };

  const onSuggest = (i: number) => {
    setOpened(i);
    setLog((l) => [
      ...l,
      { kind: 'user', text: items[i].q },
      { kind: 'bot', text: items[i].a, idx: i },
    ]);
  };

  // Escalate to WhatsApp/form with the last user question (or the topic)
  // appended to the pre-baked product inquiry message.
  const lastUserQuestion = [...log].reverse().find((m) => m.kind === 'user');
  const escalateQuery = query.trim() || lastUserQuestion?.text;
  const waHref = whatsappBase
    ? `${whatsappBase}${
        escalateQuery
          ? encodeURIComponent('\n\n' + escalateQuery)
          : ''
      }`
    : null;

  void opened; // kept for future "details" panel

  return (
    <div className={styles.chat}>
      <header className={styles.head}>
        <span className={styles.dot} aria-hidden="true" />
        <div>
          <h3 className={styles.title}>{strings.title}</h3>
          {strings.intro && <p className={styles.intro}>{strings.intro}</p>}
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.suggest}>
          <span className={styles.suggestLabel}>{strings.suggestions}</span>
          <div className={styles.suggestChips}>
            {items.map((it, i) => (
              <button
                key={it.q}
                type="button"
                className={styles.chip}
                onClick={() => onSuggest(i)}
                aria-label={it.q}
              >
                {it.q}
              </button>
            ))}
          </div>
        </div>

        {(log.length > 0 || thinking) && (
          <div className={styles.thread} ref={scroller} aria-live="polite">
            {log.map((m, i) => (
              <div
                key={i}
                className={`${styles.msg} ${
                  m.kind === 'user' ? styles.user : styles.bot
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className={`${styles.msg} ${styles.bot} ${styles.typing}`}>
                <span className={styles.dotPulse} />
                <span className={styles.dotPulse} />
                <span className={styles.dotPulse} />
                <span className="sr-only">{strings.thinking}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <form className={styles.ask} onSubmit={ask}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={strings.askPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={strings.askPlaceholder}
        />
        <button type="submit" className={styles.askBtn}>
          {strings.askButton}
        </button>
      </form>

      <div className={styles.escalate}>
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className={styles.escalateBtn}
          >
            {strings.escalateOnWhatsApp}
          </a>
        ) : (
          <a href={formHref} className={styles.escalateBtn}>
            {strings.escalateOnForm}
          </a>
        )}
        <span className={styles.escalateSub}>
          {productName}
        </span>
      </div>
    </div>
  );
};

export default ProductChat;
