import React, { useState } from 'react';
import { CATEGORIES } from '../data/transactions';
import { formatCurrency, formatDate } from '../utils/helpers';
import AddModal from './AddModal';

const COLUMNS = [
  { field: 'date', label: 'Date' },
  { field: 'description', label: 'Description' },
  { field: 'category', label: 'Category' },
  { field: 'type', label: 'Type' },
  { field: 'amount', label: 'Amount' },
];

export default function TransactionTable({
  filtered,
  role,
  search,
  setSearch,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  sortField,
  sortDir,
  toggleSort,
  onAdd,
}) {
  const [showModal, setShowModal] = useState(false);
  const isAdmin = role === 'admin';

  function sortArrow(field) {
    if (sortField !== field) return <span className="sort-arrow">↕</span>;
    return <span className="sort-arrow">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <>
      <div className="section-header">
        <div className="section-title">
          All Transactions
          <span
            style={{
              marginLeft: 8,
              fontSize: 12,
              fontWeight: 500,
              color: '#64748b',
              background: '#f1f4f9',
              padding: '2px 8px',
              borderRadius: 20,
            }}
          >
            {filtered.length}
          </span>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          disabled={!isAdmin}
          title={!isAdmin ? 'Switch to Admin role to add transactions' : 'Add a new transaction'}
        >
          + Add Transaction
        </button>
      </div>

      {!isAdmin && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#1d4ed8',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          👁 You're in Viewer mode — read-only. Switch to Admin in the top-right to add transactions.
        </div>
      )}

      <div className="txn-controls">
        {/* Search */}
        <div className="search-wrap">
          <svg className="search-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="4.5" />
            <path d="M10 10l3 3" strokeLinecap="round" />
          </svg>
          <input
            className="txn-search"
            style={{ paddingLeft: 32, width: '100%' }}
            placeholder="Search by description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expense only</option>
        </select>

        {/* Category filter */}
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No transactions found</div>
            <div className="empty-state-sub">Try adjusting your filters or search query</div>
          </div>
        ) : (
          <table className="fin-table">
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.field} onClick={() => toggleSort(col.field)}>
                    {col.label} {sortArrow(col.field)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr key={txn.id}>
                  <td className="txn-date">{formatDate(txn.date)}</td>
                  <td className="txn-desc">{txn.description}</td>
                  <td>
                    <span className="badge badge-cat">{txn.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${txn.type}`}>{txn.type}</span>
                  </td>
                  <td className={`amount-${txn.type}`}>
                    {txn.type === 'income' ? '+' : '-'}
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddModal onClose={() => setShowModal(false)} onAdd={onAdd} />
      )}
    </>
  );
}
