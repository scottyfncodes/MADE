import { defineConfig } from 'vitest/config'

/**
 * Have An App is served from GitHub Pages at https://haveanapp.com. The build
 * uses relative paths, so the same output also works under a project path
 * (scottyfncodes.github.io/<repo>/). `BASE_PATH` overrides it if ever needed.
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? './',
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
