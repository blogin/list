import type { BudgetSummary, Category, ListItem, SalaryMonth } from './types'
import { isBackfirePeriod } from './list-period'

export function parseCost(cost: string | number): number {
  const value = typeof cost === 'number' ? cost : Number.parseInt(String(cost), 10)
  return Number.isFinite(value) ? value : 0
}

export function calcAllExpenses(items: ListItem[]): number {
  if (items.length === 0) return 0
  return items.reduce((sum, item) => sum + parseCost(item.cost), 0)
}

export function calcRestOfMoney(
  salaryMonth: SalaryMonth | undefined,
  items: ListItem[],
  date: Date = new Date(),
): BudgetSummary {
  const allExpenses = calcAllExpenses(items)
  const usesBackfire = isBackfirePeriod(date)

  if (!salaryMonth) {
    return { allExpenses, restOfMoney: -allExpenses, usesBackfire }
  }

  const budget = usesBackfire ? salaryMonth.backfire : salaryMonth.salary
  const restOfMoney = Number((budget - allExpenses).toFixed(2))

  return { allExpenses, restOfMoney, usesBackfire }
}

export function calcCategoryTotals(categories: Category[], items: ListItem[]): Category[] {
  return categories.map((category) => {
    const total = items
      .filter((item) => item.sel === category.name)
      .reduce((sum, item) => sum + parseCost(item.cost), 0)

    return { ...category, total }
  })
}

export function applyCategoryVisibility(
  categories: Category[],
  items: ListItem[],
): ListItem[] {
  const visibleNames = new Set(
    categories.filter((category) => category.checked).map((category) => category.name),
  )

  return items.map((item) => ({
    ...item,
    show: visibleNames.has(item.sel),
  }))
}

export function findSalaryForMonth(
  salaryRows: SalaryMonth[],
  monthName: string,
): SalaryMonth | undefined {
  return salaryRows.find((row) => row.name === monthName)
}

export function isValidCostInput(value: string): boolean {
  return /^\d+$/.test(value)
}
