import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { EASE } from "../lib/motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const { t } = useLang();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const duration = 2100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 300);
      }
    };
    raf = requestAnimationFrame(tick);

    // Failsafe: never stay on the loader if rAF is throttled (background tab,
    // slow device). Timers fire regardless of the animation frame loop.
    const failsafe = window.setTimeout(() => {
      setCount(100);
      setDone(true);
    }, 2800);

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
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {/* top brand */}
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
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t.preloader.tagline}
            </motion.span>
          </div>

          {/* center wordmark */}
          <div className="container-x flex flex-1 items-center">
            <h1 className="reveal-line text-[clamp(3rem,12vw,11rem)] font-semibold leading-none">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              >
                <span className="gradient-text">{profile.name}</span>
              </motion.span>
            </h1>
          </div>

          {/* counter + progress */}
          <div className="container-x pb-8">
            <div className="mb-4 h-px w-full overflow-hidden bg-line">
              <motion.div
                className="h-full"
                style={{
                  background: "var(--color-accent)",
                  transformOrigin: "left",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: count / 100 }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
            <div className="flex items-end justify-between">
              <span className="eyebrow">Loading experience</span>
              <span className="font-display text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none tabular-nums">
                {count}
                <span className="text-accent">%</span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
