# Have An App — brand notes (from the MADE test)

MADE is the first app to carry the Have An App signature. This file records what worked, so later apps can feel related without looking the same: **same family, different personalities.**

> **MADE is the app. Have An App is the maker.**
> Have An App — small apps, made for you.

## 1. Where the branding lives in MADE

| Place | Treatment |
| --- | --- |
| Footer | Lockup: **MADE◆ by ▢ Have An App**. "Have An App" links to https://haveanapp.com. Under it: *Small apps, made for you.* and one quiet link, *Have an idea? Let's make it ↗*. |
| `<meta name="author">` | `Have An App` |
| Web app manifest | Description ends with "Made by Have An App." (shows in Android's install sheet) |
| Header, hero, icon, title, splash | **Nothing.** They stay MADE-only ("MADE …by scott", the M◆ icon). |

The studio shows up where people look for "who made this" (the bottom of the page) and nowhere they are trying to use the app.

## 2. Signature pattern (carry forward)

```
<APP NAME>◆  by ▢ Have An App        ← app wordmark leads, studio signs
Small apps, made for you. Have an idea? Let's make it ↗
```

- The app's own wordmark is on the left, in its own accent. The studio name comes after "by", at body size.
- **The ▢ tile mark** (`GLYPH_TILE` in `src/ui/glyphs.ts`) is Have An App's only glyph: a rounded app tile with a dot. Monochrome `currentColor`, 14px. It never gets a brand color, so it never competes with the app's accent.
- One link to haveanapp.com on the name, plus at most one soft invitation. Never a banner, never a button, never in the header.
- The copy stays in plain words: "small apps", "made", "let's make it".
- The whole signature is defined once (`MAKER` in `src/ui/header.ts`), so the name, URL and line can't drift.

## 3. Shared foundation (the family)

These tokens in `src/styles/tokens.css` should be copied as-is into new apps:

- **Type:** the system stack (SF Pro / Inter fallback). Display weight 800, tight tracking (−0.04em) for names and wordmarks. Body 16px/1.5. Secondary text 13–14px.
- **Neutrals:** near-black `#0d0d0f` / warm off-white `#f6f6f4`, with dark and light themes that follow the system setting. Muted text is `--text-muted`. Use `--text-faint` only for decoration, never for text people must read (it fails 4.5:1 on light).
- **Radii:** 10 / 16 / 24 / 32 / pill. Cards 24, buttons pill, icons ~22%.
- **Spacing:** 4px scale; gutter of 16 → 24 → 40.
- **Motion:** one ease-out curve, 140/220/360ms, a 6px fade-up on view change, all disabled under reduced motion.
- **Surfaces:** a glass sticky header, hairline `--line` borders, soft long shadows instead of hard ones.
- **Buttons:** pill-shaped, 44px minimum tap target, and the primary button carries the accent. When something isn't available, show an honest, inert status pill rather than a fake link.
- **PWA basics:** safe-area insets throughout, `black-translucent` status bar, `theme-color` per scheme, a maskable icon with safe-zone padding, network-first service worker.
- **Empty and not-found states:** one short human sentence and one way back ("Nothing here." / "Back to everything").

## 4. Personality (per app, *not* shared)

Each app picks its own:

- **Accent color.** MADE's is tangerine `#ff5c2e`. Another app should choose a different one.
- **Finish mark.** MADE's is the rotated-square "◆" after the wordmark and in the icon. Another app might borrow the idea of a small mark of completion, but it should draw its own shape.
- **Icon.** It should be recognisably the app's own, full-bleed, with no studio logo on it. The studio never appears on a home-screen icon.
- **Voice line.** MADE's "…by scott" is personal to a showroom. Other apps shouldn't copy it.

## 5. Do not carry forward

- Putting "Have An App" in the header, title, icon, splash or OG image. The app keeps those spaces.
- Using the tangerine accent or the ◆ as Have An App's color or mark. Those belong to MADE.
- MADE's category chips, featured card and grid. They are specific to a catalog.
- More than one call to action. One quiet link is the ceiling.
- Startup vocabulary: solutions, platform, innovation, transformation, enterprise.

## 6. Open items

- haveanapp.com could not be reached from the build environment during this pass, so the site's own palette and type were not compared against these notes. Check them against each other, and if the site has a real logo, compare it with the ▢ tile mark before other apps copy the tile.
- iOS standalone mode shows the `#0d0d0f` background while the page loads. A dedicated splash (`apple-touch-startup-image`) wasn't needed; if one is added later, it should show the app only.
