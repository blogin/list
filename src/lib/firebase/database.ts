import { get, ref, remove, set } from 'firebase/database'
import type { Category, ListItem, SalaryMonth } from '@/domain/types'
import { getFirebaseDatabase } from '@/lib/firebase/client'
import { RTDB_PATHS } from '@/lib/firebase/paths'

export async function fetchList(periodKey: string): Promise<ListItem[] | null> {
  const snapshot = await get(ref(getFirebaseDatabase(), RTDB_PATHS.list(periodKey)))
  return snapshot.exists() ? (snapshot.val() as ListItem[]) : null
}

export async function saveList(periodKey: string, items: ListItem[]): Promise<void> {
  await set(ref(getFirebaseDatabase(), RTDB_PATHS.list(periodKey)), items)
}

export async function fetchCategories(): Promise<Category[]> {
  const snapshot = await get(ref(getFirebaseDatabase(), RTDB_PATHS.categories))
  if (!snapshot.exists()) return []
  return snapshot.val() as Category[]
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await set(ref(getFirebaseDatabase(), RTDB_PATHS.categories), categories)
}

export async function fetchSalaryRows(): Promise<SalaryMonth[]> {
  const snapshot = await get(ref(getFirebaseDatabase(), RTDB_PATHS.salary))
  if (!snapshot.exists()) return []
  return snapshot.val() as SalaryMonth[]
}

export async function saveSalaryRows(rows: SalaryMonth[]): Promise<void> {
  await set(ref(getFirebaseDatabase(), RTDB_PATHS.salary), rows)
}

export async function fetchListPeriodKeys(): Promise<string[]> {
  const snapshot = await get(ref(getFirebaseDatabase(), 'list'))
  if (!snapshot.exists()) return []
  return Object.keys(snapshot.val() as Record<string, unknown>).sort()
}

export async function deleteList(periodKey: string): Promise<void> {
  await remove(ref(getFirebaseDatabase(), RTDB_PATHS.list(periodKey)))
}
