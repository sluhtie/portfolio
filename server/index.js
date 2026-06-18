import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendContactEmails } from "./contact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const port = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");
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

// Static assets (hashed → long cache). index.html is served by the SPA fallback.
app.use(
  express.static(distDir, {
    index: false,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// SPA fallback — every other route returns index.html.
app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`CWCODES running on http://0.0.0.0:${port}`);
});
