import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  applyCategoryVisibility,
  calcCategoryTotals,
  calcRestOfMoney,
  createListItem,
  getListPeriodKey,
  isValidCostInput,
  removeItemAt,
  resetAllChecks,
  sortListItems,
  toggleItemChecked,
} from '@/domain'
import type { Category, ListItem } from '@/domain/types'
import {
  useCategoriesQuery,
  useListQuery,
  useSalaryQuery,
  useSaveShoppingDataMutation,
} from '@/features/list/hooks'

export function useShoppingApp() {
  const now = useMemo(() => new Date(), [])
  const periodKey = getListPeriodKey(now)
  const fallbackNotified = useRef(false)

  const listQuery = useListQuery(now)
  const categoriesQuery = useCategoriesQuery()
  const salaryQuery = useSalaryQuery(now)
  const saveMutation = useSaveShoppingDataMutation()

  const [items, setItems] = useState<ListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!listQuery.data || !categoriesQuery.data) return

    const nextCategories = calcCategoryTotals(categoriesQuery.data, listQuery.data.items)
    setCategories(nextCategories)
    setItems(sortListItems(applyCategoryVisibility(nextCategories, listQuery.data.items), nextCategories))

    if (listQuery.data.usedFallback && !fallbackNotified.current) {
      fallbackNotified.current = true
      toast.message('Список не найден, загружен предыдущий период')
    }
  }, [listQuery.data, categoriesQuery.data])

  const budget = useMemo(
    () => calcRestOfMoney(salaryQuery.data, items, now),
    [salaryQuery.data, items, now],
  )

  const categoriesWithTotals = useMemo(
    () => calcCategoryTotals(categories, items),
    [categories, items],
  )

  function refreshTotals(nextItems: ListItem[], nextCategories = categories) {
    setItems(sortListItems(nextItems, nextCategories))
    setCategories(calcCategoryTotals(nextCategories, nextItems))
  }

  function addItem(input: { cost: string; name: string; sel: string }) {
    if (!input.cost || !input.name || !input.sel) {
      toast.error('Необходимо заполнить все поля')
      return false
    }
    if (!isValidCostInput(input.cost)) {
      toast.error('Стоимость должна быть в цифрах')
      return false
    }

    const nextItems = [createListItem(input), ...items]
    refreshTotals(applyCategoryVisibility(categories, nextItems))
    return true
  }

  function toggleCheck(index: number) {
    refreshTotals(toggleItemChecked(items, index))
  }

  function updateItem(index: number, patch: Partial<ListItem>) {
    const nextItems = items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    refreshTotals(nextItems)
  }

  function deleteItem(index: number) {
    refreshTotals(removeItemAt(items, index))
  }

  function toggleCategory(name: string, checked: boolean) {
    const nextCategories = categories.map((category) =>
      category.name === name ? { ...category, checked } : category,
    )
    refreshTotals(applyCategoryVisibility(nextCategories, items), nextCategories)
  }

  function resetChecks() {
    refreshTotals(resetAllChecks(items))
  }

  async function saveAll() {
    try {
      await saveMutation.mutateAsync({
        periodKey,
        items,
        categories: categoriesWithTotals,
      })
      toast.success('Данные успешно сохранены')
    } catch {
      toast.error('Проблемы при сохранении данных')
    }
  }

  const loading = listQuery.isLoading || categoriesQuery.isLoading || salaryQuery.isLoading

  return {
    loading,
    items,
    categories: categoriesWithTotals,
    salary: salaryQuery.data,
    budget,
    periodKey,
    saving: saveMutation.isPending,
    addItem,
    toggleCheck,
    updateItem,
    deleteItem,
    toggleCategory,
    resetChecks,
    saveAll,
  }
}
