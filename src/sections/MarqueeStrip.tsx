import { Marquee } from "../components/Marquee";
import { marqueeWords } from "../i18n/content";

export function MarqueeStrip() {
  return (
    <section className="relative border-y border-line py-6 md:py-8">
      <Marquee
        items={marqueeWords}
        duration={32}
        className="font-display text-[clamp(2rem,7vw,5.5rem)] font-medium leading-none text-ink"
      />
    </section>
  );
}
