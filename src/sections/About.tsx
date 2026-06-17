import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "../i18n/LanguageContext";
import { profile, stats } from "../i18n/content";
import { Reveal, RevealWords } from "../components/Reveal";
import { Counter } from "../components/Counter";

export function About() {
  const { t, tx } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="container-x relative py-24 md:py-36"
    >
      <Reveal>
        <span className="eyebrow">{t.about.eyebrow}</span>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Text */}
        <div className="md:col-span-7">
          <h2 className="font-display text-[clamp(1.9rem,4vw,3.4rem)] font-semibold leading-[1.05]">
            <RevealWords text={t.about.heading} />
          </h2>
          <p className="mt-8 max-w-xl text-balance text-base text-muted md:text-lg">
            <RevealWords text={t.about.body} stagger={0.012} />
          </p>

          <Reveal delay={0.1} className="mt-10">
            <a href="#contact" data-cursor className="btn-ghost">
              {t.about.cta}
              <span className="text-accent">→</span>
            </a>
          </Reveal>
        </div>

        {/* Visual */}
        <div className="md:col-span-5">
          <motion.div
            style={{ y: imageY }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line"
          >
            {/* gradient mesh */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 80% at 20% 10%, rgba(124,92,255,0.55), transparent 60%), radial-gradient(70% 70% at 90% 80%, rgba(0,224,198,0.45), transparent 60%), radial-gradient(50% 50% at 60% 40%, rgba(204,255,0,0.25), transparent 60%), #0c0b10",
              }}
            />
            {/* rotating ring */}
            <motion.div
              style={{ rotate: ringRotate }}
              className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
            />
            {/* initials */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[7rem] font-semibold text-ink/90 mix-blend-overlay">
                {profile.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
            {/* caption */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 text-xs text-ink/80">
              <span>{profile.name}</span>
              <span>{tx(profile.location)}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-20 grid grid-cols-2 gap-y-12 border-t border-line pt-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="flex flex-col gap-2">
              <span className="font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-sm text-muted">{tx(s.label)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
