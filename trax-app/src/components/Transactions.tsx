import type { Transaktion } from '../types';
import { AmpelPill } from './ui';
import { formatEuro, formatProzent } from '../format';

interface Props {
  txns: Transaktion[];
  onOpen: (id: string) => void;
}

export function Transactions({ txns, onOpen }: Props) {
  return (
    <div className="card">
      <table className="tx">
        <thead>
          <tr>
            <th style={{ width: 130 }}>Transaktion</th>
            <th>Objekt</th>
            <th>Typ</th>
            <th>Phase</th>
            <th className="num">Kaufpreis</th>
            <th className="num">NIY</th>
            <th style={{ width: 150 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t) => (
            <tr key={t.id} className="clickable" onClick={() => onOpen(t.id)}>
              <td className="txid">{t.id}</td>
              <td>
                <div style={{ fontWeight: 550 }}>{t.objekt.bezeichnung}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{t.objekt.typ}</div>
              </td>
              <td className="mono">{t.typ}</td>
              <td className="mono">{t.phase}</td>
              <td className="num">{formatEuro(t.kaufpreis)}</td>
              <td className="num">{formatProzent(t.rendite)}</td>
              <td><AmpelPill ampel={t.ampel} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
