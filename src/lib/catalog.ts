import { PROJECTS } from '../data/projects'
import type { CategoryId, Project, ProjectStatus } from '../data/types'

/**
 * Read-only selectors over the project catalog. Components only ever go
 * through these, so future features (search, favorites, "most played")
 * slot in here without touching the UI.
 */

export type Filter = 'all' | CategoryId

export function allProjects(projects: readonly Project[] = PROJECTS): Project[] {
  return [...projects].sort(compareProjects)
}

export function getProject(slug: string, projects: readonly Project[] = PROJECTS): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeatured(projects: readonly Project[] = PROJECTS): Project | undefined {
  const featured = projects.filter((p) => p.featured && p.status === 'live')
  if (featured.length === 0) return allProjects(projects).find((p) => p.status === 'live')
  return featured.sort(compareProjects)[0]
}

export function filterProjects(filter: Filter, projects: readonly Project[] = PROJECTS): Project[] {
  const list = filter === 'all' ? projects : projects.filter((p) => p.category === filter)
  return [...list].sort(compareProjects)
}

export function countByCategory(projects: readonly Project[] = PROJECTS): Record<Filter, number> {
  const counts: Record<Filter, number> = { all: projects.length, games: 0, apps: 0, tools: 0, experiments: 0 }
  for (const p of projects) counts[p.category] += 1
  return counts
}

export function recentlyAdded(limit = 6, projects: readonly Project[] = PROJECTS): Project[] {
  return [...projects].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, limit)
}

export function isLaunchable(project: Project): project is Project & { url: string } {
  return project.status === 'live' && typeof project.url === 'string' && project.url.length > 0
}

const STATUS_RANK: Record<ProjectStatus, number> = {
  live: 0,
  'in-development': 1,
  'coming-soon': 2,
  archived: 3,
}

/**
 * Live projects first, then alphabetical. Stable and predictable for a
 * growing grid; `recentlyAdded()` covers the newest-first view.
 */
export function compareProjects(a: Project, b: Project): number {
  const byStatus = STATUS_RANK[a.status] - STATUS_RANK[b.status]
  if (byStatus !== 0) return byStatus
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
}

/** True when `project` is this very showroom (so we do not "open" ourselves). */
export function isSelf(project: Project, here: string = selfUrl()): boolean {
  if (!project.url) return false
  return normalize(project.url) === normalize(here)
}

function selfUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.origin + import.meta.env.BASE_URL
}

function normalize(url: string): string {
  return url.replace(/\/+$/, '').toLowerCase()
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-development': 'In development',
  'coming-soon': 'Coming soon',
  archived: 'Archived',
}
