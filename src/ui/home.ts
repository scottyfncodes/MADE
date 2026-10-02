import { CATEGORIES, getCategory } from '../data/categories'
import { countByCategory, filterProjects, getFeatured, type Filter } from '../lib/catalog'
import { h, svg } from '../lib/dom'
import { categoryNav } from './catnav'
import { projectCard } from './card'
import { featuredCard } from './featured'
import { GLYPH_PLUS } from './glyphs'
import { IDEA_MAILTO, STUDIO } from './header'

const FAMILY_ID = 'family'

export function homeView(filter: Filter): HTMLElement {
  const featured = getFeatured()
  const projects = filterProjects(filter)
  const counts = countByCategory()
  const showFeatured = filter === 'all' && featured

  const gridTitle = filter === 'all' ? 'The family' : getCategory(filter).label
  const cards = projects.map((p, i) => wrapListItem(projectCard(p, i)))
  if (filter === 'all') cards.push(nextCard())
  const grid =
    projects.length > 0
      ? h('div', { class: 'grid', role: 'list' }, ...cards)
      : h('div', { class: 'empty' }, `Nothing in ${gridTitle.toLowerCase()} yet.`)

  const family = h(
    'section',
    { class: 'container section', id: FAMILY_ID, 'aria-labelledby': 'grid-title' },
    h(
      'div',
      { class: 'section__head' },
      h('h2', { class: 'section__title', id: 'grid-title' }, gridTitle),
      h(
        'span',
        { class: 'section__meta' },
        filter === 'all' ? 'Same family, different personalities.' : `${projects.length} ${projects.length === 1 ? 'app' : 'apps'}`,
      ),
    ),
    grid,
  )

  return h(
    'div',
    { class: 'view' },
    hero(),
    categoryNav(filter, counts),
    showFeatured
      ? h(
          'section',
          { class: 'container section', 'aria-labelledby': 'featured-title' },
          h('div', { class: 'section__head' }, h('h2', { class: 'section__title', id: 'featured-title' }, 'Featured')),
          featuredCard(featured),
        )
      : null,
    family,
    howItGoes(),
    hello(),
  )
}

function hero(): HTMLElement {
  // A button, not an in-page anchor: the hash belongs to the router.
  const seeMade = h('button', { class: 'btn btn--ghost btn--xl', type: 'button' }, 'See what’s made')
  seeMade.addEventListener('click', () => document.getElementById(FAMILY_ID)?.scrollIntoView({ behavior: 'smooth' }))
  return h(
    'section',
    { class: 'container hero' },
    h('h1', { class: 'hero__title' }, 'Have an idea for an app? ', h('span', { class: 'hero__answer' }, 'Cool. Let’s make it.')),
    h(
      'p',
      { class: 'hero__sub' },
      `${STUDIO.name} is a tiny studio making small, useful apps. They open fast, do one thing well, and are made on purpose.`,
    ),
    h('div', { class: 'hero__actions' }, h('a', { class: 'btn btn--primary btn--xl', href: IDEA_MAILTO }, 'Tell me the idea'), seeMade),
  )
}

/** The empty seat at the end of the family: an app, waiting for an idea. */
function nextCard(): HTMLElement {
  return h(
    'div',
    { class: 'card card--next', role: 'listitem' },
    h('div', { class: 'card__next-icon', 'aria-hidden': 'true' }, svg(GLYPH_PLUS)),
    h(
      'div',
      { class: 'card__body' },
      h('h3', { class: 'card__name' }, 'Yours, maybe'),
      h(
        'p',
        { class: 'card__desc' },
        'This spot is saved for the next idea. A tool for one job, a five-minute game, or the one thing your business keeps doing by hand.',
      ),
    ),
  )
}

const STEPS = [
  ['You have an idea.', 'A sentence is plenty. “I wish there was an app that…” is a great start.'],
  ['We make it small.', 'We find the one thing it has to do really well, then build that first.'],
  ['You have an app.', 'It opens from a link and goes on your Home Screen with its own icon. You don’t need an app store.'],
] as const

function howItGoes(): HTMLElement {
  return h(
    'section',
    { class: 'container section', 'aria-labelledby': 'how-title' },
    h('div', { class: 'section__head' }, h('h2', { class: 'section__title', id: 'how-title' }, 'How it goes')),
    h(
      'ol',
      { class: 'steps', role: 'list' },
      ...STEPS.map(([title, body], i) =>
        h(
          'li',
          { class: 'step' },
          h('span', { class: 'step__n', 'aria-hidden': 'true' }, String(i + 1)),
          h('h3', { class: 'step__title' }, title),
          h('p', null, body),
        ),
      ),
    ),
  )
}

function hello(): HTMLElement {
  return h(
    'section',
    { class: 'container section hello', 'aria-labelledby': 'hello-title' },
    h('h2', { class: 'hello__title', id: 'hello-title' }, 'Got one?'),
    h('p', { class: 'hello__sub' }, 'Send the idea, however rough. You’ll hear back from a person.'),
    h('a', { class: 'btn btn--primary btn--xl', href: IDEA_MAILTO }, STUDIO.email),
  )
}

function wrapListItem(card: HTMLElement): HTMLElement {
  card.setAttribute('role', 'listitem')
  return card
}

/** Exposed so tests can assert nav order matches the registry. */
export const NAV_ORDER: readonly string[] = ['all', ...CATEGORIES.map((c) => c.id)]
