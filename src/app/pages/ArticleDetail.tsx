import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Clock } from "lucide-react";
import { articles, getArticle, type ArticleCategory } from "../data/articles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const categoryKey: Record<ArticleCategory, DictKey> = {
  science: "journal.cat.science",
  protocols: "journal.cat.protocols",
  business: "journal.cat.business",
  longevity: "journal.cat.longevity",
};

export function ArticleDetail() {
  const { id } = useParams();
  const { t, tr } = useLang();
  const article = getArticle(id ?? "");

  useDocumentMeta(article ? tr(article.title) : "", article ? tr(article.excerpt) : undefined);

  if (!article) return <Navigate to="/journal" replace />;

  const more = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div style={{ backgroundColor: "var(--mito-ink)" }}>
      <section
        className="relative overflow-hidden pt-32 pb-16 lg:pt-40"
        style={{ backgroundColor: "var(--mito-black)" }}
      >
        <div className="relative mx-auto max-w-[820px] px-6 lg:px-10">
          <Link
            to="/journal"
            className="focus-ring mb-8 inline-flex items-center gap-2 text-[0.76rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--mito-gold-soft)" }}
          >
            <ArrowLeft size={15} /> {t("journal.back")}
          </Link>
          <span className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: "var(--mito-gold)" }}>
            {t(categoryKey[article.category])}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-5 text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.1]"
            style={{ color: "var(--mito-cream)", fontWeight: 500 }}
          >
            {tr(article.title)}
          </motion.h1>
          <div className="mt-6 flex items-center gap-4 text-[0.82rem]" style={{ color: "rgba(246,243,236,0.5)" }}>
            <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {article.readMinutes} {t("journal.readtime")}</span>
            <span>{tr(article.date)}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[820px] px-6 lg:px-10">
        <div className="-mt-8 overflow-hidden rounded-3xl" style={{ border: "1px solid rgba(201,162,75,0.16)" }}>
          <ImageWithFallback src={article.image} alt={tr(article.title)} loading="lazy" className="h-[340px] w-full object-cover" />
        </div>

        <article className="py-14">
          {article.body.map((para, i) => (
            <p
              key={i}
              className="mb-6 text-[1.08rem] leading-[1.85]"
              style={{ color: "rgba(246,243,236,0.78)", fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              {tr(para)}
            </p>
          ))}
        </article>
      </div>

      <section className="pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <h2 className="mb-8 text-[1.4rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
            {t("journal.kicker")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {more.map((a) => (
              <Link
                key={a.id}
                to={`/journal/${a.id}`}
                className="group focus-ring flex flex-col overflow-hidden rounded-2xl"
                style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
              >
                <div className="h-40 overflow-hidden">
                  <ImageWithFallback
                    src={a.image}
                    alt={tr(a.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-[1.05rem] leading-snug" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                    {tr(a.title)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
