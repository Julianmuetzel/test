export type View = 'briefing' | 'transaktionen' | 'aufgaben' | 'risiken';

interface Props {
  view: View;
  onNavigate: (v: View) => void;
  offeneAufgaben: number;
  offeneRisiken: number;
}

const ITEMS: { key: View; label: string; ico: string }[] = [
  { key: 'briefing', label: 'Daily Briefing', ico: '◳' },
  { key: 'transaktionen', label: 'Transaktionen', ico: '▦' },
  { key: 'aufgaben', label: 'Aufgaben', ico: '☑' },
  { key: 'risiken', label: 'Risiken', ico: '⚠' },
];

export function Sidebar({ view, onNavigate, offeneAufgaben, offeneRisiken }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">TX</div>
        <div>
          <div className="brand-name">TRAX</div>
          <div className="brand-sub">Transaktionsmanagement</div>
        </div>
      </div>

      <div className="nav-section">Navigation</div>
      {ITEMS.map((it) => (
        <button
          key={it.key}
          className={`nav-item ${view === it.key ? 'active' : ''}`}
          onClick={() => onNavigate(it.key)}
        >
          <span className="ico">{it.ico}</span>
          {it.label}
          {it.key === 'aufgaben' && offeneAufgaben > 0 && (
            <span className="nav-badge">{offeneAufgaben}</span>
          )}
          {it.key === 'risiken' && offeneRisiken > 0 && (
            <span className="nav-badge">{offeneRisiken}</span>
          )}
        </button>
      ))}

      <div className="sidebar-foot">
        Grünkern Asset Management
        <br />
        Vertraulich – interner Gebrauch
      </div>
    </aside>
  );
}
