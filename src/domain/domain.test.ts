import { describe, expect, it } from 'vitest'
import { isEmailAllowed } from '@/config/allowed-emails'
import {
  calcAllExpenses,
  calcCategoryTotals,
  calcRestOfMoney,
  findSalaryForMonth,
  isValidCostInput,
} from '@/domain/calculations'
import {
  getCurrentSalaryMonthName,
  getFallbackListKey,
  getListPeriodKey,
  isBackfirePeriod,
} from '@/domain/list-period'
import {
  createListItem,
  resetAllChecks,
  sortByCostDesc,
  sortListItems,
  toggleItemChecked,
} from '@/domain/list-utils'
import type { Category, ListItem, SalaryMonth } from '@/domain/types'

const sampleItems: ListItem[] = [
  { cost: '100', name: 'Milk', sel: 'Food', check: false, show: true },
  { cost: '50', name: 'Bread', sel: 'Food', check: true, show: true },
  { cost: '200', name: 'Bus', sel: 'Transport', check: false, show: true },
]

const sampleCategories: Category[] = [
  { name: 'Food', checked: true, total: 0 },
  { name: 'Transport', checked: true, total: 0 },
]

const sampleSalary: SalaryMonth[] = [
  { name: 'May', salary: 1000, backfire: 500 },
]

describe('list-period', () => {
  it('returns 10_* key before payroll cutoff', () => {
    const date = new Date('2026-05-10T12:00:00')
    expect(getListPeriodKey(date)).toBe('10_may')
    expect(isBackfirePeriod(date)).toBe(false)
  })

  it('returns 25_* key after payroll cutoff', () => {
    const date = new Date('2026-05-14T12:00:00')
    expect(getListPeriodKey(date)).toBe('25_may')
    expect(isBackfirePeriod(date)).toBe(true)
  })

  it('returns fallback key for missing current list', () => {
    const earlyMonth = new Date('2026-05-05T12:00:00')
    expect(getFallbackListKey(earlyMonth)).toBe('25_april')

    const lateMonth = new Date('2026-05-20T12:00:00')
    expect(getFallbackListKey(lateMonth)).toBe('10_may')
  })

  it('resolves current salary month in English', () => {
    const date = new Date('2026-05-20T12:00:00')
    expect(getCurrentSalaryMonthName(date)).toBe('May')
  })
})

describe('calculations', () => {
  it('sums all expenses', () => {
    expect(calcAllExpenses(sampleItems)).toBe(350)
  })

  it('calculates rest from salary before cutoff', () => {
    const date = new Date('2026-05-10T12:00:00')
    const salary = findSalaryForMonth(sampleSalary, 'May')
    expect(calcRestOfMoney(salary, sampleItems, date)).toEqual({
      allExpenses: 350,
      restOfMoney: 650,
      usesBackfire: false,
    })
  })

  it('calculates rest from backfire after cutoff', () => {
    const date = new Date('2026-05-20T12:00:00')
    const salary = findSalaryForMonth(sampleSalary, 'May')
    expect(calcRestOfMoney(salary, sampleItems, date)).toEqual({
      allExpenses: 350,
      restOfMoney: 150,
      usesBackfire: true,
    })
  })

  it('calculates category totals', () => {
    expect(calcCategoryTotals(sampleCategories, sampleItems)).toEqual([
      { name: 'Food', checked: true, total: 150 },
      { name: 'Transport', checked: true, total: 200 },
    ])
  })

  it('validates numeric cost input', () => {
    expect(isValidCostInput('123')).toBe(true)
    expect(isValidCostInput('12a')).toBe(false)
    expect(isValidCostInput('')).toBe(false)
  })
})

describe('list-utils', () => {
  it('sorts by cost descending', () => {
    expect(sortByCostDesc(sampleItems).map((item) => item.cost)).toEqual([
      '200',
      '100',
      '50',
    ])
  })

  it('moves checked items to the bottom', () => {
    expect(sortListItems(sampleItems, sampleCategories).map((item) => item.name)).toEqual([
      'Milk',
      'Bus',
      'Bread',
    ])
  })

  it('sorts unchecked items by category order then cost descending', () => {
    const categories: Category[] = [
      { name: 'Transport', checked: true, total: 0 },
      { name: 'Food', checked: true, total: 0 },
    ]
    const items: ListItem[] = [
      { cost: '50', name: 'Bread', sel: 'Food', check: false, show: true },
      { cost: '200', name: 'Bus', sel: 'Transport', check: false, show: true },
      { cost: '100', name: 'Milk', sel: 'Food', check: false, show: true },
    ]

    expect(sortListItems(items, categories).map((item) => item.name)).toEqual([
      'Bus',
      'Milk',
      'Bread',
    ])
  })

  it('returns unchecked item to its category position', () => {
    const categories: Category[] = [
      { name: 'Food', checked: true, total: 0 },
      { name: 'Transport', checked: true, total: 0 },
    ]
    const items: ListItem[] = [
      { cost: '100', name: 'Milk', sel: 'Food', check: false, show: true },
      { cost: '200', name: 'Bus', sel: 'Transport', check: false, show: true },
      { cost: '50', name: 'Bread', sel: 'Food', check: true, show: true },
    ]

    const unchecked = toggleItemChecked(items, 2)
    expect(sortListItems(unchecked, categories).map((item) => item.name)).toEqual([
      'Milk',
      'Bread',
      'Bus',
    ])
  })

  it('toggles checked state by index', () => {
    const next = toggleItemChecked(sampleItems, 0)
    expect(next[0]?.check).toBe(true)
  })

  it('creates and resets list items', () => {
    const item = createListItem({ cost: '10', name: 'Tea', sel: 'Food' })
    expect(item.check).toBe(false)
    expect(resetAllChecks([{ ...item, check: true }])[0]?.check).toBe(false)
  })
})

describe('allowed emails', () => {
  it('allows whitelisted google accounts', () => {
    expect(isEmailAllowed('user1@example.com')).toBe(true)
    expect(isEmailAllowed('user2@example.com')).toBe(true)
  })

  it('denies unknown accounts', () => {
    expect(isEmailAllowed('other@gmail.com')).toBe(false)
    expect(isEmailAllowed(null)).toBe(false)
  })
})
