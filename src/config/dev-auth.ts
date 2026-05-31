/** Автовход без Google — только `npm run dev`, в production-сборке отключено. */
export function isDevAutoLoginEnabled(): boolean {
  if (!import.meta.env.DEV) return false
  return import.meta.env.VITE_DEV_AUTO_LOGIN === 'true'
}

export function getDevAuthCredentials(): { email: string; password: string } | null {
  const email = import.meta.env.VITE_DEV_AUTH_EMAIL?.trim()
  const password = import.meta.env.VITE_DEV_AUTH_PASSWORD
  if (!email || !password) return null
  return { email, password }
}
