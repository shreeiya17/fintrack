# FinTrack — Personal Finance Dashboard

🔗 **Live Demo:** https://fintrack-topaz-kappa.vercel.app/

A clean, responsive personal finance dashboard built with React. Users can track their income and expenses, explore transactions, visualise spending patterns, and switch between roles (Viewer / Admin) for a basic RBAC simulation.

---

## Getting Started

**Prerequisites:** Node.js 16+ and npm installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

The app runs at http://localhost:5173 by default (Vite).

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Features

### Dashboard Overview

* **Summary cards** showing Net Balance, Total Income, Total Expenses, and Transaction count
* **Savings rate** calculated from income and expenses
* **Monthly bar chart** comparing income vs expenses side by side
* **Spending donut chart** breaking down the top 6 expense categories with a custom legend

### Transactions

* Sortable table with columns: Date, Description, Category, Type, Amount
* Click any column header to sort ascending/descending
* **Search** by description or category name
* **Filter** by transaction type (income/expense) or category
* Colour-coded badges and amounts (green for income, red for expense)
* Empty state when no results match the filters

### Insights

* Top spending category with total amount
* Month-over-month expense change (percentage delta between last two months)
* Savings rate with contextual label (healthy if ≥ 20%)
* Average expense per transaction
* Multi-line trend chart (income, expense, balance over time)
* Full category breakdown with animated horizontal progress bars

### Role-Based UI (RBAC Simulation)

Two roles are available — switchable from the top-right dropdown at any time:

| Role   | Can view data | Can add transactions |
| ------ | ------------- | -------------------- |
| Viewer | ✅             | ❌                    |
| Admin  | ✅             | ✅                    |

When in Viewer mode, the "Add Transaction" button is disabled and a contextual info banner is shown. No backend is involved — this is a frontend-only role simulation.

### Add Transaction (Admin only)

* Modal form with validation (description, amount, date, category, type)
* Inline error messages for missing or invalid fields
* New transactions appear immediately in the list and update all charts and totals

---

## Project Structure

```
fintrack/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── Charts.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── AddModal.jsx
│   │   └── Insights.jsx
│   ├── data/
│   │   └── transactions.js
│   ├── hooks/
│   │   └── useTransactions.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

---

## Technical Decisions

**State Management — Custom Hook (`useTransactions`)**
All application state (transactions, filters, sort, role) lives in a single custom hook. This avoids prop drilling without the overhead of Redux or Context for a project of this scope.

**Data Layer — Mock data in `/data/transactions.js`**
Structured to mirror a real API for easy future integration.

**Styling — Plain CSS with custom properties**
Design tokens defined as CSS variables for easy theming and scalability.

**Charts — Recharts**
Used for its composable and declarative API.

**Responsiveness**
Breakpoints at 1024px and 768px for adaptive layout.

---

## Assumptions Made

* Data is static (mock) — no persistence between refreshes
* Date range: March–April 2025
* Role switching is frontend-only
* Currency: Indian Rupees (₹) with `en-IN` locale

---

## Optional Enhancements

* Dark mode
* Export to CSV
* Local storage persistence
* Advanced filtering
