import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { getLegalDoc } from "../i18n/legal";
import { legalHref, pathFor, type LegalPageId } from "../lib/route";
import { LanguageToggle } from "../components/LanguageToggle";
import { Cursor } from "../components/Cursor";
import { Footer } from "../sections/Footer";
import { EASE } from "../lib/motion";

/**
 * Impressum / Datenschutz. Deliberately quiet: no WebGL world or preloader,
 * just the brand glows as a static CSS backdrop so the text stays the focus.
 */
export function LegalPage({ page }: { page: LegalPageId }) {
  const { t, locale } = useLang();
  const doc = getLegalDoc(page, locale);
  const other: LegalPageId = page === "imprint" ? "privacy" : "imprint";

  const home = pathFor("home", locale);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
        <article className="container-x pb-24 pt-16 md:pb-32 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <a
              href={home}
              data-cursor
              className="link-underline font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              <span className="text-accent">←</span> {t.legal.back}
            </a>
            <span className="eyebrow mt-12 block">{doc.eyebrow}</span>
            <h1 className="mt-4 text-[clamp(3rem,10vw,8rem)] uppercase">
              <span className="gradient-text">{doc.title}</span>
            </h1>
            {doc.intro && <div className="mt-6 max-w-2xl">{doc.intro}</div>}
          </motion.div>

          <div className="legal-body mt-16 max-w-3xl md:mt-20">
            {doc.sections.map((s) => (
              <section key={s.title} className="legal-section">
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>

          <div className="mt-20 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted">
            <span>
              {profile.name} · {profile.brand}
            </span>
            <a
              href={legalHref(other, locale)}
              data-cursor
              className="link-underline flex items-center gap-2 text-ink"
            >
              {other === "imprint" ? t.footer.imprint : t.footer.privacy}
              <span className="text-accent">→</span>
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
