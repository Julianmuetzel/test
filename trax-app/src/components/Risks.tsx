import type { Transaktion } from '../types';

interface Props {
  txns: Transaktion[];
  onOpen: (id: string) => void;
}

function stufeRank(s: string): number {
  return s === 'Hoch' ? 3 : s === 'Mittel' ? 2 : 1;
}

export function Risks({ txns, onOpen }: Props) {
  const rows = txns
    .flatMap((t) => t.risiken.map((r) => ({ ...r, txId: t.id, objekt: t.objekt.bezeichnung })))
    .sort((a, b) => stufeRank(b.impact) * stufeRank(b.wahrscheinlichkeit) - stufeRank(a.impact) * stufeRank(a.wahrscheinlichkeit));

  return (
    <div className="card">
      <table className="tx">
        <thead>
          <tr>
            <th style={{ width: 26 }}></th>
            <th>Risiko</th>
            <th>Transaktion</th>
            <th>Kategorie</th>
            <th>Wahrsch.</th>
            <th>Impact</th>
            <th>Status</th>
            <th>Maßnahme</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.txId}-${r.id}`}>
              <td>
                <span className={`dot ${r.status === 'Eskaliert' ? 'rot' : r.status === 'Geschlossen' ? 'gruen' : 'gelb'}`} />
              </td>
              <td style={{ fontWeight: 550 }}>{r.beschreibung}</td>
              <td>
                <button
                  className="txid"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={() => onOpen(r.txId)}
                >
                  {r.txId}
                </button>
              </td>
              <td className="mono">{r.kategorie}</td>
              <td className="mono">{r.wahrscheinlichkeit}</td>
              <td className="mono">{r.impact}</td>
              <td>
                <span className={`chip ${r.status === 'Eskaliert' ? 'prio-Hoch' : r.status === 'Offen' ? 'prio-Mittel' : 'prio-Niedrig'}`}>
                  {r.status}
                </span>
              </td>
              <td style={{ color: 'var(--ink-2)', maxWidth: 240 }}>{r.massnahme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
