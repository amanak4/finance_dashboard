export type UserRole = 'viewer' | 'admin'

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  description: string
}

export type SortField = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'

export type TransactionFilters = {
  search: string
  type: 'all' | TransactionType
  category: string
  sortField: SortField
  sortDir: SortDir
}
