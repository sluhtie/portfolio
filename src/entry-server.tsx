import { renderToString } from "react-dom/server";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";
import { ROUTES, pathFor, type Route } from "./lib/route";
import { headFor, renderHead, SITE_URL } from "./lib/seo";

export { ROUTES, pathFor, SITE_URL };

/** Build-time render of one route → { html, head } for scripts/prerender.mjs. */
export function render(route: Route) {
  const html = renderToString(
    <LanguageProvider initialLocale={route.locale} page={route.page}>
      <App page={route.page} />
    </LanguageProvider>
  );
  return { html, head: renderHead(headFor(route)), lang: route.locale };
}
