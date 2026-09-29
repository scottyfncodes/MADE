# MADE

**…by scott**

MADE is a small, static showroom for my apps, games, tools and experiments. One link, tap something, use it.

Live: **https://scottyfncodes.github.io/MADE/**

## Adding a project

Everything on the page is generated from one list: [`src/data/projects.ts`](src/data/projects.ts). To add a project:

1. Drop its icon (square PNG or SVG) into `art-src/<slug>.png` and run `npm run art` to render `public/art/<slug>.webp`.
2. Add one entry to `PROJECTS`:

```ts
{
  name: 'Foxtail',
  slug: 'foxtail',                    // used in the URL: #/p/foxtail
  tagline: 'One line for the card.',
  description: 'A few sentences for the detail view.',
  category: 'games',                  // games | apps | tools | experiments
  url: 'https://…',                   // ONLY when the link is confirmed to work
  repo: 'https://github.com/…',       // optional
  art: { icon: 'art/foxtail.webp', accent: '#2f7a5f' },
  tags: ['Cozy', 'PWA'],
  featured: true,                     // at most one
  status: 'live',                     // live | in-development | coming-soon | archived
  dateAdded: '2026-09-21',
}
```

3. `npm test` checks the entry: unique slug, registered category, a real `https` URL for anything marked `live`, no URL for anything that is not, and that every referenced image exists.

Projects without a confirmed URL get an honest status pill instead of a link. Nothing on the page pretends to be live.

### Adding a category

Add the id to `CategoryId` in `src/data/types.ts` and an entry to `CATEGORIES` in `src/data/categories.ts`. Navigation, filtering and counts follow automatically.

## Development

```sh
npm install
npm run dev        # local dev server
npm run check      # typecheck + tests + production build
npm run art        # re-render brand icons and project artwork (uses the bundled Chromium)
```

Deploys happen from `main` through `.github/workflows/deploy.yml` to GitHub Pages.

## Stack

Vite, TypeScript, plain DOM and modern CSS. No framework, no backend, no analytics. Installable as a PWA with a small network-first service worker.
