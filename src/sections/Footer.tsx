import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { useClock } from "../lib/hooks";
import { scrollTo } from "../lib/scroll";
import { LanguageToggle } from "../components/LanguageToggle";
import { EASE } from "../lib/motion";
import { getLegalPage, legalHref } from "../lib/route";

export function Footer() {
  const { t, tx } = useLang();
  const time = useClock(profile.timezone);
  const year = new Date().getFullYear();
  // On the legal pages the sections don't exist, so links go back home instead.
  const onHome = getLegalPage() === null;
  const goTo = (target: string | 0) => {
    if (onHome) scrollTo(target, { offset: target === 0 ? 0 : -20 });
    else window.location.href = target === 0 ? "/" : `/${target}`;
  };

  const links = [
    { id: "work", label: t.nav.work },
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <footer className="footer relative z-10 overflow-hidden border-t border-line">
      <div className="container-x py-12 md:py-20">
        {/* big brand mark — letters rise in and react on hover */}
        <button
          data-cursor
          onClick={() => goTo(0)}
          aria-label={`${profile.brand} — ${t.footer.backToTop}`}
          className="footer-brand flex w-full justify-between font-display text-[clamp(3rem,14.5vw,15rem)] font-semibold leading-[0.9]"
          style={{ ["--n" as string]: profile.brand.length }}
        >
          {Array.from(profile.brand).map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="inline-block"
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.05 }}
            >
              {/* inner span owns the hover transform; framer owns the outer one */}
              <span className="footer-letter inline-block" data-ch={ch} style={{ ["--i" as string]: i }}>
                {ch}
              </span>
            </motion.span>
          ))}
        </button>

        <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="max-w-xs text-sm text-muted">{t.footer.tagline}</p>
            <div className="mt-6 w-fit">
              <LanguageToggle />
            </div>
          </div>

          <div>
            <span className="eyebrow">{t.footer.navTitle}</span>
            <ul className="mt-4 flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    data-cursor
                    onClick={() => goTo(`#${l.id}`)}
                    className="link-underline text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="eyebrow">{t.footer.connectTitle}</span>
            <ul className="mt-4 flex flex-col gap-2">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className="link-underline text-muted transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="eyebrow">{t.footer.localTime}</span>
            <p className="mt-4 font-display text-xl tabular-nums">{time}</p>
            <p className="mt-1 text-sm text-muted">{tx(profile.location)}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center">
          <span>
            © {year} {profile.name}. {t.footer.rights}
          </span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>{t.footer.built}</span>
            <a href={legalHref.imprint} data-cursor className="link-underline transition-colors hover:text-ink">
              {t.footer.imprint}
            </a>
            <a href={legalHref.privacy} data-cursor className="link-underline transition-colors hover:text-ink">
              {t.footer.privacy}
            </a>
          </span>
          <button
            data-cursor
            onClick={() => scrollTo(0)}
            className="link-underline flex items-center gap-2 text-ink"
          >
            {t.footer.backToTop}
            <span className="text-accent">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
