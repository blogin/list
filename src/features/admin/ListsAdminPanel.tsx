import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { getListPeriodKey } from '@/domain/list-period'
import {
  useAdminListPreviewQuery,
  useDeleteListMutation,
  useListPeriodKeysQuery,
  useSaveListMutation,
} from '@/features/admin/hooks'

export function ListsAdminPanel() {
  const periodsQuery = useListPeriodKeysQuery()
  const saveListMutation = useSaveListMutation()
  const deleteListMutation = useDeleteListMutation()
  const currentPeriodKey = useMemo(() => getListPeriodKey(), [])

  const periodOptions = useMemo(() => {
    const keys = new Set(periodsQuery.data ?? [])
    keys.add(currentPeriodKey)
    return [...keys].sort()
  }, [periodsQuery.data, currentPeriodKey])

  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [customPeriod, setCustomPeriod] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)

  const activePeriod = customPeriod.trim() || selectedPeriod
  const listPreviewQuery = useAdminListPreviewQuery(activePeriod || null)

  useEffect(() => {
    if (!periodOptions.length) {
      setSelectedPeriod(currentPeriodKey)
      return
    }

    if (!selectedPeriod || !periodOptions.includes(selectedPeriod)) {
      const preferred = periodOptions.includes(currentPeriodKey)
        ? currentPeriodKey
        : periodOptions[periodOptions.length - 1]
      setSelectedPeriod(preferred ?? currentPeriodKey)
    }
  }, [periodOptions, selectedPeriod, currentPeriodKey])

  async function createEmptyList() {
    const periodKey = activePeriod.trim()
    if (!periodKey) {
      toast.error('Выберите или введите ключ периода')
      return
    }

    try {
      await saveListMutation.mutateAsync({ periodKey, items: [] })
      setCustomPeriod('')
      setSelectedPeriod(periodKey)
      toast.success(`Создан пустой список ${periodKey}`)
    } catch {
      toast.error('Не удалось создать список')
    }
  }

  async function confirmDelete() {
    const periodKey = activePeriod.trim()
    if (!periodKey) return

    try {
      await deleteListMutation.mutateAsync(periodKey)
      setDeleteOpen(false)
      setCustomPeriod('')
      toast.success(`Список ${periodKey} удалён`)
    } catch {
      toast.error('Не удалось удалить список')
    }
  }

  const itemCount = listPreviewQuery.data?.length ?? 0
  const listExists = listPreviewQuery.data !== null && listPreviewQuery.isSuccess

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Списки покупок</CardTitle>
          <CardDescription>
            Узел <code className="text-xs">list/&#123;periodKey&#125;</code>, например{' '}
            <code className="text-xs">10_may</code> или <code className="text-xs">25_may</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {periodsQuery.isLoading ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium">Существующие периоды</p>
                <Select
                  value={selectedPeriod}
                  onValueChange={(value) => {
                    setSelectedPeriod(value)
                    setCustomPeriod('')
                  }}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    {(periodOptions).map((periodKey) => (
                      <SelectItem key={periodKey} value={periodKey}>
                        {periodKey}
                        {periodKey === currentPeriodKey ? ' (текущий)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Или свой ключ</p>
                <Input
                  value={customPeriod}
                  onChange={(event) => setCustomPeriod(event.target.value)}
                  placeholder={`например ${currentPeriodKey}`}
                  className="h-10"
                />
              </div>
            </div>
          )}

          {activePeriod ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 px-3 py-3">
              <span className="text-sm font-medium">{activePeriod}</span>
              {listPreviewQuery.isLoading ? (
                <Badge variant="outline">Загрузка…</Badge>
              ) : listExists ? (
                <Badge variant="secondary">{itemCount} поз.</Badge>
              ) : (
                <Badge variant="outline">Нет в базе</Badge>
              )}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={!activePeriod || saveListMutation.isPending}
              onClick={() => void createEmptyList()}
            >
              Создать пустой список
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10"
              disabled={!activePeriod || !listExists || deleteListMutation.isPending}
              onClick={() => setDeleteOpen(true)}
            >
              Удалить период
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить список {activePeriod}?</AlertDialogTitle>
            <AlertDialogDescription>
              Будет удалён узел <code>list/{activePeriod}</code> со всеми позициями. Это действие
              нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11">Отмена</AlertDialogCancel>
            <AlertDialogAction className="h-11" onClick={() => void confirmDelete()}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
