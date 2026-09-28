import { describe, expect, it } from 'vitest'
import { hrefFor, parseHash } from '../lib/router'

describe('router', () => {
  it('parses home and category routes', () => {
    expect(parseHash('')).toEqual({ kind: 'home', filter: 'all' })
    expect(parseHash('#/')).toEqual({ kind: 'home', filter: 'all' })
    expect(parseHash('#/all')).toEqual({ kind: 'home', filter: 'all' })
    expect(parseHash('#/games')).toEqual({ kind: 'home', filter: 'games' })
    expect(parseHash('#/tools/')).toEqual({ kind: 'home', filter: 'tools' })
  })

  it('parses project routes and decodes slugs', () => {
    expect(parseHash('#/p/foxtail')).toEqual({ kind: 'project', slug: 'foxtail' })
    expect(parseHash('#/p/big%20score')).toEqual({ kind: 'project', slug: 'big score' })
  })

  it('falls back to home for unknown paths', () => {
    expect(parseHash('#/nonsense')).toEqual({ kind: 'home', filter: 'all' })
    expect(parseHash('#/p/')).toEqual({ kind: 'home', filter: 'all' })
  })

  it('round-trips hrefs', () => {
    const routes = [
      { kind: 'home', filter: 'all' },
      { kind: 'home', filter: 'apps' },
      { kind: 'project', slug: 'sos' },
    ] as const
    for (const route of routes) expect(parseHash(hrefFor(route))).toEqual(route)
    expect(hrefFor({ kind: 'home', filter: 'all' })).toBe('#/')
  })
})
