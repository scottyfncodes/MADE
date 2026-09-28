import { describe, expect, it } from 'vitest'
import type { Project } from '../data/types'
import { allProjects, compareProjects, countByCategory, filterProjects, getFeatured, getProject, isLaunchable, isSelf, recentlyAdded } from '../lib/catalog'

const make = (over: Partial<Project>): Project => ({
  name: 'X',
  slug: 'x',
  tagline: 't',
  description: 'd',
  category: 'apps',
  art: { icon: 'art/x.webp', accent: '#000000' },
  tags: [],
  status: 'live',
  url: 'https://example.com/',
  dateAdded: '2026-01-01',
  ...over,
})

const fixture: Project[] = [
  make({ slug: 'a', name: 'A', category: 'games', dateAdded: '2026-01-03' }),
  make({ slug: 'b', name: 'B', category: 'apps', dateAdded: '2026-01-02', featured: true }),
  make({ slug: 'c', name: 'C', category: 'tools', dateAdded: '2026-01-04', status: 'coming-soon', url: undefined }),
  make({ slug: 'd', name: 'D', category: 'games', dateAdded: '2026-01-01' }),
]

describe('catalog selectors', () => {
  it('sorts live first, then alphabetically', () => {
    expect(allProjects(fixture).map((p) => p.slug)).toEqual(['a', 'b', 'd', 'c'])
    expect(compareProjects(make({ name: 'B' }), make({ name: 'a' }))).toBeGreaterThan(0)
    expect(compareProjects(make({ status: 'archived' }), make({ status: 'coming-soon', url: undefined }))).toBeGreaterThan(0)
  })

  it('recognises itself regardless of trailing slash or case', () => {
    const made = make({ url: 'https://scottyfncodes.github.io/MADE/' })
    expect(isSelf(made, 'https://scottyfncodes.github.io/MADE')).toBe(true)
    expect(isSelf(made, 'https://scottyfncodes.github.io/made/')).toBe(true)
    expect(isSelf(made, 'https://scottyfncodes.github.io/FOXTAIL/')).toBe(false)
    expect(isSelf(make({ url: undefined }), 'https://scottyfncodes.github.io/MADE/')).toBe(false)
  })

  it('filters by category and keeps ordering', () => {
    expect(filterProjects('games', fixture).map((p) => p.slug)).toEqual(['a', 'd'])
    expect(filterProjects('all', fixture)).toHaveLength(4)
    expect(filterProjects('experiments', fixture)).toHaveLength(0)
  })

  it('counts per category', () => {
    expect(countByCategory(fixture)).toEqual({ all: 4, games: 2, apps: 1, tools: 1, experiments: 0 })
  })

  it('picks the featured live project, falling back to the first live one', () => {
    expect(getFeatured(fixture)?.slug).toBe('b')
    const none = fixture.map((p) => ({ ...p, featured: false }))
    expect(getFeatured(none)?.slug).toBe('a')
    const onlyUnavailable = [make({ featured: true, status: 'in-development', url: undefined })]
    expect(getFeatured(onlyUnavailable)).toBeUndefined()
  })

  it('finds by slug', () => {
    expect(getProject('c', fixture)?.name).toBe('C')
    expect(getProject('nope', fixture)).toBeUndefined()
  })

  it('orders recently added by date', () => {
    expect(recentlyAdded(2, fixture).map((p) => p.slug)).toEqual(['c', 'a'])
  })

  it('only treats live projects with a url as launchable', () => {
    expect(isLaunchable(make({}))).toBe(true)
    expect(isLaunchable(make({ url: undefined }))).toBe(false)
    expect(isLaunchable(make({ status: 'in-development' }))).toBe(false)
  })
})
