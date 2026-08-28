# Projekt-Screenshots

Full-Page-Screenshots der Projekte (als **WebP**, ~1600px breit, q80).
Erwartete Dateinamen (genau so, sonst greift der Gradient-Fallback):

| Projekt           | Datei                |
| ----------------- | -------------------- |
| Orbt              | `orbt.webp`          |
| Inselteam Usedom  | `ihreferien.webp`    |
| Beeograph         | `beeograph.webp`     |
| Rosenberger Event | `rosenberger.webp`   |
| Strassburger Pflegedienst | `strassburger-pflegedienst.webp` |

Strassburger Pflegedienst nutzt vorerst einen Ausschnitt der Startseite. Die
Vorschauen füllen ihre Bildfläche auch bei unterschiedlichen Seitenverhältnissen.

## Bild austauschen / neu aufnehmen
- **Full-Page** aufnehmen (ganze Seite): Chrome DevTools → `Cmd+Shift+P` →
  „Capture full size screenshot" → ergibt ein PNG.
- In WebP umwandeln (z. B. [squoosh.app](https://squoosh.app), Breite ~1600px)
  und unter obigem Namen hier ablegen.

Pfade werden in `src/i18n/content.ts` pro Projekt über das Feld `image` gesetzt.
