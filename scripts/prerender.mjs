/**
 * Build step 3/3: render every route to static HTML so crawlers (and visitors
 * before JS has loaded) get the full content, per-page <head> and real URLs.
 *
 *   vite build                → dist/ (client bundle + index.html template)
 *   vite build --ssr …        → dist-ssr/entry-server.js
 *   node scripts/prerender.mjs → dist/<route>/index.html, 404 pages, dist/sitemap.xml
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, ROUTES, pathFor, SITE_URL } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

function page(route) {
  const { html, head, lang } = render(route);
  let out = template
    .replace('<html lang="de">', `<html lang="${lang}">`)
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", html);
  // The no-JS fallback only matters on the home page (its preloader needs JS);
  // the other pages are fully readable as rendered.
  out =
    route.page === "home"
      ? out.replace(/<!--noscript-home:(start|end)-->\n?/g, "")
      : out.replace(/\s*<!--noscript-home:start-->[\s\S]*?<!--noscript-home:end-->/, "");
  return out;
}

const fileFor = (urlPath) =>
  urlPath === "/" ? path.join(dist, "index.html") : path.join(dist, urlPath.slice(1), "index.html");

for (const route of ROUTES) {
  const file = fileFor(pathFor(route.page, route.locale));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page(route));
  console.log("prerendered", path.relative(root, file));
}
for (const locale of ["de", "en"]) {
  const file = path.join(dist, locale === "de" ? "404.html" : "404.en.html");
  await fs.writeFile(file, page({ page: "notFound", locale }));
  console.log("prerendered", path.relative(root, file));
}

// sitemap.xml with hreflang alternates for every page pair.
const today = new Date().toISOString().slice(0, 10);
const PRIORITY = { home: "1.0", imprint: "0.3", privacy: "0.3" };
const urls = ROUTES.map((r) => {
  const alts = ["de", "en"]
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathFor(r.page, l)}" />`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathFor(r.page, "de")}" />`)
    .join("\n");
  return `  <url>
    <loc>${SITE_URL}${pathFor(r.page, r.locale)}</loc>
${alts}
    <lastmod>${today}</lastmod>
    <priority>${PRIORITY[r.page]}</priority>
  </url>`;
});
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`
);
console.log("wrote dist/sitemap.xml");

await fs.rm(ssrDir, { recursive: true, force: true });
