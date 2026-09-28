/**
 * Visual QA: serves dist/ under /MADE/ and screenshots key views at
 * phone, tablet and desktop sizes. Fails if the page logs console errors.
 *
 *   node scripts/qa-screenshots.mjs [outDir]
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const dist = path.join(root, 'dist')
const outDir = path.resolve(process.argv[2] ?? path.join(root, 'test-results', 'qa'))
await mkdir(outDir, { recursive: true })

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' }
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (!url.pathname.startsWith('/MADE/')) { res.writeHead(404); return res.end() }
  let file = path.join(dist, url.pathname.slice('/MADE/'.length) || 'index.html')
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html') } catch { res.writeHead(404); return res.end('nope') }
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch { res.writeHead(404); res.end('nope') }
})
await new Promise((r) => server.listen(0, r))
const base = `http://localhost:${server.address().port}/MADE/`

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' })
const errors = []
const viewports = [
  ['iphone', { width: 390, height: 844 }, 3, true],
  ['iphone-landscape', { width: 844, height: 390 }, 3, true],
  ['ipad', { width: 820, height: 1180 }, 2, true],
  ['desktop', { width: 1440, height: 900 }, 1, false],
]
const routes = [['home', ''], ['games', '#/games'], ['detail', '#/p/foxtail'], ['detail-unavailable', '#/p/demo-day']]
for (const [name, viewport, deviceScaleFactor, isMobile] of viewports) {
  for (const scheme of ['dark', 'light']) {
    const context = await browser.newContext({ viewport, deviceScaleFactor, isMobile, hasTouch: isMobile, colorScheme: scheme })
    const page = await context.newPage()
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}/${scheme}: ${m.text()}`) })
    page.on('pageerror', (e) => errors.push(`${name}/${scheme}: ${e.message}`))
    page.on('requestfailed', (r) => errors.push(`${name}/${scheme}: request failed ${r.url()}`))
    for (const [route, hash] of routes) {
      if (scheme === 'light' && route !== 'home') continue
      await page.goto(base + hash, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)
      await page.screenshot({ path: path.join(outDir, `${name}-${scheme}-${route}.png`), fullPage: route !== 'detail' })
    }
    await context.close()
  }
}
await browser.close()
server.close()
if (errors.length) { console.error('Console/page errors:\n' + errors.join('\n')); process.exit(1) }
console.log('QA screenshots written to', outDir)
