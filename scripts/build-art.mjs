/**
 * Renders brand assets and per-project artwork with the bundled Chromium.
 *
 *   node scripts/build-art.mjs
 *
 * Inputs
 *   brand/made-mark.svg            MADE app icon (square, full-bleed)
 *   brand/made-mark-maskable.svg   MADE icon with maskable safe-zone padding
 *   brand/og.svg                   Social preview
 *   art-src/<slug>.(svg|png)       Each project's own icon, copied from its repo
 *
 * Outputs (committed, served from public/)
 *   public/icons/*.png, public/og.png, public/art/<slug>.webp
 */
import { chromium } from 'playwright'
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const artSrc = path.join(root, 'art-src')
const outIcons = path.join(root, 'public', 'icons')
const outArt = path.join(root, 'public', 'art')
await mkdir(outIcons, { recursive: true })
await mkdir(outArt, { recursive: true })

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function dataUrl(file) {
  const buf = await readFile(file)
  const ext = path.extname(file).slice(1).toLowerCase()
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : `image/${ext}`
  return `data:${mime};base64,${buf.toString('base64')}`
}

/** Render `file` into a `size`×`size` (or w×h) raster. */
async function render(file, { width, height, type = 'png', quality }) {
  const src = await dataUrl(file)
  await page.setViewportSize({ width, height })
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent"><img src="${src}" style="display:block;width:${width}px;height:${height}px;object-fit:cover"></body></html>`,
  )
  await page.waitForFunction(() => document.images[0]?.complete)
  const opts = { type, omitBackground: true, clip: { x: 0, y: 0, width, height } }
  if (type === 'jpeg' || type === 'webp') opts.quality = quality ?? 88
  return page.screenshot(opts)
}

// --- MADE brand ---
const mark = path.join(root, 'brand', 'made-mark.svg')
const maskable = path.join(root, 'brand', 'made-mark-maskable.svg')
for (const [name, size, file] of [
  ['icon-512.png', 512, mark],
  ['icon-192.png', 192, mark],
  ['apple-touch-icon.png', 180, mark],
  ['favicon-32.png', 32, mark],
  ['maskable-512.png', 512, maskable],
]) {
  await writeFile(path.join(outIcons, name), await render(file, { width: size, height: size }))
  console.log('brand', name)
}
await writeFile(path.join(root, 'public', 'og.jpg'), await render(path.join(root, 'brand', 'og.svg'), { width: 1200, height: 630, type: 'jpeg', quality: 90 }))
console.log('brand og.jpg')

// --- Project art ---
const ART_SIZE = 384
for (const file of (await readdir(artSrc)).sort()) {
  const slug = path.parse(file).name
  const webp = await render(path.join(artSrc, file), { width: ART_SIZE, height: ART_SIZE, type: 'webp', quality: 86 })
  await writeFile(path.join(outArt, `${slug}.webp`), webp)
  console.log('art', slug, `${(webp.length / 1024).toFixed(1)}kB`)
}

await browser.close()
