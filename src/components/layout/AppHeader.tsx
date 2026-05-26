import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/AuthProvider'

export function AppHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-6">
      <div>
        <h1 className="text-lg font-semibold">Список покупок</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-11">
            Аккаунт
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => void signOut()}>
            <LogOut className="size-4" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
