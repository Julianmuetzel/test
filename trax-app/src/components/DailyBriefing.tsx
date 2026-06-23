import type { Transaktion } from '../types';
import { AmpelPill } from './ui';
import {
  HEUTE,
  formatEuroMio,
  formatDatum,
  langDatum,
  tageBis,
} from '../format';

interface Props {
  txns: Transaktion[];
  onOpen: (id: string) => void;
}

interface AufgabeFlat {
  txId: string;
  objekt: string;
  beschreibung: string;
  deadline: string | null;
  tage: number | null;
}

export function DailyBriefing({ txns, onOpen }: Props) {
  const aktive = txns.length;
  const volumen = txns.reduce((s, t) => s + t.kaufpreis, 0);
  const ankaeufe = txns.filter((t) => t.typ !== 'Verkauf').length;
  const verkaeufe = txns.filter((t) => t.typ === 'Verkauf').length;

  const offene: AufgabeFlat[] = txns.flatMap((t) =>
    t.aufgaben
      .filter((a) => !a.erledigt)
      .map((a) => ({
        txId: t.id,
        objekt: t.objekt.bezeichnung,
        beschreibung: a.beschreibung,
        deadline: a.deadline,
        tage: tageBis(a.deadline),
      })),
  );

  const heute = offene.filter((a) => a.tage === 0).sort(sortByTage);
  const ueberfaellig = offene.filter((a) => a.tage !== null && a.tage < 0).sort(sortByTage);
  const woche = offene
    .filter((a) => a.tage !== null && a.tage > 0 && a.tage <= 7)
    .sort(sortByTage);

  const risiken = txns.flatMap((t) =>
    t.risiken
      .filter((r) => r.status === 'Offen' || r.status === 'Eskaliert')
      .map((r) => ({ txId: t.id, objekt: t.objekt.bezeichnung, ...r })),
  );

  const empfehlungen = buildEmpfehlungen(ueberfaellig, heute, risiken);

  return (
    <div>
      <div className="kpi-row">
        <Kpi label="Aktive Transaktionen" value={String(aktive)} meta={`${ankaeufe} Ankäufe · ${verkaeufe} Verkäufe`} />
        <Kpi label="Gesamtvolumen" value={formatEuroMio(volumen)} meta="Summe Kaufpreise" />
        <Kpi label="Überfällige Aufgaben" value={String(ueberfaellig.length)} meta="Eskalation prüfen" />
        <Kpi label="Offene Risiken" value={String(risiken.length)} meta="inkl. eskalierter" />
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <h2>Transaktionsstatus</h2>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{langDatum(HEUTE)}</span>
        </div>
        <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
          {txns.map((t) => (
            <div key={t.id} className="brief-row">
              <AmpelPill ampel={t.ampel} />
              <div className="grow">
                <div className="title">
                  <span className="txid">{t.id}</span> &nbsp;{t.objekt.bezeichnung}
                </div>
                <div className="meta">{t.phase} · {t.hinweis}</div>
              </div>
              <button className="btn" onClick={() => onOpen(t.id)}>Öffnen</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <BriefCard title="Heute fällig" rows={heute} onOpen={onOpen} empty="Keine Aufgaben mit Fälligkeit heute." />
          <BriefCard title="Überfällig" rows={ueberfaellig} onOpen={onOpen} empty="Keine überfälligen Aufgaben." />
          <BriefCard title="Diese Woche" rows={woche} onOpen={onOpen} empty="Keine weiteren Aufgaben in den nächsten 7 Tagen." />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h2>Offene Risiken</h2></div>
            <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
              {risiken.length === 0 && <div className="empty">Keine offenen Risiken.</div>}
              {risiken.map((r) => (
                <div key={r.id} className="brief-row">
                  <span className={`dot ${r.status === 'Eskaliert' ? 'rot' : 'gelb'}`} />
                  <div className="grow">
                    <div className="title">{r.beschreibung}</div>
                    <div className="meta">
                      <span className="txid">{r.txId}</span> · {r.kategorie} · {r.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h2>Empfehlungen für heute</h2></div>
            <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
              {empfehlungen.map((e, i) => (
                <div key={i} className="rec">
                  <span className="n">{i + 1}</span>
                  <div>{e}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefCard({
  title,
  rows,
  empty,
  onOpen,
}: {
  title: string;
  rows: AufgabeFlat[];
  empty: string;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="card">
      <div className="card-head">
        <h2>{title}</h2>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{rows.length}</span>
      </div>
      <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {rows.length === 0 && <div className="empty">{empty}</div>}
        {rows.map((a, i) => (
          <div key={i} className="brief-row">
            <div className="grow">
              <div className="title">{a.beschreibung}</div>
              <div className="meta">
                <button
                  className="txid"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  onClick={() => onOpen(a.txId)}
                >
                  {a.txId}
                </button>{' '}
                · {a.objekt}
              </div>
            </div>
            <span className={`due-tag ${dueClass(a.tage)}`}>{dueText(a.tage, a.deadline)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="meta">{meta}</div>
    </div>
  );
}

function sortByTage(a: AufgabeFlat, b: AufgabeFlat) {
  return (a.tage ?? 9999) - (b.tage ?? 9999);
}

function dueClass(tage: number | null): string {
  if (tage === null) return 'soon';
  if (tage < 0) return 'over';
  if (tage === 0) return 'today';
  return 'soon';
}

function dueText(tage: number | null, deadline: string | null): string {
  if (tage === null) return 'ohne Frist';
  if (tage < 0) return `seit ${Math.abs(tage)} ${Math.abs(tage) === 1 ? 'Tag' : 'Tagen'}`;
  if (tage === 0) return 'heute';
  return `in ${tage} ${tage === 1 ? 'Tag' : 'Tagen'} · ${formatDatum(deadline)}`;
}

function buildEmpfehlungen(
  ueberfaellig: AufgabeFlat[],
  heute: AufgabeFlat[],
  risiken: { status: string; beschreibung: string; txId: string }[],
): string[] {
  const out: string[] = [];
  if (ueberfaellig.length > 0) {
    out.push(`${ueberfaellig.length} überfällige Aufgabe(n) priorisieren – beginnend mit „${ueberfaellig[0].beschreibung}“ (${ueberfaellig[0].txId}).`);
  }
  const esk = risiken.find((r) => r.status === 'Eskaliert');
  if (esk) {
    out.push(`Eskaliertes Risiko in ${esk.txId} adressieren: ${esk.beschreibung}.`);
  }
  if (heute.length > 0) {
    out.push(`${heute.length} heute fällige Aufgabe(n) abschließen, u. a. „${heute[0].beschreibung}“.`);
  }
  out.push('Wöchentlichen DD-Status-Call mit allen Beratern terminieren (Phase 2 aktiv).');
  return out.slice(0, 4);
}
