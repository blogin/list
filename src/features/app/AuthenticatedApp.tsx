import { useEffect, useState } from 'react'
import { canUseSalaryCalculator } from '@/config/salary-calculator-access'
import { AdminPage } from '@/features/admin/AdminPage'
import { ShoppingPage } from '@/features/list/ShoppingPage'
import { SalaryCalculatorPage } from '@/features/salary-calculator/SalaryCalculatorPage'
import { AppHeader } from '@/components/layout/AppHeader'
import { useAuth } from '@/features/auth/AuthProvider'
import { useIsMobile } from '@/hooks/use-mobile'

export type AppView = 'shopping' | 'admin' | 'salary-calc'

export function AuthenticatedApp() {
  const [view, setView] = useState<AppView>('shopping')
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const showSalaryCalculator = canUseSalaryCalculator(user?.email) && !isMobile

  useEffect(() => {
    if (view === 'salary-calc' && !showSalaryCalculator) {
      setView('shopping')
    }
  }, [view, showSalaryCalculator])

  return (
    <div className="min-h-svh bg-background">
      <AppHeader
        view={view}
        showSalaryCalculator={showSalaryCalculator}
        onOpenAdmin={() => setView('admin')}
        onOpenSalaryCalc={() => setView('salary-calc')}
        onBack={() => setView('shopping')}
      />
      {view === 'shopping' ? <ShoppingPage /> : null}
      {view === 'admin' ? <AdminPage /> : null}
      {view === 'salary-calc' && showSalaryCalculator ? <SalaryCalculatorPage /> : null}
    </div>
  )
}
