import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, BadgeCheck, Phone } from "lucide-react";
import { getSpecialist } from "../data/specialists";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLang } from "../i18n/i18n";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export function SpecialistDetail() {
  const { id } = useParams();
  const { t, tr } = useLang();
  const s = getSpecialist(id ?? "");

  useDocumentMeta(s ? s.name : "", s ? `${s.clinic} — ${tr(s.city)}, ${tr(s.country)}` : undefined);

  if (!s) return <Navigate to="/specialists" replace />;

  return (
    <div style={{ backgroundColor: "var(--mito-ink)" }}>
      <section className="pt-32 lg:pt-40" style={{ backgroundColor: "var(--mito-black)" }}>
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Link
            to="/specialists"
            className="focus-ring mb-10 inline-flex items-center gap-2 text-[0.76rem] uppercase tracking-[0.2em]"
            style={{ color: "var(--mito-gold-soft)" }}
          >
            <ArrowLeft size={15} /> {t("spec.back")}
          </Link>

          <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl"
              style={{ border: "1px solid rgba(201,162,75,0.18)" }}
            >
              <ImageWithFallback src={s.image} alt={s.name} className="h-full max-h-[460px] w-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              {s.verified && (
                <span
                  className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ backgroundColor: "rgba(201,162,75,0.14)", color: "var(--mito-gold-soft)" }}
                >
                  <BadgeCheck size={13} /> {t("spec.certified")}
                </span>
              )}
              <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1.05]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
                {s.name}
              </h1>
              <p className="mt-2 text-[1.1rem]" style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}>
                {s.clinic}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[0.95rem]" style={{ color: "var(--mito-gold-soft)" }}>
                <MapPin size={15} /> {tr(s.city)}, {tr(s.country)}
              </div>

              <p
                className="mt-6 max-w-lg text-[1.02rem] leading-relaxed"
                style={{ color: "rgba(246,243,236,0.7)", fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                {tr(s.bio)}
              </p>

              <div className="mt-8">
                <div className="text-[0.7rem] uppercase tracking-[0.24em]" style={{ color: "var(--mito-gold)" }}>
                  {t("spec.specialties")}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.specialties.map((sp) => (
                    <span
                      key={sp}
                      className="rounded-full px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em]"
                      style={{ border: "1px solid rgba(201,162,75,0.3)", color: "rgba(246,243,236,0.7)" }}
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/#contact"
                className="focus-ring mt-9 inline-flex w-fit items-center gap-2 rounded-full px-8 py-3.5 text-[0.8rem] uppercase tracking-[0.2em] transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: "var(--mito-gold)", color: "#0a0a0b" }}
              >
                <Phone size={15} /> {t("spec.book")}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
