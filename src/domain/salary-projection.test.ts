import { describe, expect, it } from 'vitest'
import {
  calcNdfTaxOnCumulativeIncome,
  withholdNdfFromPayment,
  createNdfWithholdingState,
} from '@/domain/ndfl'
import {
  projectSalaryYear,
  projectionToSalaryRows,
  SALARY_MONTH_NAMES,
} from '@/domain/salary-projection'

describe('ndfl', () => {
  it('calculates 13% for income within first bracket', () => {
    expect(calcNdfTaxOnCumulativeIncome(200_000)).toBe(26_000)
    expect(calcNdfTaxOnCumulativeIncome(2_400_000)).toBe(312_000)
  })

  it('calculates progressive tax above 2.4M', () => {
    expect(calcNdfTaxOnCumulativeIncome(2_450_000)).toBe(319_500)
    expect(calcNdfTaxOnCumulativeIncome(4_200_000)).toBe(582_000)
  })

  it('withholds tax cumulatively across payments', () => {
    const state = createNdfWithholdingState()
    const first = withholdNdfFromPayment(120_000, state)
    const second = withholdNdfFromPayment(80_000, state)

    expect(first.tax).toBe(15_600)
    expect(first.net).toBe(104_400)
    expect(second.tax).toBe(10_400)
    expect(second.net).toBe(69_600)
    expect(state.ytdTax).toBe(26_000)
  })
})

describe('salary-projection', () => {
  it('returns empty projection for invalid oklad', () => {
    const projection = projectSalaryYear(0)
    expect(projection.months).toHaveLength(12)
    expect(projection.totalNet).toBe(0)
  })

  it('pays advance gross 40% and salary as monthly net minus advance', () => {
    const projection = projectSalaryYear(200_000)

    expect(projection.totalGross).toBe(2_400_000)
    expect(projection.totalTax).toBe(312_000)
    expect(projection.totalNet).toBe(2_088_000)
    expect(projection.effectiveRate).toBe(13)

    for (const row of projection.months) {
      expect(row.grossBackfire).toBe(80_000)
      expect(row.bonusNet).toBe(0)
      expect(row.backfireTotal).toBe(80_000)
      expect(row.salary).toBe(94_000)
      expect(row.salary + row.backfireTotal).toBe(174_000)
    }
  })

  it('matches real february split for oklad 470588', () => {
    const february = projectSalaryYear(470_588).months[1]

    expect(february?.backfireTotal).toBe(188_235)
    expect(february?.salary).toBe(221_176)
    expect(february?.taxSalary).toBe(61_177)
  })

  it('adds quarterly bonus to april advance with tax', () => {
    const april = projectSalaryYear(470_588, 0.6).months[3]

    expect(april?.grossBonus).toBe(282_353)
    expect(april?.bonusNet).toBeGreaterThan(0)
    expect(april?.backfireTotal).toBe(april!.grossBackfire + april!.bonusNet)
    expect(april?.backfireTotal).toBeGreaterThan(april!.grossBackfire)
  })

  it('includes bonus gross in annual totals', () => {
    const projection = projectSalaryYear(100_000, 0.6)

    expect(projection.totalBonusGross).toBe(240_000)
    expect(projection.totalGross).toBe(1_440_000)
  })

  it('applies higher rate after crossing 2.4M threshold mid-year', () => {
    const projection = projectSalaryYear(350_000)
    const july = projection.months[6]

    expect(july.salary + july.backfireTotal).toBeLessThan(350_000 * 0.87 + 1)
    expect(projection.totalTax).toBeGreaterThan(350_000 * 12 * 0.13)
  })

  it('maps projection to SalaryMonth rows with total advance', () => {
    const projection = projectSalaryYear(100_000, 0.6)
    const rows = projectionToSalaryRows(projection)

    expect(rows).toHaveLength(12)
    expect(rows[0]?.name).toBe(SALARY_MONTH_NAMES[0])
    expect(rows[3]?.backfire).toBe(projection.months[3]?.backfireTotal)
  })
})
