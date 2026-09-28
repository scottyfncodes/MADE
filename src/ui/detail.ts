import { getCategory } from '../data/categories'
import type { Project } from '../data/types'
import { STATUS_LABEL, isLaunchable } from '../lib/catalog'
import { asset, h, svg } from '../lib/dom'
import { hrefFor } from '../lib/router'
import { GLYPH_CHEVRON_LEFT, GLYPH_GITHUB } from './glyphs'
import { launchButton, projectIcon, projectStyle, statusBadge } from './primitives'

export function projectDetail(project: Project, backTo: string): HTMLElement {
  const category = getCategory(project.category)

  const hero = h('div', { class: 'detail__hero' })
  if (project.art.heroImage) {
    hero.appendChild(h('img', { class: 'detail__heroimg', src: asset(project.art.heroImage), alt: `${project.name} artwork`, decoding: 'async' }))
  } else {
    hero.appendChild(projectIcon(project, 220))
  }

  const actions = h('div', { class: 'detail__actions' }, launchButton(project, { size: 'lg', labelWithName: true }))
  if (project.repo) {
    actions.appendChild(
      h('a', { class: 'btn btn--ghost', href: project.repo, target: '_blank', rel: 'noopener' }, svg(GLYPH_GITHUB, 'btn__icon'), 'Source'),
    )
  }

  const body = h(
    'div',
    { class: 'detail__body' },
    h(
      'div',
      { class: 'detail__head' },
      h('div', { class: 'detail__eyebrow' }, h('span', { class: 'badge' }, category.singular), statusBadge(project.status)),
      h('h1', { class: 'detail__name' }, project.name),
      h('p', { class: 'detail__tagline' }, project.tagline),
    ),
    h('p', { class: 'detail__desc' }, project.description),
    actions,
    project.tags.length > 0
      ? h('ul', { class: 'tags', 'aria-label': 'Tags' }, ...project.tags.map((t) => h('li', { class: 'tag' }, t)))
      : null,
    project.art.screenshots && project.art.screenshots.length > 0
      ? h(
          'div',
          { class: 'shots', 'aria-label': `${project.name} screenshots` },
          ...project.art.screenshots.map((s, i) =>
            h('img', { src: asset(s), alt: `${project.name} screenshot ${i + 1}`, loading: 'lazy', decoding: 'async' }),
          ),
        )
      : null,
    !isLaunchable(project)
      ? h('p', { class: 'detail__note' }, `${STATUS_LABEL[project.status]}. There is no public link for ${project.name} yet, so nothing here pretends to be one.`)
      : null,
    h('div', { class: 'detail__meta' }, h('span', null, `Added ${formatDate(project.dateAdded)}`)),
  )

  const view = h(
    'section',
    { class: 'container detail', style: projectStyle(project) },
    h('a', { class: 'detail__back', href: backTo }, svg(GLYPH_CHEVRON_LEFT, 'btn__icon'), 'All things'),
    hero,
    body,
  )

  const wrapper = h('div', { class: 'view' }, view)
  if (isLaunchable(project)) {
    wrapper.appendChild(
      h('div', { class: 'launchbar', style: projectStyle(project) }, launchButton(project, { size: 'lg', labelWithName: true })),
    )
  }
  return wrapper
}

export function notFound(): HTMLElement {
  return h(
    'div',
    { class: 'view' },
    h(
      'section',
      { class: 'container notfound' },
      h('h1', null, 'Nothing here.'),
      h('p', null, 'That project does not exist, or it moved.'),
      h('a', { class: 'btn btn--primary', href: hrefFor({ kind: 'home', filter: 'all' }) }, 'Back to everything'),
    ),
  )
}

function formatDate(iso: string): string {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
