import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { testimonials } from "../i18n/content";
import { Reveal } from "../components/Reveal";
import { EASE } from "../lib/motion";

export function Testimonials() {
  const { t, tx } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  const current = testimonials[index];

  return (
    <section id="testimonials" className="container-x py-24 md:py-36">
      <Reveal>
        <span className="eyebrow">{t.testimonials.eyebrow}</span>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-2">
          <span className="font-serif text-[7rem] leading-none text-accent">“</span>
        </div>

        <div className="md:col-span-10">
          <div className="relative min-h-[220px] md:min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <p className="font-display text-[clamp(1.4rem,3vw,2.6rem)] font-medium leading-[1.2] text-balance">
                  {tx(current.quote)}
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="text-base font-medium text-ink">
                    {current.author}
                  </span>
                  <span className="h-px w-8 bg-line" />
                  <span className="text-sm text-muted">{tx(current.company)}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-10 flex items-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                data-cursor
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 36 : 12,
                  background: i === index ? "var(--color-accent)" : "var(--color-line)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
