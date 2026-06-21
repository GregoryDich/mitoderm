'use client';

import { FC, useMemo } from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { dictFromMessages, lookupGlossary } from '@/lib/glossary';
import styles from './KeyActives.module.scss';

interface Props {
  ingredients: string[];
  /** Maximum number of featured cards. Defaults to 4. */
  limit?: number;
}

/** Surfaces the headline actives for a product by walking the
 *  ingredient list, matching against the locale glossary and
 *  rendering the first `limit` hits as featured cards. Falls back to
 *  null if the product has no glossary-known actives — owner pays
 *  nothing extra to ship a product without one. */
const KeyActives: FC<Props> = ({ ingredients, limit = 4 }) => {
  const t = useTranslations('keyActives');
  const messages = useMessages();
  const glossary = useMemo(
    () => dictFromMessages(messages as Record<string, unknown>),
    [messages]
  );

  const featured = useMemo(() => {
    const out: { name: string; term: string; def: string }[] = [];
    const seen = new Set<string>();
    for (const ing of ingredients) {
      if (out.length >= limit) break;
      const hit = lookupGlossary(ing, glossary);
      if (!hit) continue;
      if (seen.has(hit.term)) continue;
      seen.add(hit.term);
      out.push({ name: ing, term: hit.term, def: hit.def });
    }
    return out;
  }, [ingredients, glossary, limit]);

  if (featured.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>{t('eyebrow')}</span>
        <p className={styles.intro}>{t('intro')}</p>
      </header>
      <ul className={styles.grid}>
        {featured.map((a) => (
          <li key={a.term} className={styles.card}>
            <span className={styles.cardEyebrow}>{t('cardEyebrow')}</span>
            <h3 className={styles.cardName}>{a.name}</h3>
            <p className={styles.cardDef}>{a.def}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyActives;
