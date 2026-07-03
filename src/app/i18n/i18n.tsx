import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, type DictKey } from "./dictionary";

export type Lang = "en" | "ru" | "he";

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "he", label: "עברית", short: "HE" },
];

/** A string available in every supported language. */
export type Localized = Record<Lang, string>;

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  /** Translate a UI dictionary key. */
  t: (key: DictKey) => string;
  /** Resolve a localized data field. */
  tr: (value: Localized) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "mitoderm-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    return saved && LANGS.some((l) => l.code === saved) ? saved : "en";
  });

  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: DictKey) => dictionary[key]?.[lang] ?? dictionary[key]?.en ?? key, [lang]);
  const tr = useCallback((value: Localized) => value?.[lang] ?? value?.en ?? "", [lang]);

  const ctx = useMemo<Ctx>(() => ({ lang, dir, setLang, t, tr }), [lang, dir, setLang, t, tr]);

  return <LanguageContext.Provider value={ctx}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
