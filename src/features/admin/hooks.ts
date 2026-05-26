import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category, ListItem, SalaryMonth } from '@/domain/types'
import {
  deleteList,
  fetchCategories,
  fetchList,
  fetchListPeriodKeys,
  fetchSalaryRows,
  saveCategories,
  saveList,
  saveSalaryRows,
} from '@/lib/firebase/database'
import { queryKeys } from '@/features/list/hooks'

export const adminQueryKeys = {
  listPeriods: ['admin', 'list-periods'] as const,
  salaryAll: ['admin', 'salary-all'] as const,
  listPreview: (periodKey: string) => ['admin', 'list-preview', periodKey] as const,
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  })
}

export function useAdminSalaryQuery() {
  return useQuery({
    queryKey: adminQueryKeys.salaryAll,
    queryFn: fetchSalaryRows,
  })
}

export function useListPeriodKeysQuery() {
  return useQuery({
    queryKey: adminQueryKeys.listPeriods,
    queryFn: fetchListPeriodKeys,
  })
}

export function useAdminListPreviewQuery(periodKey: string | null) {
  return useQuery({
    queryKey: adminQueryKeys.listPreview(periodKey ?? ''),
    enabled: Boolean(periodKey),
    queryFn: async () => {
      if (!periodKey) return null
      return fetchList(periodKey)
    },
  })
}

export function useSaveCategoriesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categories: Category[]) => saveCategories(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useSaveSalaryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rows: SalaryMonth[]) => saveSalaryRows(rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.salaryAll })
      queryClient.invalidateQueries({ queryKey: queryKeys.salary })
    },
  })
}

export function useSaveListMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ periodKey, items }: { periodKey: string; items: ListItem[] }) =>
      saveList(periodKey, items),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.listPeriods })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.listPreview(variables.periodKey) })
      queryClient.invalidateQueries({ queryKey: queryKeys.list(variables.periodKey) })
    },
  })
}

export function useDeleteListMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (periodKey: string) => deleteList(periodKey),
    onSuccess: (_data, periodKey) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.listPeriods })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.listPreview(periodKey) })
      queryClient.invalidateQueries({ queryKey: queryKeys.list(periodKey) })
    },
  })
}
