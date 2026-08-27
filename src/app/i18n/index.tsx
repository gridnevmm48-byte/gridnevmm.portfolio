import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, type Dict } from "./en";
import { ru } from "./ru";
import { withCopyTypography } from "./typography";

export type Lang = "en" | "ru";
export type { Dict };

// Typography is baked in once per language rather than at each render: the copy
// is static, so there is nothing to recompute when the language stays put.
const DICTS: Record<Lang, Dict> = {
  en: withCopyTypography(en, "en"),
  ru: withCopyTypography(ru, "ru"),
};
const STORAGE_KEY = "lang";

/** The reader's saved choice, otherwise English — the browser's language is
 *  deliberately ignored, so a first visit always lands on the English copy. */
function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "ru" ? saved : "en";
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: DICTS[lang] }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Shorthand for components that only need the copy. */
export function useT(): Dict {
  return useContext(LangContext).t;
}
