import { useLang } from "../i18n/LanguageContext";
import { profile } from "../i18n/content";
import { Reveal, RevealLines } from "../components/Reveal";
import { ContactForm } from "../components/ContactForm";
import { Magnetic } from "../components/Magnetic";
import { Scramble } from "../components/KineticText";

export function Contact() {
  const { t, tx } = useLang();

  return (
    <section id="contact" className="relative z-10 overflow-hidden py-20 md:py-32 lg:py-44">
      <div className="container-x relative">
        {/* heading */}
        <div className="contact-heading mx-auto max-w-5xl text-center">
          <div className="flex items-center justify-center gap-4">
            <Reveal>
              <span className="eyebrow">{t.contact.eyebrow}</span>
            </Reveal>
            <span className="eyebrow">05</span>
          </div>
          <h2 className="contact-title mx-auto mt-8 font-display font-semibold">
            <RevealLines lines={[t.contact.heading]} />
            <RevealLines
              lines={[t.contact.headingAccent]}
              delay={0.1}
              lineClassName="gradient-text-anim font-serif font-normal italic"
            />
          </h2>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-md text-balance text-ink/70 md:text-lg">{t.contact.body}</p>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 flex justify-center md:mt-12">
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor
                className="contact-blob group relative flex h-28 w-28 items-center justify-center rounded-full text-center font-display text-base font-semibold text-bg md:h-44 md:w-44 md:text-xl"
              >
                <span className="relative z-10 px-4 leading-tight">{t.contact.write}</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* form + details */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12 md:gap-12 lg:mt-28 lg:gap-16">
          <Reveal className="order-2 flex flex-col gap-10 md:order-1 md:col-span-5">
            <div>
              <span className="eyebrow">{t.contact.emailLabel}</span>
              <div className="mt-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline font-display text-2xl font-medium break-all md:text-3xl"
                >
                  <Scramble text={profile.email} />
                </a>
              </div>
            </div>

            <div>
              <span className="eyebrow">{t.contact.socialsLabel}</span>
              <ul className="mt-4 flex flex-col">
                {profile.socials.map((s, i) => (
                  <li key={s.label} className="border-t border-line last:border-b">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="social-row group flex items-center justify-between py-4 text-lg text-ink/70 transition-colors hover:text-ink"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-xs text-muted">0{i + 1}</span>
                        <Scramble text={s.label} />
                      </span>
                      <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent">
                        ↗
                      </span>
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

          <Reveal delay={0.1} className="order-1 md:order-2 md:col-span-7">
            <div className="form-panel rounded-[1.75rem] border border-line p-6 sm:p-8 md:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
