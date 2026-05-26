export interface ListItem {
  cost: string
  name: string
  sel: string
  check: boolean
  show: boolean
}

export interface Category {
  name: string
  checked: boolean
  total?: number
  id?: string
}

export interface SalaryMonth {
  name: string
  salary: number
  backfire: number
}

export interface BudgetSummary {
  allExpenses: number
  restOfMoney: number
  usesBackfire: boolean
}
