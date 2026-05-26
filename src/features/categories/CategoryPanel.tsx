import { ChevronDown } from 'lucide-react'
import type { Category } from '@/domain/types'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface CategoryPanelProps {
  loading: boolean
  categories: Category[]
  onToggle: (name: string, checked: boolean) => void
}

export function CategoryPanel({ loading, categories, onToggle }: CategoryPanelProps) {
  const isMobile = useIsMobile()
  const checkedCount = categories.filter((category) => category.checked).length

  if (loading) {
    return <Skeleton className={cn('w-full', isMobile ? 'h-11 rounded-lg' : 'h-40 rounded-lg')} />
  }

  const list = (
    <div className="space-y-1">
      {categories.map((category) => (
        <label
          key={category.name}
          className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md px-1 hover:bg-muted/50"
        >
          <span className="flex items-center gap-3">
            <Checkbox
              checked={category.checked}
              onCheckedChange={(value) => onToggle(category.name, value === true)}
            />
            <span className="text-sm">{category.name}</span>
          </span>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {formatMoney(category.total ?? 0)}
          </span>
        </label>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="group flex h-11 w-full items-center justify-between rounded-lg border bg-card px-3 text-sm font-medium">
          <span>Категории ({checkedCount}/{categories.length})</span>
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 rounded-lg border bg-card p-2">
          {list}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">Категории</h2>
      {list}
    </div>
  )
}
