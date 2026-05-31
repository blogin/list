import { ArrowLeft, Calculator, Database, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import type { AppView } from '@/features/app/AuthenticatedApp'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  view?: AppView
  showSalaryCalculator?: boolean
  onOpenAdmin?: () => void
  onOpenSalaryCalc?: () => void
  onBack?: () => void
}

export function AppHeader({
  view = 'shopping',
  showSalaryCalculator = false,
  onOpenAdmin,
  onOpenSalaryCalc,
  onBack,
}: AppHeaderProps) {
  const { user, signOut, devAutoLogin } = useAuth()
  const isMobile = useIsMobile()
  const title =
    view === 'admin'
      ? 'Управление базой'
      : view === 'salary-calc'
        ? 'Калькулятор зарплаты'
        : 'Список покупок'

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-1">
          {view === 'admin' || view === 'salary-calc' ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 shrink-0 px-2 md:px-3"
              onClick={onBack}
            >
              <ArrowLeft className="size-4" />
              {!isMobile ? <span className="ml-2">К списку</span> : null}
            </Button>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
            {devAutoLogin && !isMobile ? (
              <p className="truncate text-xs text-amber-600 dark:text-amber-400">Dev: вход без Google</p>
            ) : view === 'shopping' && !isMobile && user?.email ? (
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {view === 'shopping' ? (
            <>
              {showSalaryCalculator ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={onOpenSalaryCalc}
                  aria-label="Калькулятор зарплаты"
                >
                  <Calculator className="size-4" />
                  <span className="ml-2">Зарплата</span>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size={isMobile ? 'icon' : 'default'}
                className={cn(isMobile ? 'size-10 shrink-0' : 'h-10')}
                onClick={onOpenAdmin}
                aria-label="Управление базой"
              >
                <Database className="size-4" />
                {!isMobile ? <span className="ml-2">База</span> : null}
              </Button>
            </>
          ) : null}

          <Button
            variant="outline"
            size={isMobile ? 'icon' : 'default'}
            className={cn(isMobile ? 'size-10 shrink-0' : 'h-10')}
            onClick={() => void signOut()}
            aria-label="Выйти"
          >
            <LogOut className="size-4" />
            {!isMobile ? <span className="ml-2">Выйти</span> : null}
          </Button>
        </div>
      </div>
    </header>
  )
}
