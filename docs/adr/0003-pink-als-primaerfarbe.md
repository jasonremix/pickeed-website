# ADR-0003: Pink als Primärfarbe

- **Status:** angenommen
- **Datum:** 24.11.2026
- **Entscheid:** durch Product Owner (Frage C1)

## Entscheidung

Primärfarbe ist **Pickeed Pink `#E0157A`** mit der Skala und den Verläufen aus
[06 – Designkonzept](../06-designkonzept.md). Weiss ist die Basisfarbe. Violett (Akzent der
Live-Plattform) wird nicht verwendet.

## Regeln

- Weisser Text nur auf `pink-500` (4.61 : 1) und dunkler sowie auf `gradient-action`.
- Im Dunkelmodus: Primärflächen `#FF4F9A` mit dunklem Text `#0F0F12` (6.23 : 1).
- `pink-400` und das helle Ende von `gradient-bloom` nur für Dekor und grosse Schrift.
- Alle Farbwerte kommen aus den Tokens in `packages/ui/src/styles/tokens.css`; Hex-Werte im
  Anwendungscode sind nicht erlaubt.

## Konsequenzen

- Logo und App-Icon werden passend zur Pink-Welt gestaltet, sobald Logo-Dateien vorliegen (Frage C2).
  Bis dahin wird eine provisorische Wortmarke verwendet.
