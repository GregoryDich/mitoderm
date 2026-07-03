import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import vtech from "../../imports/12.png";
import { useLang } from "../i18n/i18n";

export function Hero() {
  const { t } = useLang();
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
      style={{ backgroundColor: "var(--mito-black)" }}
    >
      {/* ambient aura */}
      <div
        className="pointer-events-none absolute -right-40 top-1/4 h-[640px] w-[640px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(211,108,240,0.18), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(110,231,224,0.14), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(10,10,11,0.9) 100%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-10 px-6 pt-32 pb-20 lg:grid-cols-2 lg:px-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-7 inline-flex items-center gap-3 rounded-full px-4 py-1.5"
            style={{ border: "1px solid rgba(201,162,75,0.35)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--mito-gold)" }} />
            <span className="text-[0.72rem] uppercase tracking-[0.28em]" style={{ color: "var(--mito-gold-soft)" }}>
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[clamp(3rem,7vw,6rem)] leading-[0.98]"
            style={{ color: "var(--mito-cream)", fontWeight: 500 }}
          >
            {t("hero.title1")}
            <br />
            <span
              style={{
                background: "linear-gradient(100deg, var(--mito-gold-soft), var(--mito-gold), var(--mito-gold-deep))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}
            >
              {t("hero.title2")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-7 max-w-md text-[1.05rem] leading-relaxed"
            style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href="#collection"
              className="inline-flex items-center rounded-full px-8 py-3.5 text-[0.82rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
            >
              {t("hero.cta1")}
            </a>
            <a
              href="#catalog"
              className="text-[0.82rem] uppercase tracking-[0.2em]"
              style={{ color: "rgba(246,243,236,0.7)" }}
            >
              {t("hero.cta2")} →
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div
            className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(201,162,75,0.28), transparent 70%)" }}
          />
          <motion.img
            src={vtech}
            alt="Mitoderm V Tech System — flagship exosome regeneration protocol"
            className="relative z-10 w-[78%] max-w-[460px] object-contain drop-shadow-2xl lg:w-[88%]"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: "rgba(201,162,75,0.7)" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </div>
    </section>
  );
}
