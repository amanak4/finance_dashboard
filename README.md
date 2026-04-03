# Finance Dashboard

A small, interactive finance dashboard built for evaluation: overview metrics, charts, filterable transactions, simulated roles, and lightweight insights. Data is mocked and persisted in the browser.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (design tokens via CSS variables, light/dark)
- **Zustand** with `persist` middleware (transactions, filters, role, theme → `localStorage`)
- **Recharts** for balance trend (area) and spending breakdown (donut)
- **date-fns** for dates in charts and insights

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build   # production build
npm run preview # serve dist locally
```

## Features (assignment mapping)

| Requirement | Implementation |
|-------------|------------------|
| Summary cards | Total balance, income, expenses (`SummaryCards`) |
| Time-based chart | Running balance after each transaction (`BalanceTrendChart`) |
| Category chart | Expenses by category, donut + legend (`SpendingBreakdownChart`) |
| Transactions | Date, description, category, type, amount; responsive table |
| Filter / sort / search | Type, category, text search; sort by date or amount, asc/desc |
| Role-based UI | **Viewer**: read-only rows, no add/edit/delete. **Admin**: full CRUD + restore sample data |
| Insights | Top spending category, month-over-month expenses, simple “savings rate” note |
| State | Centralized in Zustand; derived lists via `filterAndSortTransactions` |
| Empty states | No data, no filter matches, no expenses for pie chart |
| Optional | Dark mode (system/light/dark), CSV export of the **current filtered** list, local persistence |

## Project structure

```
src/
  components/
    dashboard/     # Summary + charts
    insights/      # Insight cards
    layout/        # App shell, header
    rbac/          # Role switcher (demo)
    theme/         # Syncs theme class to `<html>`
    transactions/  # Toolbar, table, form modal
    ui/            # Reusable primitives (Button, Card, Modal, …)
  data/            # Seed transactions + category list
  lib/             # formatting, CSV export, insights helpers, `cn`
  store/           # Zustand store + `filterAndSortTransactions`
  types/           # Shared TypeScript types
```

## Design notes

- **Tokens**: Colors and chart series use CSS variables so one theme layer drives both Tailwind utility usage (`bg-[var(--surface)]`) and Recharts strokes/fills.
- **Accessibility**: Skip link, dialog focus trap via Escape and scroll lock, labeled controls, table semantics.
- **RBAC**: Roles are frontend-only toggles for demonstration; there is no backend or real authorization.

## Assumptions

- Currency is **USD** for display.
- “This month” / “last month” in insights use the device clock and calendar months.
- Categories for new transactions are chosen from the predefined list in `src/data/seedTransactions.ts`.
# finance_dashboard
