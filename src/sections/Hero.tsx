import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
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
        initial={{ y: "110%" }}
        animate={{ y: ready ? "0%" : "110%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const { t, tx } = useLang();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
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

      {/* top meta row */}
      <motion.div
        className="container-x absolute inset-x-0 top-24 flex items-center justify-between text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <span className="flex items-center gap-2 text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {tx(profile.available)}
        </span>
        <span className="hidden text-muted sm:block">{t.hero.basedIn}</span>
      </motion.div>

      {/* headline + footer content */}
      <div className="container-x relative z-10 pb-14 md:pb-20">
        <motion.span
          className="eyebrow mb-6 block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t.hero.eyebrow}
        </motion.span>

        <h1 className="font-display text-[clamp(2.8rem,11vw,11rem)] font-semibold leading-[0.92]">
          <MaskedLine ready={ready} delay={0.45}>
            {t.hero.lineOne}
          </MaskedLine>
          <MaskedLine ready={ready} delay={0.55} className="gradient-text">
            {t.hero.lineTwo}
          </MaskedLine>
          <MaskedLine ready={ready} delay={0.65}>
            <span className="inline-flex items-baseline gap-3">
              {t.hero.lineThree}
              <span className="font-serif text-accent text-[0.4em] italic">®</span>
            </span>
          </MaskedLine>
        </h1>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <motion.p
            className="max-w-md text-balance text-base text-muted md:text-lg"
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
            className="group relative hidden h-28 w-28 shrink-0 items-center justify-center md:flex"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.6 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
            aria-label={t.hero.scroll}
          >
            <svg
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
      </div>
    </section>
  );
}
