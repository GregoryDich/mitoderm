import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { products, productLines, type Product, type LineId } from "../data/products";
import { useLang } from "../i18n/i18n";

type Filter = "All" | LineId;

export function ProductCatalog() {
  const { t, tr } = useLang();
  const [active, setActive] = useState<Filter>("All");

  const visibleLines = useMemo(
    () => (active === "All" ? productLines : productLines.filter((l) => l.id === active)),
    [active]
  );

  return (
    <section id="catalog" className="py-28 lg:py-36" style={{ backgroundColor: "var(--mito-ink)" }}>
      <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="text-[0.74rem] uppercase tracking-[0.3em]" style={{ color: "var(--mito-gold)" }}>
              {t("catalog.kicker")}
            </span>
            <h2
              className="mt-5 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.08]"
              style={{ color: "var(--mito-cream)", fontWeight: 400 }}
            >
              {t("catalog.title")}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", ...productLines.map((l) => l.id)] as Filter[]).map((f) => {
              const on = f === active;
              const label = f === "All" ? t("catalog.all") : tr(productLines.find((l) => l.id === f)!.name);
              return (
                <button
                  key={f}
                  onClick={() => setActive(f)}
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
        </div>

        <div className="mt-16 space-y-20">
          {visibleLines.map((line) => {
            const items = products.filter((p) => p.line === line.id);
            return (
              <div key={line.id} id={`line-${line.id}`}>
                <div className="mb-8 flex flex-col gap-3 border-s-2 ps-6" style={{ borderColor: "var(--mito-gold)" }}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[1.8rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                      {tr(line.name)}
                    </h3>
                    <span className="text-[0.68rem] uppercase tracking-[0.24em]" style={{ color: "var(--mito-gold)" }}>
                      {tr(line.kicker)}
                    </span>
                    {line.comingSoon && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[0.6rem] uppercase tracking-[0.2em]"
                        style={{ backgroundColor: "rgba(201,162,75,0.14)", color: "var(--mito-gold-soft)" }}
                      >
                        <Sparkles size={11} /> {t("catalog.comingsoon")}
                      </span>
                    )}
                  </div>
                  <p
                    className="max-w-2xl text-[0.95rem] leading-relaxed"
                    style={{ color: "rgba(246,243,236,0.55)", fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {tr(line.description)}
                  </p>
                </div>

                {line.comingSoon ? (
                  <ComingSoonCard name={tr(line.name)} />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { t, tr } = useLang();
  return (
    <Link
      to={`/product/${product.id}`}
      className="group focus-ring relative flex flex-col overflow-hidden rounded-2xl text-start transition-colors"
      style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
    >
      <div
        className="relative flex h-60 items-center justify-center overflow-hidden"
        style={{ background: "radial-gradient(120% 100% at 50% 0%, rgba(201,162,75,0.12), transparent 70%)" }}
      >
        <img
          src={product.image}
          alt={`${product.name} — ${tr(product.subtitle)}`}
          loading="lazy"
          decoding="async"
          className="max-h-[78%] w-auto max-w-[72%] object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className="absolute start-4 top-4 rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em]"
            style={{ backgroundColor: "rgba(201,162,75,0.16)", color: "var(--mito-gold-soft)" }}
          >
            {tr(product.badge)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.4rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
          {product.name}
        </h3>
        <p
          className="mt-1 text-[0.88rem]"
          style={{ color: "rgba(246,243,236,0.5)", fontFamily: "var(--font-body)", fontWeight: 300 }}
        >
          {tr(product.subtitle)}
        </p>
        <div
          className="mt-5 flex items-center gap-2 text-[0.74rem] uppercase tracking-[0.18em]"
          style={{ color: "rgba(246,243,236,0.6)" }}
        >
          {t("catalog.viewdetails")}
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ComingSoonCard({ name }: { name: string }) {
  const { t } = useLang();
  return (
    <div
      className="flex flex-col items-start gap-4 rounded-2xl p-10"
      style={{
        border: "1px dashed rgba(201,162,75,0.35)",
        background: "radial-gradient(120% 100% at 0% 0%, rgba(201,162,75,0.08), transparent 70%)",
      }}
    >
      <Sparkles size={26} style={{ color: "var(--mito-gold-soft)" }} />
      <p className="text-[1.3rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
        {name} — {t("catalog.cs.dev")}
      </p>
      <p
        className="max-w-xl text-[0.95rem] leading-relaxed"
        style={{ color: "rgba(246,243,236,0.55)", fontFamily: "var(--font-body)", fontWeight: 300 }}
      >
        {t("catalog.cs.body")}
      </p>
      <Link
        to="/#contact"
        className="btn-outline-gold focus-ring mt-2 inline-flex items-center rounded-full px-6 py-2.5 text-[0.74rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
      >
        {t("catalog.notify")}
      </Link>
    </div>
  );
}
