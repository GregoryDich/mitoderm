import { motion } from "motion/react";

export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <section
      className="relative overflow-hidden pt-40 pb-20 lg:pt-48 lg:pb-28"
      style={{ backgroundColor: "var(--mito-black)" }}
    >
      <div
        className="pointer-events-none absolute -right-32 top-10 h-[460px] w-[460px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(201,162,75,0.18), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(211,108,240,0.12), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[0.74rem] uppercase tracking-[0.3em]"
          style={{ color: "var(--mito-gold)" }}
        >
          {kicker}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-6 max-w-[860px] text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[1.05]"
          style={{ color: "var(--mito-cream)", fontWeight: 400 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="mt-7 max-w-xl text-[1.08rem] leading-relaxed"
          style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}
        >
          {intro}
        </motion.p>
      </div>
    </section>
  );
}
