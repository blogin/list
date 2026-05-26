export function parseAllowedEmails(raw: string | undefined): readonly string[] {
  if (!raw?.trim()) return []

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false

  return parseAllowedEmails(import.meta.env.VITE_ALLOWED_EMAILS).includes(email.toLowerCase())
}
