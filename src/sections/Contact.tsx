import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { Reveal, RevealLines } from "../components/Reveal";
import { ContactForm } from "../components/ContactForm";

export function Contact() {
  const { t, tx } = useLang();

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      {/* glow */}
      <div
        className="blob left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2"
        style={{ background: "rgba(124,92,255,0.22)" }}
      />
      <div
        className="blob right-[8%] bottom-[10%] h-[24rem] w-[24rem]"
        style={{ background: "rgba(0,224,198,0.16)" }}
      />

      <div className="container-x relative z-10">
        {/* heading */}
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow">{t.contact.eyebrow}</span>
          </Reveal>
          <h2 className="mx-auto mt-8 font-display text-[clamp(2.4rem,8vw,7rem)] font-semibold leading-[0.95]">
            <RevealLines lines={[t.contact.heading]} />
            <RevealLines
              lines={[t.contact.headingAccent]}
              delay={0.1}
              lineClassName="gradient-text font-serif italic"
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-md text-balance text-muted md:text-lg">
              {t.contact.body}
            </p>
          </Reveal>
        </div>

        {/* form + details */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-2 md:gap-20">
          {/* details */}
          <Reveal className="order-2 flex flex-col gap-10 md:order-1">
            <div>
              <span className="eyebrow">{t.contact.emailLabel}</span>
              <div className="mt-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline font-display text-2xl font-medium md:text-3xl"
                >
                  {profile.email}
                </a>
              </div>
            </div>

            <div>
              <span className="eyebrow">{t.contact.socialsLabel}</span>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-lg text-muted transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="eyebrow">{tx(profile.location)}</span>
              <p className="mt-3 flex items-center gap-2 text-lg text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {tx(profile.available)}
              </p>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.1} className="order-1 md:order-2">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
