# TRAX – Transaktionsmanagement-Dashboard

Professionelles, institutionelles Web-Dashboard für das Management gewerblicher
und wohnwirtschaftlicher Immobilientransaktionen. Umsetzung der TRAX-Idee
(siehe [`../trax-transaction-mgmt/SYSTEM_PROMPT.md`](../trax-transaction-mgmt/SYSTEM_PROMPT.md))
als eigenständige React-App mit schlichtem Design-System (gedämpfte Farben,
klare Typografie, Ampel-Status).

## Funktionen

- **Daily Briefing** – Portfolio-KPIs, Transaktionsstatus mit Ampel, „Heute
  fällig / Überfällig / Diese Woche“, offene Risiken und priorisierte
  Handlungsempfehlungen.
- **Transaktionen** – Übersichtstabelle; Klick öffnet die Detailansicht.
- **Transaktions-Detail** – Objekt- & Parteidaten, Phasen-Fortschrittsleiste
  über die 6 Phasen, abhakbare Aufgabenliste und Risikoregister.
- **Aufgaben** – globale, nach Status & Kategorie filterbare Liste (überfällig
  rot hervorgehoben), sortiert nach Frist.
- **Risiken** – globales Risikoregister mit Ampellogik.
- **Neue Transaktion** – Formular legt einen Deal samt Start-Aufgaben an.

Deutsche Formatierung (€1.250.000, 5,75 %, DD.MM.YYYY). Daten sind Demo-Mock-
Daten im Frontend; Referenzdatum ist der 23.06.2026 (`src/format.ts`).

## Tech-Stack

React 18 · TypeScript · Vite. Kein Backend – State lebt im Browser.

## Lokal starten

```bash
cd trax-app
npm install
npm run dev      # Entwicklung mit Hot-Reload (http://localhost:5173)
# oder
npm run build && npm run preview   # Produktions-Build + Vorschau
```

## Struktur

```
src/
  data.ts          # Demo-Transaktionen, Aufgaben, Risiken
  types.ts         # Domänen-Typen (Transaktion, Aufgabe, Risiko, Phasen)
  format.ts        # de-DE Zahlen-/Datums-Formatierung, Fristenlogik
  styles.css       # Design-System (Tokens, Komponenten)
  components/       # Sidebar, DailyBriefing, Transactions, TransactionDetail,
                    # Tasks, Risks, NewTransactionModal, ui
  App.tsx          # Routing (State), Datenhaltung, Aktionen
```
