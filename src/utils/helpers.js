/**
 * Format a number as Indian Rupees.
 * e.g. 65000 → ₹65,000
 */
export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

/**
 * Format an ISO date string as a readable date.
 * e.g. '2025-03-05' → '05 Mar 2025'
 */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns the month label from an ISO date string.
 * e.g. '2025-03-05' → 'Mar '25'
 */
export function monthLabel(isoDate) {
  return new Date(isoDate.slice(0, 7) + '-01').toLocaleString('en', {
    month: 'short',
    year: '2-digit',
  });
}

/**
 * Groups transactions by month and computes totals for each.
 * Returns an array sorted by month ascending.
 */
export function groupByMonth(transactions) {
  const map = {};

  transactions.forEach((t) => {
    const key = t.date.slice(0, 7); // 'YYYY-MM'
    if (!map[key]) {
      map[key] = { month: key, label: monthLabel(t.date), income: 0, expense: 0 };
    }
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });

  return Object.values(map)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .map((m) => ({ ...m, balance: m.income - m.expense }));
}

/**
 * Aggregates expenses by category and returns sorted descending by value.
 */
export function groupByCategory(transactions) {
  const map = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

/**
 * Generates a unique numeric ID (simple incrementing approach).
 */
export function generateId(transactions) {
  return transactions.length > 0
    ? Math.max(...transactions.map((t) => t.id)) + 1
    : 1;
}
