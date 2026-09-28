import { h } from '../lib/dom'
import { hrefFor } from '../lib/router'

export function wordmark(tag: 'a' | 'div' = 'a'): HTMLElement {
  const mark = h('span', { class: 'wordmark__mark' }, 'MADE', h('span', { class: 'wordmark__dot', 'aria-hidden': 'true' }))
  const tagline = h('span', { class: 'wordmark__tag' }, 'Things I’ve made.')
  if (tag === 'a') {
    return h('a', { class: 'wordmark', href: hrefFor({ kind: 'home', filter: 'all' }), 'aria-label': 'MADE home' }, mark, tagline)
  }
  return h('div', { class: 'wordmark' }, mark, tagline)
}

export function header(projectCount: number): HTMLElement {
  return h(
    'header',
    { class: 'header' },
    h(
      'div',
      { class: 'container header__row' },
      wordmark('a'),
      h('span', { class: 'header__count', 'aria-hidden': 'true' }, `${projectCount} things`),
    ),
  )
}

export function footer(): HTMLElement {
  return h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'container footer__row' },
      h('span', null, 'MADE — a showroom for things I’ve made.'),
      h('a', { href: 'https://github.com/scottyfncodes', target: '_blank', rel: 'noopener' }, 'github.com/scottyfncodes'),
    ),
  )
}
