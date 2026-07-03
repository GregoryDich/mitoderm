import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Clock, ArrowUpRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { articles, type ArticleCategory } from "../data/articles";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const categoryKey: Record<ArticleCategory, DictKey> = {
  science: "journal.cat.science",
  protocols: "journal.cat.protocols",
  business: "journal.cat.business",
  longevity: "journal.cat.longevity",
};

type Filter = "all" | ArticleCategory;
const filters: Filter[] = ["all", "science", "protocols", "business", "longevity"];

export function Journal() {
  const { t, tr } = useLang();
  const [active, setActive] = useState<Filter>("all");
  useDocumentMeta(t("journal.title"), t("journal.intro"));

  const filtered = useMemo(
    () => (active === "all" ? articles : articles.filter((a) => a.category === active)),
    [active]
  );

  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHeader kicker={t("journal.kicker")} title={t("journal.title")} intro={t("journal.intro")} />

      <section className="py-16 lg:py-24" style={{ backgroundColor: "var(--mito-ink)" }}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <div className="mb-12 flex flex-wrap gap-2">
            {filters.map((c) => {
              const on = c === active;
              const label = c === "all" ? t("journal.cat.all") : t(categoryKey[c]);
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className="focus-ring rounded-full px-5 py-2 text-[0.74rem] uppercase tracking-[0.16em] transition-all"
                  style={{
                    border: `1px solid ${on ? "var(--mito-gold)" : "rgba(246,243,236,0.18)"}`,
                    backgroundColor: on ? "var(--mito-gold)" : "transparent",
                    color: on ? "#0a0a0b" : "rgba(246,243,236,0.7)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to={`/journal/${featured.id}`}
                className="group focus-ring mb-12 grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-2"
                style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.16)" }}
              >
                <div className="relative h-72 overflow-hidden lg:h-auto">
                  <ImageWithFallback
                    src={featured.image}
                    alt={tr(featured.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: "var(--mito-gold)" }}>
                    {t("journal.featured")} · {t(categoryKey[featured.category])}
                  </span>
                  <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                    {tr(featured.title)}
                  </h2>
                  <p className="mt-4 text-[1rem] leading-relaxed" style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
                    {tr(featured.excerpt)}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-[0.8rem]" style={{ color: "rgba(246,243,236,0.5)" }}>
                    <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {featured.readMinutes} {t("journal.readtime")}</span>
                    <span>{tr(featured.date)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <Link
                  to={`/journal/${a.id}`}
                  className="group focus-ring flex h-full flex-col overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <ImageWithFallback
                      src={a.image}
                      alt={tr(a.title)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[0.64rem] uppercase tracking-[0.22em]" style={{ color: "var(--mito-gold)" }}>
                      {t(categoryKey[a.category])}
                    </span>
                    <h3 className="mt-3 text-[1.25rem] leading-snug" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                      {tr(a.title)}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed" style={{ color: "rgba(246,243,236,0.55)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
                      {tr(a.excerpt)}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[0.78rem]" style={{ color: "rgba(246,243,236,0.5)" }}>
                      <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {a.readMinutes} {t("journal.readtime")}</span>
                      <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--mito-gold)" }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
