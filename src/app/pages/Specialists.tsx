import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { MapPin, BadgeCheck, Search, ArrowUpRight } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { specialists } from "../data/specialists";
import { useLang } from "../i18n/i18n";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function Specialists() {
  const { t, tr } = useLang();
  const [query, setQuery] = useState("");
  useDocumentMeta(t("spec.title"), t("spec.intro"));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specialists;
    return specialists.filter((s) =>
      [s.name, s.clinic, tr(s.city), tr(s.country)].some((v) => v.toLowerCase().includes(q))
    );
  }, [query, tr]);

  return (
    <>
      <PageHeader kicker={t("spec.kicker")} title={t("spec.title")} intro={t("spec.intro")} />

      <section className="py-20 lg:py-28" style={{ backgroundColor: "var(--mito-ink)" }}>
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <div
            className="mx-auto mb-14 flex max-w-xl items-center gap-3 rounded-full px-6 py-3.5"
            style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.22)" }}
          >
            <Search size={18} style={{ color: "var(--mito-gold)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("spec.search")}
              className="focus-ring w-full bg-transparent outline-none"
              style={{ color: "var(--mito-cream)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <Link
                  to={`/specialists/${s.id}`}
                  className="group focus-ring block overflow-hidden rounded-2xl"
                  style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={s.image}
                      alt={`${s.name}, ${s.clinic}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(17,17,20,0.95), transparent 55%)" }}
                    />
                    {s.verified && (
                      <span
                        className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em]"
                        style={{ backgroundColor: "rgba(10,10,11,0.6)", color: "var(--mito-gold-soft)", backdropFilter: "blur(6px)" }}
                      >
                        <BadgeCheck size={13} /> {t("spec.certified")}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-[1.35rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                      {s.name}
                    </h3>
                    <p
                      className="mt-1 text-[0.9rem]"
                      style={{ color: "rgba(246,243,236,0.55)", fontFamily: "var(--font-body)", fontWeight: 300 }}
                    >
                      {s.clinic}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[0.85rem]" style={{ color: "var(--mito-gold-soft)" }}>
                      <MapPin size={14} />
                      {tr(s.city)}, {tr(s.country)}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.specialties.map((sp) => (
                        <span
                          key={sp}
                          className="rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em]"
                          style={{ border: "1px solid rgba(201,162,75,0.25)", color: "rgba(246,243,236,0.65)" }}
                        >
                          {sp}
                        </span>
                      ))}
                    </div>

                    <div
                      className="mt-6 flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.18em]"
                      style={{ color: "var(--mito-gold)" }}
                    >
                      {t("spec.profile")}
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-10 text-center" style={{ color: "rgba(246,243,236,0.5)" }}>
              {t("spec.none")}
            </p>
          )}

          <div
            className="mt-20 flex flex-col items-center gap-4 rounded-3xl px-8 py-14 text-center"
            style={{ background: "linear-gradient(135deg, #14110a, #2a2113 55%, #14110a)" }}
          >
            <h3 className="text-[1.9rem]" style={{ color: "var(--mito-cream)", fontWeight: 400 }}>
              {t("spec.join.title")}
            </h3>
            <p className="max-w-md" style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
              {t("spec.join.body")}
            </p>
            <Link
              to="/#contact"
              className="focus-ring mt-2 inline-flex rounded-full px-7 py-3 text-[0.78rem] uppercase tracking-[0.2em]"
              style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
            >
              {t("spec.join.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
