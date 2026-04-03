import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--fg)]',
        'shadow-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
