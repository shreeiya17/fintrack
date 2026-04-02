# FinTrack — Personal Finance Dashboard

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

The app runs at [http://localhost:5173](http://localhost:5173) by default (Vite).

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Features

### Dashboard Overview
- **Summary cards** showing Net Balance, Total Income, Total Expenses, and Transaction count
- **Savings rate** calculated from income and expenses
- **Monthly bar chart** comparing income vs expenses side by side
- **Spending donut chart** breaking down the top 6 expense categories with a custom legend

### Transactions
- Sortable table with columns: Date, Description, Category, Type, Amount
- Click any column header to sort ascending/descending
- **Search** by description or category name
- **Filter** by transaction type (income/expense) or category
- Colour-coded badges and amounts (green for income, red for expense)
- Empty state when no results match the filters

### Insights
- Top spending category with total amount
- Month-over-month expense change (percentage delta between last two months)
- Savings rate with contextual label (healthy if ≥ 20%)
- Average expense per transaction
- Multi-line trend chart (income, expense, balance over time)
- Full category breakdown with animated horizontal progress bars

### Role-Based UI (RBAC Simulation)
Two roles are available — switchable from the top-right dropdown at any time:

| Role    | Can view data | Can add transactions |
|---------|---------------|----------------------|
| Viewer  | ✅             | ❌                   |
| Admin   | ✅             | ✅                   |

When in Viewer mode, the "Add Transaction" button is disabled and a contextual info banner is shown. No backend is involved — this is a frontend-only role simulation.

### Add Transaction (Admin only)
- Modal form with validation (description, amount, date, category, type)
- Inline error messages for missing or invalid fields
- New transactions appear immediately in the list and update all charts and totals

---

## Project Structure

```
fintrack/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Left navigation sidebar
│   │   ├── Topbar.jsx           # Top header with role switcher
│   │   ├── SummaryCards.jsx     # 4-card financial summary grid
│   │   ├── Charts.jsx           # Bar chart + donut pie chart
│   │   ├── TransactionTable.jsx # Sortable/filterable transaction list
│   │   ├── AddModal.jsx         # Add transaction modal with validation
│   │   └── Insights.jsx         # Insights page with trend chart + breakdown
│   ├── data/
│   │   └── transactions.js      # Mock data and category config
│   ├── hooks/
│   │   └── useTransactions.js   # Central state management hook
│   ├── utils/
│   │   └── helpers.js           # formatCurrency, formatDate, groupByMonth, etc.
│   ├── App.jsx                  # Root component — page routing + layout
│   ├── index.css                # Global styles and CSS variables
│   └── index.js                 # React entry point
├── package.json
└── README.md
```

---

## Technical Decisions

**State Management — Custom Hook (`useTransactions`)**  
All application state (transactions, filters, sort, role) lives in a single custom hook. This avoids prop drilling without the overhead of Redux or Context for a project of this scope. The hook exposes only what each component needs.

**Data Layer — Mock data in `/data/transactions.js`**  
The data file is structured to mirror what a real API would return. Swapping in a real `fetch()` call would require changing only this file and the hook's initial state.

**Styling — Plain CSS with custom properties**  
No CSS framework was used. Design tokens (colours, radii, shadows) are defined as CSS variables in `:root`, making theming and future dark mode straightforward. Component styles are co-located in `index.css` with clearly named class namespaces.

**Charts — Recharts**  
Chosen for its composable, declarative API and good default accessibility. Custom tooltips are used on all charts for consistency.

**Responsiveness**  
Breakpoints at 1024px (2-column summary grid) and 768px (sidebar hidden, single-column layout). The transactions table hides the description column below 768px to prevent overflow.

---

## Assumptions Made

- Data is static (mock) — no persistence between page refreshes. Local storage could be added as an enhancement.
- The date range is March–April 2025 for demonstration purposes.
- "Role switching" is frontend-only simulation as specified in the requirements.
- Amounts are in Indian Rupees (₹) formatted with the `en-IN` locale.

---

## Optional Enhancements (not included, but straightforward to add)

- **Dark mode** — CSS variables are already abstracted; a `data-theme` attribute toggle would be sufficient
- **Export to CSV** — iterate `transactions` array and generate a Blob download
- **Local storage persistence** — wrap `useState` in `useTransactions` with a `localStorage` read/write effect
- **Advanced filtering** — date range picker, multi-select category filter
