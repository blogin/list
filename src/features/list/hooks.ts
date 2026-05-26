import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  calcCategoryTotals,
  findSalaryForMonth,
  getCurrentSalaryMonthName,
  getFallbackListKey,
  getListPeriodKey,
} from '@/domain'
import type { Category, ListItem } from '@/domain/types'
import {
  fetchCategories,
  fetchList,
  fetchSalaryRows,
  saveCategories,
  saveList,
} from '@/lib/firebase/database'

export const queryKeys = {
  list: (periodKey: string) => ['list', periodKey] as const,
  categories: ['categories'] as const,
  salary: ['salary'] as const,
}

export function useListQuery(date = new Date(), enabled = true) {
  const periodKey = getListPeriodKey(date)
  const fallbackKey = getFallbackListKey(date)

  return useQuery({
    queryKey: queryKeys.list(periodKey),
    enabled,
    queryFn: async () => {
      const current = await fetchList(periodKey)
      if (current) {
        return { items: current, periodKey, usedFallback: false as const }
      }

      const fallback = await fetchList(fallbackKey)
      if (fallback) {
        return {
          items: fallback,
          periodKey,
          usedFallback: true as const,
          fallbackKey,
        }
      }

      return { items: [] as ListItem[], periodKey, usedFallback: false as const }
    },
  })
}

export function useCategoriesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories,
    enabled,
    queryFn: fetchCategories,
  })
}

export function useSalaryQuery(date = new Date(), enabled = true) {
  const monthName = getCurrentSalaryMonthName(date)

  return useQuery({
    queryKey: queryKeys.salary,
    enabled,
    queryFn: async () => {
      const rows = await fetchSalaryRows()
      return findSalaryForMonth(rows, monthName)
    },
  })
}

export function useSaveShoppingDataMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      periodKey,
      items,
      categories,
    }: {
      periodKey: string
      items: ListItem[]
      categories: Category[]
    }) => {
      const categoriesWithTotals = calcCategoryTotals(categories, items)
      await saveList(periodKey, items)
      await saveCategories(categoriesWithTotals)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(variables.periodKey) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}
