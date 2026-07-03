import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router";
import type { Product } from "../data/products";
import { productLines } from "../data/products";
import { useLang } from "../i18n/i18n";

const surfaceStyles: Record<
  Product["surface"],
  { bg: string; text: string; sub: string; line: string; chipText: string }
> = {
  dark: {
    bg: "var(--mito-black)",
    text: "var(--mito-cream)",
    sub: "rgba(246,243,236,0.58)",
    line: "rgba(201,162,75,0.25)",
    chipText: "var(--mito-gold-soft)",
  },
  light: {
    bg: "var(--mito-cream)",
    text: "var(--mito-ink)",
    sub: "rgba(10,10,11,0.6)",
    line: "rgba(10,10,11,0.12)",
    chipText: "var(--mito-gold-deep)",
  },
  gold: {
    bg: "linear-gradient(135deg, #14110a, #2a2113 55%, #14110a)",
    text: "var(--mito-cream)",
    sub: "rgba(246,243,236,0.6)",
    line: "rgba(201,162,75,0.4)",
    chipText: "var(--mito-gold-soft)",
  },
};

function ShowcaseRow({ product, index }: { product: Product; index: number }) {
  const { t, tr } = useLang();
  const s = surfaceStyles[product.surface];
  const reversed = index % 2 === 1;
  const line = productLines.find((l) => l.id === product.line);

  return (
    <section className="relative overflow-hidden" style={{ background: s.bg }}>
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-10 px-6 py-24 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-32">
        <motion.div
          initial={{ opacity: 0, x: reversed ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className={`relative flex justify-center ${reversed ? "lg:order-2" : ""}`}
        >
          <div
            className="absolute inset-0 m-auto h-[70%] w-[70%] rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(201,162,75,0.22), transparent 70%)" }}
          />
          <img
            src={product.image}
            alt={`${product.name} — ${tr(product.subtitle)}`}
            loading="lazy"
            decoding="async"
            className="relative z-10 max-h-[440px] w-auto max-w-[80%] object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={reversed ? "lg:order-1" : ""}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[0.72rem] uppercase tracking-[0.28em]" style={{ color: s.chipText }}>
              {line ? tr(line.name) : ""}
            </span>
            {product.badge && (
              <span
                className="rounded-full px-3 py-0.5 text-[0.62rem] uppercase tracking-[0.2em]"
                style={{ border: `1px solid ${s.line}`, color: s.chipText }}
              >
                {tr(product.badge)}
              </span>
            )}
          </div>

          <h2 className="text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02]" style={{ color: s.text, fontWeight: 500 }}>
            {product.name}
          </h2>
          <p
            className="mt-3 text-[1.15rem]"
            style={{ color: s.chipText, fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            {tr(product.tagline)}
          </p>

          <p
            className="mt-6 max-w-md text-[1rem] leading-relaxed"
            style={{ color: s.sub, fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            {tr(product.description)}
          </p>

          <ul className="mt-8 space-y-3">
            {product.highlights.map((h) => (
              <li key={h.en} className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ border: `1px solid ${s.line}` }}
                >
                  <Check size={13} style={{ color: s.chipText }} />
                </span>
                <span className="text-[0.95rem]" style={{ color: s.sub }}>
                  {tr(h)}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to={`/product/${product.id}`}
            className="focus-ring mt-10 inline-flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.22em] transition-opacity hover:opacity-70"
            style={{ color: s.chipText, borderBottom: `1px solid ${s.line}`, paddingBottom: "6px" }}
          >
            {t("showcase.learnmore")} →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ProductShowcase({ products }: { products: Product[] }) {
  const { t } = useLang();
  return (
    <div id="collection">
      <div className="px-6 pt-28 text-center" style={{ backgroundColor: "var(--mito-black)" }}>
        <span className="text-[0.74rem] uppercase tracking-[0.3em]" style={{ color: "var(--mito-gold)" }}>
          {t("showcase.kicker")}
        </span>
        <h2
          className="mx-auto mt-6 max-w-[760px] text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.1]"
          style={{ color: "var(--mito-cream)", fontWeight: 400 }}
        >
          {t("showcase.title")}
        </h2>
      </div>
      {products.map((p, i) => (
        <ShowcaseRow key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
