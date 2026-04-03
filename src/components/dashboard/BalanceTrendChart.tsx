import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { useFinanceStore } from '../../store/financeStore'
import { balanceTrendPoints } from '../../lib/insights'
import { formatCurrency } from '../../lib/formatCurrency'
import { Card, CardTitle } from '../ui/Card'

export function BalanceTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const data = useMemo(
    () =>
      balanceTrendPoints(transactions).map((p) => ({
        ...p,
        label: format(parseISO(p.date), 'MMM d'),
      })),
    [transactions],
  )

  if (!transactions.length) {
    return (
      <Card>
        <CardTitle>Balance trend</CardTitle>
        <p className="mt-4 rounded-xl bg-[var(--surface-2)] py-10 text-center text-sm text-[var(--fg-muted)]">
          No transactions yet. Add data to see how your balance changes over time.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <CardTitle>Balance trend</CardTitle>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Running balance after each recorded transaction
      </p>
      <div className="mt-4 h-64 w-full min-h-[16rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--fg-muted)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => formatCurrency(Number(v))}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--fg-muted)' }}
              formatter={(value) => [
                formatCurrency(Number(value ?? 0)),
                'Balance',
              ]}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#balFill)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--chart-1)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
