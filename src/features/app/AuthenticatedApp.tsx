import { useState } from 'react'
import { AdminPage } from '@/features/admin/AdminPage'
import { ShoppingPage } from '@/features/list/ShoppingPage'
import { AppHeader } from '@/components/layout/AppHeader'

export type AppView = 'shopping' | 'admin'

export function AuthenticatedApp() {
  const [view, setView] = useState<AppView>('shopping')

  return (
    <div className="min-h-svh bg-background">
      <AppHeader
        view={view}
        onOpenAdmin={() => setView('admin')}
        onBack={() => setView('shopping')}
      />
      {view === 'shopping' ? <ShoppingPage /> : <AdminPage />}
    </div>
  )
}
