// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { mount, titleFor, viewFor } from '../app'
import { PROJECTS } from '../data/projects'
import { CATEGORIES } from '../data/categories'
import { STATUS_LABEL } from '../lib/catalog'

function root(): HTMLElement {
  document.body.innerHTML = '<div id="app"></div>'
  window.location.hash = ''
  return document.getElementById('app') as HTMLElement
}

describe('home view', () => {
  beforeEach(root)

  it('renders the brand, the featured project and a card for every project', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    expect(view.querySelector('.intro__title')?.textContent).toContain('MADE')
    const flagged = PROJECTS.find((p) => p.featured)
    expect(view.querySelector('.featured')?.getAttribute('data-slug')).toBe(flagged?.slug)
    expect(view.querySelectorAll('.card')).toHaveLength(PROJECTS.length)
  })

  it('renders All plus one chip per non-empty category, in registry order', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    const chips = [...view.querySelectorAll('.chip')].map((c) => c.getAttribute('data-filter'))
    const used = CATEGORIES.filter((c) => PROJECTS.some((p) => p.category === c.id)).map((c) => c.id)
    expect(chips).toEqual(['all', ...used])
    expect(view.querySelector('.chip[aria-current="true"]')?.getAttribute('data-filter')).toBe('all')
  })

  it('hides an empty category from the nav unless it is the active filter', () => {
    const empty = CATEGORIES.find((c) => !PROJECTS.some((p) => p.category === c.id))
    if (!empty) return // every category is in use; nothing to hide
    const home = viewFor({ kind: 'home', filter: 'all' })
    expect(home.querySelector(`.chip[data-filter="${empty.id}"]`)).toBeNull()
    const direct = viewFor({ kind: 'home', filter: empty.id })
    expect(direct.querySelector(`.chip[data-filter="${empty.id}"]`)?.getAttribute('aria-current')).toBe('true')
    expect(direct.querySelector('.empty')).not.toBeNull()
  })

  it('filters cards by category and hides the featured block', () => {
    const view = viewFor({ kind: 'home', filter: 'games' })
    const expected = PROJECTS.filter((p) => p.category === 'games').length
    expect(view.querySelectorAll('.card')).toHaveLength(expected)
    expect(view.querySelector('.featured')).toBeNull()
    expect(view.querySelector('.chip[aria-current="true"]')?.getAttribute('data-filter')).toBe('games')
  })

  it('gives live projects a real launch link and unavailable ones an inert status', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    for (const p of PROJECTS) {
      const card = view.querySelector(`.card[data-slug="${p.slug}"]`) as HTMLElement
      const launch = card.querySelector('a[data-launch]') as HTMLAnchorElement | null
      if (p.status === 'live') {
        expect(launch, p.name).not.toBeNull()
        expect(launch?.getAttribute('href')).toBe(p.url)
        expect(launch?.getAttribute('target')).toBe('_blank')
        expect(launch?.getAttribute('rel')).toContain('noopener')
      } else {
        expect(launch, p.name).toBeNull()
        expect(card.querySelector('.btn--disabled')?.textContent).toContain(STATUS_LABEL[p.status])
      }
    }
  })

  it('passes a project text color through to its card when set', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    for (const p of PROJECTS) {
      const style = view.querySelector(`.card[data-slug="${p.slug}"]`)?.getAttribute('style') ?? ''
      expect(style).toContain(`--project-accent:${p.art.accent}`)
      if (p.art.ink) expect(style).toContain(`--project-ink:${p.art.ink}`)
      else expect(style).not.toContain('--project-ink')
    }
  })

  it('links every card to its detail route', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    for (const p of PROJECTS) {
      const link = view.querySelector(`.card[data-slug="${p.slug}"] .card__link`)
      expect(link?.getAttribute('href')).toBe(`#/p/${p.slug}`)
    }
  })

  it('gives every image alt text and lazy loading', () => {
    const view = viewFor({ kind: 'home', filter: 'all' })
    for (const img of view.querySelectorAll('img')) {
      expect(img.hasAttribute('alt')).toBe(true)
    }
  })
})

describe('detail view', () => {
  beforeEach(root)

  it('renders artwork, name, description, tags and a primary launch action', () => {
    const p = PROJECTS.find((x) => x.slug === 'foxtail')!
    const view = viewFor({ kind: 'project', slug: 'foxtail' })
    expect(view.querySelector('.detail__name')?.textContent).toBe(p.name)
    expect(view.querySelector('.detail__desc')?.textContent).toBe(p.description)
    expect(view.querySelectorAll('.tag')).toHaveLength(p.tags.length)
    const launches = view.querySelectorAll('a[data-launch]')
    expect(launches.length).toBeGreaterThanOrEqual(1)
    expect(launches[0]?.textContent).toContain('Play')
    expect(view.querySelector('.launchbar')).not.toBeNull()
  })

  it('explains adding a live project to the Home Screen', () => {
    const view = viewFor({ kind: 'project', slug: 'foxtail' })
    const guide = view.querySelector('details.install')
    expect(guide?.querySelector('summary')?.textContent).toBe('Add Foxtail to your Home Screen')
    expect(guide?.textContent).toContain('Add to Home Screen')
    expect(guide?.querySelectorAll('.install__platform')).toHaveLength(2)
  })

  it('shows an honest note instead of a link for unavailable projects', () => {
    const unavailable = PROJECTS.filter((p) => p.status !== 'live')
    for (const p of unavailable) {
      const view = viewFor({ kind: 'project', slug: p.slug })
      expect(view.querySelector('a[data-launch]'), p.name).toBeNull()
      expect(view.querySelector('.launchbar'), p.name).toBeNull()
      expect(view.querySelector('.install'), p.name).toBeNull()
      expect(view.querySelector('.detail__note')?.textContent, p.name).toContain(STATUS_LABEL[p.status])
    }
  })

  it('renders not-found for unknown slugs', () => {
    const view = viewFor({ kind: 'project', slug: 'does-not-exist' })
    expect(view.querySelector('.notfound')).not.toBeNull()
  })

  it('sets page titles', () => {
    expect(titleFor({ kind: 'home', filter: 'all' })).toContain('MADE')
    expect(titleFor({ kind: 'project', slug: 'sos' })).toBe('SOS — MADE')
  })
})

describe('mount', () => {
  it('renders header, main and footer and re-renders on hash change', async () => {
    const el = root()
    const unmount = mount(el)
    expect(el.querySelector('header .wordmark')).not.toBeNull()
    expect(el.querySelector('main .featured')).not.toBeNull()
    window.location.hash = '#/p/sos'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(el.querySelector('main .detail__name')?.textContent).toBe('SOS')
    window.location.hash = '#/outdoors'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(el.querySelector('main .chip[aria-current="true"]')?.getAttribute('data-filter')).toBe('outdoors')
    unmount()
  })

  it('signs the footer "MADE by Have An App" with a real link to the studio', () => {
    const el = root()
    const unmount = mount(el)
    const footer = el.querySelector('footer') as HTMLElement
    expect(footer.querySelector('.maker__lockup')?.textContent).toBe('MADEby Have An App')
    const links = [...footer.querySelectorAll<HTMLAnchorElement>('a[href="https://haveanapp.com"]')]
    expect(links.length).toBeGreaterThanOrEqual(1)
    for (const a of links) {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toContain('noopener')
    }
    // The studio stays out of the header: MADE is the app.
    expect(el.querySelector('header')?.textContent).not.toContain('Have An App')
    unmount()
  })
})
