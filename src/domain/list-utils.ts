import type { Category, ListItem } from './types'
import { parseCost } from './calculations'

export function sortByCostDesc(items: ListItem[]): ListItem[] {
  return [...items].sort((a, b) => parseCost(b.cost) - parseCost(a.cost))
}

/** Unchecked: category order, then cost desc. Checked: at the bottom, stable order. */
export function sortListItems(items: ListItem[], categories: Category[]): ListItem[] {
  const categoryOrder = new Map(categories.map((category, index) => [category.name, index]))

  function compareUnchecked(a: ListItem, b: ListItem): number {
    const categoryA = categoryOrder.get(a.sel) ?? Number.MAX_SAFE_INTEGER
    const categoryB = categoryOrder.get(b.sel) ?? Number.MAX_SAFE_INTEGER
    if (categoryA !== categoryB) return categoryA - categoryB
    return parseCost(b.cost) - parseCost(a.cost)
  }

  const unchecked = items.filter((item) => !item.check).sort(compareUnchecked)
  const checked = items.filter((item) => item.check)

  return [...unchecked, ...checked]
}

/** @deprecated Use sortListItems */
export function sortByChecked(items: ListItem[]): ListItem[] {
  return [...items.filter((item) => !item.check), ...items.filter((item) => item.check)]
}

export function toggleItemChecked(items: ListItem[], index: number): ListItem[] {
  return items.map((item, i) =>
    i === index ? { ...item, check: !item.check } : item,
  )
}

export function removeItemAt(items: ListItem[], index: number): ListItem[] {
  return items.filter((_, i) => i !== index)
}

export function resetAllChecks(items: ListItem[]): ListItem[] {
  return items.map((item) => ({ ...item, check: false }))
}

export function createListItem(input: {
  cost: string
  name: string
  sel: string
}): ListItem {
  return {
    cost: input.cost,
    name: input.name,
    sel: input.sel,
    check: false,
    show: true,
  }
}
