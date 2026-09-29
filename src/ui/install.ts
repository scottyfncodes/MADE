import { getCategory } from '../data/categories'
import type { Project } from '../data/types'
import { h } from '../lib/dom'

/**
 * How to put a project on the Home Screen so it opens full-screen with its own
 * icon. Only shown for projects with a live link: the steps happen on the
 * project's own page, not on MADE.
 */
export function installGuide(project: Project): HTMLElement {
  const action = getCategory(project.category).action
  const steps = (items: (string | Node)[][]) => h('ol', { class: 'install__steps' }, ...items.map((parts) => h('li', null, ...parts)))
  const b = (text: string) => h('strong', null, text)

  return h(
    'details',
    { class: 'install' },
    h('summary', { class: 'install__summary' }, `Add ${project.name} to your Home Screen`),
    h(
      'div',
      { class: 'install__body' },
      h(
        'p',
        { class: 'install__lead' },
        `From your Home Screen, ${project.name} opens full-screen with its own icon, like an app. Tap `,
        b(action),
        ` to open it, then:`,
      ),
      h(
        'div',
        { class: 'install__platform' },
        h('h3', { class: 'install__os' }, 'iPhone and iPad', h('span', { class: 'install__browser' }, 'Safari')),
        steps([
          ['Tap ', b('Share'), '. On iOS 26, tap ', b('•••'), ' first, then ', b('Share'), '.'],
          ['Scroll down and tap ', b('Add to Home Screen'), '.'],
          ['Leave ', b('Open as Web App'), ' on, then tap ', b('Add'), '.'],
        ]),
      ),
      h(
        'div',
        { class: 'install__platform' },
        h('h3', { class: 'install__os' }, 'Android', h('span', { class: 'install__browser' }, 'Chrome')),
        steps([
          ['Tap ', b('⋮'), ' in the top corner.'],
          ['Tap ', b('Add to Home screen'), ' or ', b('Install app'), '.'],
          ['Tap ', b('Install'), '.'],
        ]),
      ),
    ),
  )
}
