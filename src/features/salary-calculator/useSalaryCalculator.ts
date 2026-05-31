import { useEffect, useMemo, useState } from 'react'
import {
  BONUS_COEFFICIENT_OPTIONS,
  projectSalaryYear,
  projectionToSalaryRows,
  type BonusCoefficient,
} from '@/domain/salary-projection'
import { parseDigitsOnly } from '@/lib/format'

const OKLAD_STORAGE_KEY = 'salary-calculator-gross-oklad'
const BONUS_STORAGE_KEY = 'salary-calculator-bonus-coef'

function readStoredOklad(): string {
  try {
    return parseDigitsOnly(localStorage.getItem(OKLAD_STORAGE_KEY) ?? '')
  } catch {
    return ''
  }
}

function readStoredBonusCoef(): BonusCoefficient {
  try {
    const raw = localStorage.getItem(BONUS_STORAGE_KEY)
    const parsed = Number(raw)
    return BONUS_COEFFICIENT_OPTIONS.includes(parsed as BonusCoefficient)
      ? (parsed as BonusCoefficient)
      : 0
  } catch {
    return 0
  }
}

function writeStoredOklad(value: string) {
  try {
    if (value) {
      localStorage.setItem(OKLAD_STORAGE_KEY, value)
    } else {
      localStorage.removeItem(OKLAD_STORAGE_KEY)
    }
  } catch {
    // ignore
  }
}

function writeStoredBonusCoef(value: BonusCoefficient) {
  try {
    localStorage.setItem(BONUS_STORAGE_KEY, String(value))
  } catch {
    // ignore
  }
}

export function useSalaryCalculator() {
  const [okladDigits, setOkladDigits] = useState(readStoredOklad)
  const [bonusCoefficient, setBonusCoefficient] = useState<BonusCoefficient>(readStoredBonusCoef)

  useEffect(() => {
    writeStoredOklad(okladDigits)
  }, [okladDigits])

  useEffect(() => {
    writeStoredBonusCoef(bonusCoefficient)
  }, [bonusCoefficient])

  const monthlyGross = useMemo(() => {
    const parsed = Number.parseInt(okladDigits, 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  }, [okladDigits])

  const projection = useMemo(
    () => projectSalaryYear(monthlyGross, bonusCoefficient),
    [monthlyGross, bonusCoefficient],
  )
  const salaryRows = useMemo(() => projectionToSalaryRows(projection), [projection])

  return {
    okladDigits,
    setOkladDigits,
    bonusCoefficient,
    setBonusCoefficient,
    monthlyGross,
    projection,
    salaryRows,
    hasValidOklad: monthlyGross > 0,
  }
}
