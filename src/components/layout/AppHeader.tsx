import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export function AppHeader() {
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold md:text-lg">Список покупок</h1>
          {!isMobile && user?.email ? (
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          ) : null}
        </div>
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
    </header>
  )
}
