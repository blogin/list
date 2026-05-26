import type { BudgetSummary, SalaryMonth } from '@/domain/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { statPillVariants } from '@/components/ui/stat-pill'
import { formatMoney, monthInPrepositional } from '@/lib/format'
import { cn } from '@/lib/utils'

interface SalaryPanelProps {
  loading: boolean
  salary?: SalaryMonth
  budget: BudgetSummary
  compact?: boolean
}

export function SalaryPanel({ loading, salary, budget, compact = false }: SalaryPanelProps) {
  if (loading) {
    return compact ? (
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    ) : (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  const monthLabel = monthInPrepositional()
  const budgetLabel = budget.usesBackfire ? 'Аванс' : 'Зап.плата'
  const budgetAmount = salary
    ? budget.usesBackfire
      ? salary.backfire
      : salary.salary
    : 0

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <StatPill label={budgetLabel} value={formatMoney(budgetAmount)} tone="budget" />
        <StatPill
          label="Остаток"
          value={formatMoney(budget.restOfMoney)}
          tone={budget.restOfMoney >= 0 ? 'success' : 'expense'}
        />
        <StatPill label="Расходы" value={formatMoney(budget.allExpenses)} tone="expense" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        {budgetLabel} в {monthLabel}
      </h2>
      <div className="grid gap-2">
        <StatRow label="Бюджет" value={formatMoney(budgetAmount)} tone="budget" />
        <StatRow
          label="Остаток"
          value={formatMoney(budget.restOfMoney)}
          tone={budget.restOfMoney >= 0 ? 'success' : 'expense'}
        />
        <StatRow label="Расходы" value={formatMoney(budget.allExpenses)} tone="expense" />
      </div>
    </div>
  )
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'budget' | 'success' | 'expense'
}) {
  return (
    <div className={cn(statPillVariants({ tone }))}>
      <span className="truncate text-[11px] font-medium uppercase tracking-wide opacity-80">
        {label}
      </span>
      <span className="truncate text-base font-semibold tabular-nums">{value}</span>
    </div>
  )
}

function StatRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'budget' | 'success' | 'expense'
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          tone === 'budget' && 'text-sky-700',
          tone === 'success' && 'text-emerald-700',
          tone === 'expense' && 'text-rose-700',
        )}
      >
        {value}
      </span>
    </div>
  )
}
