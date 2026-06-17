import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { LanguageToggle } from "./LanguageToggle";
import { Magnetic } from "./Magnetic";
import { scrollTo, startScroll, stopScroll } from "../lib/scroll";
import { EASE } from "../lib/motion";

export function Navbar({ ready }: { ready: boolean }) {
  const { t, tx } = useLang();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    if (menuOpen) return;
    if (latest > prev && latest > 300) setHidden(true);
    else setHidden(false);
  });

  const links = [
    { id: "work", label: t.nav.work },
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ];

  const go = (id: string) => {
    setMenuOpen(false);
    startScroll();
    // wait a tick so the menu overlay starts closing first
    window.setTimeout(() => scrollTo(`#${id}`, { offset: -20 }), 50);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open;
      if (next) stopScroll();
      else startScroll();
      return next;
    });
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -120 }}
        animate={{ y: ready ? (hidden ? -120 : 0) : -120 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className={`transition-colors duration-500 ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <nav className="container-x flex items-center justify-between py-4">
            {/* Brand */}
            <button
              data-cursor
              onClick={() => scrollTo(0)}
              className="font-display text-lg font-semibold tracking-tight"
            >
              {profile.brand}
              <span className="text-accent">.</span>
            </button>

            {/* Center links (desktop) */}
            <ul className="hidden items-center gap-9 md:flex">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    data-cursor
                    onClick={() => go(l.id)}
                    className="link-underline text-sm text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Magnetic className="hidden sm:inline-flex" strength={0.4}>
                <button
                  data-cursor
                  onClick={() => go("contact")}
                  className="btn-primary !py-2.5 !px-5 text-sm"
                >
                  {t.nav.cta}
                </button>
              </Magnetic>

              {/* Mobile burger */}
              <button
                data-cursor
                onClick={toggleMenu}
                aria-label="Menu"
                className="relative ml-1 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
              >
                <motion.span
                  className="block h-[1.5px] w-6 bg-ink"
                  animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="block h-[1.5px] w-6 bg-ink"
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="block h-[1.5px] w-6 bg-ink"
                  animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg-soft px-8 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
                >
                  <button
                    onClick={() => go(l.id)}
                    className="font-display text-5xl font-medium"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-12 flex flex-col gap-1 text-sm text-muted">
              <a href={`mailto:${profile.email}`} className="link-underline w-fit">
                {profile.email}
              </a>
              <span>{tx(profile.location)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
