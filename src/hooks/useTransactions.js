import { useState, useMemo } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/transactions';
import { generateId } from '../utils/helpers';

/**
 * Central state management hook for all transaction data.
 * Keeps transactions, filters, sort, and role in one place.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole] = useState('viewer'); // 'viewer' | 'admin'

  // Filter state
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'
  const [filterCategory, setFilterCategory] = useState('all');

  // Sort state
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // --- Derived totals ---
  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
      savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
      count: transactions.length,
      categoryCount: new Set(transactions.map((t) => t.category)).size,
    };
  }, [transactions]);

  // --- Filtered + sorted transactions ---
  const filtered = useMemo(() => {
    let result = transactions;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }

    result = [...result].sort((a, b) => {
      const va = sortField === 'amount' ? a.amount : a[sortField];
      const vb = sortField === 'amount' ? b.amount : b[sortField];
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, search, filterType, filterCategory, sortField, sortDir]);

  // --- Actions ---
  function addTransaction(formData) {
    const newTxn = {
      id: generateId(transactions),
      date: formData.date,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      amount: parseFloat(formData.amount),
    };
    setTransactions((prev) => [newTxn, ...prev]);
  }

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  return {
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
  };
}
