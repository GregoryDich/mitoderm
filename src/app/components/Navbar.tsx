import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "../i18n/i18n";
import type { DictKey } from "../i18n/dictionary";

const links: { key: DictKey; to: string }[] = [
  { key: "nav.collection", to: "/#collection" },
  { key: "nav.catalog", to: "/#catalog" },
  { key: "nav.specialists", to: "/specialists" },
  { key: "nav.journal", to: "/journal" },
  { key: "nav.events", to: "/events" },
];

export function Navbar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Inner pages always need a readable bar; home is transparent until scrolled.
  const solid = scrolled || !isHome;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: solid ? "rgba(10,10,11,0.72)" : "transparent",
        backdropFilter: solid ? "blur(18px)" : "none",
        borderBottom: solid ? "1px solid rgba(201,162,75,0.18)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-[76px] items-center justify-between">
          <Link to="/" className="focus-ring"><Logo height={46} /></Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="nav-link text-[0.82rem] tracking-[0.18em] uppercase focus-ring"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <Link
              to="/#contact"
              className="btn-outline-gold inline-flex items-center rounded-full px-6 py-2.5 text-[0.78rem] tracking-[0.18em] uppercase focus-ring"
            >
              {t("nav.partner")}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <button
              style={{ color: "var(--mito-cream)" }}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="focus-ring"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden"
          style={{ backgroundColor: "rgba(10,10,11,0.96)", borderTop: "1px solid rgba(201,162,75,0.18)" }}
        >
          <div className="flex flex-col px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-[0.95rem] tracking-[0.14em] uppercase"
                style={{ color: "rgba(246,243,236,0.82)" }}
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
