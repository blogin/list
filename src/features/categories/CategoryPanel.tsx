import { ChevronDown } from 'lucide-react'
import type { Category } from '@/domain/types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { sidebarRowClass } from '@/components/layout/sidebar-row'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface CategoryPanelProps {
  loading: boolean
  categories: Category[]
  onToggle: (name: string, checked: boolean) => void
}

function CategoryRows({
  categories,
  onToggle,
}: {
  categories: Category[]
  onToggle: (name: string, checked: boolean) => void
}) {
  return (
    <div className="grid gap-2">
      {categories.map((category) => (
        <label
          key={category.name}
          className={cn(
            sidebarRowClass,
            'cursor-pointer transition-colors hover:bg-muted/30',
            !category.checked && 'opacity-70',
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            <Checkbox
              checked={category.checked}
              onCheckedChange={(value) => onToggle(category.name, value === true)}
            />
            <span className="truncate text-sm">{category.name}</span>
          </span>
          <Badge variant="category" className="shrink-0 tabular-nums">
            {formatMoney(category.total ?? 0)}
          </Badge>
        </label>
      ))}
    </div>
  )
}

export function CategoryPanel({ loading, categories, onToggle }: CategoryPanelProps) {
  const isMobile = useIsMobile()
  const checkedCount = categories.filter((category) => category.checked).length

  if (loading) {
    return <Skeleton className={cn('w-full', isMobile ? 'h-11 rounded-lg' : 'h-48 rounded-lg')} />
  }

  if (isMobile) {
    return (
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="group flex h-11 w-full items-center justify-between rounded-lg border bg-card px-3 text-sm font-medium">
          <span>Категории ({checkedCount}/{categories.length})</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <CategoryRows categories={categories} onToggle={onToggle} />
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Категории
      </h3>
      <CategoryRows categories={categories} onToggle={onToggle} />
    </div>
  )
}
