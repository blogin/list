import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Category } from '@/domain/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminCategoriesQuery, useSaveCategoriesMutation } from '@/features/admin/hooks'

export function CategoriesAdminPanel() {
  const categoriesQuery = useAdminCategoriesQuery()
  const saveMutation = useSaveCategoriesMutation()
  const [draft, setDraft] = useState<Category[]>([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (categoriesQuery.data) {
      setDraft(categoriesQuery.data.map((category) => ({ ...category })))
    }
  }, [categoriesQuery.data])

  function updateCategory(index: number, patch: Partial<Category>) {
    setDraft((current) =>
      current.map((category, i) => (i === index ? { ...category, ...patch } : category)),
    )
  }

  function removeCategory(index: number) {
    setDraft((current) => current.filter((_, i) => i !== index))
  }

  function addCategory() {
    const name = newName.trim()
    if (!name) {
      toast.error('Введите название категории')
      return
    }
    if (draft.some((category) => category.name === name)) {
      toast.error('Такая категория уже есть')
      return
    }

    setDraft((current) => [...current, { name, checked: true, total: 0 }])
    setNewName('')
  }

  async function save() {
    const names = draft.map((category) => category.name.trim())
    if (names.some((name) => !name)) {
      toast.error('Название категории не может быть пустым')
      return
    }
    if (new Set(names).size !== names.length) {
      toast.error('Названия категорий должны быть уникальными')
      return
    }

    try {
      await saveMutation.mutateAsync(
        draft.map((category) => ({
          ...category,
          name: category.name.trim(),
        })),
      )
      toast.success('Категории сохранены')
    } catch {
      toast.error('Не удалось сохранить категории')
    }
  }

  if (categoriesQuery.isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Категории</CardTitle>
        <CardDescription>
          Узел <code className="text-xs">db_opt</code> — названия и видимость в приложении.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {draft.map((category, index) => (
            <div
              key={`${category.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
            >
              <Checkbox
                checked={category.checked}
                onCheckedChange={(checked) =>
                  updateCategory(index, { checked: checked === true })
                }
                aria-label={`Показывать категорию ${category.name}`}
              />
              <Input
                value={category.name}
                onChange={(event) => updateCategory(index, { name: event.target.value })}
                className="h-10"
              />
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => removeCategory(index)}
                aria-label={`Удалить категорию ${category.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Новая категория"
            className="h-10"
            onKeyDown={(event) => {
              if (event.key === 'Enter') addCategory()
            }}
          />
          <Button type="button" variant="outline" className="h-10 shrink-0" onClick={addCategory}>
            <Plus className="size-4" />
            Добавить
          </Button>
        </div>

        <Button
          type="button"
          className="h-10"
          disabled={saveMutation.isPending}
          onClick={() => void save()}
        >
          {saveMutation.isPending ? 'Сохранение…' : 'Сохранить категории'}
        </Button>
      </CardContent>
    </Card>
  )
}
