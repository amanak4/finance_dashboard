import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from 'date-fns'
import type { Transaction } from '../types/finance'

export type MonthlyTotals = { income: number; expense: number }

export function sumByMonth(
  transactions: Transaction[],
  monthStart: Date,
): MonthlyTotals {
  const start = startOfMonth(monthStart)
  const end = endOfMonth(monthStart)
  return transactions.reduce(
    (acc, t) => {
      const d = parseISO(t.date)
      if (!isWithinInterval(d, { start, end })) return acc
      if (t.type === 'income') acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 },
  )
}

export function categoryExpenseTotals(
  transactions: Transaction[],
): Record<string, number> {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})
}

export function highestSpendingCategory(
  transactions: Transaction[],
): { category: string; amount: number } | null {
  const totals = categoryExpenseTotals(transactions)
  const entries = Object.entries(totals)
  if (!entries.length) return null
  entries.sort((a, b) => b[1] - a[1])
  return { category: entries[0][0], amount: entries[0][1] }
}

export function balanceTrendPoints(transactions: Transaction[]): {
  date: string
  balance: number
}[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  let running = 0
  return sorted.map((t) => {
    running += t.type === 'income' ? t.amount : -t.amount
    return { date: t.date, balance: running }
  })
}
