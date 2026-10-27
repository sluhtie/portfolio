import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { services } from "../i18n/content";
import { Reveal, RevealLines } from "../components/Reveal";
import { ServiceGraphic } from "../components/ServiceGraphic";
import { useMediaQuery } from "../lib/hooks";
import { EASE } from "../lib/motion";

const ACCENTS = ["#7c5cff", "#00e0c6", "#ccff00", "#7c5cff"];

function ServiceCard({
  index,
  total,
  progress,
  stack,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  stack: boolean;
}) {
  const { tx } = useLang();
  const s = services[index];
  const accent = ACCENTS[index % ACCENTS.length];
  // Cards that have been stacked over shrink back and dim a little.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.045]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total + 0.15)], [0, (total - index - 1) * 0.18]);

  return (
    <div
      className={stack ? "sticky" : undefined}
      style={stack ? { top: `calc(6.5rem + ${index * 1.6}rem)` } : undefined}
    >
      <motion.article
        style={stack ? { scale } : undefined}
        className="service-card relative grid origin-top grid-cols-1 overflow-hidden rounded-[1.75rem] border border-line md:grid-cols-12"
      >
        <motion.div aria-hidden="true" style={{ opacity: stack ? dim : 0 }} className="pointer-events-none absolute inset-0 z-20 bg-bg" />
        <div className="relative z-10 flex flex-col p-7 sm:p-10 md:col-span-7 md:p-12">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest" style={{ color: accent }}>
              {s.num} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-12" style={{ background: accent }} />
          </div>
          <h3 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.8rem)] font-semibold leading-[1] tracking-[-0.02em]">
            {tx(s.title)}
          </h3>
          <p className="mt-6 max-w-lg text-balance text-ink/70 md:text-lg">{tx(s.body)}</p>
          <ul className="mt-auto flex flex-wrap gap-2 pt-8">
            {s.skills.map((skill) => (
              <li key={skill} className="rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm text-ink/70">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="service-art relative z-10 flex items-center justify-center border-t border-line p-6 md:col-span-5 md:border-t-0 md:border-l md:p-8">
          <div className="aspect-[4/3] w-full max-w-[26rem]">
            <ServiceGraphic index={index} />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/** Phones and tablets: a compact accordion instead of full-height cards. */
function ServiceAccordion() {
  const { tx } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i;
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <div key={s.num} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 py-5 text-left"
            >
              <span className="font-mono text-xs" style={{ color: accent }}>
                {s.num}
              </span>
              <h3
                className="flex-1 font-display text-[clamp(1.5rem,6vw,2.4rem)] font-semibold leading-tight transition-colors duration-300"
                style={{ color: isOpen ? accent : "var(--color-ink)" }}
              >
                {tx(s.title)}
              </h3>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-2xl text-muted"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-5 pb-7 sm:grid-cols-[1fr_14rem] sm:items-center">
                    <div>
                      <p className="text-balance text-ink/70">{tx(s.body)}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {s.skills.map((skill) => (
                          <li key={skill} className="rounded-full border border-line px-3 py-1.5 text-xs text-ink/70">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="service-art hidden aspect-[4/3] rounded-xl border border-line p-2 sm:block">
                      <ServiceGraphic index={i} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function Services() {
  const { t } = useLang();
  const stackRef = useRef<HTMLDivElement>(null);
  // Stack the cards only where a whole card fits on screen.
  const wide = useMediaQuery("(min-width: 1024px)");
  const stack = useMediaQuery("(min-width: 1024px) and (min-height: 700px)");
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section id="services" className="container-x relative z-10 py-16 md:py-24 lg:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-4">
            <Reveal>
              <span className="eyebrow">{t.services.eyebrow}</span>
            </Reveal>
            <span className="eyebrow">02</span>
          </div>
          <h2 className="mt-5 font-display text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.035em]">
            <RevealLines lines={[t.services.heading]} />
          </h2>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-balance text-muted">{t.services.subheading}</p>
        </Reveal>
      </div>

      {wide ? (
        <div ref={stackRef} className={`mt-20 flex flex-col gap-6 ${stack ? "gap-[12vh] pb-[6vh]" : ""}`}>
          {services.map((s, i) => (
            <ServiceCard key={s.num} index={i} total={services.length} progress={scrollYProgress} stack={stack} />
          ))}
        </div>
      ) : (
        <ServiceAccordion />
      )}
    </section>
  );
}
