import { useMemo, useState } from 'react';
import type { Transaktion } from './types';
import { TRANSAKTIONEN } from './data';
import { Sidebar, type View } from './components/Sidebar';
import { DailyBriefing } from './components/DailyBriefing';
import { Transactions } from './components/Transactions';
import { TransactionDetail } from './components/TransactionDetail';
import { Tasks } from './components/Tasks';
import { Risks } from './components/Risks';
import { NewTransactionModal } from './components/NewTransactionModal';
import { langDatum } from './format';
import { HEUTE } from './format';

const TITLES: Record<View, { title: string; sub: string }> = {
  briefing: { title: 'Daily Briefing', sub: langDatum(HEUTE) },
  transaktionen: { title: 'Transaktionen', sub: 'Alle aktiven Deals im Überblick' },
  aufgaben: { title: 'Aufgaben', sub: 'Aufgaben über alle Transaktionen' },
  risiken: { title: 'Risikoregister', sub: 'Risiken über alle Transaktionen' },
};

export function App() {
  const [txns, setTxns] = useState<Transaktion[]>(TRANSAKTIONEN);
  const [view, setView] = useState<View>('briefing');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const offeneAufgaben = useMemo(
    () => txns.reduce((s, t) => s + t.aufgaben.filter((a) => !a.erledigt).length, 0),
    [txns],
  );
  const offeneRisiken = useMemo(
    () => txns.reduce((s, t) => s + t.risiken.filter((r) => r.status === 'Offen' || r.status === 'Eskaliert').length, 0),
    [txns],
  );

  function toggleTask(txId: string, taskId: string) {
    setTxns((prev) =>
      prev.map((t) =>
        t.id !== txId
          ? t
          : { ...t, aufgaben: t.aufgaben.map((a) => (a.id === taskId ? { ...a, erledigt: !a.erledigt } : a)) },
      ),
    );
  }

  function openTxn(id: string) {
    setOpenId(id);
    setView('transaktionen');
  }

  function navigate(v: View) {
    setView(v);
    setOpenId(null);
  }

  function nextId(): string {
    const year = 2026;
    const nums = txns.map((t) => Number(t.id.split('-')[2]));
    const max = nums.length ? Math.max(...nums) : 0;
    return `TXN-${year}-${String(max + 1).padStart(3, '0')}`;
  }

  function createTxn(txn: Transaktion) {
    setTxns((prev) => [...prev, txn]);
    setShowModal(false);
    openTxn(txn.id);
  }

  const openTxnObj = openId ? txns.find((t) => t.id === openId) : null;

  const header =
    view === 'transaktionen' && openTxnObj
      ? { title: openTxnObj.objekt.bezeichnung, sub: openTxnObj.id }
      : TITLES[view];

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={navigate} offeneAufgaben={offeneAufgaben} offeneRisiken={offeneRisiken} />

      <div className="main">
        <div className="topbar">
          <div>
            <h1>{header.title}</h1>
            <div className="sub">{header.sub}</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Neue Transaktion</button>
        </div>

        <div className="content">
          {view === 'briefing' && <DailyBriefing txns={txns} onOpen={openTxn} />}

          {view === 'transaktionen' &&
            (openTxnObj ? (
              <TransactionDetail txn={openTxnObj} onBack={() => setOpenId(null)} onToggleTask={toggleTask} />
            ) : (
              <Transactions txns={txns} onOpen={openTxn} />
            ))}

          {view === 'aufgaben' && <Tasks txns={txns} onToggleTask={toggleTask} onOpen={openTxn} />}

          {view === 'risiken' && <Risks txns={txns} onOpen={openTxn} />}
        </div>
      </div>

      {showModal && <NewTransactionModal onClose={() => setShowModal(false)} onCreate={createTxn} nextId={nextId()} />}
    </div>
  );
}
