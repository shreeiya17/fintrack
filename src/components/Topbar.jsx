import React from 'react';

const PAGE_LABELS = {
  dashboard: { title: 'Dashboard', sub: 'Financial overview — March to April 2025' },
  transactions: { title: 'Transactions', sub: 'Browse, filter and manage your transactions' },
  insights: { title: 'Insights', sub: 'Patterns and observations from your spending' },
};

export default function Topbar({ activePage, role, onRoleChange }) {
  const { title, sub } = PAGE_LABELS[activePage] || PAGE_LABELS.dashboard;

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>

      <div className="topbar-right">
        <div className={`topbar-role-pill ${role}`}>
          {role === 'admin' ? '⚡ Admin' : '👁 Viewer'}
        </div>
        <select
          className="filter-select"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          title="Switch role for demo"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </header>
  );
}
