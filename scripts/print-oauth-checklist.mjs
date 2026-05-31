import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve('.env.local'), 'utf8')
    const env = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const i = trimmed.indexOf('=')
      if (i === -1) continue
      env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim()
    }
    return env
  } catch {
    return {}
  }
}

const env = { ...loadEnvLocal(), ...process.env }
const projectId = env.VITE_FIREBASE_PROJECT_ID ?? 'your-project-id'
const webApp = `https://${projectId}.web.app`
const firebaseApp = `https://${projectId}.firebaseapp.com`

console.log('')
console.log('Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID (Web client)')
console.log('')
console.log('Authorized JavaScript origins — добавить если нет:')
console.log(`  ${webApp}`)
console.log('')
console.log('Authorized redirect URIs — добавить если нет:')
console.log(`  ${webApp}/__/auth/handler`)
console.log('')
console.log('Обычно уже есть (не удалять):')
console.log(`  ${firebaseApp}/__/auth/handler`)
console.log('')
console.log(`Console: https://console.cloud.google.com/apis/credentials?project=${projectId}`)
console.log('')
