import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CategoryPanel } from '@/features/categories/CategoryPanel'
import { ActionBar } from '@/features/list/ActionBar'
import { AddItemForm } from '@/features/list/AddItemForm'
import { ExpenseList } from '@/features/list/ExpenseList'
import { ListPreview } from '@/features/list/ListPreview'
import { useShoppingApp } from '@/features/list/useShoppingApp'
import { SalaryPanel } from '@/features/salary/SalaryPanel'
import { AppHeader } from '@/components/layout/AppHeader'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'

export function ShoppingPage() {
  const [showListPreview, setShowListPreview] = useState(false)
  const app = useShoppingApp()
  const isMobile = useIsMobile()

  return (
    <div className="min-h-svh bg-background pb-28 md:pb-6">
      <AppHeader />

      <div className="mx-auto grid max-w-7xl gap-4 p-4 md:grid-cols-[300px_minmax(0,1fr)] md:gap-6 md:p-6">
        <aside className="space-y-3">
          {isMobile ? (
            <>
              <SalaryPanel
                loading={app.loading}
                salary={app.salary}
                budget={app.budget}
                compact
              />
              <CategoryPanel
                loading={app.loading}
                categories={app.categories}
                onToggle={app.toggleCategory}
              />
            </>
          ) : (
            <Card>
              <CardContent className="space-y-5 p-4">
                <SalaryPanel
                  loading={app.loading}
                  salary={app.salary}
                  budget={app.budget}
                />
                <Separator />
                <CategoryPanel
                  loading={app.loading}
                  categories={app.categories}
                  onToggle={app.toggleCategory}
                />
                <Separator />
                <ActionBar
                  saving={app.saving}
                  onSave={() => void app.saveAll()}
                  onShowList={() => setShowListPreview(true)}
                  onReset={app.resetChecks}
                  className="static border-0 bg-transparent p-0 backdrop-blur-none"
                />
              </CardContent>
            </Card>
          )}
        </aside>

        <main className="min-w-0 space-y-3">
          <AddItemForm categories={app.categories} onAdd={app.addItem} />
          {app.loading ? (
            <div className="overflow-hidden rounded-lg border bg-card">
              <Skeleton className="h-12 w-full rounded-none" />
              <Skeleton className="h-12 w-full rounded-none border-t" />
              <Skeleton className="h-12 w-full rounded-none border-t" />
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

      {isMobile ? (
        <ActionBar
          saving={app.saving}
          onSave={() => void app.saveAll()}
          onShowList={() => setShowListPreview(true)}
          onReset={app.resetChecks}
        />
      ) : null}

      <ListPreview
        open={showListPreview}
        items={app.items}
        onOpenChange={setShowListPreview}
      />
    </div>
  )
}
