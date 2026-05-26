import type { ListItem } from '@/domain/types'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { formatItemCost } from '@/lib/format'
import { cn } from '@/lib/utils'

interface ListPreviewProps {
  open: boolean
  items: ListItem[]
  onOpenChange: (open: boolean) => void
}

export function ListPreview({ open, items, onOpenChange }: ListPreviewProps) {
  const isMobile = useIsMobile()

  const content = (
    <div className="max-h-[70svh] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Цена</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.name}-${index}`} className={cn(item.check && 'bg-emerald-50/70')}>
              <TableCell>
                <Badge variant="amount" className="text-sm">
                  {formatItemCost(item.cost)}
                </Badge>
              </TableCell>
              <TableCell className="text-[15px]">{item.name}</TableCell>
              <TableCell>
                <Badge variant="category">{item.sel}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[90svh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Полный список</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">{content}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Полный список</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
