/**
 * Tiny path-based routing for the two legal pages. Everything else is the
 * one-page portfolio. The Express server already serves index.html for every
 * unknown path, so these work as real URLs (and in `vite dev`).
 */
export type LegalPageId = "imprint" | "privacy";

const PATHS: Record<string, LegalPageId> = {
  "/impressum": "imprint",
  "/imprint": "imprint",
  "/datenschutz": "privacy",
  "/privacy": "privacy",
};

export const legalHref: Record<LegalPageId, string> = {
  imprint: "/impressum",
  privacy: "/datenschutz",
};

export function getLegalPage(): LegalPageId | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname.replace(/\/+$/, "").toLowerCase();
  return PATHS[path] ?? null;
}
