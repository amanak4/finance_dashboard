import { useFinanceStore } from '../../store/financeStore'
import type { UserRole } from '../../types/finance'
import { Select } from '../ui/Select'

const labels: Record<UserRole, string> = {
  viewer: 'Viewer (read-only)',
  admin: 'Admin (edit data)',
}

export function RoleSwitcher() {
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)

  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-xs font-medium text-[var(--fg-muted)]">Role</span>
      <Select
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
        aria-label="Switch role for demo"
        className="min-w-[200px]"
      >
        {(Object.keys(labels) as UserRole[]).map((r) => (
          <option key={r} value={r}>
            {labels[r]}
          </option>
        ))}
      </Select>
    </label>
  )
}
