import './styles/index.css'
import { mount } from './app'

mount(document.getElementById('app') as HTMLElement)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* offline support is a progressive enhancement */
    })
  })
}
