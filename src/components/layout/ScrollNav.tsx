import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

export type NavSection = { id: string; label: string }

type ScrollNavProps = {
  sections: NavSection[]
  className?: string
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ScrollNav({ sections, className }: ScrollNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const rafRef = useRef(0)
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections])

  const updateActive = useCallback(() => {
    const marker = window.innerHeight * 0.3
    let current = sectionIds[0] ?? ''
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= marker) current = id
    }
    setActiveId((prev) => (prev === current ? prev : current))
  }, [sectionIds])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateActive)
    }
    rafRef.current = requestAnimationFrame(updateActive)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateActive])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }, [])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav
      aria-label="On this page"
      className={cn(
        'flex gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-2 shadow-[var(--shadow-card)] backdrop-blur-md',
        'flex-row overflow-x-auto scrollbar-none lg:flex-col lg:overflow-visible',
        className,
      )}
    >
      {sections.map((s, i) => {
        const active = activeId === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToId(s.id)}
            className={cn(
              'flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-[color,background] duration-200',
              'hover:bg-[var(--surface-hover)]',
              active && 'bg-[var(--accent-soft)]',
            )}
          >
            <span
              className="flex flex-col items-center max-lg:hidden"
              aria-hidden
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full border-2 transition-all duration-200',
                  active
                    ? 'scale-125 border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]'
                    : 'border-[var(--border)] bg-[var(--surface)]',
                )}
              />
              {i < sections.length - 1 ? (
                <span
                  className={cn(
                    'h-4 w-px rounded-full transition-colors duration-200',
                    active ? 'bg-[var(--accent)]/40' : 'bg-[var(--border)]',
                  )}
                />
              ) : null}
            </span>
            <span
              className={cn(
                'whitespace-nowrap text-xs font-semibold tracking-wide transition-colors duration-200',
                active ? 'text-[var(--fg)]' : 'text-[var(--fg-muted)]',
              )}
            >
              {s.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
