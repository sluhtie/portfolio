# Projekt-Screenshots

Lege hier die **Full-Page-Screenshots** deiner Projekte ab. Erwartete Dateinamen
(genau so, sonst greift der Gradient-Fallback):

| Projekt           | Datei                |
| ----------------- | -------------------- |
| Orbt              | `orbt.png`           |
| Inselteam Usedom  | `ihreferien.png`     |
| Beeograph         | `beeograph.png`      |
| Rosenberger Event | `rosenberger.png`    |

## Tipps
- **Full-Page** aufnehmen (ganze Seite, nicht nur der sichtbare Teil).
  Chrome DevTools → `Cmd+Shift+P` → „Capture full size screenshot".
- Einheitliche Breite, z. B. **1440px** bei 2× Retina.
- Für kleinere Dateien als **WebP** exportieren und in
  `src/i18n/content.ts` die Endung `.png` → `.webp` ändern.
- Sehr lange Seiten ggf. auf ~2500–3000px Höhe kürzen.

Pfad wird in `src/i18n/content.ts` pro Projekt über das Feld `image` gesetzt.
