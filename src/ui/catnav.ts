import { CATEGORIES } from '../data/categories'
import type { Filter } from '../lib/catalog'
import { h } from '../lib/dom'
import { hrefFor } from '../lib/router'

/**
 * Thumb-friendly category filter. Chips are real links, so the filter is
 * shareable and works without JavaScript-driven state.
 */
export function categoryNav(active: Filter, counts: Record<Filter, number>): HTMLElement {
  const entries: { id: Filter; label: string }[] = [{ id: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]
  const list = h(
    'div',
    { class: 'catnav__scroll', role: 'list' },
    ...entries.map((entry) =>
      h(
        'a',
        {
          class: 'chip',
          role: 'listitem',
          href: hrefFor({ kind: 'home', filter: entry.id }),
          'aria-current': active === entry.id ? 'true' : null,
          'data-filter': entry.id,
        },
        entry.label,
        h('span', { class: 'chip__count' }, String(counts[entry.id])),
      ),
    ),
  )
  return h('nav', { class: 'catnav', 'aria-label': 'Categories' }, list)
}
