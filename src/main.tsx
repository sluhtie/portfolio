import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LanguageProvider, LOCALE_STORAGE_KEY } from "./i18n/LanguageContext";
import { currentRoute, pathFor } from "./lib/route";

const route = currentRoute();

// Returning visitors who picked English last time land on /en. Only an
// explicit earlier choice counts, so crawlers always get the URL they asked for.
let stored: string | null = null;
try {
  stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
} catch {
  /* storage blocked */
}
if (route.page === "home" && route.locale === "de" && stored === "en") {
  window.location.replace(pathFor("home", "en") + window.location.hash);
} else {
  const root = document.getElementById("root")!;
  const app = (
    <LanguageProvider initialLocale={route.locale} page={route.page}>
      <App page={route.page} />
    </LanguageProvider>
  );
  // Production HTML is prerendered (scripts/prerender.mjs) → hydrate it.
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
