# Ankit Saklani — Portfolio

Personal portfolio for Ankit Saklani, Software Developer (backend & distributed systems).

Built with **Astro 5** (static output), **Tailwind CSS 4**, and hand-rolled vanilla JS.
No client framework, no animation library, no WebGL — the whole page ships
**~2.6 kB of gzipped JS**.

**Theme: graphite + ember.** Near-black editorial dark mode with a warm paper light
mode, an ember accent, Instrument Serif display type over Inter and JetBrains Mono,
a hairline grid, and a scrubbed timeline rail.

**3D, in pure CSS.** A pointer-steered architecture scene in the hero — service
panels floating above a wiring plane, each lifting further out on hover. Project,
experience and education cards tilt on both axes under the cursor with their
content raised off the card face, and the ember spotlight glow tracks the same
pointer position. Sections rotate up out of the page as they enter view.

## Two designs, one flag

The site ships two complete looks. One value in
[`src/data/design.ts`](src/data/design.ts) decides which a visitor sees:

```ts
export const DESIGN_MODE = 'random' as DesignMode;
```

| Value | Behaviour |
|---|---|
| `'ember'` | Everyone always sees ember. Winter is excluded from the build. |
| `'winter'` | Everyone always sees winter. |
| `'random'` | **Current.** Each visitor gets one at random on first visit, then keeps it. |

### How random mode behaves

- **Per visitor, not per page load.** The choice is stored in `localStorage`, so
  reloading or navigating never changes it. Re-rolling on every load would make the
  site look broken to anyone who refreshes, and would mean a recruiter sharing your
  link couldn't rely on their colleague seeing the same thing.
- **Resolved before first paint** by the same inline script that applies the
  light/dark theme, so there's no flash of the wrong design.
- **Forceable via URL** — `?design=winter` or `?design=ember` pins a design and
  remembers it. Useful for sharing a specific look, or checking both yourself.
- **Re-roll** by clearing site data, or just visit `?design=…` to choose.
- **Link previews always show the ember card.** Social crawlers don't run
  JavaScript, so `OG_DESIGN` in `design.ts` commits to one static image. The tab
  favicon *is* swapped at runtime to match.

| | `ember` (current) | `winter` |
|---|---|---|
| Page | graphite `#0a0b0d` | polar night `#060910` |
| Accent | warm ember | ice cyan |
| Light mode | warm paper | snowfield |
| Atmosphere | accent bloom behind the headline | drifting aurora + canvas snowfall |
| Extra 3D | — | spinning three-plane snowflake |
| Favicon / social card | `favicon-ember.svg` / `og-ember.png` | `favicon-winter.svg` / `og-winter.png` |

**Content, layout, sections, the light/dark toggle and all the shared 3D are identical
between them** — only the palette, atmosphere and branding assets change. There is one
copy of your résumé content, so nothing can drift out of sync.

### How the switch works

- **Palettes** — all four combinations (2 designs × 2 modes) live in `global.css`,
  scoped by `[data-design]` and `[data-theme]`.
- **Winter-only components** — `Atmosphere.astro` and `Crystal.astro` are loaded with
  `await import()` behind `SHIPS_WINTER`, so on an `'ember'` build their markup *and
  their CSS* are absent from the output entirely. On a `'winter'` or `'random'` build
  they're present, and the `.winter-only` class keeps them inert when the resolved
  design is ember.
- **Snowfall** — `main.ts` guards `initSnow()` on `SHIPS_WINTER` (a literal, so the
  bundler drops the function on an ember-only build) *and* re-checks
  `data-design === 'winter'` at runtime, so in random mode no animation loop starts
  for visitors who got ember.

### Build cost

| Mode | CSS | client JS |
|---|---|---|
| `'ember'` | 44.9 kB | 6.8 kB |
| `'winter'` | 47.3 kB | 8.2 kB |
| `'random'` | 46.8 kB | 8.2 kB |

A fixed `'ember'` build contains no `aurora`, `crystal` or snowfall code at all —
verified by grepping the output. `'random'` necessarily ships both, costing about
+1.9 kB CSS and +1.4 kB JS over ember-only. Visitors who land on ember still pay no
*runtime* cost: the snowfall canvas is never sized and no `requestAnimationFrame`
loop runs.

### Comparing them side by side

Once this is a git repo (see [DEPLOYMENT.md](DEPLOYMENT.md)), keep `main` on `ember`
and a `winter` branch with the flag flipped. Cloudflare Pages builds a preview URL for
every branch automatically, so you get both designs live at stable links with no extra
work — and production stays whichever one you point the domain at.

---

## Before you deploy — 3 things to fill in

All three live in [`src/data/site.ts`](src/data/site.ts):

1. **`PROFILE_URLS`** — your real GitHub and LinkedIn URLs. Currently guessed placeholders.
2. **`CONTACT_FORM_KEY`** — free access key from [web3forms.com](https://web3forms.com).
   Until it's set, the contact form gracefully falls back to opening the visitor's email client.
3. **`site`** in [`astro.config.mjs`](astro.config.mjs) — your final domain. Drives canonical
   URLs, the sitemap and Open Graph tags. Also update the `Sitemap:` line in `public/robots.txt`.

---

## Commands

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # static build into dist/
npm run preview  # preview the production build locally
```

## Editing content

Every piece of copy lives in `src/data/site.ts` — nothing is hardcoded in components.
Add a job, a project, or a skill group there and the page picks it up.

To replace the résumé PDF, drop the new file at `public/Ankit-Saklani-Resume.pdf`
(keep the filename, or update `person.resumePath`).

To regenerate the social share image after a copy change, edit and re-render
the OG card — the source HTML used to produce `public/og.png` is a standalone
1200×630 page; any HTML-to-PNG step works.

## Project structure

```
src/
  data/site.ts        all content — the single source of truth
  layouts/Base.astro  <head>, meta tags, JSON-LD, no-flash theme script
  components/         one file per section
  scripts/main.ts     theme, nav, reveals, timeline, form, diagram
  styles/global.css   design tokens, theme variables, component classes
public/               résumé PDF, favicon, OG image, robots.txt
```

## Design & accessibility notes

- **Theme** — dark by default, follows `prefers-color-scheme` on first visit, and
  remembers the visitor's choice in `localStorage`. Applied before first paint, so no flash.
- **Motion** — everything respects `prefers-reduced-motion`: reveals become instant,
  tilt is disabled, and the diagram's flow animation and floating shards are removed.
- **3D** — pure CSS `transform-style: preserve-3d` with per-element `perspective()`.
  Tilt is gated on `(hover: hover)`, so touch devices get the static layout.
  Note that `.reveal-3d` and `.tilt` must stay on **separate elements** — both
  animate `transform`, and the reveal rule wins if they share one.
- **Contrast** — the ember accent is a bright mid-tone, so filled buttons use the
  `--on-accent` token (dark ink on ember) rather than white, which only reaches 2.8:1.
- **No-JS** — all content is server-rendered and visible without JavaScript.
  A safety net also reveals everything if the IntersectionObserver never fires.
- **Semantics** — one `<h1>`, landmark regions, a skip link, visible focus rings,
  `aria-live` on the contact form status and the diagram caption.
- **Contrast** — body and muted text meet WCAG AA against both backgrounds.
