import { motion } from "motion/react";
import { Quote, ShieldCheck, FlaskConical, Sparkles, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLang, type Localized } from "../i18n/i18n";
import { specialists } from "../data/specialists";

const L = (en: string, ru: string, he: string): Localized => ({ en, ru, he });

const before =
  "https://images.unsplash.com/photo-1609120144474-85e0a930d74d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700";
const after =
  "https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700";

const testimonials: { quote: Localized; specialistId: string }[] = [
  {
    specialistId: "elena-vasquez",
    quote: L(
      "The V Tech System has become the backbone of my anti-aging menu. My clients see the difference within weeks.",
      "V Tech System стала основой моего антивозрастного меню. Клиенты видят разницу уже через несколько недель.",
      "מערכת V Tech הפכה לעמוד השדרה של תפריט האנטי-אייג'ינג שלי. הלקוחות רואים את ההבדל תוך שבועות."
    ),
  },
  {
    specialistId: "yael-cohen",
    quote: L(
      "Exonad gave me a longevity story clients truly connect with. Retention has never been higher.",
      "Exonad дал мне историю долголетия, которая по-настоящему откликается у клиентов. Удержание — на рекордном уровне.",
      "Exonad נתן לי סיפור אריכות ימים שהלקוחות מתחברים אליו באמת. שימור הלקוחות מעולם לא היה גבוה יותר."
    ),
  },
  {
    specialistId: "marco-bellini",
    quote: L(
      "With the Exosignal line and Mitopen, my hair-restoration results speak for themselves.",
      "С линейкой Exosignal и Mitopen мои результаты по восстановлению волос говорят сами за себя.",
      "עם קו Exosignal ו-Mitopen, תוצאות שיקום השיער שלי מדברות בעד עצמן."
    ),
  },
];

const certs: { icon: typeof ShieldCheck; label: Localized }[] = [
  { icon: FlaskConical, label: L("Clinical-grade formulas", "Клинические формулы", "פורמולות ברמה קלינית") },
  { icon: ShieldCheck, label: L("Sterile & single-dose", "Стерильно, одноразово", "סטרילי ומנה בודדת") },
  { icon: Award, label: L("Professional-only", "Только для профи", "לאנשי מקצוע בלבד") },
  { icon: Sparkles, label: L("Cruelty-free", "Без тестов на животных", "ללא ניסויים בבע\"ח") },
];

export function Trust() {
  const { t, tr } = useLang();

  return (
    <section className="py-28 lg:py-36" style={{ backgroundColor: "var(--mito-black)" }}>
      <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="text-[0.74rem] uppercase tracking-[0.3em]" style={{ color: "var(--mito-gold)" }}>
            {t("trust.kicker")}
          </span>
          <h2
            className="mt-6 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.1]"
            style={{ color: "var(--mito-cream)", fontWeight: 400 }}
          >
            {t("trust.title")}
          </h2>
        </div>

        {/* Before / After */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2"
        >
          <div>
            <h3 className="text-[1.6rem]" style={{ color: "var(--mito-cream)", fontWeight: 500 }}>
              {t("trust.results.title")}
            </h3>
            <p
              className="mt-4 max-w-md text-[1rem] leading-relaxed"
              style={{ color: "rgba(246,243,236,0.6)", fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              {t("trust.results.body")}
            </p>
            <p className="mt-6 text-[0.78rem]" style={{ color: "rgba(246,243,236,0.4)" }}>
              {t("trust.disclaimer")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { src: before, label: t("trust.before"), grayscale: true },
              { src: after, label: t("trust.after"), grayscale: false },
            ].map((im) => (
              <div
                key={im.label}
                className="relative overflow-hidden rounded-2xl"
                style={{ border: "1px solid rgba(201,162,75,0.16)" }}
              >
                <ImageWithFallback
                  src={im.src}
                  alt={im.label}
                  loading="lazy"
                  className="h-72 w-full object-cover"
                  style={im.grayscale ? { filter: "grayscale(1) brightness(0.9)" } : undefined}
                />
                <span
                  className="absolute bottom-3 start-3 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ backgroundColor: "rgba(10,10,11,0.65)", color: "var(--mito-gold-soft)", backdropFilter: "blur(6px)" }}
                >
                  {im.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <h3 className="mb-8 mt-24 text-center text-[1.6rem]" style={{ color: "var(--mito-cream)", fontWeight: 400 }}>
          {t("trust.testimonials.title")}
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((tst, i) => {
            const s = specialists.find((x) => x.id === tst.specialistId)!;
            return (
              <motion.div
                key={tst.specialistId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col rounded-2xl p-8"
                style={{ backgroundColor: "var(--mito-charcoal)", border: "1px solid rgba(201,162,75,0.14)" }}
              >
                <Quote size={26} style={{ color: "var(--mito-gold)" }} />
                <p
                  className="mt-4 flex-1 text-[1.02rem] leading-relaxed"
                  style={{ color: "rgba(246,243,236,0.8)", fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  “{tr(tst.quote)}”
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <ImageWithFallback
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[0.95rem]" style={{ color: "var(--mito-cream)" }}>{s.name}</div>
                    <div className="text-[0.78rem]" style={{ color: "var(--mito-gold-soft)" }}>{s.clinic}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <h3 className="mb-8 mt-24 text-center text-[1.6rem]" style={{ color: "var(--mito-cream)", fontWeight: 400 }}>
          {t("trust.certs.title")}
        </h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {certs.map((c) => (
            <div
              key={c.label.en}
              className="flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center"
              style={{ border: "1px solid rgba(201,162,75,0.16)" }}
            >
              <c.icon size={26} style={{ color: "var(--mito-gold-soft)" }} />
              <span className="text-[0.9rem]" style={{ color: "rgba(246,243,236,0.75)" }}>{tr(c.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
