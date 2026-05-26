import { useState } from 'react'
import { CategoriesAdminPanel } from '@/features/admin/CategoriesAdminPanel'
import { SalaryAdminPanel } from '@/features/admin/SalaryAdminPanel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AdminTab = 'categories' | 'salary'

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'categories', label: 'Категории' },
  { id: 'salary', label: 'Зарплата' },
]

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('categories')

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold md:text-xl">Управление базой</h2>
        <p className="text-sm text-muted-foreground">
          Категории и зарплата в Firebase RTDB.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <Button
            key={item.id}
            type="button"
            variant={tab === item.id ? 'default' : 'outline'}
            className={cn('h-10', tab !== item.id && 'bg-card')}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {tab === 'categories' ? <CategoriesAdminPanel /> : null}
      {tab === 'salary' ? <SalaryAdminPanel /> : null}
    </div>
  )
}
