import type { Transaction } from '../types/finance'

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function transactionsToCsv(rows: Transaction[]): string {
  const header = ['id', 'date', 'amount', 'category', 'type', 'description']
  const lines = [
    header.join(','),
    ...rows.map((t) =>
      [
        t.id,
        t.date,
        String(t.amount),
        escapeCell(t.category),
        t.type,
        escapeCell(t.description),
      ].join(','),
    ),
  ]
  return lines.join('\n')
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
