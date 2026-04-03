import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] shadow-sm hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-[var(--surface-2)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--surface-hover)]',
  ghost:
    'text-[var(--fg-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--fg)]',
  danger:
    'bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]',
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]',
        'disabled:pointer-events-none disabled:opacity-45',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
