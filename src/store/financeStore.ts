import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { seedTransactions } from '../data/seedTransactions'
import type {
  Transaction,
  TransactionFilters,
  UserRole,
} from '../types/finance'

export type ThemeMode = 'light' | 'dark' | 'system'

const defaultFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  sortField: 'date',
  sortDir: 'desc',
}

type FinanceState = {
  transactions: Transaction[]
  filters: TransactionFilters
  role: UserRole
  theme: ThemeMode
  setRole: (role: UserRole) => void
  setTheme: (theme: ThemeMode) => void
  setFilters: (patch: Partial<TransactionFilters>) => void
  resetFilters: () => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  removeTransaction: (id: string) => void
  resetToSeed: () => void
}

function nextId(list: Transaction[]): string {
  const max = list.reduce((m, t) => {
    const n = Number.parseInt(t.id, 10)
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return String(max + 1)
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: seedTransactions,
      filters: defaultFilters,
      role: 'viewer',
      theme: 'system',
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: defaultFilters }),
      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            ...s.transactions,
            { ...t, id: nextId(s.transactions) },
          ],
        })),
      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((x) =>
            x.id === id ? { ...x, ...patch, id: x.id } : x,
          ),
        })),
      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
        })),
      resetToSeed: () => set({ transactions: [...seedTransactions] }),
    }),
    {
      name: 'finance-dashboard',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        transactions: s.transactions,
        role: s.role,
        theme: s.theme,
        filters: s.filters,
      }),
    },
  ),
)

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const q = filters.search.trim().toLowerCase()
  let list = transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category)
      return false
    if (q) {
      const hay = `${t.description} ${t.category}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
  const dir = filters.sortDir === 'asc' ? 1 : -1
  list = [...list].sort((a, b) => {
    if (filters.sortField === 'amount') {
      return (a.amount - b.amount) * dir
    }
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir
  })
  return list
}
