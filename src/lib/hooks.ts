import { useEffect, useState } from "react";

/** Reactive media query. */
export function useMediaQuery(query: string): boolean {
  // Start false on every first render so the prerendered HTML and the
  // hydrating client agree; the effect below syncs it immediately.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on devices that have a precise pointer (mouse/trackpad). */
export function useHasFinePointer() {
  return useMediaQuery("(pointer: fine)");
}

/** Live ticking clock string for a given IANA timezone. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone,
          }).format(new Date())
        );
      } catch {
        setTime("");
      }
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}
