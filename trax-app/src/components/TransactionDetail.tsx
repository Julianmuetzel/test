import type { Transaktion } from '../types';
import { PHASEN } from '../types';
import { AmpelPill } from './ui';
import { formatEuro, formatProzent, formatDatum, tageBis } from '../format';

interface Props {
  txn: Transaktion;
  onBack: () => void;
  onToggleTask: (txId: string, taskId: string) => void;
}

export function TransactionDetail({ txn, onBack, onToggleTask }: Props) {
  const currentIdx = PHASEN.indexOf(txn.phase);

  return (
    <div>
      <button className="back" onClick={onBack}>← Zurück zur Übersicht</button>

      <div className="detail-head">
        <div>
          <span className="txid">{txn.id}</span>
          <h1>{txn.objekt.bezeichnung}</h1>
          <div className="addr">{txn.objekt.adresse}</div>
        </div>
        <AmpelPill ampel={txn.ampel} />
      </div>

      <div className="meta-grid">
        <MetaCell k="Transaktionstyp" v={txn.typ} />
        <MetaCell k="Kaufpreis" v={formatEuro(txn.kaufpreis)} />
        <MetaCell k="Nettoanfangsrendite" v={formatProzent(txn.rendite)} />
        <MetaCell k="Objekttyp" v={txn.objekt.typ} />
        <MetaCell k="Nutzfläche" v={`${new Intl.NumberFormat('de-DE').format(txn.objekt.nutzflaeche_qm)} m²`} />
        <MetaCell k="Baujahr" v={String(txn.objekt.baujahr)} />
        <MetaCell k="Aktuelle Phase" v={txn.phase} />
        <MetaCell k="Offene Aufgaben" v={String(txn.aufgaben.filter((a) => !a.erledigt).length)} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head"><h2>Phasen-Fortschritt</h2></div>
        <div className="card-body" style={{ paddingTop: 18, paddingBottom: 22 }}>
          <div className="phases">
            {PHASEN.map((p, i) => (
              <div
                key={p}
                className={`phase-step ${i < currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}
              >
                <span className="pbar" />
                <span className="pnode" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cols">
        <div className="card">
          <div className="card-head"><h2>Parteien</h2></div>
          <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
            <PartyRow role="Verkäufer" name={txn.parteien.verkaeufer.name} ap={txn.parteien.verkaeufer.ansprechpartner} />
            <PartyRow role="Käufer" name={txn.parteien.kaeufer.name} ap={txn.parteien.kaeufer.ansprechpartner} />
            {txn.parteien.makler && <PartyRow role="Makler" name={txn.parteien.makler.name} ap={txn.parteien.makler.ansprechpartner} />}
            {txn.parteien.notar && <PartyRow role="Notar" name={txn.parteien.notar.name} ap={txn.parteien.notar.kontakt} />}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Risikoregister</h2>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{txn.risiken.length}</span>
          </div>
          <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
            {txn.risiken.length === 0 && <div className="empty">Keine erfassten Risiken.</div>}
            {txn.risiken.map((r) => (
              <div key={r.id} className="brief-row">
                <span className={`dot ${r.status === 'Eskaliert' ? 'rot' : r.status === 'Geschlossen' ? 'gruen' : 'gelb'}`} />
                <div className="grow">
                  <div className="title">{r.beschreibung}</div>
                  <div className="meta">
                    {r.kategorie} · W: {r.wahrscheinlichkeit} · Impact: {r.impact} · {r.status}
                  </div>
                  <div className="meta" style={{ marginTop: 2 }}>Maßnahme: {r.massnahme}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="card">
        <div className="card-head">
          <h2>Aufgaben</h2>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {txn.aufgaben.filter((a) => a.erledigt).length}/{txn.aufgaben.length} erledigt
          </span>
        </div>
        <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
          {txn.aufgaben.map((a) => {
            const tage = tageBis(a.deadline);
            const over = !a.erledigt && tage !== null && tage < 0;
            return (
              <div key={a.id} className={`task ${a.erledigt ? 'done' : ''}`}>
                <button
                  className={`checkbox ${a.erledigt ? 'on' : ''}`}
                  onClick={() => onToggleTask(txn.id, a.id)}
                  aria-label="Aufgabe abhaken"
                >
                  {a.erledigt ? '✓' : ''}
                </button>
                <div className="grow">
                  <div className="t-desc">{a.beschreibung}</div>
                  <div className="t-meta">
                    <span className="chip">{a.kategorie}</span>
                    <span className={`chip prio-${a.prioritaet}`}>{a.prioritaet}</span>
                    {a.deadline && (
                      <span style={{ fontSize: 12, color: over ? 'var(--rot)' : 'var(--ink-3)', fontWeight: over ? 600 : 400 }}>
                        {over ? `überfällig seit ${formatDatum(a.deadline)}` : `Frist ${formatDatum(a.deadline)}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetaCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="meta-cell">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}

function PartyRow({ role, name, ap }: { role: string; name: string; ap?: string }) {
  return (
    <div className="party">
      <span className="role">{role}</span>
      <span className="who">
        {name}
        {ap && <small>{ap}</small>}
      </span>
    </div>
  );
}
