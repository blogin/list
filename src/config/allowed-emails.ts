export const allowedEmails = [
  'user1@example.com',
  'user2@example.com',
  'user3@example.com',
] as const

export type AllowedEmail = (typeof allowedEmails)[number]

export function isEmailAllowed(email: string | null | undefined): email is AllowedEmail {
  if (!email) return false
  return (allowedEmails as readonly string[]).includes(email.toLowerCase())
}
