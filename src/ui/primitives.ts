import { getCategory } from '../data/categories'
import type { Project, ProjectStatus } from '../data/types'
import { STATUS_LABEL, isLaunchable, isSelf } from '../lib/catalog'
import { asset, h, svg } from '../lib/dom'
import { GLYPH_ARROW_UP_RIGHT, GLYPH_CLOCK, GLYPH_PLAY } from './glyphs'

/** Inline CSS custom properties carrying a project's own colors. */
export function projectStyle(project: Project, extra = ''): string {
  const ink = project.art.ink ? `;--project-ink:${project.art.ink}` : ''
  return `--project-accent:${project.art.accent}${ink}${extra}`
}

/** Square project icon with the project's accent as its backdrop. */
export function projectIcon(project: Project, sizeHint: number): HTMLElement {
  const img = h('img', {
    src: asset(project.art.icon),
    alt: '',
    width: sizeHint,
    height: sizeHint,
    loading: 'lazy',
    decoding: 'async',
  })
  return h('div', { class: 'picon', 'aria-hidden': 'true' }, img)
}

export function statusBadge(status: ProjectStatus): HTMLElement | null {
  if (status === 'live') return null
  return h('span', { class: `badge badge--status badge--${status}` }, STATUS_LABEL[status])
}

export function categoryBadge(project: Project): HTMLElement {
  return h('span', { class: 'badge' }, getCategory(project.category).singular)
}

interface LaunchOptions {
  size?: 'sm' | 'md' | 'lg'
  /** Adds "aria-describedby"-style context for screen readers. */
  labelWithName?: boolean
}

/**
 * The primary action for a project. A real link when the project is live;
 * an inert, clearly-labelled status pill otherwise. Never a fake URL.
 */
export function launchButton(project: Project, options: LaunchOptions = {}): HTMLElement {
  const category = getCategory(project.category)
  const sizeClass = options.size === 'sm' ? ' btn--sm' : options.size === 'lg' ? ' btn--lg' : ''
  if (isSelf(project)) {
    return h('span', { class: `btn btn--here${sizeClass}`, 'aria-label': `${project.name}: you are here` }, 'You’re here')
  }
  if (isLaunchable(project)) {
    const verb = category.action
    const label = options.labelWithName ? `${verb} ${project.name}` : verb
    const glyph = project.category === 'games' ? GLYPH_PLAY : GLYPH_ARROW_UP_RIGHT
    return h(
      'a',
      {
        class: `btn btn--primary${sizeClass}`,
        href: project.url,
        target: '_blank',
        rel: 'noopener',
        'aria-label': `${verb} ${project.name} (opens in a new tab)`,
        'data-launch': project.slug,
      },
      label,
      svg(glyph, 'btn__icon'),
    )
  }
  return h(
    'span',
    { class: `btn btn--disabled${sizeClass}`, role: 'status', 'aria-label': `${project.name}: ${STATUS_LABEL[project.status]}` },
    svg(GLYPH_CLOCK, 'btn__icon'),
    STATUS_LABEL[project.status],
  )
}
