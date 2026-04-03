import { useState } from 'react'
import type { Transaction, TransactionType } from '../../types/finance'
import { CATEGORIES } from '../../data/seedTransactions'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'

type Mode = { kind: 'create' } | { kind: 'edit'; transaction: Transaction }

type TransactionFormModalProps = {
  open: boolean
  mode: Mode
  /** Bumps when opening the modal so create/edit forms remount with fresh state */
  session: number
  onClose: () => void
  onSave: (payload: Omit<Transaction, 'id'>, id?: string) => void
}

type FormState = {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
}

const emptyForm: FormState = {
  date: '',
  amount: '',
  category: CATEGORIES[0],
  type: 'expense',
  description: '',
}

function initialForm(mode: Mode): FormState {
  if (mode.kind === 'edit') {
    const t = mode.transaction
    return {
      date: t.date,
      amount: String(t.amount),
      category: t.category,
      type: t.type,
      description: t.description,
    }
  }
  return {
    ...emptyForm,
    date: new Date().toISOString().slice(0, 10),
  }
}

function TransactionFormBody({
  mode,
  onSave,
  onClose,
}: {
  mode: Mode
  onSave: (payload: Omit<Transaction, 'id'>, id?: string) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<FormState>(() => initialForm(mode))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    if (!form.date || !Number.isFinite(amount) || amount <= 0) return
    const payload: Omit<Transaction, 'id'> = {
      date: form.date,
      amount,
      category: form.category,
      type: form.type,
      description: form.description.trim() || '—',
    }
    if (mode.kind === 'edit') onSave(payload, mode.transaction.id)
    else onSave(payload)
    onClose()
  }

  return (
    <form id="tx-form" className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--fg-muted)]">Date</span>
        <Input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--fg-muted)]">Amount</span>
        <Input
          type="number"
          inputMode="decimal"
          min={0.01}
          step={0.01}
          required
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--fg-muted)]">Type</span>
        <Select
          value={form.type}
          onChange={(e) =>
            setForm((f) => ({ ...f, type: e.target.value as TransactionType }))
          }
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--fg-muted)]">Category</span>
        <Select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-[var(--fg-muted)]">Description</span>
        <Input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What was this for?"
        />
      </label>
    </form>
  )
}

export function TransactionFormModal({
  open,
  mode,
  session,
  onClose,
  onSave,
}: TransactionFormModalProps) {
  const title = mode.kind === 'create' ? 'Add transaction' : 'Edit transaction'

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="tx-form">
            Save
          </Button>
        </>
      }
    >
      {open ? (
        <TransactionFormBody
          key={session}
          mode={mode}
          onSave={onSave}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  )
}
