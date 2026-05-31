/** Пороги прогрессивной шкалы НДФЛ (ФЗ № 176-ФЗ, 2025–2026). */
const NDFL_BRACKETS = [
  { upTo: 2_400_000, rate: 0.13 },
  { upTo: 5_000_000, rate: 0.15 },
  { upTo: 20_000_000, rate: 0.18 },
  { upTo: 50_000_000, rate: 0.2 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.22 },
] as const

export function roundRubles(value: number): number {
  return Math.round(value)
}

/** НДФЛ на накопленный gross-доход с начала года. */
export function calcNdfTaxOnCumulativeIncome(ytdGross: number): number {
  if (ytdGross <= 0) return 0

  let tax = 0
  let prevLimit = 0

  for (const { upTo, rate } of NDFL_BRACKETS) {
    const chunk = Math.min(ytdGross, upTo) - prevLimit
    if (chunk > 0) {
      tax += chunk * rate
    }
    if (ytdGross <= upTo) break
    prevLimit = upTo
  }

  return roundRubles(tax)
}

export interface NdfWithholdingState {
  ytdGross: number
  ytdTax: number
}

export function createNdfWithholdingState(): NdfWithholdingState {
  return { ytdGross: 0, ytdTax: 0 }
}

export interface PaymentWithholding {
  gross: number
  tax: number
  net: number
}

/** Удержание НДФЛ с одной выплаты (нарастающим итогом). */
export function withholdNdfFromPayment(
  paymentGross: number,
  state: NdfWithholdingState,
): PaymentWithholding {
  state.ytdGross += paymentGross
  const totalTaxDue = calcNdfTaxOnCumulativeIncome(state.ytdGross)
  const tax = roundRubles(totalTaxDue - state.ytdTax)
  state.ytdTax = totalTaxDue

  return {
    gross: paymentGross,
    tax,
    net: roundRubles(paymentGross - tax),
  }
}
