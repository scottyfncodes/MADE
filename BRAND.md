# Have An App — brand system

> Have an idea for an app? **Cool. Let's make it.**
> Have An App — small apps, made for you.

This is the canonical reference. It started as the MADE branding test, moved to `scottyfncodes/haveanapp`, and came back here when MADE's showroom became the Have An App site. This copy wins over any other.

**Same family, different personalities.** Apps share a foundation and a signature. Each one keeps its own color, mark, icon and voice.

## The studio

- **Name:** always "Have An App", with each word capitalised. The URL is `haveanapp.com`, all lowercase.
- **Line:** *Small apps, made for you.*
- **Invitation:** *Have an idea? Let's make it.* Use it at most once per surface.
- **Voice:** small, clever, useful, human. Talk to one person, in plain words. "I wish there was an app that…" is the kind of line that fits.
- **Never say:** solutions, platform, enterprise, innovation, transformation, end-to-end, scalable, synergy. `src/test/ui.test.ts` checks the site for these.

## The mark: the tile

A rounded app tile with a dot in the middle: an app, waiting for an idea.

```svg
<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="8" r="1.8" fill="currentColor"/></svg>
```

- It is monochrome and uses `currentColor` everywhere. It never gets a brand color, so it never competes with an app's accent.
- On a light background it's near-black; on a dark one it's off-white. As the app icon (`brand/mark.svg`) it's off-white on the family's dark gradient tile.
- The wordmark is the tile followed by "Have An App" in the display font, weight 800, tracking −0.03em.

## Color

The studio has **no accent**; it's ink on paper. Its primary button is simply the inverted text color. The color on a Have An App page comes from the apps it shows: each family card's icon, button and glow use that app's accent (`--project-accent`, set from `art.accent` in `src/data/projects.ts`).

## Shared foundation (every app copies these)

The family token set is `:root` in `src/styles/tokens.css`. Copy everything except `--accent`, which each app sets to its own color:

| | |
| --- | --- |
| Type | System stack (SF Pro, then Inter). Display: weight 800 with tight tracking (−0.03 to −0.045em). Body: 16/1.5. Small text: 13–15px. |
| Neutrals | `#0d0d0f` dark and `#f6f6f4` light, following the system setting. Body copy uses `--text-muted`. `--text-faint` is for decoration only, because it fails 4.5:1 in light mode. |
| Radii | 10 / 16 / 24 / 32 / pill. Cards 24, buttons pill, icons 22%. |
| Spacing | 4px scale. The gutter is 16px, rising to 24 at 640px and 40 at 1024px. |
| Motion | One ease-out curve; 140/220/360ms; a 6px fade-up when content arrives; all of it off under reduced motion. |
| Surfaces | Glass sticky header, hairline borders, soft long shadows. |
| Buttons | Pill-shaped, 44px minimum (52 for primary). The primary button uses the accent. Pressing scales it to 0.97. |
| Honesty | Only link things that work. Show an inert status pill for anything not live yet. Empty states are one human sentence and one way back. |
| PWA | Safe-area insets; a `theme-color` for each scheme; a full-bleed icon plus a maskable one; network-first service worker. |

## Personality (each app chooses)

- **Accent:** one color, for example Foxtail's green `#2f7a5f` or Rideout's `#5aa864`.
- **Finish mark:** a small shape of its own after the wordmark. Don't reuse another app's shape.
- **Icon:** the app's own mark on a full-bleed tile, with **no studio logo**.
- **Voice line:** a short line of its own that sounds like it, in the studio's plain voice.

## The signature (how an app credits the studio)

```
<APP>◆  by ▢ Have An App
Small apps, made for you. Have an idea? Let's make it ↗
```

- It goes in the **footer** or the About area, and nowhere else. The header, title, icon, splash and social image belong to the app.
- The app's wordmark comes first, in its accent. The studio name follows "by" at body size, with the tile mark.
- Use one link to https://haveanapp.com, plus at most one soft invitation.
- Add `<meta name="author" content="Have An App">`. Where there's room, end the manifest description with "Made by Have An App."
- `STUDIO` in `src/ui/header.ts` holds the canonical name, line, URL and email for apps to copy.

## Where the studio site carries it

This repo is haveanapp.com: the studio leads everywhere (header, title, icon, splash, social image), and the apps in the family each keep their own accent on their card and detail page.

| Place | Treatment |
| --- | --- |
| Header | The wordmark, and one "Say hi" link |
| Home | Hero with the invitation, the family, "How it goes", "Got one?" |
| Footer | ▢ **Have An App** — small apps, made for you. |
| Email | Every "tell me the idea" action is `IDEA_MAILTO` to hello@haveanapp.com |

## Don't

- Don't put Have An App in an app's header, icon or splash, or show it as a banner.
- Don't give the studio mark a color, or borrow an app's accent or mark for the studio.
- Don't use more than one call to action per surface.
- Don't link an app before it's live. An app still in development can sit in the family with an inert status pill, and no link, until it is.
