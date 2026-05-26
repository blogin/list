import { AuthProvider, useAuth } from '@/features/auth/AuthProvider'
import { LoginPage } from '@/features/auth/LoginPage'
import { ShoppingPage } from '@/features/list/ShoppingPage'
import { Toaster } from '@/components/ui/sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { isFirebaseConfigured } from '@/lib/firebase/client'

function MissingConfigPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Нужна конфигурация Firebase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Скопируй `.env.example` в `.env.local` и заполни ключи Web App из Firebase Console.</p>
          <p>После этого перезапусти `npm run dev`.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AppContent() {
  const { user, loading, accessDenied } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage accessDenied={accessDenied} />
  }

  return <ShoppingPage />
}

export default function App() {
  if (!isFirebaseConfigured()) {
    return <MissingConfigPage />
  }

  return (
    <AuthProvider>
      <AppContent />
      <Toaster richColors position="top-center" className="md:top-auto md:bottom-4 md:right-4" />
    </AuthProvider>
  )
}
