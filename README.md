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
api/
  contact.ts    Vercel Serverless-Funktion — verschickt E-Mails via Brevo
```

## Features

Preloader · Custom Cursor · magnetische Buttons · Masken-Text-Reveals ·
Word-by-Word-Reveals · Scroll-Parallax · animierte Counter · gepinnte horizontale
Galerie · Marquees · Akkordeon-Services · Testimonial-Slider · Scroll-Progress ·
DE/EN-Umschalter · responsive · `prefers-reduced-motion`-freundlich.

## Kontaktformular (Brevo)

Das Formular postet an die Serverless-Funktion `api/contact.ts`, die via
[Brevo](https://www.brevo.com) **zwei** E-Mails verschickt: eine Benachrichtigung
an dich (mit Reply-To = Absender) und eine gebrandete Eingangsbestätigung an den
Absender (in dessen Sprache, DE/EN). Kostenlos bis 300 Mails/Tag, **keine eigene
Domain nötig**.

**Einrichtung:**

1. [Brevo](https://www.brevo.com)-Account erstellen → **Senders, Domains &
   Dedicated IPs → Senders** → `connor@cwcodes.de` als Absender hinzufügen und
   per Klick-Link in der Bestätigungs-Mail verifizieren.
2. **SMTP & API → API Keys** → Key generieren.
3. In Vercel unter **Settings → Environment Variables** `BREVO_API_KEY`
   hinterlegen (siehe `.env.example`). Re-deploy.

Optional für bessere Zustellbarkeit (kostenlos, nur DNS): in Brevo unter
**Domains** die DKIM/SPF-Records für `cwcodes.de` setzen.

Lokal testen mit `vercel dev` (plain `npm run dev` kennt die `api/`-Funktion
nicht → das Formular fällt dann auf `mailto:` zurück). Provider wechseln? Nur
`api/contact.ts` anpassen.

## Barrierefreiheit / Performance

- Respektiert `prefers-reduced-motion` (Animationen werden reduziert).
- WebGL pausiert bei verstecktem Tab; DPR auf 1.5 gedeckelt.
- Failsafes sorgen dafür, dass der Preloader nie hängen bleibt.
