import { getCategory } from '../data/categories'
import type { Project } from '../data/types'
import { asset, h } from '../lib/dom'
import { hrefFor } from '../lib/router'
import { launchButton, projectIcon, projectStyle, statusBadge } from './primitives'

export function featuredCard(project: Project): HTMLElement {
  const category = getCategory(project.category)
  const art = h('div', { class: 'featured__art' })
  if (project.art.heroImage) {
    art.appendChild(
      h('img', { class: 'featured__hero', src: asset(project.art.heroImage), alt: `${project.name} artwork`, decoding: 'async' }),
    )
  } else {
    art.appendChild(projectIcon(project, 200))
  }

  const body = h(
    'div',
    { class: 'featured__body' },
    h(
      'div',
      { class: 'featured__eyebrow' },
      h('span', { class: 'badge' }, 'Featured'),
      h('span', { class: 'badge' }, category.singular),
      statusBadge(project.status),
    ),
    h('h2', { class: 'featured__name' }, project.name),
    h('p', { class: 'featured__desc' }, project.tagline),
    h(
      'div',
      { class: 'featured__actions' },
      launchButton(project, { size: 'lg', labelWithName: true }),
      h('a', { class: 'btn btn--ghost', href: hrefFor({ kind: 'project', slug: project.slug }) }, 'Details'),
    ),
  )

  return h('article', { class: 'featured', style: projectStyle(project), 'data-slug': project.slug }, art, body)
}
