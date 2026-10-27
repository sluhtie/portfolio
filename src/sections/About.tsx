import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { toolbox } from "../i18n/content";
import { Reveal, RevealWords } from "../components/Reveal";
import { ScrubWords } from "../components/KineticText";
import { BusinessCard } from "../components/BusinessCard";
import { Magnetic } from "../components/Magnetic";
import { EASE } from "../lib/motion";

export function About() {
  const { t } = useLang();

  return (
    <section id="about" className="container-x relative z-10 py-16 md:py-24 lg:py-40">
      <div className="flex items-center gap-4">
        <Reveal>
          <span className="eyebrow">{t.about.eyebrow}</span>
        </Reveal>
        <motion.span
          className="hairline flex-1 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <span className="eyebrow">01</span>
      </div>

      {/* manifesto — words light up as you scroll */}
      <h2 className="mt-8 max-w-[22ch] font-display text-[clamp(2.1rem,5.6vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.025em] md:mt-16">
        <ScrubWords text={t.about.heading} highlight={t.about.highlight} />
      </h2>

      <div className="mt-12 grid grid-cols-1 items-center gap-10 md:mt-20 md:grid-cols-12 lg:mt-32 md:gap-10">
        {/* 3D business card */}
        <div className="relative md:order-2 md:col-span-6 lg:col-span-5 lg:col-start-8">
          <BusinessCard className="mx-auto h-[24rem] w-full max-w-[24rem] sm:h-[30rem] md:h-[36rem] md:max-w-none" />
          <p className="mx-auto mt-2 max-w-[22rem] text-center text-xs text-muted">{t.about.cardCaption}</p>
        </div>

        <div className="md:order-1 md:col-span-6 lg:col-span-6">
          <p className="max-w-xl text-balance text-lg leading-relaxed text-ink/75 md:text-xl">
            <RevealWords text={t.about.body} stagger={0.012} />
          </p>

          <Reveal delay={0.1} className="mt-10">
            <Magnetic strength={0.3}>
              <a href="#contact" data-cursor className="btn-ghost">
                {t.about.cta}
                <span className="text-accent">→</span>
              </a>
            </Magnetic>
          </Reveal>

          {/* toolbox */}
          <div className="mt-12 md:mt-16">
            <span className="eyebrow">{t.about.toolbox}</span>
            <ul className="mt-4 flex flex-wrap gap-2">
              {toolbox.map((tool, i) => (
                <motion.li
                  key={tool}
                  className="toolbox-chip rounded-full border border-line px-4 py-2 font-mono text-xs tracking-wide text-ink/75"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                >
                  {tool}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
