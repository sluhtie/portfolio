import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { services } from "../i18n/content";
import { Reveal } from "../components/Reveal";
import { EASE } from "../lib/motion";

export function Services() {
  const { t, tx } = useLang();
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="services" className="container-x py-24 md:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <span className="eyebrow">{t.services.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold">
              {t.services.heading}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-balance text-muted">{t.services.subheading}</p>
        </Reveal>
      </div>

      <div className="mt-14 border-t border-line">
        {services.map((s, i) => {
          const isActive = active === i;
          return (
            <div
              key={s.num}
              className="border-b border-line"
              onMouseEnter={() => setActive(i)}
            >
              <button
                data-cursor
                onClick={() => setActive(isActive ? null : i)}
                className="group flex w-full items-center gap-5 py-7 text-left md:gap-10 md:py-9"
              >
                <span className="font-display text-sm text-muted md:text-base">
                  {s.num}
                </span>
                <h3
                  className="flex-1 font-display text-[clamp(1.7rem,4.2vw,3.2rem)] font-medium transition-colors duration-300"
                  style={{ color: isActive ? "var(--color-accent)" : "var(--color-ink)" }}
                >
                  {tx(s.title)}
                </h3>
                <motion.span
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="text-2xl text-muted"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 items-start gap-6 pb-9 md:grid-cols-12 md:pl-[calc(2.5rem+1.5rem)]">
                      <p className="text-balance text-muted md:col-span-7 md:text-lg">
                        {tx(s.body)}
                      </p>
                      <ul className="flex flex-wrap gap-2 md:col-span-5 md:justify-end">
                        {s.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-line px-4 py-2 text-sm text-muted"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
