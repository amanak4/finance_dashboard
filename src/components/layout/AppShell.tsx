import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Header } from './Header'
import { ScrollNav, type NavSection } from './ScrollNav'

type AppShellProps = {
  children: ReactNode
  navSections?: NavSection[]
}

export function AppShell({ children, navSections }: AppShellProps) {
  const showNav = navSections && navSections.length > 0

  return (
    <div className="min-h-svh bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Header />
        <div
          className={cn(
            'mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10',
          )}
        >
          {showNav ? (
            <aside className="z-30 shrink-0 lg:sticky lg:top-8 lg:w-44 lg:self-start">
              <ScrollNav
                sections={navSections}
                className="sticky top-4 max-lg:max-w-[calc(100vw-2rem)]"
              />
            </aside>
          ) : null}
          <main
            id="main-content"
            className="min-w-0 flex-1 space-y-12"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
