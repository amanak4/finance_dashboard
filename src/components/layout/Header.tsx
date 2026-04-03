import { useFinanceStore, type ThemeMode } from '../../store/financeStore'
import { RoleSwitcher } from '../rbac/RoleSwitcher'
import { Select } from '../ui/Select'

const themeLabels: Record<ThemeMode, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
}

export function Header() {
  const theme = useFinanceStore((s) => s.theme)
  const setTheme = useFinanceStore((s) => s.setTheme)

  return (
    <header className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 pt-2 md:flex-row md:items-end md:justify-between">
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Finance
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--fg)] md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          Track balances, spending, and activity. Switch role to compare viewer vs
          admin capabilities.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-left">
          <span className="text-xs font-medium text-[var(--fg-muted)]">Theme</span>
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
            aria-label="Theme mode"
            className="min-w-[140px]"
          >
            {(Object.keys(themeLabels) as ThemeMode[]).map((t) => (
              <option key={t} value={t}>
                {themeLabels[t]}
              </option>
            ))}
          </Select>
        </label>
        <RoleSwitcher />
      </div>
    </header>
  )
}
