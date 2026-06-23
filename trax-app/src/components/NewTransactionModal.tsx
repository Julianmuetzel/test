import { useState } from 'react';
import type { Transaktion, TxnTyp, ObjektTyp, Phase } from '../types';

interface Props {
  onClose: () => void;
  onCreate: (txn: Transaktion) => void;
  nextId: string;
}

const TXN_TYPEN: TxnTyp[] = ['Ankauf', 'Verkauf', 'Forward Deal', 'Sale & Leaseback', 'Portfolio'];
const OBJ_TYPEN: ObjektTyp[] = ['Büro', 'Einzelhandel', 'Wohnen', 'Logistik', 'Hotel', 'Mixed-Use'];
const PHASEN: Phase[] = ['Akquisition', 'LOI', 'Due Diligence', 'Verhandlung & Signing', 'Closing', 'Post-Closing'];

export function NewTransactionModal({ onClose, onCreate, nextId }: Props) {
  const [bezeichnung, setBezeichnung] = useState('');
  const [adresse, setAdresse] = useState('');
  const [objektTyp, setObjektTyp] = useState<ObjektTyp>('Büro');
  const [txnTyp, setTxnTyp] = useState<TxnTyp>('Ankauf');
  const [phase, setPhase] = useState<Phase>('Akquisition');
  const [kaufpreis, setKaufpreis] = useState('');
  const [verkaeufer, setVerkaeufer] = useState('');

  const valid = bezeichnung.trim() !== '' && kaufpreis.trim() !== '';

  function submit() {
    if (!valid) return;
    const txn: Transaktion = {
      id: nextId,
      objekt: {
        bezeichnung: bezeichnung.trim(),
        adresse: adresse.trim() || '—',
        typ: objektTyp,
        nutzflaeche_qm: 0,
        baujahr: new Date().getFullYear(),
      },
      typ: txnTyp,
      phase,
      kaufpreis: Number(kaufpreis.replace(/\./g, '').replace(/[^0-9]/g, '')) || 0,
      rendite: null,
      ampel: 'gruen',
      hinweis: 'Neu angelegt – Erstprüfung ausstehend.',
      parteien: {
        verkaeufer: { name: verkaeufer.trim() || 'tbd' },
        kaeufer: { name: 'Grünkern Asset Management' },
      },
      aufgaben: [
        { id: `${nextId}-A1`, beschreibung: 'Erstbewertung Objekt: Lage, Typ, Volumen', kategorie: 'Commercial', prioritaet: 'Hoch', deadline: null, erledigt: false },
        { id: `${nextId}-A2`, beschreibung: 'Exposé / Teaser beim Makler anfordern', kategorie: 'Admin', prioritaet: 'Mittel', deadline: null, erledigt: false },
        { id: `${nextId}-A3`, beschreibung: 'NDA anfragen und intern genehmigen lassen', kategorie: 'Legal', prioritaet: 'Mittel', deadline: null, erledigt: false },
      ],
      risiken: [],
    };
    onCreate(txn);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h2>Neue Transaktion anlegen</h2>
          <button className="back" style={{ padding: 0 }} onClick={onClose}>✕</button>
        </div>
        <div className="card-body">
          <div className="field">
            <label>Objektbezeichnung *</label>
            <input value={bezeichnung} onChange={(e) => setBezeichnung(e.target.value)} placeholder="z. B. Bürogebäude München-Schwabing" />
          </div>
          <div className="field">
            <label>Adresse</label>
            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Straße, PLZ Ort" />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Objekttyp</label>
              <select value={objektTyp} onChange={(e) => setObjektTyp(e.target.value as ObjektTyp)}>
                {OBJ_TYPEN.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Transaktionstyp</label>
              <select value={txnTyp} onChange={(e) => setTxnTyp(e.target.value as TxnTyp)}>
                {TXN_TYPEN.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Phase</label>
              <select value={phase} onChange={(e) => setPhase(e.target.value as Phase)}>
                {PHASEN.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Kaufpreis (€) *</label>
              <input value={kaufpreis} onChange={(e) => setKaufpreis(e.target.value)} placeholder="z. B. 42500000" inputMode="numeric" />
            </div>
          </div>
          <div className="field">
            <label>Verkäufer</label>
            <input value={verkaeufer} onChange={(e) => setVerkaeufer(e.target.value)} placeholder="Name des Verkäufers" />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={submit} disabled={!valid} style={!valid ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
            Transaktion anlegen
          </button>
        </div>
      </div>
    </div>
  );
}
