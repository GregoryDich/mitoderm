import { Link } from "react-router";
import { Logo } from "./Logo";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";
import { productLines } from "../data/products";

type FooterLink = { key: DictKey; to: string };

export function Footer() {
  const { t, tr } = useLang();

  const groups: { title: DictKey; links: { label: string; to: string }[] }[] = [
    {
      title: "footer.lines",
      links: productLines
        .filter((l) => !l.comingSoon)
        .map((l) => ({ label: tr(l.name), to: `/#line-${l.id}` })),
    },
    {
      title: "footer.explore",
      links: (
        [
          { key: "nav.specialists", to: "/specialists" },
          { key: "nav.journal", to: "/journal" },
          { key: "nav.events", to: "/events" },
          { key: "footer.science", to: "/#science" },
        ] as FooterLink[]
      ).map((l) => ({ label: t(l.key), to: l.to })),
    },
    {
      title: "footer.company",
      links: (
        [
          { key: "footer.philosophy", to: "/#philosophy" },
          { key: "nav.partner", to: "/#contact" },
          { key: "footer.contact", to: "/#contact" },
        ] as FooterLink[]
      ).map((l) => ({ label: t(l.key), to: l.to })),
    },
  ];

  return (
    <footer style={{ backgroundColor: "var(--mito-black)" }}>
      <div className="mx-auto max-w-[1300px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo height={64} />
            <p
              className="mt-6 max-w-xs text-[0.92rem] leading-relaxed"
              style={{ color: "rgba(246,243,236,0.5)", fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:border-[var(--mito-gold)]"
                  style={{ border: "1px solid rgba(246,243,236,0.18)", color: "rgba(246,243,236,0.7)" }}
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4
                className="text-[0.72rem] uppercase tracking-[0.24em]"
                style={{ color: "var(--mito-gold)", fontFamily: "var(--font-body)" }}
              >
                {t(g.title)}
              </h4>
              <ul className="mt-5 space-y-3">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer-link focus-ring text-[0.92rem]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
          style={{ borderTop: "1px solid rgba(246,243,236,0.1)" }}
        >
          <p className="text-[0.8rem]" style={{ color: "rgba(246,243,236,0.4)" }}>
            © {new Date().getFullYear()} Mitoderm Ltd. {t("footer.rights")}
          </p>
          <div className="flex gap-6">
            {(["footer.privacy", "footer.terms", "footer.cookies"] as DictKey[]).map((k) => (
              <a key={k} href="#" className="focus-ring text-[0.8rem]" style={{ color: "rgba(246,243,236,0.4)" }}>
                {t(k)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
