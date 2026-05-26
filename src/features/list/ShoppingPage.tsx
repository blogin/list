import { useState } from 'react'
import { CategoryPanel } from '@/features/categories/CategoryPanel'
import { ActionBar } from '@/features/list/ActionBar'
import { AddItemForm } from '@/features/list/AddItemForm'
import { ExpenseList } from '@/features/list/ExpenseList'
import { ListPreview } from '@/features/list/ListPreview'
import { useShoppingApp } from '@/features/list/useShoppingApp'
import { SalaryPanel } from '@/features/salary/SalaryPanel'
import { AppHeader } from '@/components/layout/AppHeader'
import { Skeleton } from '@/components/ui/skeleton'

export function ShoppingPage() {
  const [showListPreview, setShowListPreview] = useState(false)
  const app = useShoppingApp()

  return (
    <div className="min-h-svh bg-background pb-28 md:pb-6">
      <AppHeader />

      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-[320px_1fr] md:p-6">
        <aside className="space-y-4">
          <SalaryPanel loading={app.loading} salary={app.salary} budget={app.budget} />
          <CategoryPanel
            loading={app.loading}
            categories={app.categories}
            onToggle={app.toggleCategory}
          />
          <div className="hidden md:block">
            <ActionBar
              saving={app.saving}
              onSave={() => void app.saveAll()}
              onShowList={() => setShowListPreview(true)}
              onReset={app.resetChecks}
            />
          </div>
        </aside>

        <main className="space-y-4">
          <AddItemForm categories={app.categories} onAdd={app.addItem} />
          {app.loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <ExpenseList
              items={app.items}
              categories={app.categories}
              onToggleCheck={app.toggleCheck}
              onUpdate={app.updateItem}
              onDelete={app.deleteItem}
            />
          )}
        </main>
      </div>

      <div className="md:hidden">
        <ActionBar
          saving={app.saving}
          onSave={() => void app.saveAll()}
          onShowList={() => setShowListPreview(true)}
          onReset={app.resetChecks}
        />
      </div>

      <ListPreview
        open={showListPreview}
        items={app.items}
        onOpenChange={setShowListPreview}
      />
    </div>
  )
}
