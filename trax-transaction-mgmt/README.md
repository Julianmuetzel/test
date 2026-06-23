# TRAX — Institutionelles Immobilien-Transaktionsmanagement-Tool

TRAX (**Tra**nsaction AI e**X**pert) ist ein KI-Assistent für das vollständige
Management von gewerblichen und wohnwirtschaftlichen Immobilientransaktionen in
Deutschland (optional international). Er agiert als strukturierter Co-Pilot für
Transaktionsmanager auf Käufer- und Verkäuferseite und begleitet Deals über alle
Phasen — von der Akquisition bis zum Post-Closing.

## Inhalt dieses Repositorys

| Datei | Beschreibung |
|---|---|
| [`SYSTEM_PROMPT.md`](./SYSTEM_PROMPT.md) | Vollständiger System-Prompt (Rolle, Prozesse, Befehle, Verhaltensprinzipien). |
| [`memory.schema.json`](./memory.schema.json) | JSON-Schema (Draft 2020-12) für das transaktionsspezifische Gedächtnis. |

## Funktionsumfang

- **Transaktions-Gedächtnis** — strukturiertes, dauerhaft gepflegtes Protokoll
  pro Transaktion (siehe `memory.schema.json`).
- **Tägliches Status-Briefing** — Ampelstatus, fällige/überfällige Aufgaben,
  Meilensteine, Risiken und priorisierte Handlungsempfehlungen.
- **6-Phasen-Prozessmodell** — Akquisition, LOI, Due Diligence, Verhandlung &
  Signing, Closing, Post-Closing — jeweils mit automatisch generiertem
  Aufgabenkatalog.
- **Dokumenten- & E-Mail-Analyse** — Klassifizierung, Informationsextraktion und
  automatische Aufgaben-Generierung aus hochgeladenen Dateien.
- **Risikomanagement** — automatisches Risikoregister mit Ampellogik.
- **Berechnungen** — Kaufpreis-, Rendite-, DCF- und Finanzierungskennzahlen
  sowie Grunderwerbsteuer.

## Befehle (Auswahl)

| Befehl | Aktion |
|---|---|
| `/neu` | Neue Transaktion anlegen |
| `/status` | Tagesüberblick aller Transaktionen |
| `/txn [ID]` | Detailansicht einer Transaktion |
| `/aufgaben [ID]` | Aufgabenliste einer Transaktion |
| `/risiken [ID]` | Risikoregister einer Transaktion |
| `/upload` | Dokument / E-Mail analysieren |
| `/kalkulation` | Rendite- / Kaufpreiskalkulation starten |
| `/phase [ID] [Phase]` | Transaktion in nächste Phase setzen |
| `/bericht [ID]` | Vollständigen Transaktionsbericht erstellen |
| `/help` | Alle Befehle und Funktionen anzeigen |

Die vollständige Befehlsreferenz steht in [`SYSTEM_PROMPT.md`](./SYSTEM_PROMPT.md).

## Nutzung

Der Inhalt von `SYSTEM_PROMPT.md` wird als System-Prompt eines LLM-basierten
Assistenten verwendet. Das `memory.schema.json` validiert den pro Transaktion
gepflegten Gedächtnis-State.

---

*TRAX — Institutionelles Transaktionsmanagement, powered by AI*
*Vertraulich — Nur für internen Gebrauch*
