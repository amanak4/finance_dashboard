import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useFinanceStore } from '../../store/financeStore'
import { categoryExpenseTotals } from '../../lib/insights'
import { formatCurrency } from '../../lib/formatCurrency'
import { Card, CardTitle } from '../ui/Card'

const SLICE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

export function SpendingBreakdownChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const data = useMemo(() => {
    const totals = categoryExpenseTotals(transactions)
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const hasExpenses = data.length > 0

  if (!transactions.length) {
    return (
      <Card>
        <CardTitle>Spending by category</CardTitle>
        <p className="mt-4 rounded-xl bg-[var(--surface-2)] py-10 text-center text-sm text-[var(--fg-muted)]">
          No spending data yet. Expense transactions will appear grouped by category.
        </p>
      </Card>
    )
  }

  if (!hasExpenses) {
    return (
      <Card>
        <CardTitle>Spending by category</CardTitle>
        <p className="mt-4 rounded-xl bg-[var(--surface-2)] py-10 text-center text-sm text-[var(--fg-muted)]">
          No expenses recorded. Only expense transactions are included in this breakdown.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle>Spending by category</CardTitle>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Share of total expenses across categories
      </p>
      <div className="mt-4 h-64 w-full min-h-[16rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                  stroke="var(--surface)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value) => formatCurrency(Number(value ?? 0))}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--fg-muted)]">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
            />
            <span className="text-[var(--fg)]">{d.name}</span>
            <span className="tabular-nums">{formatCurrency(d.value)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
