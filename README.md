# Have An App

**Small apps, made for you.**

The website for Have An App, a tiny studio that makes small, useful apps, and the showroom for every app in the family: games, and apps for the outdoors, home and work. One link, tap something, use it.

It will live at **https://haveanapp.com**. Until the domain moves over, it's at https://scottyfncodes.github.io/MADE/. The build uses relative paths, so it works at either.

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
  category: 'games',                  // games | outdoors | home | commercial
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
npm run art        # re-render the studio icons, social image and project artwork (uses the bundled Chromium)
```

Deploys happen from `main` through `.github/workflows/deploy.yml` to GitHub Pages.

## Brand

[`BRAND.md`](BRAND.md) is the Have An App brand system: what every app in the family shares, and what each one keeps for itself. The studio is ink on paper; the color on the page comes from the apps.

## Stack

Vite, TypeScript, plain DOM and modern CSS. No framework, no backend, no analytics. Installable as a PWA with a small network-first service worker.
