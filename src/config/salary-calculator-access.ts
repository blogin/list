export const SALARY_CALCULATOR_EMAIL = 'alogin2009@gmail.com'

export function canUseSalaryCalculator(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === SALARY_CALCULATOR_EMAIL
}
