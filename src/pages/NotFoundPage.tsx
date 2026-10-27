import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { pathFor } from "../lib/route";
import { LanguageToggle } from "../components/LanguageToggle";
import { Cursor } from "../components/Cursor";
import { Footer } from "../sections/Footer";
import { EASE } from "../lib/motion";

/** 404 — same quiet shell as the legal pages. Served with a real 404 status. */
export function NotFoundPage() {
  const { t, locale } = useLang();
  const home = pathFor("home", locale);

  return (
    <div className="grain relative">
      <Cursor />
      <div aria-hidden="true" className="legal-glow" />

      <header className="relative z-20">
        <nav className="container-x flex items-center justify-between py-4">
          <a
            href={home}
            data-cursor
            className="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight"
          >
            <span aria-hidden="true" className="brand-orb" />
            {profile.brand}
            <span className="text-accent">.</span>
          </a>
          <LanguageToggle />
        </nav>
      </header>

      <main className="relative z-10">
        <section className="container-x flex min-h-[70svh] flex-col justify-center pb-24 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span className="eyebrow block">{t.notFound.eyebrow}</span>
            <h1 className="mt-4 text-[clamp(3rem,10vw,8rem)] uppercase">
              <span className="gradient-text">{t.notFound.title}</span>
            </h1>
            <p className="mt-6 max-w-xl text-muted">{t.notFound.body}</p>
            <a href={home} data-cursor className="btn-primary mt-10 inline-flex">
              {t.legal.back}
              <span>→</span>
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
