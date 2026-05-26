import type { BudgetSummary, SalaryMonth } from '@/domain/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { sidebarRowClass } from '@/components/layout/sidebar-row'
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
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
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
      <div className="space-y-2">
        <BudgetHeading budgetLabel={budgetLabel} monthLabel={monthLabel} compact />
        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Бюджет" value={formatMoney(budgetAmount)} tone="budget" />
          <StatPill
            label="Остаток"
            value={formatMoney(budget.restOfMoney)}
            tone={budget.restOfMoney >= 0 ? 'success' : 'expense'}
          />
          <StatPill label="Расходы" value={formatMoney(budget.allExpenses)} tone="expense" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <BudgetHeading budgetLabel={budgetLabel} monthLabel={monthLabel} />
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

function BudgetHeading({
  budgetLabel,
  monthLabel,
  compact = false,
}: {
  budgetLabel: string
  monthLabel: string
  compact?: boolean
}) {
  return (
    <h2
      className={cn(
        'leading-tight tracking-tight',
        compact ? 'text-base font-semibold' : 'text-lg font-semibold md:text-xl',
      )}
    >
      {budgetLabel}{' '}
      <span className="font-medium text-muted-foreground">в {monthLabel}</span>
    </h2>
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
    <div className={sidebarRowClass}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={tone} className="text-sm tabular-nums">
        {value}
      </Badge>
    </div>
  )
}
