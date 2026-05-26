import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvLocal() {
  const path = resolve('.env.local')

  try {
    const content = readFileSync(path, 'utf8')
    const env = {}

    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim()
      env[key] = value
    }

    return env
  } catch {
    return {}
  }
}

const env = { ...loadEnvLocal(), ...process.env }
const raw = env.VITE_ALLOWED_EMAILS

if (!raw?.trim()) {
  console.error('Задайте VITE_ALLOWED_EMAILS в .env.local (через запятую).')
  process.exit(1)
}

const emails = raw
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

if (emails.length === 0) {
  console.error('VITE_ALLOWED_EMAILS пустой.')
  process.exit(1)
}

const condition = emails.map((email) => `auth.token.email == '${email}'`).join(' || ')
const rules = {
  rules: {
    '.read': `auth != null && (${condition})`,
    '.write': `auth != null && (${condition})`,
  },
}

writeFileSync('database.rules.json', `${JSON.stringify(rules, null, 2)}\n`)
console.log(`database.rules.json обновлён (${emails.length} email).`)
