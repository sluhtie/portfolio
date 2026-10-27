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
npm run build    # Production-Build nach dist/
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
  index.js      Express-Server: liefert dist/ + /api/contact + /api/health
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
4. **Domain** `cwcodes.de` zuweisen — Dokploy/Traefik übernimmt HTTPS.
5. Deploy. Health-Check läuft gegen `/api/health`.

(Alternativ den „Compose"-Typ mit `docker-compose.yml` nutzen.)

> Absender-Domain (`cwcodes.de`) in useSend verifizieren (DKIM/SPF-DNS-Records),
> damit die Mails nicht im Spam landen.

## Barrierefreiheit / Performance

- Respektiert `prefers-reduced-motion` (Animationen werden reduziert).
- WebGL pausiert bei verstecktem Tab bzw. außerhalb des Viewports; DPR gedeckelt.
- Failsafes sorgen dafür, dass der Preloader nie hängen bleibt.
