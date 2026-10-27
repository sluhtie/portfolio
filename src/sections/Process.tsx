import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { processSteps } from "../i18n/content";
import { Reveal, RevealLines } from "../components/Reveal";
import { EASE } from "../lib/motion";

export function Process() {
  const { t, tx } = useLang();
  const listRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.6", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // the step crossing the reading line becomes active
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="container-x relative z-10 py-16 md:py-28 lg:py-40">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
        {/* sticky heading + giant step counter */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <div className="flex items-center gap-4">
              <Reveal>
                <span className="eyebrow">{t.process.eyebrow}</span>
              </Reveal>
              <span className="eyebrow">04</span>
            </div>
            <h2 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.035em]">
              <RevealLines lines={[t.process.heading]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xs text-balance text-muted">{t.process.subheading}</p>
            </Reveal>

            <div aria-hidden="true" className="relative mt-12 hidden h-[clamp(8rem,16vw,14rem)] overflow-hidden md:block">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  className="outline-text absolute left-0 top-0 font-display text-[clamp(8rem,16vw,14rem)] font-semibold leading-none"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {processSteps[active]?.num}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* steps with a progress rail */}
        <div ref={listRef} className="relative md:col-span-7">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[0.6rem] w-px bg-line md:left-[0.85rem]">
            <motion.div
              style={{ scaleY: line }}
              className="h-full w-full origin-top bg-gradient-to-b from-violet via-accent to-teal"
            />
          </div>

          {processSteps.map((step, i) => {
            const on = i <= active;
            return (
              <div
                key={step.num}
                ref={(el) => (stepRefs.current[i] = el)}
                data-index={i}
                className="relative pb-10 pl-12 last:pb-0 md:pb-16 md:pl-16 lg:pb-24"
              >
                <span
                  aria-hidden="true"
                  className={`process-node absolute top-2 left-0 h-[1.25rem] w-[1.25rem] rounded-full border md:h-[1.75rem] md:w-[1.75rem] ${
                    on ? "is-on" : ""
                  }`}
                />
                <Reveal>
                  <span className={`font-mono text-xs tracking-widest transition-colors duration-500 ${on ? "text-accent" : "text-muted"}`}>
                    {step.num}
                  </span>
                  <h3
                    className={`mt-3 font-display text-[clamp(1.9rem,3.4vw,3rem)] font-medium leading-[1.05] transition-colors duration-500 ${
                      i === active ? "text-ink" : "text-ink/45"
                    }`}
                  >
                    {tx(step.title)}
                  </h3>
                  <p className="mt-4 max-w-lg text-balance text-muted md:text-lg">{tx(step.body)}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
