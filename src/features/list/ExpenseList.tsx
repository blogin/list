import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Category, ListItem } from '@/domain/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
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
import { cn } from '@/lib/utils'

interface ExpenseListProps {
  items: ListItem[]
  categories: Category[]
  onToggleCheck: (index: number) => void
  onUpdate: (index: number, patch: Partial<ListItem>) => void
  onDelete: (index: number) => void
}

export function ExpenseList({
  items,
  categories,
  onToggleCheck,
  onUpdate,
  onDelete,
}: ExpenseListProps) {
  const isMobile = useIsMobile()
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<ListItem>>({})

  const visibleItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.show)

  function openEdit(index: number) {
    setEditIndex(index)
    setDraft(items[index] ?? {})
  }

  function saveEdit() {
    if (editIndex === null) return
    onUpdate(editIndex, {
      cost: draft.cost ?? '',
      name: draft.name ?? '',
      sel: draft.sel ?? '',
    })
    setEditIndex(null)
    setDraft({})
  }

  const editSheet = (
    <EditSheet
      open={editIndex !== null}
      draft={draft}
      categories={categories}
      onChange={setDraft}
      onClose={() => setEditIndex(null)}
      onSave={saveEdit}
    />
  )

  const deleteDialog = (
    <DeleteDialog
      open={deleteIndex !== null}
      onCancel={() => setDeleteIndex(null)}
      onConfirm={() => {
        if (deleteIndex !== null) onDelete(deleteIndex)
        setDeleteIndex(null)
      }}
    />
  )

  if (isMobile) {
    return (
      <>
        <div className="overflow-hidden rounded-lg border bg-card">
          {visibleItems.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              Нет позиций для выбранных категорий
            </div>
          ) : (
            visibleItems.map(({ item, index }, rowIndex) => (
              <div
                key={`${item.name}-${index}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5',
                  rowIndex > 0 && 'border-t',
                  item.check && 'border-l-[3px] border-l-emerald-500 bg-emerald-50/80',
                )}
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onToggleCheck(index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-14 shrink-0 text-base font-semibold tabular-nums">
                      {item.cost}
                    </span>
                    <span
                      className={cn(
                        'min-w-0 flex-1 truncate text-base',
                        item.check && 'text-muted-foreground line-through',
                      )}
                    >
                      {item.name}
                    </span>
                    <Badge variant="category" className="shrink-0">
                      {item.sel}
                    </Badge>
                  </div>
                </button>
                <div className="flex shrink-0">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="size-8"
                    onClick={() => openEdit(index)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="size-8"
                    onClick={() => setDeleteIndex(index)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {editSheet}
        {deleteDialog}
      </>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24">Цена</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="w-32">Категория</TableHead>
              <TableHead className="w-24 text-right"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map(({ item, index }) => (
              <TableRow
                key={`${item.name}-${index}`}
                className={cn(item.check && 'bg-emerald-50/70')}
              >
                <TableCell className="py-2 font-semibold tabular-nums">
                  <button type="button" className="w-full text-left" onClick={() => onToggleCheck(index)}>
                    {item.cost}
                  </button>
                </TableCell>
                <TableCell className="py-2">
                  <button
                    type="button"
                    className={cn('w-full text-left', item.check && 'text-muted-foreground line-through')}
                    onClick={() => onToggleCheck(index)}
                  >
                    {item.name}
                  </button>
                </TableCell>
                <TableCell className="py-2">
                  <Badge variant="category">{item.sel}</Badge>
                </TableCell>
                <TableCell className="py-2 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon-sm" variant="ghost" onClick={() => openEdit(index)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setDeleteIndex(index)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editSheet}
      {deleteDialog}
    </>
  )
}

function EditSheet({
  open,
  draft,
  categories,
  onChange,
  onClose,
  onSave,
}: {
  open: boolean
  draft: Partial<ListItem>
  categories: Category[]
  onChange: (draft: Partial<ListItem>) => void
  onClose: () => void
  onSave: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent side="bottom" className="max-h-[85svh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Редактирование</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 px-4 pb-4">
          <Input
            inputMode="numeric"
            value={draft.cost ?? ''}
            onChange={(event) => onChange({ ...draft, cost: event.target.value })}
            placeholder="Цена"
            className="h-11 text-base"
          />
          <Input
            value={draft.name ?? ''}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Название"
            className="h-11 text-base"
          />
          <Select
            value={draft.sel ?? ''}
            onValueChange={(value) => onChange({ ...draft, sel: value })}
          >
            <SelectTrigger className="h-11 w-full text-base">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <SheetFooter>
          <Button className="h-11 w-full" onClick={onSave}>
            Сохранить
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function DeleteDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить позицию?</AlertDialogTitle>
          <AlertDialogDescription>
            Позиция будет удалена из текущего списка.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">Отмена</AlertDialogCancel>
          <AlertDialogAction className="h-11" onClick={onConfirm}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
