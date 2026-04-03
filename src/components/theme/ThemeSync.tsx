import { useEffect } from 'react'
import type { ThemeMode } from '../../store/financeStore'

function resolveEffectiveDark(theme: ThemeMode): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeSync({ theme }: { theme: ThemeMode }) {
  useEffect(() => {
    const apply = () => {
      const dark = resolveEffectiveDark(theme)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  return null
}
