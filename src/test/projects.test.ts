import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CATEGORIES, isCategoryId } from '../data/categories'
import { PROJECTS } from '../data/projects'

const PUBLIC_DIR = path.resolve(__dirname, '../../public')

/** Hosts a confirmed link is allowed to point at. Anything else is suspicious. */
const ALLOWED_HOSTS = ['scottyfncodes.github.io', 'vercel.app']

describe('project catalog', () => {
  it('has at least one project', () => {
    expect(PROJECTS.length).toBeGreaterThan(0)
  })

  it('uses unique, URL-safe slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it('only uses registered categories', () => {
    for (const p of PROJECTS) expect(isCategoryId(p.category), `${p.name} category`).toBe(true)
  })

  it('never shows a fake link: live projects have a confirmed https URL, others have none', () => {
    for (const p of PROJECTS) {
      if (p.status === 'live') {
        expect(p.url, `${p.name} must have a url`).toBeDefined()
        const url = new URL(p.url as string)
        expect(url.protocol).toBe('https:')
        expect(
          ALLOWED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)),
          `${p.name} url host ${url.hostname}`,
        ).toBe(true)
      } else {
        expect(p.url, `${p.name} is ${p.status} and must not carry a url`).toBeUndefined()
      }
    }
  })

  it('points every icon and image at a file that exists in public/', () => {
    for (const p of PROJECTS) {
      const files = [p.art.icon, p.art.heroImage, ...(p.art.screenshots ?? [])].filter(Boolean) as string[]
      for (const file of files) {
        expect(existsSync(path.join(PUBLIC_DIR, file)), `${p.name}: ${file}`).toBe(true)
      }
    }
  })

  it('uses valid accent colors and ISO dates', () => {
    for (const p of PROJECTS) {
      expect(p.art.accent, `${p.name} accent`).toMatch(/^#[0-9a-f]{6}$/i)
      if (p.art.ink !== undefined) expect(p.art.ink, `${p.name} ink`).toMatch(/^#[0-9a-f]{6}$/i)
      expect(p.dateAdded, `${p.name} dateAdded`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(p.dateAdded))).toBe(false)
    }
  })

  it('keeps copy short enough for cards', () => {
    for (const p of PROJECTS) {
      expect(p.name.length, `${p.name} name`).toBeLessThanOrEqual(24)
      expect(p.tagline.length, `${p.name} tagline`).toBeLessThanOrEqual(90)
      expect(p.description.length, `${p.name} description`).toBeGreaterThan(20)
      expect(p.tags.length, `${p.name} tags`).toBeLessThanOrEqual(6)
    }
  })

  it('includes the initial collection', () => {
    const expected = [
      'made', 'foxtail', 'demo-day', 'rideout', 'tread', 'aerobook', 'crew', 'safetrace', 'unearth',
      'route-rabbit', 'antlerboard', 'leaf-hunter', 'caddaie', 'sos', 'big-score',
      'fowl-play', 'backyard-lab', 'snownow', 'co-trail-atlas',
    ]
    const slugs = new Set(PROJECTS.map((p) => p.slug))
    for (const slug of expected) expect(slugs.has(slug), slug).toBe(true)
  })

  it('has exactly one featured, live project', () => {
    const featured = PROJECTS.filter((p) => p.featured)
    expect(featured.length).toBe(1)
    expect(featured[0]?.status).toBe('live')
  })

  it('registers each category exactly once', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
