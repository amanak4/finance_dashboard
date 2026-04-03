import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Card } from './Card'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-2)] text-2xl"
        aria-hidden
      >
        ∅
      </div>
      <div>
        <p className="text-base font-medium text-[var(--fg)]">{title}</p>
        {description ? (
          <p className="mt-1 max-w-sm text-sm text-[var(--fg-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </Card>
  )
}
