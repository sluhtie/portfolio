/**
 * Renders og.html → public/og-image.jpg (DE) and public/og-image-en.jpg (EN).
 * Run from the repo root after editing the template:
 *
 *   npx -y -p playwright@1 node scripts/og/render.mjs
 *
 * (needs a Chromium for Playwright: `npx playwright install chromium` once).
 * Uses the Fontshare brand fonts when they're reachable, else Inter Display.
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "..", "..", "public");
const template = pathToFileURL(path.join(here, "og.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [lang, file] of [["de", "og-image.jpg"], ["en", "og-image-en.jpg"]]) {
  await page.goto(`${template}?lang=${lang}`, { waitUntil: "networkidle" }).catch(() => {});
  if (process.env.OG_EXTRA_CSS) await page.addStyleTag({ content: process.env.OG_EXTRA_CSS });
  await page.evaluate(() => document.fonts.ready);
  // JPEG keeps the glow gradients smooth at a fraction of a PNG's size.
  await page.screenshot({ path: path.join(out, file), type: "jpeg", quality: 90 });
  console.log("wrote", path.join("public", file));
}
await browser.close();
