import { h, svg } from '../lib/dom'
import { hrefFor } from '../lib/router'
import { GLYPH_ARROW_UP_RIGHT, GLYPH_TILE } from './glyphs'

export function wordmark(tag: 'a' | 'div' = 'a'): HTMLElement {
  const mark = h('span', { class: 'wordmark__mark' }, 'MADE', h('span', { class: 'wordmark__dot', 'aria-hidden': 'true' }))
  const tagline = h('span', { class: 'wordmark__tag' }, '…by scott')
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

/** The studio behind MADE. Future apps reuse this signature with their own name. */
export const MAKER = { name: 'Have An App', url: 'https://haveanapp.com', line: 'Small apps, made for you.' } as const

export function footer(): HTMLElement {
  const external = { target: '_blank', rel: 'noopener' }
  return h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'container footer__row' },
      h(
        'div',
        { class: 'maker' },
        h(
          'p',
          { class: 'maker__lockup' },
          h('span', { class: 'maker__app' }, 'MADE', h('span', { class: 'wordmark__dot', 'aria-hidden': 'true' })),
          h(
            'span',
            { class: 'maker__by' },
            'by ',
            h('a', { class: 'maker__studio', href: MAKER.url, ...external }, svg(GLYPH_TILE, 'maker__tile'), MAKER.name),
          ),
        ),
        h(
          'p',
          { class: 'maker__line' },
          `${MAKER.line} `,
          h('a', { class: 'maker__cta', href: MAKER.url, ...external }, 'Have an idea? Let’s make it', svg(GLYPH_ARROW_UP_RIGHT, 'btn__icon')),
        ),
      ),
      h(
        'div',
        { class: 'footer__meta' },
        h('span', null, 'A showroom for things I’ve made.'),
        h('a', { href: 'https://github.com/scottyfncodes', ...external }, 'github.com/scottyfncodes'),
      ),
    ),
  )
}
