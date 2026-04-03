import { useMemo } from 'react'
import { subMonths } from 'date-fns'
import { useFinanceStore } from '../../store/financeStore'
import {
  highestSpendingCategory,
  sumByMonth,
} from '../../lib/insights'
import { formatCurrency } from '../../lib/formatCurrency'
import { Card, CardTitle } from '../ui/Card'

export function InsightsPanel() {
  const transactions = useFinanceStore((s) => s.transactions)

  const insights = useMemo(() => {
    const now = new Date()
    const thisM = sumByMonth(transactions, now)
    const lastM = sumByMonth(transactions, subMonths(now, 1))
    const top = highestSpendingCategory(transactions)

    const expenseDelta = lastM.expense
      ? ((thisM.expense - lastM.expense) / lastM.expense) * 100
      : null

    const savingsRate =
      thisM.income > 0
        ? ((thisM.income - thisM.expense) / thisM.income) * 100
        : null

    return { thisM, lastM, top, expenseDelta, savingsRate }
  }, [transactions])

  if (!transactions.length) {
    return (
      <Card>
        <CardTitle>Insights</CardTitle>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          Insights appear once you have transaction history.
        </p>
      </Card>
    )
  }

  const { thisM, lastM, top, expenseDelta, savingsRate } = insights

  return (
    <Card>
      <CardTitle>Insights</CardTitle>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Quick reads from your current dataset
      </p>
      <ul className="mt-5 space-y-4">
        <li className="flex gap-3 rounded-xl bg-[var(--surface-2)] p-4">
          <span className="text-lg" aria-hidden>
            ◆
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--fg)]">
              Highest spending category
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {top ? (
                <>
                  <span className="font-semibold text-[var(--fg)]">
                    {top.category}
                  </span>{' '}
                  leads at {formatCurrency(top.amount)} total expenses.
                </>
              ) : (
                'No expense categories to rank yet.'
              )}
            </p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl bg-[var(--surface-2)] p-4">
          <span className="text-lg" aria-hidden>
            ≈
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--fg)]">
              Month-over-month expenses
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              This month: {formatCurrency(thisM.expense)} · Last month:{' '}
              {formatCurrency(lastM.expense)}
              {expenseDelta !== null && Number.isFinite(expenseDelta) ? (
                <>
                  {' '}
                  (
                  <span
                    className={
                      expenseDelta > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }
                  >
                    {expenseDelta > 0 ? '+' : ''}
                    {expenseDelta.toFixed(0)}% vs last month
                  </span>
                  ).
                </>
              ) : null}
            </p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl bg-[var(--surface-2)] p-4">
          <span className="text-lg" aria-hidden>
            %
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--fg)]">
              Savings signal (this month)
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {savingsRate !== null ? (
                <>
                  You retained about{' '}
                  <span className="font-semibold text-[var(--fg)]">
                    {savingsRate.toFixed(0)}%
                  </span>{' '}
                  of income after expenses in the latest month with data.
                </>
              ) : (
                'Not enough income in the latest month to compute a rate.'
              )}
            </p>
          </div>
        </li>
      </ul>
    </Card>
  )
}
