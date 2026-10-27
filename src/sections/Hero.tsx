import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { SplitChars } from "../components/KineticText";
import { Magnetic } from "../components/Magnetic";
import { EASE } from "../lib/motion";
import { scrollTo } from "../lib/scroll";

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  // As the hero scrolls away, the three lines drift apart and dissolve.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(10px)"]);

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 18 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* top meta row */}
      <div className="container-x relative z-10 flex items-start justify-between pt-28 text-xs text-muted sm:text-sm md:pt-32">
        {/* The page's h1: who, what, where. The big statement below is visual. */}
        <motion.h1 {...fadeIn(0.5)} className="flex flex-col gap-1 font-sans text-xs font-normal leading-[1.6] tracking-normal sm:text-sm">
          <span className="eyebrow !text-ink/80">{t.hero.eyebrow}</span>
          <span>{t.hero.basedIn}</span>
        </motion.h1>
        <motion.div {...fadeIn(0.6)} className="hidden flex-col items-end gap-1 text-right sm:flex">
          <span className="font-mono text-[0.7rem] tracking-widest text-ink/70">53.5511° N · 9.9937° E</span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t.hero.available}
          </span>
        </motion.div>
      </div>

      {/* headline */}
      <motion.div
        style={{ opacity: fade, y: lift, filter: blur }}
        className="container-x relative z-10 flex flex-1 flex-col justify-center py-10"
      >
        <p className="hero-title font-display font-semibold uppercase leading-[0.86] tracking-[-0.035em]">
          <motion.span style={{ x: xLeft }} className="block">
            <SplitChars text={t.hero.lineOne} show={ready} delay={0.25} />
          </motion.span>
          <motion.span style={{ x: xRight }} className="hero-line-2 block">
            <span className="reveal-line">
              <motion.span
                className="gradient-text-anim inline-block pr-[0.08em] font-serif font-normal normal-case italic tracking-[-0.02em]"
                initial={{ y: "120%", rotate: 4 }}
                animate={ready ? { y: "0%", rotate: 0 } : { y: "120%", rotate: 4 }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.45 }}
              >
                {t.hero.lineTwo}
              </motion.span>
            </span>
          </motion.span>
          <motion.span style={{ x: xLeft }} className="hero-line-3 block">
            <SplitChars text={t.hero.lineThree} show={ready} delay={0.55} />
          </motion.span>
        </p>
      </motion.div>

      {/* bottom row */}
      <div className="container-x relative z-10 flex items-end justify-between gap-8 pb-10 md:pb-12">
        <motion.p
          {...fadeIn(1)}
          className="max-w-[30rem] text-balance text-sm leading-relaxed text-ink/70 sm:text-base"
        >
          {t.hero.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.6 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
          className="shrink-0"
        >
          <Magnetic strength={0.35}>
            <button
              data-cursor
              onClick={() => scrollTo("#about", { offset: -20 })}
              className="hero-scroll group relative flex h-24 w-24 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:h-28 md:w-28"
              aria-label={t.hero.scroll}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] text-ink/60"
              >
                <defs>
                  <path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="7.4" letterSpacing="3.2" fill="currentColor">
                  <textPath href="#circlePath">{`${t.hero.scroll} • ${profile.brand} • `}</textPath>
                </text>
              </svg>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-500 group-hover:scale-110">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" className="animate-[bob_2.2s_ease-in-out_infinite]">
                  <path d="M12 5v14M12 19l6-6M12 19l-6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
