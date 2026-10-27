import { VelocityMarquee } from "../components/VelocityMarquee";
import { marqueeWords } from "../i18n/content";

export function MarqueeStrip() {
  const half = Math.ceil(marqueeWords.length / 2);
  return (
    <section className="relative z-10 -rotate-2 py-10 md:py-24">
      <div className="marquee-band border-y border-line py-5 md:py-7">
        <VelocityMarquee
          items={marqueeWords}
          itemClassName="font-display text-[clamp(2.4rem,8vw,7rem)] font-semibold uppercase leading-none tracking-tight"
        />
      </div>
      <div className="marquee-band-alt mt-3 rotate-3 border-y border-line py-3 md:py-4">
        <VelocityMarquee
          items={[...marqueeWords.slice(half), ...marqueeWords.slice(0, half)]}
          reverse
          baseSpeed={0.45}
          itemClassName="font-serif text-[clamp(1.4rem,4vw,3.2rem)] italic leading-none text-ink/70"
        />
      </div>
      {/* the marquee words stay readable for assistive tech once */}
      <p className="sr-only">{marqueeWords.join(", ")}</p>
    </section>
  );
}
