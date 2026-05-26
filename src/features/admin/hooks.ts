import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category, SalaryMonth } from '@/domain/types'
import {
  fetchCategories,
  fetchSalaryRows,
  saveCategories,
  saveSalaryRows,
} from '@/lib/firebase/database'
import { queryKeys } from '@/features/list/hooks'

export const adminQueryKeys = {
  salaryAll: ['admin', 'salary-all'] as const,
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
