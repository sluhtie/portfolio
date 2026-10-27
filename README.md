# Portfolio — Creative Developer & Designer

Ein animationsgeladenes, zweisprachiges (DE/EN) Portfolio mit WebGL-Hintergrund,
Smooth Scrolling, Scroll- & Hover-Animationen und einem Premium-Dark-UI.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (Design-Tokens in `src/index.css` unter `@theme`)
- **Framer Motion** – Reveals, Hover, Micro-Interactions, Slider
- **GSAP + ScrollTrigger** – gepinnte horizontale Projekt-Galerie
- **three.js** – seitenweite WebGL-Welt (flüssiger Orb, Orbit-Ringe, Partikel,
  Glow-Feld im Visitenkarten-Look) + 3D-Visitenkarte im About-Bereich.
  Lazy geladen, mit CSS-Fallback ohne WebGL.
- Natives Scrolling (kein Scroll-Hijacking)

## Befehle

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Dev-Server (http://localhost:5173)
npm run build    # Production-Build nach dist/ (inkl. Prerendering aller Seiten)
npm run preview  # Build lokal ansehen
npm run typecheck
```

## ✏️ Inhalte anpassen — alles an einem Ort

**`src/i18n/content.ts`** enthält deine kompletten Inhalte. Felder, die sich je
Sprache unterscheiden, sind als `{ en, de }` hinterlegt.

- `profile` – Name, Brand, E-Mail, Standort, Zeitzone, Social-Links
- `projects` – deine Projekte (Titel, Jahr, Kategorie, Beschreibung, Tags, Akzentfarbe)
- `services` – Leistungen
- `processSteps` – Ablauf
- `stats` – Zahlen (Counter)
- `testimonials` – Kundenstimmen
- `marqueeWords` – Lauftext-Begriffe

**`src/i18n/translations.ts`** enthält die UI-Texte (Navigation, Überschriften,
Buttons …) für `en` und `de`.

> Aktuell sind Platzhalter-Inhalte gesetzt (Name „Alex Mercer"). Einfach
> überschreiben — die ganze Seite zieht automatisch nach.

## 🎨 Design anpassen

Farben, Fonts und Easing sind als CSS-Variablen in `src/index.css` (`@theme`)
definiert:

```css
--color-bg / --color-ink / --color-accent / --color-violet / --color-teal …
--font-display (Clash Display) / --font-sans (General Sans) / --font-serif (Gambetta)
```

Die Fonts kommen via Fontshare (CDN, kostenlos) — siehe `<link>` in `index.html`.
Die Farbpalette der WebGL-Szenen liegt in `src/gl/noise.ts` (`PALETTE`). Wo der
Orb in welchem Abschnitt sitzt (Position, Größe, Intensität), steuern
`DESKTOP_STATES` / `MOBILE_STATES` in `src/gl/World.ts`. Die 3D-Visitenkarte
(Vorder- und Rückseite werden per Canvas gezeichnet) steckt in `src/gl/Card.ts`.

## Struktur

```
src/
  components/   wiederverwendbare Bausteine (Magnetic, Reveal, Marquee, Navbar, ContactForm …)
  sections/     Seitenabschnitte (Hero, About, Services, Work, Process, Testimonials, Contact, Footer)
  i18n/         Sprachsystem + Inhalte
  lib/          Scroll-Helfer (nativ), Hooks, Motion-Presets
  index.css     Design-System
server/
  contact.js    Kontakt-/E-Mail-Logik (useSend)
  index.js      Express-Server: prerenderte Seiten, Redirects, 404, /api/contact, /api/health
scripts/
  prerender.mjs Build-Schritt: HTML pro Route + sitemap.xml
  og/           Vorlage + Renderer für die Open-Graph-Bilder
Dockerfile · docker-compose.yml   Self-Hosting (Docker / Dokploy)
```

## Features

WebGL-Welt, die beim Scrollen zwischen Abschnitten „wandert" · 3D-Visitenkarte
(Scroll-Spin, Maus-Tilt, Klick zum Drehen) · CW-Monogramm-Preloader mit
Split-Curtain · 3D-Character-Reveals · Scroll-gescrubbtes Manifest ·
Velocity-Marquees · gestapelte Sticky-Service-Karten mit animierten
SVG-Illustrationen · gepinnte Coverflow-Projektgalerie mit Velocity-Skew ·
Prozess-Timeline mit Fortschrittsschiene · Custom Cursor · Scramble-Text ·
Kapitel-HUD · DE/EN-Umschalter · responsive · `prefers-reduced-motion`-freundlich.

## Self-Hosting (Docker / Dokploy)

Die Seite läuft als **ein** Container: ein schlanker Express-Server
(`server/index.js`) liefert das gebaute Frontend **und** die Kontakt-API
(`/api/contact`) auf demselben Port. Das Formular verschickt über
[useSend](https://usesend.com) (selfhosted Resend-Alternative) **zwei** E-Mails:
eine Benachrichtigung an dich (Reply-To = Absender) und eine gebrandete
Eingangsbestätigung an den Absender (in dessen Sprache, DE/EN).

```bash
# Lokal bauen & starten
docker compose up --build
# → http://localhost:3000
```

**Auf Dokploy:**

1. Neue **Application** anlegen → Source: dein GitHub-Repo (`sluhtie/portfolio`),
   Build Type: **Dockerfile**.
2. **Port** auf `3000` setzen.
3. **Environment Variables**: `USESEND_API_KEY` (Pflicht), `USESEND_BASE_URL`
   (deine useSend-Instanz, z. B. `https://send.cwcodes.de`), optional
   `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` / `CONTACT_FROM_NAME` (siehe `.env.example`).
4. **Domain** `www.cwcodes.de` (und `cwcodes.de`) zuweisen — Dokploy/Traefik
   übernimmt HTTPS. Mit `CANONICAL_HOST=www.cwcodes.de` leitet der Server
   `cwcodes.de` per 301 auf `www` um (weglassen, falls Traefik das schon macht).
5. Deploy. Health-Check läuft gegen `/api/health`.

(Alternativ den „Compose"-Typ mit `docker-compose.yml` nutzen.)

> Absender-Domain (`cwcodes.de`) in useSend verifizieren (DKIM/SPF-DNS-Records),
> damit die Mails nicht im Spam landen.

## SEO

- **Eine URL pro Sprache:** Deutsch unter `/`, Englisch unter `/en`
  (`/impressum` ↔ `/en/imprint`, `/datenschutz` ↔ `/en/privacy`), verknüpft per
  `hreflang`. Wer einmal EN gewählt hat, landet beim nächsten Besuch auf `/en`.
- **Prerendering:** `npm run build` rendert jede Seite zu fertigem HTML
  (`scripts/prerender.mjs` + `src/entry-server.tsx`), der Browser hydriert nur
  noch. Suchmaschinen und Link-Vorschauen sehen so den kompletten Text.
- **Head-Tags** (Title, Description, Canonical, OG/Twitter, JSON-LD mit
  `ProfessionalService` + `Person`) kommen zentral aus `src/lib/seo.ts`; die
  Texte für die Startseite stehen unter `meta` in `src/i18n/translations.ts`.
- **sitemap.xml** wird beim Build generiert (mit hreflang-Alternativen),
  `robots.txt` liegt in `public/`.
- **OG-Bilder** (`public/og-image.jpg` / `og-image-en.jpg`) werden aus
  `scripts/og/og.html` gerendert: `npx -y -p playwright@1 node scripts/og/render.mjs`.
- Unbekannte Pfade liefern eine echte **404** (`noindex`), alte/abweichende
  Schreibweisen werden per 301 auf die kanonische URL umgeleitet.

## Barrierefreiheit / Performance

- Respektiert `prefers-reduced-motion` (Animationen werden reduziert).
- WebGL pausiert bei verstecktem Tab bzw. außerhalb des Viewports; DPR gedeckelt.
- three.js lädt erst, wenn der Browser idle ist (Welt) bzw. die Visitenkarte in
  Sichtweite kommt; bei aktivem Datensparmodus gibt's den statischen CSS-Glow.
- Projekt-Screenshots sind echte `<img>` mit Alt-Text und `loading="lazy"`.
- Der Server komprimiert Antworten (gzip) und cached gehashte Assets 1 Jahr.
- Failsafes sorgen dafür, dass der Preloader nie hängen bleibt.
