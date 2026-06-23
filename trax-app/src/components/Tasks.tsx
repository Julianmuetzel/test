import { useState } from 'react';
import type { Transaktion, AufgabenKategorie } from '../types';
import { formatDatum, tageBis } from '../format';

interface Props {
  txns: Transaktion[];
  onToggleTask: (txId: string, taskId: string) => void;
  onOpen: (id: string) => void;
}

type StatusFilter = 'offen' | 'erledigt' | 'alle';

const KATEGORIEN: AufgabenKategorie[] = ['Legal', 'Commercial', 'Finance', 'Technical', 'Admin', 'ESG'];

export function Tasks({ txns, onToggleTask, onOpen }: Props) {
  const [status, setStatus] = useState<StatusFilter>('offen');
  const [kat, setKat] = useState<AufgabenKategorie | 'alle'>('alle');

  const rows = txns
    .flatMap((t) => t.aufgaben.map((a) => ({ ...a, txId: t.id, objekt: t.objekt.bezeichnung })))
    .filter((a) => (status === 'alle' ? true : status === 'offen' ? !a.erledigt : a.erledigt))
    .filter((a) => (kat === 'alle' ? true : a.kategorie === kat))
    .sort((a, b) => (tageBis(a.deadline) ?? 9999) - (tageBis(b.deadline) ?? 9999));

  return (
    <div>
      <div className="filters">
        <span className="filter-label">Status</span>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          <option value="offen">Offen</option>
          <option value="erledigt">Erledigt</option>
          <option value="alle">Alle</option>
        </select>
        <span className="filter-label">Kategorie</span>
        <select className="select" value={kat} onChange={(e) => setKat(e.target.value as AufgabenKategorie | 'alle')}>
          <option value="alle">Alle</option>
          {KATEGORIEN.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-3)' }}>{rows.length} Aufgaben</span>
      </div>

      <div className="card">
        <table className="tx">
          <thead>
            <tr>
              <th style={{ width: 38 }}></th>
              <th>Aufgabe</th>
              <th>Transaktion</th>
              <th>Kategorie</th>
              <th>Priorität</th>
              <th>Frist</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const tage = tageBis(a.deadline);
              const over = !a.erledigt && tage !== null && tage < 0;
              return (
                <tr key={`${a.txId}-${a.id}`} className={a.erledigt ? 'done' : ''}>
                  <td>
                    <button
                      className={`checkbox ${a.erledigt ? 'on' : ''}`}
                      onClick={() => onToggleTask(a.txId, a.id)}
                      aria-label="Aufgabe abhaken"
                    >
                      {a.erledigt ? '✓' : ''}
                    </button>
                  </td>
                  <td style={a.erledigt ? { color: 'var(--ink-3)', textDecoration: 'line-through' } : undefined}>
                    {a.beschreibung}
                  </td>
                  <td>
                    <button
                      className="txid"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      onClick={() => onOpen(a.txId)}
                    >
                      {a.txId}
                    </button>
                  </td>
                  <td><span className="chip">{a.kategorie}</span></td>
                  <td><span className={`chip prio-${a.prioritaet}`}>{a.prioritaet}</span></td>
                  <td style={{ color: over ? 'var(--rot)' : 'var(--ink-2)', fontWeight: over ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
                    {a.deadline ? (over ? `überfällig · ${formatDatum(a.deadline)}` : formatDatum(a.deadline)) : '–'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
