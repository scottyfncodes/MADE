import { isCategoryId } from '../data/categories'
import type { CategoryId } from '../data/types'

/**
 * Tiny hash router. Hash routes keep deep links working on GitHub Pages
 * without a 404 rewrite, and keep URLs short enough to share:
 *
 *   #/            home (all projects)
 *   #/games       home filtered to a category
 *   #/p/foxtail   project detail
 */
export type Route =
  | { kind: 'home'; filter: 'all' | CategoryId }
  | { kind: 'project'; slug: string }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '')
  if (path === '' || path === 'all') return { kind: 'home', filter: 'all' }
  const [head = '', tail = ''] = path.split('/')
  if (head === 'p' && tail) return { kind: 'project', slug: decodeURIComponent(tail) }
  if (isCategoryId(head)) return { kind: 'home', filter: head }
  return { kind: 'home', filter: 'all' }
}

export function hrefFor(route: Route): string {
  if (route.kind === 'project') return `#/p/${encodeURIComponent(route.slug)}`
  return route.filter === 'all' ? '#/' : `#/${route.filter}`
}

export function currentRoute(): Route {
  return parseHash(window.location.hash)
}

export function navigate(route: Route): void {
  const href = hrefFor(route)
  if (window.location.hash === href) return
  window.location.hash = href
}

export function onRouteChange(handler: (route: Route) => void): () => void {
  const listener = () => handler(currentRoute())
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}
