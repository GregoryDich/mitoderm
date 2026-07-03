import { motion } from "motion/react";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";

const stats: { value: string; label: DictKey }[] = [
  { value: "8", label: "philo.stat.products" },
  { value: "100%", label: "philo.stat.grade" },
  { value: "1", label: "philo.stat.ecosystem" },
];

export function Philosophy() {
  const { t } = useLang();
  return (
    <section
      id="philosophy"
      className="relative overflow-hidden py-28 lg:py-40"
      style={{ backgroundColor: "var(--mito-paper)" }}
    >
      <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[0.74rem] uppercase tracking-[0.3em]"
          style={{ color: "var(--mito-gold-deep)" }}
        >
          {t("philo.kicker")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-8 max-w-[920px] text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.18]"
          style={{ color: "var(--mito-ink)", fontWeight: 400 }}
        >
          {t("philo.quote")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-3"
          style={{ border: "1px solid rgba(10,10,11,0.08)", backgroundColor: "rgba(10,10,11,0.08)" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="px-8 py-12" style={{ backgroundColor: "var(--mito-paper)" }}>
              <div
                className="text-[3rem] leading-none"
                style={{ color: "var(--mito-ink)", fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div
                className="mt-3 text-[0.78rem] uppercase tracking-[0.22em]"
                style={{ color: "rgba(10,10,11,0.5)" }}
              >
                {t(s.label)}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
