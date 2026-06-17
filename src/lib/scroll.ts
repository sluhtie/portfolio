import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Native, non-hijacking scroll helpers.
 * Wheel/trackpad scrolling stays 100% the browser's own — we only do a smooth
 * jump on explicit anchor clicks (and instant if the user prefers reduced motion).
 */
export function scrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number }
) {
  let top = 0;
  if (typeof target === "number") {
    top = target;
  } else {
    const el =
      typeof target === "string"
        ? document.querySelector<HTMLElement>(target)
        : target;
    if (!el) return;
    top = el.getBoundingClientRect().top + window.scrollY;
  }
  top += options?.offset ?? 0;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/** Lock page scroll (used while the preloader and mobile menu are open). */
export function stopScroll() {
  document.documentElement.style.overflow = "hidden";
}

/** Restore page scroll. */
export function startScroll() {
  document.documentElement.style.overflow = "";
}
