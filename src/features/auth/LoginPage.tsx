import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithGoogle } from '@/features/auth/google-sign-in'
import { getAuthErrorCode } from '@/features/auth/auth-log'

export function LoginPage({ accessDenied = false }: { accessDenied?: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      if (error instanceof Error && error.message === 'redirect') {
        return
      }
      const code = getAuthErrorCode(error)
      toast.error(
        code ? `Не удалось войти (${code})` : 'Не удалось войти через Google',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Список покупок</CardTitle>
          <CardDescription>
            {accessDenied
              ? 'У вашего Google-аккаунта нет доступа к этому приложению.'
              : 'Войдите через Google, чтобы открыть список и бюджет.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="h-11 w-full"
            disabled={loading}
            onClick={() => void handleSignIn()}
          >
            {loading ? 'Вход...' : 'Войти через Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
