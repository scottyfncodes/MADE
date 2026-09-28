/** Minimal DOM helper so components stay dependency-free. */

type Child = Node | string | number | null | undefined | false | Child[]

type Attrs = Record<string, string | number | boolean | null | undefined | ((event: Event) => void)>

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs | null = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (value === null || value === undefined || value === false) continue
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
    } else if (key === 'class') {
      el.className = String(value)
    } else if (key === 'style') {
      el.setAttribute('style', String(value))
    } else if (value === true) {
      el.setAttribute(key, '')
    } else {
      el.setAttribute(key, String(value))
    }
  }
  append(el, children)
  return el
}

export function svg(markup: string, className?: string): SVGSVGElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = markup.trim()
  const el = wrapper.firstElementChild as SVGSVGElement
  if (className) el.classList.add(className)
  return el
}

export function append(parent: Node, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue
    if (Array.isArray(child)) {
      append(parent, child)
    } else if (child instanceof Node) {
      parent.appendChild(child)
    } else {
      parent.appendChild(document.createTextNode(String(child)))
    }
  }
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild)
}

/** Resolve a public-asset path against Vite's configured base. */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
