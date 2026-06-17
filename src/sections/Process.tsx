import { useLang } from "../i18n/LanguageContext";
import { processSteps } from "../i18n/content";
import { Reveal } from "../components/Reveal";

export function Process() {
  const { t, tx } = useLang();

  return (
    <section id="process" className="container-x py-24 md:py-36">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Sticky heading */}
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <Reveal>
              <span className="eyebrow">{t.process.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold">
                {t.process.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xs text-balance text-muted">
                {t.process.subheading}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Steps */}
        <div className="md:col-span-8">
          {processSteps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.05}>
              <div className="group flex gap-6 border-t border-line py-10 transition-colors md:gap-10">
                <span className="font-display text-sm text-accent">{step.num}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium transition-transform duration-500 group-hover:translate-x-2">
                    {tx(step.title)}
                  </h3>
                  <p className="mt-3 max-w-lg text-balance text-muted md:text-lg">
                    {tx(step.body)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
