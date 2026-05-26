import type { Category } from '@/domain/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

interface CategoryPanelProps {
  loading: boolean
  categories: Category[]
  onToggle: (name: string, checked: boolean) => void
}

export function CategoryPanel({ loading, categories, onToggle }: CategoryPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Категории</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.name}
            className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md px-1"
          >
            <span className="flex items-center gap-3">
              <Checkbox
                checked={category.checked}
                onCheckedChange={(value) => onToggle(category.name, value === true)}
              />
              <span className="text-sm">{category.name}</span>
            </span>
            <span className="text-sm font-medium tabular-nums">{category.total ?? 0}</span>
          </label>
        ))}
      </CardContent>
    </Card>
  )
}
