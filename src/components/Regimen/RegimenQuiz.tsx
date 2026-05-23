'use client';

import { FC, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Footer from '@/components/Layout/Footer/Footer';
import ProductMedia from '@/components/Product/ProductMedia';
import { CatalogItem, ProductAccent } from '@/products';
import { productInquiryMessage, whatsappHref } from '@/lib/whatsapp';
import styles from './RegimenQuiz.module.scss';

interface Props {
  catalog: CatalogItem[];
}

/** Each answer carries a vote vector keyed by product slug. The quiz is
 *  three short questions; the engine adds the picks up and surfaces the
 *  top 2 catalog items as a recommendation. Owner can tune scores by
 *  editing this map alone — the rest is structural. */
const SCORES: Record<string, Record<string, number>> = {
  // Q1 — primary concern
  'concern.aging':       { 'v-tech-serum': 3, 'v-tech-gel-mask': 3, 'exotech-gel': 2 },
  'concern.hair':        { 'exosignal-hair': 3, 'exosignal-hair-spray': 2 },
  'concern.acne':        { 'exotech-gel': 3, 'v-tech-gel-mask': 2 },
  'concern.recovery':    { 'exotech-gel': 3, 'v-tech-serum': 1 },

  // Q2 — sensitivity
  'sens.normal':         { 'v-tech-serum': 1, 'exotech-gel': 1 },
  'sens.sensitive':      { 'v-tech-gel-mask': 2 },
  'sens.very':           { 'v-tech-gel-mask': 3, 'exotech-gel': 1 },

  // Q3 — session intensity
  'sess.gentle':         { 'v-tech-gel-mask': 2, 'exosignal-hair-spray': 1 },
  'sess.standard':       { 'v-tech-serum': 2, 'exotech-gel': 1, 'exosignal-hair': 1 },
  'sess.intensive':      { 'exotech-gel': 2, 'exosignal-hair': 2, 'v-tech-serum': 1 },
};

const QUESTIONS: { id: string; answers: string[] }[] = [
  { id: 'concern', answers: ['aging', 'hair', 'acne', 'recovery'] },
  { id: 'sens',    answers: ['normal', 'sensitive', 'very'] },
  { id: 'sess',    answers: ['gentle', 'standard', 'intensive'] },
];

const accentVar: Record<ProductAccent, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

const RegimenQuiz: FC<Props> = ({ catalog }) => {
  const t = useTranslations('regimen');
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const totalSteps = QUESTIONS.length;

  const recommendations = useMemo(() => {
    if (!done) return [] as (CatalogItem & { score: number })[];
    const tally: Record<string, number> = {};
    for (const [qid, ans] of Object.entries(picks)) {
      const key = `${qid}.${ans}`;
      const vector = SCORES[key];
      if (!vector) continue;
      for (const [slug, n] of Object.entries(vector)) {
        tally[slug] = (tally[slug] ?? 0) + n;
      }
    }
    return catalog
      .map((c) => ({ ...c, score: tally[c.slug] ?? 0 }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }, [done, picks, catalog]);

  const reset = () => {
    setPicks({});
    setStep(0);
    setDone(false);
  };

  const onAnswer = (qid: string, ans: string) => {
    setPicks((cur) => ({ ...cur, [qid]: ans }));
    if (step + 1 >= totalSteps) setDone(true);
    else setStep((s) => s + 1);
  };

  const recoSummary = recommendations
    .map((r) => r.name)
    .join(', ');
  const waHref = recoSummary
    ? whatsappHref(productInquiryMessage(recoSummary, 'en'))
    : null;

  return (
    <div className={`pageScroll ${styles.page}`}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {t('eyebrow')}
        </div>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <main className={styles.content}>
        {!done ? (
          <section className={styles.quiz}>
            <div
              className={styles.progress}
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={t('progressLabel')}
            >
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`}
                />
              ))}
            </div>
            {QUESTIONS.map((q, i) =>
              i === step ? (
                <div key={q.id} className={styles.step}>
                  <span className={styles.stepIndex}>
                    {String(i + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                  </span>
                  <h2 className={styles.question}>{t(`q.${q.id}.title`)}</h2>
                  <div className={styles.answers}>
                    {q.answers.map((a) => (
                      <button
                        key={a}
                        type="button"
                        className={styles.answer}
                        onClick={() => onAnswer(q.id, a)}
                      >
                        <span className={styles.answerLabel}>
                          {t(`q.${q.id}.${a}`)}
                        </span>
                        <span className={styles.answerArrow}>→</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      className={styles.back}
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                    >
                      ← {t('back')}
                    </button>
                  )}
                </div>
              ) : null
            )}
          </section>
        ) : (
          <section className={styles.result}>
            <span className={styles.resultEyebrow}>{t('resultEyebrow')}</span>
            <h2 className={styles.resultTitle}>{t('resultTitle')}</h2>
            <p className={styles.resultIntro}>{t('resultIntro')}</p>

            {recommendations.length === 0 ? (
              <p className={styles.empty}>{t('noMatch')}</p>
            ) : (
              <ol className={styles.recList}>
                {recommendations.map((r, i) => (
                  <li key={r.slug} className={styles.recItem}>
                    <span className={styles.recRank}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={r.href}
                      className={styles.recCard}
                      style={{
                        ['--accent' as string]:
                          accentVar[r.accent as ProductAccent],
                      }}
                    >
                      <div className={styles.recMedia}>
                        <ProductMedia
                          image={r.image}
                          accent={r.accent}
                          alt={r.name}
                          className={styles.recMediaInner}
                          sizes="(max-width: 768px) 100vw, 220px"
                        />
                      </div>
                      <div className={styles.recBody}>
                        <span className={styles.recCategory}>
                          {r.category.replace('-', ' ').toUpperCase()}
                        </span>
                        <h3 className={styles.recName}>{r.name}</h3>
                        <p className={styles.recDesc}>{r.shortDescription}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <div className={styles.resultActions}>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cta}
                >
                  {t('ctaWhatsApp')}
                </a>
              )}
              <Link href="/form" className={styles.ctaGhost}>
                {t('ctaForm')}
              </Link>
              <button type="button" className={styles.ctaGhost} onClick={reset}>
                {t('restart')}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RegimenQuiz;
