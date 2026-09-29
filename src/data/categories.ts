import type { Category, CategoryId } from './types'

/**
 * Category registry. Order here is the order shown in navigation.
 * To add a category: add its id to `CategoryId` in `types.ts` and an entry here.
 */
export const CATEGORIES: readonly Category[] = [
  { id: 'games', label: 'Games', singular: 'Game', action: 'Play' },
  { id: 'outdoors', label: 'Outdoors', singular: 'Outdoors', action: 'Open' },
  { id: 'home', label: 'Home', singular: 'Home', action: 'Open' },
  { id: 'commercial', label: 'Commercial', singular: 'Commercial', action: 'Open' },
] as const

const byId = new Map<CategoryId, Category>(CATEGORIES.map((c) => [c.id, c]))

export function getCategory(id: CategoryId): Category {
  const category = byId.get(id)
  if (!category) throw new Error(`Unknown category: ${id}`)
  return category
}

export function isCategoryId(value: string): value is CategoryId {
  return byId.has(value as CategoryId)
}
