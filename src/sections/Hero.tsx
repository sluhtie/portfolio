import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { AuroraBackground } from "../components/AuroraBackground";
import { EASE } from "../lib/motion";
import { scrollTo } from "../lib/scroll";

function MaskedLine({
  children,
  ready,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  ready: boolean;
  delay: number;
  className?: string;
}) {
  return (
    <span className="reveal-line">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "150%" }}
        animate={{ y: ready ? "0%" : "150%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t } = useLang();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <AuroraBackground intensity={1} />

      {/* darken toward the bottom for a clean transition + text contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,7,10,0.35) 0%, rgba(8,7,10,0.1) 40%, rgba(8,7,10,0.85) 85%, var(--color-bg) 100%)",
        }}
      />

      {/* One centered composition, with room for the fixed navigation. */}
      <div className="hero-content container-x relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          <span className="eyebrow">{t.hero.eyebrow}</span>
          <span className="text-xs text-muted sm:text-sm">{t.hero.basedIn}</span>
        </motion.div>

        <h1 className="hero-title w-full font-display font-semibold leading-[0.98]">
          <MaskedLine ready={ready} delay={0.45}>
            {t.hero.lineOne}
          </MaskedLine>
          <MaskedLine ready={ready} delay={0.55}>
            <span className="gradient-text">{t.hero.lineTwo}</span>
          </MaskedLine>
          <MaskedLine ready={ready} delay={0.65}>
            <span className="relative inline-block">
              {t.hero.lineThree}
              <span
                aria-hidden="true"
                className="absolute bottom-[0.2em] left-full ml-[0.15em] font-serif text-[0.25em] italic text-accent"
              >
                ®
              </span>
            </span>
          </MaskedLine>
        </h1>
        <motion.p
          className="max-w-[34rem] text-balance text-sm leading-relaxed text-muted sm:text-base lg:text-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          {t.hero.intro}
        </motion.p>

        {/* rotating scroll badge */}
        <motion.button
          data-cursor
          onClick={() => scrollTo("#about", { offset: -20 })}
          className="hero-scroll group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.6 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
          aria-label={t.hero.scroll}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] text-muted"
          >
            <defs>
              <path
                id="circlePath"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <text fontSize="8" letterSpacing="3.4" fill="currentColor">
              <textPath href="#circlePath">{`${t.hero.scroll} •`}</textPath>
            </text>
          </svg>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M12 19l6-6M12 19l-6-6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.button>
      </div>
    </section>
  );
}
