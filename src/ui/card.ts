import { getCategory } from '../data/categories'
import type { Project } from '../data/types'
import { h } from '../lib/dom'
import { hrefFor } from '../lib/router'
import { launchButton, projectIcon, statusBadge } from './primitives'

/**
 * Project card. The whole card links to the detail view via a stretched
 * link; the launch button sits above it so the primary action stays obvious.
 */
export function projectCard(project: Project, index = 0): HTMLElement {
  const category = getCategory(project.category)
  const detailHref = hrefFor({ kind: 'project', slug: project.slug })
  const titleId = `card-title-${project.slug}`
  const muted = project.status !== 'live'

  return h(
    'article',
    {
      class: `card${muted ? ' card--muted' : ''}`,
      style: `--project-accent:${project.art.accent};--i:${index}`,
      'data-slug': project.slug,
      'aria-labelledby': titleId,
    },
    h('a', { class: 'card__link', href: detailHref, 'aria-label': `${project.name} details` }),
    h('div', { class: 'card__top' }, projectIcon(project, 64), h('div', { class: 'card__badges' }, statusBadge(project.status))),
    h(
      'div',
      { class: 'card__body' },
      h('h3', { class: 'card__name', id: titleId }, project.name),
      h('p', { class: 'card__desc' }, project.tagline),
    ),
    h(
      'div',
      { class: 'card__foot' },
      h('span', { class: 'card__cat' }, category.singular),
      launchButton(project, { size: 'sm' }),
    ),
  )
}
