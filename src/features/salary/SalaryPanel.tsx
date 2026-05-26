import type { BudgetSummary, SalaryMonth } from '@/domain/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SalaryPanelProps {
  loading: boolean
  salary?: SalaryMonth
  budget: BudgetSummary
}

export function SalaryPanel({ loading, salary, budget }: SalaryPanelProps) {
  if (loading) {
    return (
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

  const monthLabel = new Date().toLocaleString('ru', { month: 'long' })
  const budgetLabel = budget.usesBackfire ? 'Аванс' : 'Зап.плата'
  const budgetAmount = salary
    ? budget.usesBackfire
      ? salary.backfire
      : salary.salary
    : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {budgetLabel} в {monthLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Бюджет</span>
          <span className="font-medium text-green-600">{budgetAmount}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Остаток | Расходы</span>
          <span>
            <span
              className={cn(
                'font-medium',
                budget.restOfMoney >= 0 ? 'text-green-600' : 'text-destructive',
              )}
            >
              {budget.restOfMoney}
            </span>
            <span className="text-muted-foreground"> | </span>
            <span className="font-medium text-destructive">{budget.allExpenses}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
