import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../i18n/LanguageContext";
import { projects, type Project } from "../i18n/content";
import { Reveal, RevealLines } from "../components/Reveal";
import { useMediaQuery } from "../lib/hooks";
import { EASE } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProjectCard({ project, total }: { project: Project; total: number }) {
  const { t, tx } = useLang();
  const tiltRef = useRef<HTMLDivElement>(null);
  const fine = useMediaQuery("(pointer: fine)");

  // subtle 3D tilt toward the cursor
  const onMove = (e: React.PointerEvent) => {
    if (!fine || !tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.style.setProperty("--rx", `${-py * 6}deg`);
    tiltRef.current.style.setProperty("--ry", `${px * 8}deg`);
    tiltRef.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    tiltRef.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={tiltRef} className="project-tilt h-full" onPointerMove={onMove} onPointerLeave={onLeave}>
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        data-cursor-label={t.work.cursor}
        aria-label={`${project.title} — ${t.work.status[project.status]} — ${t.work.view}`}
        className="project-card group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-line"
        style={{ ["--accent" as string]: project.accent }}
      >
        {/* screenshot */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(70% 70% at 30% 20%, ${project.accent}55, transparent 60%), radial-gradient(60% 60% at 80% 90%, ${project.accent}22, transparent 55%), #0c0b10`,
            }}
          />
          {project.image && (
            <img
              src={project.image}
              alt={`${t.work.screenshot}: ${project.title} – ${tx(project.category)}`}
              loading="lazy"
              decoding="async"
              className="project-shot absolute inset-0 h-full w-full object-cover object-top"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0a0e] via-transparent to-transparent opacity-90" />
          <div className="project-sheen pointer-events-none absolute inset-0" />

          {/* top chips */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 md:p-5">
            <span className="glass truncate rounded-full px-3 py-1.5 text-xs text-ink/80">{hostnameOf(project.url)}</span>
            <span
              className={`glass inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                project.status === "live" ? "text-accent" : "text-amber-300"
              }`}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
              {t.work.status[project.status]}
            </span>
          </div>

          {/* big index */}
          <span aria-hidden="true" className="project-index absolute bottom-2 left-4 font-display text-[clamp(4rem,9vw,8rem)] font-semibold leading-none md:left-6">
            {project.index}
          </span>
          <span aria-hidden="true" className="absolute right-5 bottom-5 font-mono text-[0.65rem] tracking-widest text-ink/50">
            / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* meta */}
        <div className="relative border-t border-line bg-[#0c0b10]/90 p-6 md:p-7">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            style={{ background: project.accent }}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-semibold leading-tight md:text-[2rem]">{project.title}</h3>
              <span className="mt-1 block text-xs tracking-wide text-muted">{tx(project.category)}</span>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-accent group-hover:text-bg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted">{tx(project.description)}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </a>
    </div>
  );
}

/** Phones and tablets: a native swipe carousel instead of one tall card per project. */
function SwipeGallery() {
  const { t } = useLang();
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const p = max > 0 ? rail.scrollLeft / max : 0;
    if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
    setCurrent(Math.min(projects.length, Math.round(p * (projects.length - 1)) + 1));
  };

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div
        ref={railRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-[clamp(1.25rem,5vw,5rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[clamp(1.25rem,5vw,5rem)] px-[clamp(1.25rem,5vw,5rem)] pb-2"
      >
        {projects.map((p) => (
          <div key={p.id} className="h-[34rem] max-h-[78svh] min-h-[28rem] w-[min(84vw,26rem)] shrink-0 snap-start">
            <ProjectCard project={p} total={projects.length} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <span className="font-mono text-xs tabular-nums tracking-widest text-ink/80">
          {String(current).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 overflow-hidden bg-line">
          <div ref={barRef} className="h-full origin-left scale-x-[0.04] bg-gradient-to-r from-violet via-accent to-teal" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-muted">{t.work.swipe}</span>
      </div>
      <a href="#contact" data-cursor className="btn-primary mt-8 w-fit">
        {t.work.all}
        <span>→</span>
      </a>
    </motion.div>
  );
}

export function Work() {
  const { t } = useLang();
  // Short windows need stacked cards to keep screenshots and copy visible.
  const isDesktop = useMediaQuery("(min-width: 1024px) and (min-height: 640px)");
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!isDesktop || !pinRef.current || !trackRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".work-slide", track);
      const getDistance = () => track.scrollWidth - window.innerWidth;
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            setCurrent(Math.min(projects.length, Math.max(1, Math.round(self.progress * (projects.length - 1)) + 1)));
            if (!reduced) skewTo(gsap.utils.clamp(-6, 6, self.getVelocity() / -400));
          },
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        },
      });

      // coverflow: cards rotate and recede the further they sit from centre
      if (!reduced) {
        const update = () => {
          const vw = window.innerWidth;
          for (const el of cards) {
            const r = el.getBoundingClientRect();
            const d = (r.left + r.width / 2 - vw / 2) / vw; // -1 … 1
            const inner = el.firstElementChild as HTMLElement | null;
            if (!inner) continue;
            inner.style.transform = `perspective(1400px) rotateY(${d * -16}deg) translateZ(${-Math.abs(d) * 120}px)`;
            inner.style.opacity = String(1 - Math.min(0.5, Math.abs(d) * 0.45));
          }
        };
        gsap.ticker.add(update);
        return () => gsap.ticker.remove(update);
      }
    }, pinRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section id="work" className="relative z-10 py-16 md:py-24 lg:py-0">
      {isDesktop ? (
        <div ref={pinRef} className="relative h-screen overflow-hidden">
          <div className="flex h-full items-center">
            <div ref={trackRef} className="flex h-[72vh] items-stretch gap-8 pr-[10vw] will-change-transform">
              {/* intro panel travels with the cards */}
              <div className="flex h-full w-[min(44rem,62vw)] shrink-0 flex-col justify-between pl-[clamp(1.25rem,5vw,5rem)]">
                <div className="flex items-center gap-4">
                  <span className="eyebrow">{t.work.eyebrow}</span>
                  <span className="eyebrow">03</span>
                </div>
                <h2 className="font-display text-[clamp(3.5rem,8.5vw,9rem)] font-semibold uppercase leading-[0.86] tracking-[-0.04em]">
                  <RevealLines lines={t.work.heading.split(" ")} />
                </h2>
                <div className="flex items-end justify-between gap-6">
                  <p className="max-w-xs text-balance text-muted">{t.work.subheading}</p>
                  <span className="work-hint flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/60">
                    {t.work.drag}
                    <span className="inline-block h-px w-14 bg-accent" />
                  </span>
                </div>
              </div>

              {projects.map((p) => (
                <div key={p.id} className="work-slide h-full w-[clamp(21rem,40vw,36rem)] shrink-0">
                  <div className="h-full will-change-transform">
                    <ProjectCard project={p} total={projects.length} />
                  </div>
                </div>
              ))}

              {/* trailing CTA panel */}
              <div className="flex h-full w-[26rem] shrink-0 flex-col items-start justify-center gap-8 pl-8">
                <h3 className="font-display text-5xl font-semibold leading-[0.95]">{t.work.all}</h3>
                <a href="#contact" data-cursor className="btn-primary">
                  {t.nav.cta}
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* progress HUD */}
          <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-6">
            <span className="font-mono text-xs tabular-nums tracking-widest text-ink/80">
              {String(current).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-line">
              <div ref={barRef} className="h-full origin-left scale-x-0 bg-gradient-to-r from-violet via-accent to-teal" />
            </div>
          </div>
        </div>
      ) : (
        <div className="container-x">
          <div className="flex items-center gap-4">
            <Reveal>
              <span className="eyebrow">{t.work.eyebrow}</span>
            </Reveal>
            <span className="eyebrow">03</span>
          </div>
          <h2 className="mt-5 font-display text-[clamp(2.8rem,12vw,6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.035em]">
            <RevealLines lines={t.work.heading.split(" ")} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xs text-balance text-muted">{t.work.subheading}</p>
          </Reveal>
          <SwipeGallery />
        </div>
      )}
    </section>
  );
}
