import React from 'react';
import { formatCurrency } from '../utils/helpers';

export default function SummaryCards({ totals }) {
  const { balance, income, expense, savingsRate, count, categoryCount } = totals;

  const cards = [
    {
      label: 'Net Balance',
      value: formatCurrency(balance),
      colorClass: 'blue',
      icon: '💳',
      meta: (
        <>
          Savings rate:{' '}
          <span className={savingsRate >= 20 ? 'up' : 'dn'}>{savingsRate}%</span>
        </>
      ),
    },
    {
      label: 'Total Income',
      value: formatCurrency(income),
      colorClass: 'green',
      icon: '📈',
      meta: `${count} total transactions`,
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(expense),
      colorClass: 'red',
      icon: '📉',
      meta: `Across ${categoryCount} categories`,
    },
    {
      label: 'Transactions',
      value: count,
      colorClass: '',
      icon: '🗂️',
      meta: `${categoryCount} unique categories`,
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div className="summary-card" key={card.label}>
          <div className={`summary-card-icon ${card.colorClass || 'amber'}`}>
            {card.icon}
          </div>
          <div className="summary-card-label">{card.label}</div>
          <div className={`summary-card-value ${card.colorClass}`}>{card.value}</div>
          <div className="summary-card-meta">{card.meta}</div>
        </div>
      ))}
    </div>
  );
}
