import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SummaryCards from './components/SummaryCards';
import Charts from './components/Charts';
import TransactionTable from './components/TransactionTable';
import Insights from './components/Insights';
import { useTransactions } from './hooks/useTransactions';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const {
    transactions,
    filtered,
    totals,
    role,
    setRole,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    sortField,
    sortDir,
    toggleSort,
    addTransaction,
  } = useTransactions();

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} role={role} />

      <div className="main-content">
        <Topbar activePage={activePage} role={role} onRoleChange={setRole} />

        <main className="page-container">
          {/* ── Dashboard ── */}
          {activePage === 'dashboard' && (
            <>
              <div className="page-header">
                <div className="page-title">Good morning 👋</div>
                <div className="page-subtitle">
                  Here's a snapshot of your financial activity.
                </div>
              </div>
              <SummaryCards totals={totals} />
              <Charts transactions={transactions} />
            </>
          )}

          {/* ── Transactions ── */}
          {activePage === 'transactions' && (
            <>
              <div className="page-header">
                <div className="page-title">Transactions</div>
                <div className="page-subtitle">
                  A complete record of all income and expenses.
                </div>
              </div>
              <TransactionTable
                filtered={filtered}
                role={role}
                search={search}
                setSearch={setSearch}
                filterType={filterType}
                setFilterType={setFilterType}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                sortField={sortField}
                sortDir={sortDir}
                toggleSort={toggleSort}
                onAdd={addTransaction}
              />
            </>
          )}

          {/* ── Insights ── */}
          {activePage === 'insights' && (
            <>
              <div className="page-header">
                <div className="page-title">Insights</div>
                <div className="page-subtitle">
                  Patterns and observations derived from your data.
                </div>
              </div>
              <Insights transactions={transactions} totals={totals} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
