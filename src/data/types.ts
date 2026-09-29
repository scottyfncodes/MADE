/**
 * Core data model for the MADE showroom.
 *
 * Everything the UI renders is derived from `Project` entries. Adding a
 * project means adding one entry to `src/data/projects.ts`; nothing else
 * needs to change.
 */

/** Category identifiers. Extend `CATEGORIES` in `categories.ts` to add more. */
export type CategoryId = 'games' | 'outdoors' | 'home' | 'commercial'

export interface Category {
  id: CategoryId
  /** Display label, e.g. "Games". */
  label: string
  /** Singular label used on cards and detail pages, e.g. "Game". */
  singular: string
  /** Verb used on the primary action for projects in this category. */
  action: 'Play' | 'Open' | 'Use' | 'Try'
}

/**
 * Availability of a project.
 *
 * - `live`          A confirmed, working URL exists. The card launches it.
 * - `in-development` Real project, no confirmed public URL yet.
 * - `coming-soon`   Announced but not yet available.
 * - `archived`      Kept for the record; no longer maintained.
 */
export type ProjectStatus = 'live' | 'in-development' | 'coming-soon' | 'archived'

export interface ProjectArt {
  /** Icon shown on cards and as the detail hero. Path relative to site base. */
  icon: string
  /** Optional larger artwork for the featured card / detail hero. */
  heroImage?: string
  /** Optional gallery of screenshots for the detail view. */
  screenshots?: string[]
  /**
   * Accent color for this project. MADE is the frame; each project keeps its
   * own identity through this color (glow, gradient wash, focus ring).
   */
  accent: string
  /**
   * Optional text color used on top of `accent` (launch buttons). Set it when
   * the accent is too light for white text, e.g. a pale cyan or yellow.
   */
  ink?: string
}

export interface Project {
  /** Human-facing name, as the project brands itself. */
  name: string
  /** URL-safe identifier used in routes (`#/p/<slug>`). Must be unique. */
  slug: string
  /** One-liner shown on cards. Keep it under ~90 characters. */
  tagline: string
  /** Longer description for the detail view. Plain text, 1–3 sentences. */
  description: string
  category: CategoryId
  /**
   * Confirmed live URL. Only set this when the link is known to work.
   * Projects without a URL must use a non-`live` status.
   */
  url?: string
  /** Source repository, when public. Shown as a secondary link. */
  repo?: string
  art: ProjectArt
  tags: string[]
  featured?: boolean
  status: ProjectStatus
  /** ISO date (YYYY-MM-DD). Used for "Recently added" ordering. */
  dateAdded: string
}
