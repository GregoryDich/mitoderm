'use client';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './ProductChat.module.scss';

interface QA {
  q: string;
  a: string;
}

interface Props {
  productName: string;
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
  items,
  whatsappBase,
  formHref,
  strings,
}) => {
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<number | null>(null);
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

  const ask = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery('');
    const next: typeof log = [...log, { kind: 'user', text: q }];
    if (best) {
      next.push({ kind: 'bot', text: items[best.idx].a, idx: best.idx });
    } else {
      next.push({ kind: 'bot', text: strings.noMatch });
    }
    setLog(next);
    // keep focus on the input so the user can keep typing
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

        {log.length > 0 && (
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
