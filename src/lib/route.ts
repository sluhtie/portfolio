/**
 * Tiny path-based routing. German lives at the root, English under /en — each
 * language gets its own crawlable URL (see seo.ts for canonical + hreflang).
 * The build prerenders every route in ROUTES to static HTML, and the Express
 * server maps these paths to those files.
 */
import type { Locale } from "../i18n/translations";

export type LegalPageId = "imprint" | "privacy";
export type PageId = "home" | LegalPageId | "notFound";
export type Route = { page: PageId; locale: Locale };

const PATHS: Record<Exclude<PageId, "notFound">, Record<Locale, string>> = {
  home: { de: "/", en: "/en" },
  imprint: { de: "/impressum", en: "/en/imprint" },
  privacy: { de: "/datenschutz", en: "/en/privacy" },
};

/** Every prerendered, indexable route. */
export const ROUTES: Route[] = (Object.keys(PATHS) as (keyof typeof PATHS)[]).flatMap((page) =>
  (["de", "en"] as Locale[]).map((locale) => ({ page, locale }))
);

export function pathFor(page: PageId, locale: Locale): string {
  if (page === "notFound") return locale === "en" ? "/en" : "/";
  return PATHS[page][locale];
}

export function legalHref(page: LegalPageId, locale: Locale): string {
  return pathFor(page, locale);
}

export function resolvePath(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  for (const page of Object.keys(PATHS) as (keyof typeof PATHS)[]) {
    for (const locale of ["de", "en"] as Locale[]) {
      if (PATHS[page][locale] === path) return { page, locale };
    }
  }
  return { page: "notFound", locale: path === "/en" || path.startsWith("/en/") ? "en" : "de" };
}

export function currentRoute(): Route {
  if (typeof window === "undefined") return { page: "home", locale: "de" };
  return resolvePath(window.location.pathname);
}
