import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { EASE, EASE_INOUT } from "../lib/motion";

/**
 * The "CW" monogram from the business card fills with the brand glow while
 * the counter runs, then the curtain splits open onto the WebGL world.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const { t } = useLang();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const duration = 2200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 350);
      }
    };
    raf = requestAnimationFrame(tick);

    // Failsafe: never stay on the loader if rAF is throttled (background tab,
    // slow device). Timers fire regardless of the animation frame loop.
    const failsafe = window.setTimeout(() => {
      setCount(100);
      setDone(true);
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, []);

  // Reveal the page as soon as we're done — the curtain lift is pure polish on
  // top, so the critical hand-off never depends on the exit animation finishing.
  useEffect(() => {
    if (done && !firedRef.current) {
      firedRef.current = true;
      onComplete();
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[100]" exit={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          {/* split curtain */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-bg"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.1, ease: EASE_INOUT, delay: 0.1 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-bg"
            exit={{ y: "100%" }}
            transition={{ duration: 1.1, ease: EASE_INOUT, delay: 0.1 }}
          />

          <motion.div
            className="absolute inset-0 flex flex-col justify-between"
            exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* top row */}
            <div className="container-x flex items-center justify-between pt-8">
              <motion.span
                className="font-display text-lg font-semibold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {profile.brand}
                <span className="text-accent">.</span>
              </motion.span>
              <motion.span
                className="eyebrow hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {t.preloader.tagline}
              </motion.span>
            </div>

            {/* monogram */}
            <div className="relative flex flex-1 items-center justify-center">
              <div aria-hidden="true" className="loader-glow absolute h-[60vmin] w-[60vmin]" />
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 400 400"
                className="relative h-[52vmin] w-[52vmin]"
                initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE }}
              >
                <defs>
                  <linearGradient id="loader-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7c5cff" />
                    <stop offset="0.55" stopColor="#ccff00" />
                    <stop offset="1" stopColor="#00e0c6" />
                  </linearGradient>
                  <clipPath id="loader-fill">
                    <rect x="0" y={400 - count * 4} width="400" height="400" />
                  </clipPath>
                </defs>
                <motion.path
                  d="M200 32 C 320 32, 368 80, 368 200 C 368 320, 320 368, 200 368 C 80 368, 32 320, 32 200 C 32 80, 80 32, 200 32 Z"
                  fill="none"
                  stroke="rgba(236,235,228,0.22)"
                  strokeWidth="1.2"
                  transform="rotate(39 200 200)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: EASE_INOUT }}
                />
                <text
                  x="200"
                  y="236"
                  textAnchor="middle"
                  fontFamily="Clash Display, sans-serif"
                  fontWeight="700"
                  fontSize="128"
                  fill="none"
                  stroke="rgba(236,235,228,0.28)"
                  strokeWidth="1.2"
                >
                  CW
                </text>
                <text
                  x="200"
                  y="236"
                  textAnchor="middle"
                  fontFamily="Clash Display, sans-serif"
                  fontWeight="700"
                  fontSize="128"
                  fill="url(#loader-g)"
                  clipPath="url(#loader-fill)"
                >
                  CW
                </text>
              </motion.svg>
            </div>

            {/* bottom row */}
            <div className="container-x pb-8">
              <div className="mb-4 h-px w-full overflow-hidden bg-line">
                <div
                  className="h-full origin-left bg-gradient-to-r from-violet via-accent to-teal"
                  style={{ transform: `scaleX(${count / 100})` }}
                />
              </div>
              <div className="flex items-end justify-between">
                <span className="eyebrow">{profile.name} — Portfolio ©{new Date().getFullYear()}</span>
                <span className="font-display text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tabular-nums">
                  {count}
                  <span className="text-accent">%</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
