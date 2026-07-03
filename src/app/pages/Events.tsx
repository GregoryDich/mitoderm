import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, ArrowRight, Check } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { events, pastEvents, type EventStatus } from "../data/events";
import { useLang } from "../i18n/i18n";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const statusStyle: Record<EventStatus, { bg: string; color: string }> = {
  open: { bg: "rgba(110,231,224,0.15)", color: "#8fe9e2" },
  soldout: { bg: "rgba(211,108,240,0.16)", color: "#e0a0f2" },
};

export function Events() {
  const { t, tr } = useLang();
  const [registered, setRegistered] = useState<Record<string, boolean>>({});
  useDocumentMeta(t("events.title"), t("events.intro"));

  return (
    <>
      <PageHeader kicker={t("events.kicker")} title={t("events.title")} intro={t("events.intro")} />

      <section className="py-16 lg:py-24" style={{ backgroundColor: "var(--mito-ink)" }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <h2 className="mb-10 text-[1.8rem]" style={{ color: "var(--mito-cream)", fontWeight: 400 }}>
            {t("events.upcoming")}
          </h2>

          <div className="space-y-7">
            {events.map((e, i) => {
              const st = statusStyle[e.status];
              const isReg = registered[e.id];
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  className="group grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_1.4fr]"
                  style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.16)" }}
                >
                  <div className="relative h-60 overflow-hidden lg:h-auto">
                    <ImageWithFallback
                      src={e.image}
                      alt={tr(e.title)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className="absolute start-4 top-4 rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.18em]"
                      style={{ backgroundColor: st.bg, color: st.color, backdropFilter: "blur(6px)" }}
                    >
                      {t(e.status === "open" ? "events.status.open" : "events.status.soldout")}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center p-8 lg:p-10">
                    <span className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: "var(--mito-gold)" }}>
                      {tr(e.type)}
                    </span>
                    <h3 className="mt-3 text-[1.7rem] leading-snug" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                      {tr(e.title)}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-5 text-[0.88rem]" style={{ color: "var(--mito-gold-soft)" }}>
                      <span className="inline-flex items-center gap-2"><Calendar size={15} /> {tr(e.date)}</span>
                      <span className="inline-flex items-center gap-2"><MapPin size={15} /> {tr(e.location)}</span>
                    </div>
                    <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
                      {tr(e.description)}
                    </p>
                    {isReg ? (
                      <p className="mt-7 inline-flex items-center gap-2 text-[0.9rem]" style={{ color: "var(--mito-gold-soft)" }}>
                        <Check size={16} /> {t("events.registered")}
                      </p>
                    ) : (
                      <button
                        onClick={() => setRegistered((r) => ({ ...r, [e.id]: true }))}
                        className="focus-ring mt-7 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3 text-[0.76rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
                        style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
                      >
                        {t(e.status === "soldout" ? "events.waitlist" : "events.reserve")}
                        <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <h2 className="mb-8 mt-20 text-[1.8rem]" style={{ color: "var(--mito-cream)", fontWeight: 400 }}>
            {t("events.past")}
          </h2>
          <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(201,162,75,0.14)" }}>
            {pastEvents.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  backgroundColor: "var(--mito-charcoal)",
                  borderTop: i === 0 ? "none" : "1px solid rgba(246,243,236,0.08)",
                }}
              >
                <span className="text-[1.05rem]" style={{ color: "var(--mito-cream)" }}>{tr(p.title)}</span>
                <div className="flex gap-5 text-[0.85rem]" style={{ color: "rgba(246,243,236,0.5)" }}>
                  <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {tr(p.date)}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {tr(p.location)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
