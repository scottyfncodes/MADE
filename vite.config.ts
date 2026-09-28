import { defineConfig } from 'vitest/config'

/**
 * MADE is served from GitHub Pages at https://scottyfncodes.github.io/MADE/.
 * `BASE_PATH` lets the same build run from a different path (or root).
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/MADE/',
  build: {
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
