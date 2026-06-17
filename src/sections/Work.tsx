import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../i18n/LanguageContext";
import { projects, type Project } from "../i18n/content";
import { Reveal } from "../components/Reveal";
import { useMediaQuery } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProjectCard({ project }: { project: Project }) {
  const { t, tx } = useLang();
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title} — ${t.work.view}`}
      className="group relative flex h-full w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-bg-soft transition-colors duration-500 hover:border-ink/25"
    >
      {/* browser bar */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-3 truncate text-xs text-muted">{hostnameOf(project.url)}</span>
        <span className="ml-auto shrink-0 text-xs text-muted">{project.year}</span>
      </div>

      {/* scrolling screenshot */}
      <div className="relative flex-1 overflow-hidden">
        {/* gradient fallback — shows until the screenshot is in place */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 70% at 30% 20%, ${project.accent}55, transparent 60%), radial-gradient(60% 60% at 80% 90%, ${project.accent}22, transparent 55%), #0c0b10`,
          }}
        />
        {project.image && (
          <div
            className="absolute inset-0 bg-top bg-no-repeat bg-[length:100%_auto] transition-[background-position] duration-[5000ms] ease-linear group-hover:bg-bottom motion-reduce:transition-none motion-reduce:group-hover:bg-top"
            style={{ backgroundImage: `url(${project.image})` }}
          />
        )}
        {/* hover arrow */}
        <div className="absolute right-5 bottom-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-accent text-bg opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 17L17 7M17 7H8M17 7V16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* meta */}
      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold md:text-3xl">
            {project.title}
          </h3>
          <span className="shrink-0 text-xs text-muted">{tx(project.category)}</span>
        </div>
        <p className="mt-2 max-w-md text-sm text-muted">{tx(project.description)}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}

export function Work() {
  const { t } = useLang();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || !pinRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getDistance = () =>
        track.scrollWidth - window.innerWidth + window.innerWidth * 0.1;

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
        },
      });
    }, pinRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section id="work" className="relative py-24 md:py-0 md:pt-36">
      {/* header */}
      <div className="container-x flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <span className="eyebrow">{t.work.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold">
              {t.work.heading}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-balance text-muted">{t.work.subheading}</p>
        </Reveal>
      </div>

      {/* gallery */}
      {isDesktop ? (
        <div ref={pinRef} className="relative mt-16 h-screen overflow-hidden">
          <div className="flex h-full items-center">
            <div ref={trackRef} className="flex h-[70vh] items-stretch gap-7 pl-[5vw] pr-[5vw]">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="h-full w-[clamp(20rem,42vw,34rem)]"
                >
                  <ProjectCard project={p} />
                </div>
              ))}
              {/* trailing CTA panel */}
              <div className="flex h-full w-[24rem] shrink-0 flex-col items-start justify-center gap-6 pl-6">
                <h3 className="font-display text-4xl font-semibold leading-tight">
                  {t.work.all}
                </h3>
                <a href="#contact" data-cursor className="btn-primary">
                  {t.nav.cta}
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-x mt-12 flex flex-col gap-6">
          {projects.map((p) => (
            <div key={p.id} className="h-[78vh]">
              <ProjectCard project={p} />
            </div>
          ))}
          <a href="#contact" data-cursor className="btn-primary mt-2 w-fit">
            {t.work.all}
            <span>→</span>
          </a>
        </div>
      )}
    </section>
  );
}
