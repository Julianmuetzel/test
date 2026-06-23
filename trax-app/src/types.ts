export type Ampel = 'gruen' | 'gelb' | 'rot';

export type TxnTyp =
  | 'Ankauf'
  | 'Verkauf'
  | 'Forward Deal'
  | 'Sale & Leaseback'
  | 'Portfolio';

export type Phase =
  | 'Akquisition'
  | 'LOI'
  | 'Due Diligence'
  | 'Verhandlung & Signing'
  | 'Closing'
  | 'Post-Closing';

export const PHASEN: Phase[] = [
  'Akquisition',
  'LOI',
  'Due Diligence',
  'Verhandlung & Signing',
  'Closing',
  'Post-Closing',
];

export type ObjektTyp =
  | 'Büro'
  | 'Einzelhandel'
  | 'Wohnen'
  | 'Logistik'
  | 'Hotel'
  | 'Mixed-Use';

export type AufgabenKategorie =
  | 'Legal'
  | 'Commercial'
  | 'Finance'
  | 'Technical'
  | 'Admin'
  | 'ESG';

export type Prioritaet = 'Hoch' | 'Mittel' | 'Niedrig';

export interface Aufgabe {
  id: string;
  beschreibung: string;
  kategorie: AufgabenKategorie;
  prioritaet: Prioritaet;
  /** ISO-Datum YYYY-MM-DD, optional */
  deadline: string | null;
  erledigt: boolean;
}

export type RisikoKategorie =
  | 'Legal'
  | 'Financial'
  | 'Technical'
  | 'Market'
  | 'ESG'
  | 'Regulatory'
  | 'Counterparty'
  | 'Timing';

export type Stufe = 'Niedrig' | 'Mittel' | 'Hoch';
export type RisikoStatus = 'Offen' | 'In Bearbeitung' | 'Eskaliert' | 'Geschlossen';

export interface Risiko {
  id: string;
  kategorie: RisikoKategorie;
  beschreibung: string;
  wahrscheinlichkeit: Stufe;
  impact: Stufe;
  status: RisikoStatus;
  massnahme: string;
}

export interface Partei {
  name: string;
  ansprechpartner?: string;
  kontakt?: string;
}

export interface Transaktion {
  id: string;
  objekt: {
    bezeichnung: string;
    adresse: string;
    typ: ObjektTyp;
    nutzflaeche_qm: number;
    baujahr: number;
  };
  typ: TxnTyp;
  phase: Phase;
  kaufpreis: number;
  rendite: number | null;
  ampel: Ampel;
  hinweis: string;
  parteien: {
    verkaeufer: Partei;
    kaeufer: Partei;
    makler?: Partei;
    notar?: Partei;
  };
  aufgaben: Aufgabe[];
  risiken: Risiko[];
}
