import type { Transaktion } from './types';

/**
 * Realistische Demo-Daten. Referenzdatum der App ist der 23.06.2026
 * (siehe format.ts → HEUTE). Deadlines sind so gesetzt, dass es
 * überfällige, heute fällige und in dieser Woche fällige Aufgaben gibt.
 */
export const TRANSAKTIONEN: Transaktion[] = [
  {
    id: 'TXN-2026-001',
    objekt: {
      bezeichnung: 'Bürogebäude München-Schwabing',
      adresse: 'Leopoldstraße 112, 80802 München',
      typ: 'Büro',
      nutzflaeche_qm: 8420,
      baujahr: 2009,
    },
    typ: 'Ankauf',
    phase: 'Verhandlung & Signing',
    kaufpreis: 42_500_000,
    rendite: 4.1,
    ampel: 'gelb',
    hinweis: 'KV v3 in Verhandlung – Haftungscap noch offen.',
    parteien: {
      verkaeufer: { name: 'Isarpark Real Estate GmbH', ansprechpartner: 'Dr. T. Lehmann' },
      kaeufer: { name: 'Grünkern Asset Management', ansprechpartner: 'M. Brandt' },
      makler: { name: 'CBRE München' },
      notar: { name: 'Dr. Müller', kontakt: 'München' },
    },
    aufgaben: [
      { id: 'T1-1', beschreibung: 'Rechtsanwalt: §12 Haftungsklauseln kommentieren', kategorie: 'Legal', prioritaet: 'Hoch', deadline: '2026-06-19', erledigt: false },
      { id: 'T1-2', beschreibung: 'IC-Vorlage finalisieren und versenden', kategorie: 'Admin', prioritaet: 'Hoch', deadline: '2026-06-23', erledigt: false },
      { id: 'T1-3', beschreibung: 'Notartermin für Signing bestätigen', kategorie: 'Admin', prioritaet: 'Mittel', deadline: '2026-06-26', erledigt: false },
      { id: 'T1-4', beschreibung: 'Finanzierungsbank: CP-Bestätigung anfordern', kategorie: 'Finance', prioritaet: 'Mittel', deadline: '2026-06-29', erledigt: false },
      { id: 'T1-5', beschreibung: 'Commercial DD Red Flag Report freigegeben', kategorie: 'Commercial', prioritaet: 'Mittel', deadline: '2026-06-10', erledigt: true },
    ],
    risiken: [
      { id: 'R1-1', kategorie: 'Legal', beschreibung: 'Haftungscap des Verkäufers unter Marktstandard', wahrscheinlichkeit: 'Mittel', impact: 'Hoch', status: 'Offen', massnahme: 'Nachverhandlung Cap auf 10 % KP' },
      { id: 'R1-2', kategorie: 'Timing', beschreibung: 'Signing-Termin von Notarverfügbarkeit abhängig', wahrscheinlichkeit: 'Niedrig', impact: 'Mittel', status: 'In Bearbeitung', massnahme: 'Alternativtermin reservieren' },
    ],
  },
  {
    id: 'TXN-2026-002',
    objekt: {
      bezeichnung: 'Logistikzentrum Leipzig-Nord',
      adresse: 'Am Güterring 4, 04158 Leipzig',
      typ: 'Logistik',
      nutzflaeche_qm: 31_200,
      baujahr: 2018,
    },
    typ: 'Ankauf',
    phase: 'Due Diligence',
    kaufpreis: 58_900_000,
    rendite: 5.2,
    ampel: 'rot',
    hinweis: 'Altlastenverdacht – Phase-II-Bodengutachten ausstehend.',
    parteien: {
      verkaeufer: { name: 'NordLog Property Fund', ansprechpartner: 'S. Krüger' },
      kaeufer: { name: 'Grünkern Asset Management', ansprechpartner: 'M. Brandt' },
      makler: { name: 'JLL Leipzig' },
      notar: { name: 'Notariat Sachsen-Mitte' },
    },
    aufgaben: [
      { id: 'T2-1', beschreibung: 'Bodengutachten Phase II beauftragen', kategorie: 'ESG', prioritaet: 'Hoch', deadline: '2026-06-18', erledigt: false },
      { id: 'T2-2', beschreibung: 'Legal DD: Grundbuch Abt. II/III prüfen', kategorie: 'Legal', prioritaet: 'Hoch', deadline: '2026-06-23', erledigt: false },
      { id: 'T2-3', beschreibung: 'WALT-Berechnung & Mietrisikoprofil', kategorie: 'Commercial', prioritaet: 'Mittel', deadline: '2026-06-25', erledigt: false },
      { id: 'T2-4', beschreibung: 'Term Sheets bei 3 Banken einholen', kategorie: 'Finance', prioritaet: 'Mittel', deadline: '2026-06-30', erledigt: false },
      { id: 'T2-5', beschreibung: 'Datenraum-Zugang für DD-Partner eingerichtet', kategorie: 'Admin', prioritaet: 'Niedrig', deadline: '2026-06-05', erledigt: true },
    ],
    risiken: [
      { id: 'R2-1', kategorie: 'ESG', beschreibung: 'Altlastenverdacht aus historischer Nutzung (Tanklager)', wahrscheinlichkeit: 'Hoch', impact: 'Hoch', status: 'Eskaliert', massnahme: 'Phase-II-Gutachten, Kaufpreiseinbehalt prüfen' },
      { id: 'R2-2', kategorie: 'Market', beschreibung: 'Single-Tenant – Klumpenrisiko bei Auszug', wahrscheinlichkeit: 'Mittel', impact: 'Hoch', status: 'Offen', massnahme: 'Mietvertragsverlängerung als CP verhandeln' },
      { id: 'R2-3', kategorie: 'Financial', beschreibung: 'Zinsumfeld erhöht Finanzierungskosten', wahrscheinlichkeit: 'Mittel', impact: 'Mittel', status: 'Offen', massnahme: 'Forward-Hedge prüfen' },
    ],
  },
  {
    id: 'TXN-2026-003',
    objekt: {
      bezeichnung: 'Wohnportfolio Berlin-Pankow',
      adresse: '7 Liegenschaften, 13187 Berlin',
      typ: 'Wohnen',
      nutzflaeche_qm: 14_650,
      baujahr: 1998,
    },
    typ: 'Portfolio',
    phase: 'Closing',
    kaufpreis: 36_200_000,
    rendite: 3.4,
    ampel: 'gruen',
    hinweis: 'Alle CPs erfüllt, Kaufpreisfälligkeit terminiert.',
    parteien: {
      verkaeufer: { name: 'Pankow Wohnbau eG', ansprechpartner: 'H. Vogt' },
      kaeufer: { name: 'Grünkern Asset Management', ansprechpartner: 'L. Sommer' },
      notar: { name: 'Dr. Schneider', kontakt: 'Berlin' },
    },
    aufgaben: [
      { id: 'T3-1', beschreibung: 'Kaufpreis-Überweisung intern freigeben', kategorie: 'Finance', prioritaet: 'Hoch', deadline: '2026-06-24', erledigt: false },
      { id: 'T3-2', beschreibung: 'Mieterwechselschreiben vorbereiten', kategorie: 'Admin', prioritaet: 'Mittel', deadline: '2026-06-27', erledigt: false },
      { id: 'T3-3', beschreibung: 'Property Manager briefen', kategorie: 'Admin', prioritaet: 'Niedrig', deadline: '2026-06-30', erledigt: false },
      { id: 'T3-4', beschreibung: 'Grundschuldbestellung beim Notar', kategorie: 'Legal', prioritaet: 'Hoch', deadline: '2026-06-12', erledigt: true },
      { id: 'T3-5', beschreibung: 'Vorkaufsrechtsverzicht Gemeinde eingeholt', kategorie: 'Legal', prioritaet: 'Hoch', deadline: '2026-06-08', erledigt: true },
    ],
    risiken: [
      { id: 'R3-1', kategorie: 'Regulatory', beschreibung: 'Mietendeckel-/Milieuschutz-Auflagen im Bezirk', wahrscheinlichkeit: 'Niedrig', impact: 'Mittel', status: 'In Bearbeitung', massnahme: 'Bestätigung Bezirksamt eingeholt' },
    ],
  },
  {
    id: 'TXN-2026-004',
    objekt: {
      bezeichnung: 'Geschäftshaus Köln-Innenstadt',
      adresse: 'Schildergasse 88, 50667 Köln',
      typ: 'Einzelhandel',
      nutzflaeche_qm: 4980,
      baujahr: 1986,
    },
    typ: 'Verkauf',
    phase: 'LOI',
    kaufpreis: 27_800_000,
    rendite: 4.8,
    ampel: 'gelb',
    hinweis: 'Exklusivität bis 10.07. – LOI-Konditionen offen.',
    parteien: {
      verkaeufer: { name: 'Grünkern Asset Management', ansprechpartner: 'M. Brandt' },
      kaeufer: { name: 'Rheinland Retail Invest', ansprechpartner: 'P. Adler' },
      makler: { name: 'Colliers Köln' },
    },
    aufgaben: [
      { id: 'T4-1', beschreibung: 'LOI-Konditionen mit Käufer verhandeln', kategorie: 'Commercial', prioritaet: 'Hoch', deadline: '2026-06-25', erledigt: false },
      { id: 'T4-2', beschreibung: 'Exklusivitätszeitraum dokumentieren', kategorie: 'Admin', prioritaet: 'Mittel', deadline: '2026-06-28', erledigt: false },
      { id: 'T4-3', beschreibung: 'Verkäufer-Datenraum aktualisieren', kategorie: 'Admin', prioritaet: 'Niedrig', deadline: '2026-07-02', erledigt: false },
      { id: 'T4-4', beschreibung: 'Drittverwendungsfähigkeit / Marktmiete geprüft', kategorie: 'Commercial', prioritaet: 'Mittel', deadline: '2026-06-15', erledigt: true },
    ],
    risiken: [
      { id: 'R4-1', kategorie: 'Market', beschreibung: 'Strukturwandel Einzelhandel – Reversionsrisiko Erdgeschossmiete', wahrscheinlichkeit: 'Mittel', impact: 'Mittel', status: 'Offen', massnahme: 'Mietausläufe staffeln, Nutzungskonzept prüfen' },
      { id: 'R4-2', kategorie: 'Counterparty', beschreibung: 'Finanzierungszusage des Käufers noch nicht bestätigt', wahrscheinlichkeit: 'Mittel', impact: 'Hoch', status: 'Offen', massnahme: 'Financing-Proof als LOI-Bedingung' },
    ],
  },
  {
    id: 'TXN-2026-005',
    objekt: {
      bezeichnung: 'Hotel Hamburg-HafenCity',
      adresse: 'Überseeallee 10, 20457 Hamburg',
      typ: 'Hotel',
      nutzflaeche_qm: 11_300,
      baujahr: 2015,
    },
    typ: 'Sale & Leaseback',
    phase: 'Akquisition',
    kaufpreis: 71_000_000,
    rendite: 5.6,
    ampel: 'gruen',
    hinweis: 'Teaser gesichtet – Erstindikation in Vorbereitung.',
    parteien: {
      verkaeufer: { name: 'HanseHotel Betriebs AG', ansprechpartner: 'C. Berger' },
      kaeufer: { name: 'Grünkern Asset Management', ansprechpartner: 'L. Sommer' },
      makler: { name: 'Savills Hamburg' },
    },
    aufgaben: [
      { id: 'T5-1', beschreibung: 'NDA prüfen und gegenzeichnen', kategorie: 'Legal', prioritaet: 'Hoch', deadline: '2026-06-26', erledigt: false },
      { id: 'T5-2', beschreibung: 'Erstindikation Kaufpreis / NIY erstellen', kategorie: 'Commercial', prioritaet: 'Mittel', deadline: '2026-06-29', erledigt: false },
      { id: 'T5-3', beschreibung: 'Investment Rationale für IC-Shortlist', kategorie: 'Admin', prioritaet: 'Niedrig', deadline: '2026-07-03', erledigt: false },
    ],
    risiken: [
      { id: 'R5-1', kategorie: 'Financial', beschreibung: 'Bonität des Pächters (Leaseback-Mieter) zu prüfen', wahrscheinlichkeit: 'Mittel', impact: 'Hoch', status: 'Offen', massnahme: 'Wirtschaftsauskunft + Konzerngarantie anfordern' },
    ],
  },
];
