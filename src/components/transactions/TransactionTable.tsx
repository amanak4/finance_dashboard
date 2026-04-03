import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  filterAndSortTransactions,
  useFinanceStore,
} from '../../store/financeStore'
import type { Transaction } from '../../types/finance'
import { formatCurrency } from '../../lib/formatCurrency'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

type TransactionTableProps = {
  onEdit: (t: Transaction) => void
}

export function TransactionTable({ onEdit }: TransactionTableProps) {
  const role = useFinanceStore((s) => s.role)
  const transactions = useFinanceStore((s) => s.transactions)
  const filters = useFinanceStore((s) => s.filters)
  const removeTransaction = useFinanceStore((s) => s.removeTransaction)
  const resetFilters = useFinanceStore((s) => s.resetFilters)

  const filtered = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters],
  )

  const isAdmin = role === 'admin'
  const hasAny = transactions.length > 0
  const hasVisible = filtered.length > 0

  if (!hasAny) {
    return (
      <EmptyState
        title="No transactions"
        description="Switch to Admin to add a transaction or use “Restore sample data” in the toolbar."
      />
    )
  }

  if (!hasVisible) {
    return (
      <EmptyState
        title="No matches"
        description="Try clearing search or widening filters to see more rows."
        action={
          <Button type="button" variant="secondary" onClick={resetFilters}>
            Reset filters
          </Button>
        }
      />
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-xs uppercase tracking-wide text-[var(--fg-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
              {isAdmin ? (
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((t) => (
              <tr
                key={t.id}
                className="transition-colors hover:bg-[var(--surface-hover)]"
              >
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-[var(--fg-muted)]">
                  {format(parseISO(t.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-[var(--fg)]">{t.description}</td>
                <td className="px-4 py-3">
                  <Badge tone="accent">{t.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={t.type === 'income' ? 'income' : 'expense'}>
                    {t.type}
                  </Badge>
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium tabular-nums ${
                    t.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-[var(--fg)]'
                  }`}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatCurrency(t.amount, true)}
                </td>
                {isAdmin ? (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-2 py-1 text-xs"
                        onClick={() => onEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="px-2 py-1 text-xs"
                        onClick={() => removeTransaction(t.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
