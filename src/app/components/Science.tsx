import { motion } from "motion/react";
import { Atom, Microscope, Layers, ShieldCheck } from "lucide-react";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";

const pillars: { icon: typeof Atom; title: DictKey; body: DictKey }[] = [
  { icon: Atom, title: "science.p1.title", body: "science.p1.body" },
  { icon: Microscope, title: "science.p2.title", body: "science.p2.body" },
  { icon: Layers, title: "science.p3.title", body: "science.p3.body" },
  { icon: ShieldCheck, title: "science.p4.title", body: "science.p4.body" },
];

export function Science() {
  const { t } = useLang();
  return (
    <section
      id="science"
      className="relative overflow-hidden py-28 lg:py-36"
      style={{ backgroundColor: "var(--mito-black)" }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[160px]"
        style={{ background: "radial-gradient(circle, rgba(110,231,224,0.1), rgba(211,108,240,0.08), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="text-[0.74rem] uppercase tracking-[0.3em]" style={{ color: "var(--mito-gold)" }}>
            {t("science.kicker")}
          </span>
          <h2
            className="mt-6 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.1]"
            style={{ color: "var(--mito-cream)", fontWeight: 400 }}
          >
            {t("science.title")}
          </h2>
        </div>

        <div
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: "rgba(201,162,75,0.16)" }}
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="p-9"
              style={{ backgroundColor: "var(--mito-ink)" }}
            >
              <span
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ border: "1px solid rgba(201,162,75,0.4)", color: "var(--mito-gold-soft)" }}
              >
                <p.icon size={22} />
              </span>
              <h3 className="text-[1.25rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                {t(p.title)}
              </h3>
              <p
                className="mt-3 text-[0.92rem] leading-relaxed"
                style={{ color: "rgba(246,243,236,0.55)", fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                {t(p.body)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
