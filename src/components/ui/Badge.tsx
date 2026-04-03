import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'income' | 'expense' | 'accent'

const toneClass: Record<Tone, string> = {
  neutral: 'bg-[var(--surface-2)] text-[var(--fg-muted)]',
  income: 'bg-[var(--tone-income-bg)] text-[var(--tone-income-fg)]',
  expense: 'bg-[var(--tone-expense-bg)] text-[var(--tone-expense-fg)]',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
}

export function Badge({
  tone = 'neutral',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
