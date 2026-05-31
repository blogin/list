import { parseCost } from '@/domain/calculations'

const MONTHS_IN = [
  'январе',
  'феврале',
  'марте',
  'апреле',
  'мае',
  'июне',
  'июле',
  'августе',
  'сентябре',
  'октябре',
  'ноябре',
  'декабре',
] as const

export function monthInPrepositional(date: Date = new Date()): string {
  return MONTHS_IN[date.getMonth()] ?? ''
}

export function formatMoney(value: number): string {
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)} ₽`
}

export function formatItemCost(cost: string | number): string {
  return formatMoney(parseCost(cost))
}

const integerFormatter = new Intl.NumberFormat('ru-RU')

export function formatIntegerWithSpaces(value: string | number): string {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''
  return integerFormatter.format(Number.parseInt(digits, 10))
}

export function parseDigitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

const SALARY_MONTH_RU: Record<string, string> = {
  January: 'Январь',
  February: 'Февраль',
  March: 'Март',
  April: 'Апрель',
  May: 'Май',
  June: 'Июнь',
  July: 'Июль',
  August: 'Август',
  September: 'Сентябрь',
  October: 'Октябрь',
  November: 'Ноябрь',
  December: 'Декабрь',
}

export function formatSalaryMonthName(englishName: string): string {
  return SALARY_MONTH_RU[englishName] ?? englishName
}
