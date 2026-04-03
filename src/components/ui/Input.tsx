import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)]',
        'shadow-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}
