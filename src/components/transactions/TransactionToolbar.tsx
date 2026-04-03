import { useMemo, useState } from 'react'
import { CATEGORIES } from '../../data/seedTransactions'
import { downloadTextFile, transactionsToCsv } from '../../lib/exportCsv'
import {
  filterAndSortTransactions,
  useFinanceStore,
} from '../../store/financeStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

type TransactionToolbarProps = {
  onAdd: () => void
}

export function TransactionToolbar({ onAdd }: TransactionToolbarProps) {
  const role = useFinanceStore((s) => s.role)
  const transactions = useFinanceStore((s) => s.transactions)
  const filters = useFinanceStore((s) => s.filters)
  const setFilters = useFinanceStore((s) => s.setFilters)
  const resetFilters = useFinanceStore((s) => s.resetFilters)
  const resetToSeed = useFinanceStore((s) => s.resetToSeed)

  const [exportFlash, setExportFlash] = useState(false)

  const filtered = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters],
  )

  const categoryOptions = useMemo(() => {
    const set = new Set<string>([...CATEGORIES])
    transactions.forEach((t) => set.add(t.category))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [transactions])

  const isAdmin = role === 'admin'

  const exportCsv = () => {
    const csv = transactionsToCsv(filtered)
    downloadTextFile('transactions.csv', csv)
    setExportFlash(true)
    window.setTimeout(() => setExportFlash(false), 1200)
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Search</span>
          <Input
            placeholder="Description or category"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            aria-label="Search transactions"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Type</span>
          <Select
            value={filters.type}
            onChange={(e) =>
              setFilters({ type: e.target.value as typeof filters.type })
            }
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Category</span>
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
          >
            <option value="all">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Sort</span>
          <div className="flex gap-2">
            <Select
              className="flex-1"
              value={filters.sortField}
              onChange={(e) =>
                setFilters({ sortField: e.target.value as typeof filters.sortField })
              }
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </Select>
            <Select
              className="w-24 shrink-0"
              value={filters.sortDir}
              onChange={(e) =>
                setFilters({ sortDir: e.target.value as typeof filters.sortDir })
              }
              aria-label="Sort direction"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </Select>
          </div>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={resetFilters}>
          Reset filters
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={exportCsv}
          aria-live="polite"
        >
          {exportFlash ? 'Exported' : 'Export CSV'}
        </Button>
        {isAdmin ? (
          <>
            <Button type="button" onClick={onAdd}>
              Add transaction
            </Button>
            <Button type="button" variant="ghost" onClick={resetToSeed}>
              Restore sample data
            </Button>
          </>
        ) : null}
      </div>
      {!isAdmin ? (
        <p className="w-full text-xs text-[var(--fg-muted)]">
          Viewer mode: you can search, filter, and export. Switch role to Admin to add
          or edit rows.
        </p>
      ) : null}
    </div>
  )
}
