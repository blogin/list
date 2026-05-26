import type { ListItem } from './types'
import { parseCost } from './calculations'

export function sortByCostDesc(items: ListItem[]): ListItem[] {
  return [...items].sort((a, b) => parseCost(b.cost) - parseCost(a.cost))
}

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
