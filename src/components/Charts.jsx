import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { groupByMonth, groupByCategory, formatCurrency } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/transactions';

const CHART_COLORS = Object.values(CATEGORY_COLORS);

// Recharts custom tooltip
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
      {label && (
        <div style={{ fontWeight: 600, marginBottom: 6, color: '#0f1729' }}>{label}</div>
      )}
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, marginTop: 2 }}>
          {p.name}: <strong>{formatCurrency(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e4e8f0',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <strong>{payload[0].name}</strong>: {formatCurrency(payload[0].value)}
    </div>
  );
}

export default function Charts({ transactions }) {
  const monthlyData = groupByMonth(transactions);
  const categoryData = groupByCategory(transactions).slice(0, 6); // top 6

  return (
    <div className="charts-row">
      {/* Bar chart — monthly income vs expense */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">Monthly Income vs Expenses</div>
          <div className="chart-card-sub">Side-by-side comparison per month</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4} barSize={22}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e4e8f0"
              vertical={false}
            />
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
            <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut pie — spending by category */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-title">Spending by Category</div>
          <div className="chart-card-sub">Top 6 expense categories</div>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend */}
        <div className="pie-legend">
          {categoryData.map((entry) => (
            <div className="pie-legend-item" key={entry.name}>
              <div className="pie-legend-left">
                <div
                  className="pie-legend-dot"
                  style={{ background: CATEGORY_COLORS[entry.name] || '#94a3b8' }}
                />
                <span className="pie-legend-name">{entry.name}</span>
              </div>
              <span className="pie-legend-val">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
