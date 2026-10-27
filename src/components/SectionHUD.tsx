import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { useClock } from "../lib/hooks";
import { EASE } from "../lib/motion";

/** Fixed corner HUD: current chapter on the left, Hamburg time + scroll % on the right. */
export function SectionHUD({ ready }: { ready: boolean }) {
  const { t } = useLang();
  const time = useClock(profile.timezone);
  const { scrollYProgress, scrollY } = useScroll();
  const [pct, setPct] = useState(0);
  const [show, setShow] = useState(false);
  const [section, setSection] = useState("top");

  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > window.innerHeight * 0.6));

  const chapters: { id: string; label: string }[] = [
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "work", label: t.nav.work },
    { id: "process", label: t.process.heading },
    { id: "contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    ["top", "about", "services", "work", "process", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const idx = chapters.findIndex((c) => c.id === section);
  const current = chapters[idx];

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 hidden font-mono text-[0.62rem] uppercase tracking-[0.22em] text-ink/55 lg:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready && show && section !== "work" ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* sits in the side gutters so it never covers content */}
      <div className="hud-side hud-left flex items-center gap-3 overflow-hidden">
        <span className="text-accent">{idx >= 0 ? `0${idx + 1}` : "00"}</span>
        <span className="h-8 w-px bg-ink/30" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current?.id ?? "top"}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {current?.label ?? profile.brand}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="hud-side hud-right flex items-center gap-5 tabular-nums">
        <span>HH {time}</span>
        <span className="h-8 w-px bg-ink/30" />
        <span>{String(pct).padStart(2, "0")}%</span>
      </div>
    </motion.div>
  );
}
