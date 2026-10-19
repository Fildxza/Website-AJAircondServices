import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, LANG_STORAGE_KEY, copy, isLang, type Copy, type Lang } from "@/content/copy";

type LanguageValue = { lang: Lang; setLang: (next: Lang) => void; t: Copy };

const LanguageContext = createContext<LanguageValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: copy[DEFAULT_LANG],
});

/**
 * Bahasa Melayu is the default (and what the server renders). A saved choice is read after the first
 * render so server and browser markup match; it is kept in localStorage only, as a single "ms"/"en"
 * value. The <html lang> attribute follows the selected language.
 */
export function LanguageProvider({
  children,
  initial = DEFAULT_LANG,
}: {
  children: ReactNode;
  initial?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      // Storage can be blocked (private mode, site data cleared): the default language is used.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy[lang].htmlLang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Not persisted; the choice still applies for this visit.
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: copy[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
export const useCopy = () => useContext(LanguageContext).t;
