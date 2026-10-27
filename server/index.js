import express from "express";
import compression from "compression";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendContactEmails } from "./contact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const port = process.env.PORT || 3000;

// Optional: e.g. CANONICAL_HOST=www.cwcodes.de → every other host (cwcodes.de)
// gets a 301 there, so Google only ever sees one version of each URL. Leave it
// unset if the reverse proxy already handles this.
const canonicalHost = process.env.CANONICAL_HOST;

// Prerendered pages (scripts/prerender.mjs) → their HTML file in dist/.
const PAGES = {
  "/": "index.html",
  "/en": "en/index.html",
  "/impressum": "impressum/index.html",
  "/datenschutz": "datenschutz/index.html",
  "/en/imprint": "en/imprint/index.html",
  "/en/privacy": "en/privacy/index.html",
};
// Old or alternative spellings → their canonical URL.
const REDIRECTS = {
  "/de": "/",
  "/index.html": "/",
  "/imprint": "/en/imprint",
  "/privacy": "/en/privacy",
  "/impressum.html": "/impressum",
  "/datenschutz.html": "/datenschutz",
  "/og-image.png": "/og-image.jpg",
};

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(compression());

if (canonicalHost) {
  app.use((req, res, next) => {
    if (req.path === "/api/health" || req.hostname === canonicalHost) return next();
    res.redirect(301, `https://${canonicalHost}${req.originalUrl}`);
  });
}

app.use(express.json({ limit: "32kb" }));

// Health check (handy for Docker / Dokploy)
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Contact form → useSend
app.post("/api/contact", async (req, res) => {
  try {
    const { status, body } = await sendContactEmails(req.body || {});
    res.status(status).json(body);
  } catch (err) {
    console.error("contact handler error", err);
    res.status(500).json({ error: "Server error" });
  }
});

const NOT_FOUND = { de: "404.html", en: "404.en.html" };
function notFoundPage(req, res) {
  const lang = req.path === "/en" || req.path.startsWith("/en/") ? "en" : "de";
  const file = fs.existsSync(path.join(distDir, NOT_FOUND[lang])) ? NOT_FOUND[lang] : "index.html";
  sendPage(res, file, 404);
}

const sendPage = (res, file, status = 200) => {
  res.status(status);
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.sendFile(path.join(distDir, file));
};

app.get("*", (req, res, next) => {
  const query = req.originalUrl.slice(req.path.length);
  // One URL per page: no trailing slash, lowercase.
  const clean = req.path.length > 1 ? req.path.replace(/\/+$/, "").toLowerCase() : "/";
  const target = REDIRECTS[clean] ?? (clean !== req.path && PAGES[clean] ? clean : null);
  if (target) return res.redirect(301, target + query);
  if (PAGES[req.path]) return sendPage(res, PAGES[req.path]);
  next();
});

// HTML files are only reachable through their clean URLs above.
app.use((req, res, next) => (req.path.endsWith(".html") ? notFoundPage(req, res) : next()));

// Static assets (hashed → long cache).
app.use(
  express.static(distDir, {
    index: false,
    // Don't serve dist/en/ etc. as directories — the page routes own those paths.
    redirect: false,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.includes(`${path.sep}projects${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    },
  })
);

// Everything else is a real 404 (not the home page with a 200, which Google
// would flag as a soft 404).
app.use(notFoundPage);

app.listen(port, () => {
  console.log(`CWCODES running on http://0.0.0.0:${port}`);
});
