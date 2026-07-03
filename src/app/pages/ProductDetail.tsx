import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { Check, ArrowLeft } from "lucide-react";
import { products, productLines } from "../data/products";
import { useLang } from "../i18n/i18n";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function ProductDetail() {
  const { id } = useParams();
  const { t, tr } = useLang();
  const product = products.find((p) => p.id === id);

  useDocumentMeta(product ? product.name : "", product ? tr(product.subtitle) : undefined);

  if (!product) return <Navigate to="/#catalog" replace />;

  const line = productLines.find((l) => l.id === product.line);
  const related = products.filter((p) => p.line === product.line && p.id !== product.id);

  return (
    <div style={{ backgroundColor: "var(--mito-ink)" }}>
      <section
        className="relative overflow-hidden pt-32 lg:pt-40"
        style={{ background: "linear-gradient(180deg, var(--mito-black), var(--mito-ink))" }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(201,162,75,0.22), transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
          <Link
            to="/#catalog"
            className="focus-ring mb-10 inline-flex items-center gap-2 text-[0.76rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--mito-gold-soft)" }}
          >
            <ArrowLeft size={15} /> {t("catalog.back")}
          </Link>

          <div className="grid grid-cols-1 items-center gap-12 pb-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative flex justify-center"
            >
              <img
                src={product.image}
                alt={`${product.name} — ${tr(product.subtitle)}`}
                className="max-h-[440px] w-auto max-w-[80%] object-contain drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-[0.72rem] uppercase tracking-[0.26em]" style={{ color: "var(--mito-gold)" }}>
                  {line ? tr(line.name) : ""}
                </span>
                {product.badge && (
                  <span
                    className="rounded-full px-3 py-0.5 text-[0.62rem] uppercase tracking-[0.2em]"
                    style={{ border: "1px solid rgba(201,162,75,0.4)", color: "var(--mito-gold-soft)" }}
                  >
                    {tr(product.badge)}
                  </span>
                )}
              </div>
              <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                {product.name}
              </h1>
              <p
                className="mt-3 text-[1.25rem]"
                style={{ color: "var(--mito-gold-soft)", fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                {tr(product.tagline)}
              </p>
              <p
                className="mt-6 max-w-lg text-[1.05rem] leading-relaxed"
                style={{ color: "rgba(246,243,236,0.65)", fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                {tr(product.description)}
              </p>

              <Link
                to="/#contact"
                className="focus-ring mt-9 inline-flex items-center rounded-full px-8 py-3.5 text-[0.8rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
              >
                {t("catalog.consult")}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <h2 className="text-[1.4rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
            {t("catalog.highlights")}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {product.highlights.map((h) => (
              <li
                key={h.en}
                className="flex items-start gap-3 rounded-2xl p-6"
                style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={{ border: "1px solid rgba(201,162,75,0.4)" }}
                >
                  <Check size={13} style={{ color: "var(--mito-gold-soft)" }} />
                </span>
                <span className="text-[0.98rem]" style={{ color: "rgba(246,243,236,0.8)" }}>{tr(h)}</span>
              </li>
            ))}
          </ul>

          {related.length > 0 && (
            <>
              <h2 className="mb-8 mt-20 text-[1.4rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                {t("catalog.related")}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group focus-ring flex flex-col overflow-hidden rounded-2xl"
                    style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
                  >
                    <div
                      className="flex h-52 items-center justify-center"
                      style={{ background: "radial-gradient(120% 100% at 50% 0%, rgba(201,162,75,0.12), transparent 70%)" }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="max-h-[75%] w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-[1.2rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>{p.name}</h3>
                      <p className="mt-1 text-[0.85rem]" style={{ color: "rgba(246,243,236,0.5)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
                        {tr(p.subtitle)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
