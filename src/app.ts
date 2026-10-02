import { getProject } from './lib/catalog'
import { clear, h } from './lib/dom'
import { currentRoute, hrefFor, onRouteChange, type Route } from './lib/router'
import { notFound, projectDetail } from './ui/detail'
import { footer, header } from './ui/header'
import { homeView } from './ui/home'

const SITE_TITLE = 'Have An App — small apps, made for you'
const SUFFIX = ' — Have An App'

/** Remembers the last home filter so "back" from a detail returns there. */
let lastHomeHref = hrefFor({ kind: 'home', filter: 'all' })

export function mount(root: HTMLElement): () => void {
  clear(root)
  const skip = h('a', { class: 'skip-link', href: '#main' }, 'Skip to content')
  const main = h('main', { id: 'main', tabindex: '-1' })
  root.append(skip, header(), main, footer())

  const render = (route: Route) => {
    clear(main)
    main.appendChild(viewFor(route))
    document.title = titleFor(route)
    if (route.kind === 'home') {
      lastHomeHref = hrefFor(route)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }

  render(currentRoute())
  return onRouteChange(render)
}

export function viewFor(route: Route): HTMLElement {
  if (route.kind === 'home') return homeView(route.filter)
  const project = getProject(route.slug)
  return project ? projectDetail(project, lastHomeHref) : notFound()
}

export function titleFor(route: Route): string {
  if (route.kind === 'project') {
    const project = getProject(route.slug)
    return project ? `${project.name}${SUFFIX}` : `Not found${SUFFIX}`
  }
  return SITE_TITLE
}
