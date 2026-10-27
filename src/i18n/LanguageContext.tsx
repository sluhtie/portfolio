import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { translations, type Dictionary, type Locale } from "./translations";
import { pathFor, type PageId } from "../lib/route";
import { applyHead, headFor } from "../lib/seo";

type LanguageContextValue = {
  locale: Locale;
  /** the page being shown (fixed for the lifetime of the document) */
  page: PageId;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: Dictionary;
  /** pick the right side of a {en, de} object */
  tx: (pair: { en: string; de: string }) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LOCALE_STORAGE_KEY = "portfolio-locale";

/**
 * The language comes from the URL (/ = German, /en = English), so crawlers and
 * shared links always get the same content. Switching swaps the URL in place
 * without a reload and remembers the choice for the next visit.
 */
export function LanguageProvider({
  initialLocale,
  page,
  children,
}: {
  initialLocale: Locale;
  page: PageId;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const first = useRef(true);

  useEffect(() => {
    // The prerendered HTML already carries the right <head>; only touch it on
    // a real switch (or in dev, where nothing was prerendered).
    if (first.current) {
      first.current = false;
      if (!import.meta.env.DEV) return;
    }
    applyHead(headFor({ page, locale }));
    const path = pathFor(page, locale);
    if (page !== "notFound" && window.location.pathname !== path) {
      window.history.replaceState(null, "", path + window.location.hash);
    }
  }, [locale, page]);

  const setLocale = (l: Locale) => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* storage blocked — the URL still carries the language */
    }
    setLocaleState(l);
  };
  const toggle = () => setLocale(locale === "en" ? "de" : "en");

  const value: LanguageContextValue = {
    locale,
    page,
    setLocale,
    toggle,
    t: translations[locale],
    tx: (pair) => pair[locale],
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
