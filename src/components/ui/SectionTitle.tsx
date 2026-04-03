import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function SectionTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold tracking-tight text-[var(--fg)]',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function SectionSubtitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p
      className={cn('text-sm text-[var(--fg-muted)]', className)}
      {...props}
    >
      {children}
    </p>
  )
}
