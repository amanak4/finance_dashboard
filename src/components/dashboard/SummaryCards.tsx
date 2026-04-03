import { useMemo } from 'react'
import { useFinanceStore } from '../../store/financeStore'
import { formatCurrency } from '../../lib/formatCurrency'
import { Card, CardTitle } from '../ui/Card'

export function SummaryCards() {
  const transactions = useFinanceStore((s) => s.transactions)

  const { balance, income, expense } = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return { balance: income - expense, income, expense }
  }, [transactions])

  const items = [
    {
      title: 'Total balance',
      value: formatCurrency(balance),
      hint: 'Income minus expenses',
      accent: 'from-[var(--accent)]/20 to-transparent',
    },
    {
      title: 'Income',
      value: formatCurrency(income),
      hint: 'All credited amounts',
      accent: 'from-emerald-500/15 to-transparent',
    },
    {
      title: 'Expenses',
      value: formatCurrency(expense),
      hint: 'All debited amounts',
      accent: 'from-rose-500/15 to-transparent',
    },
  ]

  if (!transactions.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="relative overflow-hidden">
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent}`}
              aria-hidden
            />
            <CardTitle>{item.title}</CardTitle>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--fg-muted)]">
              —
            </p>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">{item.hint}</p>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="relative overflow-hidden">
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent}`}
            aria-hidden
          />
          <CardTitle>{item.title}</CardTitle>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--fg)]">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">{item.hint}</p>
        </Card>
      ))}
    </div>
  )
}
