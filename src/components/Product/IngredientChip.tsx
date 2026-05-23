'use client';

import { FC, useMemo } from 'react';
import { useMessages } from 'next-intl';
import { dictFromMessages, lookupGlossary } from '@/lib/glossary';
import styles from './IngredientChip.module.scss';

interface Props {
  ingredient: string;
  index: number;
}

/** Renders an ingredient row. If a glossary term matches the
 *  ingredient text, the row gets a dotted underline + native tooltip
 *  (title attribute) for instant hover/focus reveal. Pure CSS, no
 *  popper / no portal — works fine on touch when the user long-presses. */
const IngredientChip: FC<Props> = ({ ingredient, index }) => {
  const messages = useMessages();
  const glossary = useMemo(
    () => dictFromMessages(messages as Record<string, unknown>),
    [messages]
  );
  const hit = useMemo(
    () => lookupGlossary(ingredient, glossary),
    [ingredient, glossary]
  );

  return (
    <li className={styles.row}>
      {hit ? (
        <span
          className={styles.term}
          title={hit.def}
          tabIndex={0}
          aria-label={`${ingredient} — ${hit.def}`}
        >
          {ingredient}
          <span className={styles.info} aria-hidden="true">
            ⓘ
          </span>
        </span>
      ) : (
        <span>{ingredient}</span>
      )}
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
    </li>
  );
};

export default IngredientChip;
