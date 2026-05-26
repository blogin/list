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
import { Card, CardContent } from '@/components/ui/card'
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

  if (isMobile) {
    return (
      <>
        <div className="space-y-2">
          {visibleItems.map(({ item, index }) => (
            <Card
              key={`${item.name}-${index}`}
              className={cn(item.check && 'border-primary/40 bg-primary/10')}
            >
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <button
                  type="button"
                  className="min-h-11 flex-1 text-left"
                  onClick={() => onToggleCheck(index)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.cost}</span>
                    <Badge variant="secondary">{item.sel}</Badge>
                  </div>
                </button>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(index)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteIndex(index)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <EditSheet
          open={editIndex !== null}
          draft={draft}
          categories={categories}
          onChange={setDraft}
          onClose={() => setEditIndex(null)}
          onSave={saveEdit}
        />
        <DeleteDialog
          open={deleteIndex !== null}
          onCancel={() => setDeleteIndex(null)}
          onConfirm={() => {
            if (deleteIndex !== null) onDelete(deleteIndex)
            setDeleteIndex(null)
          }}
        />
      </>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Цена</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="w-36">Категория</TableHead>
              <TableHead className="w-28 text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map(({ item, index }) => (
              <TableRow
                key={`${item.name}-${index}`}
                className={cn(item.check && 'bg-primary/10')}
              >
                <TableCell>
                  <button type="button" className="w-full text-left" onClick={() => onToggleCheck(index)}>
                    {item.cost}
                  </button>
                </TableCell>
                <TableCell>
                  <button type="button" className="w-full text-left" onClick={() => onToggleCheck(index)}>
                    {item.name}
                  </button>
                </TableCell>
                <TableCell>{item.sel}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => openEdit(index)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setDeleteIndex(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditSheet
        open={editIndex !== null}
        draft={draft}
        categories={categories}
        onChange={setDraft}
        onClose={() => setEditIndex(null)}
        onSave={saveEdit}
      />
      <DeleteDialog
        open={deleteIndex !== null}
        onCancel={() => setDeleteIndex(null)}
        onConfirm={() => {
          if (deleteIndex !== null) onDelete(deleteIndex)
          setDeleteIndex(null)
        }}
      />
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
            className="h-11"
          />
          <Input
            value={draft.name ?? ''}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
            placeholder="Название"
            className="h-11"
          />
          <Select
            value={draft.sel ?? ''}
            onValueChange={(value) => onChange({ ...draft, sel: value })}
          >
            <SelectTrigger className="h-11 w-full">
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
