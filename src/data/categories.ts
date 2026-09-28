import type { Category, CategoryId } from './types'

/**
 * Category registry. Order here is the order shown in navigation.
 * To add a category: add its id to `CategoryId` in `types.ts` and an entry here.
 */
export const CATEGORIES: readonly Category[] = [
  { id: 'games', label: 'Games', singular: 'Game', action: 'Play' },
  { id: 'apps', label: 'Apps', singular: 'App', action: 'Open' },
  { id: 'tools', label: 'Tools', singular: 'Tool', action: 'Open' },
  { id: 'experiments', label: 'Experiments', singular: 'Experiment', action: 'Try' },
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
