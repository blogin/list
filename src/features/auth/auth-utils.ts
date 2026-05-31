export function getAuthErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String((error as { code: string }).code)
  }
  return undefined
}

export function isMissingRedirectStateError(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error)
  return text.includes('missing initial state')
}

export function shouldFallbackToRedirect(code: string | undefined): boolean {
  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/operation-not-supported-in-this-environment' ||
    code === 'auth/internal-error' ||
    code === 'auth/cancelled-popup-request' ||
    code === 'auth/popup-closed-by-user'
  )
}

export function getAuthErrorMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined

  const authError = error as {
    message?: string
    customData?: { message?: string }
  }

  return authError.customData?.message ?? authError.message
}

export function canUseSessionStorage(): boolean {
  try {
    const key = '__auth_storage_test__'
    sessionStorage.setItem(key, '1')
    sessionStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
