import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { groupByMonth, groupByCategory, formatCurrency } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e4e8f0',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#0f1729' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: <strong>{formatCurrency(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function Insights({ transactions, totals }) {
  const monthlyData = groupByMonth(transactions);
  const categoryData = groupByCategory(transactions);
  const topCategory = categoryData[0];

  // Month-over-month comparison (last two months)
  const momChange = useMemo(() => {
    if (monthlyData.length < 2) return null;
    const prev = monthlyData[monthlyData.length - 2];
    const curr = monthlyData[monthlyData.length - 1];
    const pct = prev.expense > 0
      ? Math.round(((curr.expense - prev.expense) / prev.expense) * 100)
      : 0;
    return { prev, curr, pct, decreased: curr.expense <= prev.expense };
  }, [monthlyData]);

  const avgExpense = useMemo(() => {
    const expTxns = transactions.filter((t) => t.type === 'expense');
    return expTxns.length > 0
      ? Math.round(expTxns.reduce((s, t) => s + t.amount, 0) / expTxns.length)
      : 0;
  }, [transactions]);

  const { savingsRate } = totals;

  const insightCards = [
    {
      icon: '🏆',
      label: 'Top spending category',
      value: topCategory ? topCategory.name : '—',
      desc: topCategory ? formatCurrency(topCategory.value) + ' total spent' : '',
      color: '',
    },
    {
      icon: '📊',
      label: 'Month-over-month',
      value: momChange
        ? `${momChange.decreased ? '▼' : '▲'} ${Math.abs(momChange.pct)}%`
        : '—',
      desc: momChange
        ? `${momChange.curr.label} vs ${momChange.prev.label} expenses`
        : '',
      color: momChange?.decreased ? 'green' : 'red',
    },
    {
      icon: '💰',
      label: 'Savings rate',
      value: `${savingsRate}%`,
      desc: savingsRate >= 20 ? 'Healthy — above 20% target' : 'Below the 20% target',
      color: savingsRate >= 20 ? 'green' : 'amber',
    },
    {
      icon: '🧾',
      label: 'Avg expense / transaction',
      value: formatCurrency(avgExpense),
      desc: `Across ${transactions.filter((t) => t.type === 'expense').length} expense entries`,
      color: '',
    },
  ];

  return (
    <>
      <div className="insights-grid">
        {insightCards.map((card) => (
          <div className="insight-card" key={card.label}>
            <div className="insight-icon">{card.icon}</div>
            <div className="insight-label">{card.label}</div>
            <div className={`insight-value ${card.color}`}>{card.value}</div>
            {card.desc && <div className="insight-desc">{card.desc}</div>}
          </div>
        ))}
      </div>

      {/* Trend line chart */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div className="chart-card-header">
          <div className="chart-card-title">Income, Expense & Balance — Monthly Trend</div>
          <div className="chart-card-sub">Visualising how your balance evolves over time</div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => '₹' + (v / 1000).toFixed(0) + 'k'}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown table */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">Full Category Breakdown</div>
          <div className="chart-card-sub">All expense categories ranked by total spend</div>
        </div>
        <div style={{ marginTop: 4 }}>
          {categoryData.map((cat, i) => {
            const maxVal = categoryData[0].value;
            const pct = Math.round((cat.value / maxVal) * 100);
            return (
              <div
                key={cat.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < categoryData.length - 1 ? '1px solid #e4e8f0' : 'none',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: CATEGORY_COLORS[cat.name] || '#94a3b8',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 500, width: 100, flexShrink: 0 }}>
                  {cat.name}
                </span>
                <div style={{ flex: 1, height: 6, background: '#f1f4f9', borderRadius: 4 }}>
                  <div
                    style={{
                      height: '100%',
                      width: pct + '%',
                      background: CATEGORY_COLORS[cat.name] || '#94a3b8',
                      borderRadius: 4,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#0f1729',
                    width: 80,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {formatCurrency(cat.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
