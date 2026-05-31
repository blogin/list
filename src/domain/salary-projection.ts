import { calcNdfTaxOnCumulativeIncome, roundRubles } from '@/domain/ndfl'
import type { SalaryMonth } from '@/domain/types'

/** Аванс 25-го — 40% оклада gross, без удержания НДФЛ. */
export const ADVANCE_GROSS_RATIO = 0.4

/** Индексы месяцев выплаты квартальной премии (25-е): Q4→янв, Q1→апр, Q2→июл, Q3→окт. */
export const QUARTERLY_BONUS_MONTH_INDICES = new Set([0, 3, 6, 9])

export const BONUS_COEFFICIENT_OPTIONS = [0, 0.6, 0.7, 0.8, 0.9, 1] as const
export type BonusCoefficient = (typeof BONUS_COEFFICIENT_OPTIONS)[number]

export const SALARY_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export interface MonthlySalaryBreakdown extends SalaryMonth {
  grossSalary: number
  grossBackfire: number
  grossBonus: number
  bonusNet: number
  /** Аванс 25-го + премия на руки. */
  backfireTotal: number
  taxSalary: number
  taxBackfire: number
}

export interface SalaryYearProjection {
  months: MonthlySalaryBreakdown[]
  totalGross: number
  totalBonusGross: number
  totalBonusNet: number
  totalTax: number
  totalNet: number
  effectiveRate: number
  bonusCoefficient: number
}

function emptyMonth(name: string): MonthlySalaryBreakdown {
  return {
    name,
    salary: 0,
    backfire: 0,
    grossSalary: 0,
    grossBackfire: 0,
    grossBonus: 0,
    bonusNet: 0,
    backfireTotal: 0,
    taxSalary: 0,
    taxBackfire: 0,
  }
}

export function projectSalaryYear(
  monthlyGrossOklad: number,
  bonusCoefficient = 0,
): SalaryYearProjection {
  const coef = Number.isFinite(bonusCoefficient) && bonusCoefficient > 0 ? bonusCoefficient : 0

  if (monthlyGrossOklad <= 0 || !Number.isFinite(monthlyGrossOklad)) {
    return {
      months: SALARY_MONTH_NAMES.map((name) => emptyMonth(name)),
      totalGross: 0,
      totalBonusGross: 0,
      totalBonusNet: 0,
      totalTax: 0,
      totalNet: 0,
      effectiveRate: 0,
      bonusCoefficient: coef,
    }
  }

  let ytdGross = 0
  let ytdTax = 0
  let totalBonusGross = 0
  let totalBonusNet = 0
  const months: MonthlySalaryBreakdown[] = []

  SALARY_MONTH_NAMES.forEach((name, monthIndex) => {
    const grossBonus = QUARTERLY_BONUS_MONTH_INDICES.has(monthIndex)
      ? roundRubles(monthlyGrossOklad * coef)
      : 0
    const monthIncomeGross = monthlyGrossOklad + grossBonus

    ytdGross += monthIncomeGross
    const totalTaxDue = calcNdfTaxOnCumulativeIncome(ytdGross)
    const taxThisMonth = roundRubles(totalTaxDue - ytdTax)
    ytdTax = totalTaxDue

    const grossBackfire = roundRubles(monthlyGrossOklad * ADVANCE_GROSS_RATIO)
    const backfire = grossBackfire

    const taxOnBonus =
      grossBonus > 0 ? roundRubles(taxThisMonth * (grossBonus / monthIncomeGross)) : 0
    const bonusNet = roundRubles(grossBonus - taxOnBonus)
    const backfireTotal = roundRubles(backfire + bonusNet)
    const salary = roundRubles(monthIncomeGross - taxThisMonth - backfireTotal)
    const grossSalary = roundRubles(monthlyGrossOklad - grossBackfire)

    totalBonusGross += grossBonus
    totalBonusNet += bonusNet

    months.push({
      name,
      salary,
      backfire: backfireTotal,
      grossSalary,
      grossBackfire,
      grossBonus,
      bonusNet,
      backfireTotal,
      taxSalary: taxThisMonth,
      taxBackfire: 0,
    })
  })

  const totalGross = roundRubles(monthlyGrossOklad * 12 + totalBonusGross)
  const totalTax = ytdTax
  const totalNet = roundRubles(totalGross - totalTax)
  const effectiveRate = totalGross > 0 ? roundRubles((totalTax / totalGross) * 1000) / 10 : 0

  return {
    months,
    totalGross,
    totalBonusGross,
    totalBonusNet,
    totalTax,
    totalNet,
    effectiveRate,
    bonusCoefficient: coef,
  }
}

/** Для yearSalary: backfire — итого на 25-е (аванс + премия). */
export function projectionToSalaryRows(projection: SalaryYearProjection): SalaryMonth[] {
  return projection.months.map(({ name, salary, backfireTotal }) => ({
    name,
    salary,
    backfire: backfireTotal,
  }))
}
