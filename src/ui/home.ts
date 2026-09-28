import { CATEGORIES, getCategory } from '../data/categories'
import { countByCategory, filterProjects, getFeatured, type Filter } from '../lib/catalog'
import { h } from '../lib/dom'
import { categoryNav } from './catnav'
import { projectCard } from './card'
import { featuredCard } from './featured'

export function homeView(filter: Filter): HTMLElement {
  const featured = getFeatured()
  const projects = filterProjects(filter)
  const counts = countByCategory()
  const showFeatured = filter === 'all' && featured

  const intro = h(
    'section',
    { class: 'container intro' },
    h('h1', { class: 'intro__title' }, 'MADE', h('span', { class: 'wordmark__dot', 'aria-hidden': 'true' })),
    h('p', { class: 'intro__sub' }, 'Things I’ve made. Tap one to open it.'),
  )

  const gridTitle = filter === 'all' ? 'Everything' : getCategory(filter).label
  const grid =
    projects.length > 0
      ? h('div', { class: 'grid', role: 'list' }, ...projects.map((p, i) => wrapListItem(projectCard(p, i))))
      : h('div', { class: 'empty' }, `Nothing in ${gridTitle.toLowerCase()} yet.`)

  const everything = h(
    'section',
    { class: 'container section', 'aria-labelledby': 'grid-title' },
    h(
      'div',
      { class: 'section__head' },
      h('h2', { class: 'section__title', id: 'grid-title' }, gridTitle),
      h('span', { class: 'section__meta' }, `${projects.length} ${projects.length === 1 ? 'thing' : 'things'}`),
    ),
    grid,
  )

  return h(
    'div',
    { class: 'view' },
    intro,
    categoryNav(filter, counts),
    showFeatured
      ? h(
          'section',
          { class: 'container section', 'aria-labelledby': 'featured-title' },
          h('div', { class: 'section__head' }, h('h2', { class: 'section__title', id: 'featured-title' }, 'Featured')),
          featuredCard(featured),
        )
      : null,
    everything,
  )
}

function wrapListItem(card: HTMLElement): HTMLElement {
  card.setAttribute('role', 'listitem')
  return card
}

/** Exposed so tests can assert nav order matches the registry. */
export const NAV_ORDER: readonly string[] = ['all', ...CATEGORIES.map((c) => c.id)]
