const EN_MONTH = new Intl.DateTimeFormat('en', { month: 'long' })

function getRuDay(date: Date): string {
  return date.toLocaleString('ru', { day: '2-digit' })
}

function getEnMonthName(date: Date): string {
  return EN_MONTH.format(date)
}

function getEnMonthNameByIndex(monthIndex: number): string {
  return EN_MONTH.format(new Date(2010, monthIndex))
}

function isAfterPayrollCutoff(day: string): boolean {
  return day > '13'
}

export function getListPeriodKey(date: Date = new Date()): string {
  const day = getRuDay(date)
  const month = getEnMonthName(date).toLowerCase()
  const prefix = isAfterPayrollCutoff(day) ? '25' : '10'
  return `${prefix}_${month}`
}

export function getFallbackListKey(date: Date = new Date()): string {
  const day = getRuDay(date)
  const month = getEnMonthName(date).toLowerCase()

  if (isAfterPayrollCutoff(day)) {
    return `10_${month}`
  }

  const previousMonth = getEnMonthNameByIndex(date.getMonth() - 1).toLowerCase()
  return `25_${previousMonth}`
}

export function getCurrentSalaryMonthName(date: Date = new Date()): string {
  return getEnMonthName(date)
}

export function isBackfirePeriod(date: Date = new Date()): boolean {
  return isAfterPayrollCutoff(getRuDay(date))
}
