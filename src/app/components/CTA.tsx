import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "../i18n/i18n";

export function CTA() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-28 lg:py-40"
      style={{ background: "linear-gradient(135deg, #14110a, #2a2113 55%, #14110a)" }}
    >
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(201,162,75,0.3), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[760px] px-6 text-center lg:px-10">
        <span className="text-[0.74rem] uppercase tracking-[0.3em]" style={{ color: "var(--mito-gold-soft)" }}>
          {t("cta.kicker")}
        </span>
        <h2
          className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08]"
          style={{ color: "var(--mito-cream)", fontWeight: 400 }}
        >
          {t("cta.title")}
        </h2>
        <p
          className="mx-auto mt-6 max-w-md text-[1.05rem] leading-relaxed"
          style={{ color: "rgba(246,243,236,0.65)", fontFamily: "var(--font-body)", fontWeight: 300 }}
        >
          {t("cta.desc")}
        </p>

        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-[1.05rem]"
            style={{ color: "var(--mito-gold-soft)" }}
          >
            {t("cta.thanks")}
          </motion.p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("cta.placeholder")}
              className="focus-ring flex-1 rounded-full px-6 py-3.5 outline-none"
              style={{
                backgroundColor: "rgba(246,243,236,0.06)",
                border: "1px solid rgba(201,162,75,0.3)",
                color: "var(--mito-cream)",
              }}
            />
            <button
              type="submit"
              className="focus-ring rounded-full px-8 py-3.5 text-[0.8rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
            >
              {t("cta.button")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
