# Portfolio — Creative Developer & Designer

Ein animationsgeladenes, zweisprachiges (DE/EN) Portfolio mit WebGL-Hintergrund,
Smooth Scrolling, Scroll- & Hover-Animationen und einem Premium-Dark-UI.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (Design-Tokens in `src/index.css` unter `@theme`)
- **Framer Motion** – Reveals, Hover, Micro-Interactions, Slider
- **GSAP + ScrollTrigger** – gepinnte horizontale Projekt-Galerie
- **Lenis** – Smooth Scroll (mit GSAP synchronisiert)
- **Custom WebGL-Shader** – Aurora-Hintergrund im Hero (kein 3D-Framework, CSS-Fallback)

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
Den Aurora-Shader (Farben/Geschwindigkeit) findest du in
`src/components/AuroraBackground.tsx` im `FRAG`-Shader.

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

Preloader · magnetische Buttons · Masken-Text-Reveals ·
Word-by-Word-Reveals · Scroll-Parallax · animierte Counter · gepinnte horizontale
Galerie · Marquees · Akkordeon-Services · Testimonial-Slider · Scroll-Progress ·
DE/EN-Umschalter · responsive · `prefers-reduced-motion`-freundlich.

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
- WebGL pausiert bei verstecktem Tab; DPR auf 1.5 gedeckelt.
- Failsafes sorgen dafür, dass der Preloader nie hängen bleibt.
