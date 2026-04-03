import { useState } from 'react'
import { BalanceTrendChart } from './components/dashboard/BalanceTrendChart'
import { SpendingBreakdownChart } from './components/dashboard/SpendingBreakdownChart'
import { SummaryCards } from './components/dashboard/SummaryCards'
import { InsightsPanel } from './components/insights/InsightsPanel'
import { AppShell } from './components/layout/AppShell'
import type { NavSection } from './components/layout/ScrollNav'
import { ThemeSync } from './components/theme/ThemeSync'
import { TransactionFormModal } from './components/transactions/TransactionFormModal'
import { TransactionTable } from './components/transactions/TransactionTable'
import { TransactionToolbar } from './components/transactions/TransactionToolbar'
import { SectionSubtitle, SectionTitle } from './components/ui/SectionTitle'
import { useFinanceStore } from './store/financeStore'
import type { Transaction } from './types/finance'

const PAGE_NAV: NavSection[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'trends', label: 'Trends' },
  { id: 'insights', label: 'Insights' },
  { id: 'transactions', label: 'Transactions' },
]

export default function App() {
  const theme = useFinanceStore((s) => s.theme)
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const updateTransaction = useFinanceStore((s) => s.updateTransaction)

  const [formOpen, setFormOpen] = useState(false)
  const [formSession, setFormSession] = useState(0)
  const [formMode, setFormMode] = useState<
    { kind: 'create' } | { kind: 'edit'; transaction: Transaction }
  >({ kind: 'create' })

  const openCreate = () => {
    setFormSession((n) => n + 1)
    setFormMode({ kind: 'create' })
    setFormOpen(true)
  }

  const openEdit = (t: Transaction) => {
    setFormSession((n) => n + 1)
    setFormMode({ kind: 'edit', transaction: t })
    setFormOpen(true)
  }

  const handleSave = (payload: Omit<Transaction, 'id'>, id?: string) => {
    if (id) updateTransaction(id, payload)
    else addTransaction(payload)
  }

  return (
    <>
      <ThemeSync theme={theme} />
      <AppShell navSections={PAGE_NAV}>
        <section aria-labelledby="overview-heading" className="space-y-8">
          <div
            id="summary"
            className="space-y-8 scroll-mt-28 lg:scroll-mt-16"
          >
            <div>
              <SectionTitle id="overview-heading">Overview</SectionTitle>
              <SectionSubtitle>
                Snapshot of your money movement and visual breakdowns.
              </SectionSubtitle>
            </div>
            <SummaryCards />
          </div>
          <div
            id="trends"
            className="grid gap-6 scroll-mt-28 lg:scroll-mt-16 lg:grid-cols-2"
          >
            <BalanceTrendChart />
            <SpendingBreakdownChart />
          </div>
          <div
            id="insights"
            className="scroll-mt-28 lg:scroll-mt-16"
          >
            <InsightsPanel />
          </div>
        </section>

        <section
          id="transactions"
          aria-labelledby="tx-heading"
          className="space-y-6 scroll-mt-28 lg:scroll-mt-16"
        >
          <div>
            <SectionTitle id="tx-heading">Transactions</SectionTitle>
            <SectionSubtitle>
              Filter, sort, and inspect individual entries. Role controls whether you can
              mutate data.
            </SectionSubtitle>
          </div>
          <TransactionToolbar onAdd={openCreate} />
          <TransactionTable onEdit={openEdit} />
        </section>
      </AppShell>

      <TransactionFormModal
        open={formOpen}
        mode={formMode}
        session={formSession}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
