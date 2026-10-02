import { h, svg } from '../lib/dom'
import { hrefFor } from '../lib/router'
import { GLYPH_TILE } from './glyphs'

/** The studio. This site is its home and its showroom. */
export const STUDIO = {
  name: 'Have An App',
  url: 'https://haveanapp.com',
  line: 'Small apps, made for you.',
  email: 'hello@haveanapp.com',
} as const

/** One mailto for every "tell me the idea" action, so the subject line stays consistent. */
export const IDEA_MAILTO = `mailto:${STUDIO.email}?subject=${encodeURIComponent('I have an idea for an app')}`

export function wordmark(): HTMLElement {
  return h(
    'a',
    { class: 'wordmark', href: hrefFor({ kind: 'home', filter: 'all' }), 'aria-label': `${STUDIO.name} home` },
    svg(GLYPH_TILE, 'tile'),
    STUDIO.name,
  )
}

export function header(): HTMLElement {
  return h(
    'header',
    { class: 'header' },
    h('div', { class: 'container header__row' }, wordmark(), h('a', { class: 'header__link', href: IDEA_MAILTO }, 'Say hi')),
  )
}

export function footer(): HTMLElement {
  return h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'container footer__row' },
      h(
        'p',
        { class: 'footer__sig' },
        svg(GLYPH_TILE, 'tile'),
        h('span', null, h('strong', null, STUDIO.name), ` — ${STUDIO.line.charAt(0).toLowerCase()}${STUDIO.line.slice(1)}`),
      ),
      h(
        'div',
        { class: 'footer__meta' },
        h('span', null, `© ${new Date().getFullYear()} ${STUDIO.name}`),
        h('a', { href: 'https://github.com/scottyfncodes', target: '_blank', rel: 'noopener' }, 'github.com/scottyfncodes'),
      ),
    ),
  )
}
