import { Pencil, Trash2 } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
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
import { formatItemCost } from '@/lib/format'
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
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<ListItem>>({})
  const scrollSnapshotRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (scrollSnapshotRef.current === null) return
    const top = scrollSnapshotRef.current
    scrollSnapshotRef.current = null
    window.scrollTo({ top, left: window.scrollX })
  }, [items])

  function handleToggleCheck(index: number) {
    scrollSnapshotRef.current = window.scrollY
    onToggleCheck(index)
  }

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

  if (visibleItems.length === 0) {
    return (
      <>
        <div className="overflow-hidden rounded-lg border bg-card px-3 py-8 text-center text-sm text-muted-foreground">
          Нет позиций для выбранных категорий
        </div>
        {editSheet}
        {deleteDialog}
      </>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card [overflow-anchor:none] md:hidden">
        {visibleItems.map(({ item, index }, rowIndex) => (
          <div
            key={`mobile-${item.name}-${index}`}
            className={cn(
              'flex items-center gap-1 px-3 py-2.5',
              rowIndex > 0 && 'border-t',
              item.check && 'border-l-[3px] border-l-emerald-500 bg-emerald-50/80',
            )}
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
              onClick={(event) => {
                event.currentTarget.blur()
                handleToggleCheck(index)
              }}
            >
              <ItemAmountBadge cost={item.cost} checked={item.check} />
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-[15px] leading-snug',
                  item.check && 'text-muted-foreground line-through',
                )}
              >
                {item.name}
              </span>
              <Badge variant="category" className="max-w-[4.5rem] shrink-0 truncate">
                {item.sel}
              </Badge>
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
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border bg-card md:block">
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
                key={`desktop-${item.name}-${index}`}
                className={cn(item.check && 'bg-emerald-50/70')}
              >
                <TableCell className="py-2.5">
                  <button
                    type="button"
                    className="text-left"
                    onClick={(event) => {
                      event.currentTarget.blur()
                      handleToggleCheck(index)
                    }}
                  >
                    <ItemAmountBadge cost={item.cost} checked={item.check} />
                  </button>
                </TableCell>
                <TableCell className="py-2.5">
                  <button
                    type="button"
                    className={cn(
                      'w-full text-left text-[15px] leading-snug',
                      item.check && 'text-muted-foreground line-through',
                    )}
                    onClick={(event) => {
                      event.currentTarget.blur()
                      handleToggleCheck(index)
                    }}
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

function ItemAmountBadge({ cost, checked }: { cost: string; checked: boolean }) {
  return (
    <Badge variant="amount" className={cn('shrink-0 text-sm', checked && 'opacity-60')}>
      {formatItemCost(cost)}
    </Badge>
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
