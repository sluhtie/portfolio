import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import type { Locale } from "../i18n/translations";
import { pathFor } from "../lib/route";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t, page } = useLang();
  const options: Locale[] = ["en", "de"];

  return (
    <div
      className={`relative flex items-center rounded-full border border-line p-1 ${className}`}
      role="group"
      aria-label={t.lang.label}
    >
      {options.map((l) => {
        const active = locale === l;
        return (
          // Real links so crawlers find both language versions; clicks swap in place.
          <a
            key={l}
            href={pathFor(page, l)}
            hrefLang={l}
            lang={l}
            data-cursor
            onClick={(e) => {
              e.preventDefault();
              setLocale(l);
            }}
            aria-current={active ? "true" : undefined}
            className="relative z-10 rounded-full px-3 py-1 text-[0.72rem] font-medium tracking-wider transition-colors duration-300"
            style={{ color: active ? "#08070a" : "var(--color-muted)" }}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "var(--color-accent)" }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
