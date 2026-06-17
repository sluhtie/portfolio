import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { useClock } from "../lib/hooks";
import { scrollTo } from "../lib/scroll";
import { LanguageToggle } from "../components/LanguageToggle";

export function Footer() {
  const { t, tx } = useLang();
  const time = useClock(profile.timezone);
  const year = new Date().getFullYear();

  const links = [
    { id: "work", label: t.nav.work },
    { id: "about", label: t.nav.about },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="container-x py-16 md:py-20">
        {/* big brand mark */}
        <button
          data-cursor
          onClick={() => scrollTo(0)}
          className="block w-full text-left font-display text-[clamp(3.5rem,16vw,15rem)] font-semibold leading-none gradient-text"
        >
          {profile.brand}
        </button>

        <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="max-w-xs text-sm text-muted">{t.footer.tagline}</p>
            <div className="mt-6">
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
                    onClick={() => scrollTo(`#${l.id}`, { offset: -20 })}
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
          <span>{t.footer.built}</span>
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
