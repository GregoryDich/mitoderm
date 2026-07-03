import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLang, LANGS } from "../i18n/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.74rem] uppercase tracking-[0.16em] transition-colors"
        style={{ border: "1px solid rgba(201,162,75,0.35)", color: "var(--mito-gold-soft)" }}
        aria-label="Change language"
      >
        <Globe size={15} />
        {current.short}
      </button>

      {open && (
        <div
          className="absolute end-0 mt-2 min-w-[150px] overflow-hidden rounded-xl py-1"
          style={{ backgroundColor: "rgba(20,20,24,0.97)", border: "1px solid rgba(201,162,75,0.2)", backdropFilter: "blur(12px)" }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-[0.85rem] transition-colors hover:bg-white/5"
              style={{ color: l.code === lang ? "var(--mito-gold-soft)" : "rgba(246,243,236,0.75)" }}
            >
              {l.label}
              {l.code === lang && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
