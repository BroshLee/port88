# Ankit Saklani — Portfolio

Personal portfolio for Ankit Saklani, Software Developer (backend & distributed systems).

Built with **Astro 5** (static output), **Tailwind CSS 4**, and hand-rolled vanilla JS.
No client framework, no animation library, no WebGL — the whole page ships
**~3 kB of gzipped JS**.

**Theme: winter.** Polar-night dark mode and a snowfield light mode, drifting aurora
bands, canvas snowfall with depth layers, frosted-glass surfaces, and real CSS 3D —
a pointer-steered architecture scene, tilting project cards with content lifted off
the card face, and a spinning three-plane snowflake built from intersecting SVG.

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
- **Motion** — everything respects `prefers-reduced-motion`: snowfall never starts,
  aurora and flow animations stop, tilt is disabled, and reveals become instant.
- **3D** — pure CSS `transform-style: preserve-3d` with per-element `perspective()`.
  Tilt is gated on `(hover: hover)`, so touch devices get the static layout.
  Note that `.reveal-3d` and `.tilt` must stay on **separate elements** — both
  animate `transform`, and the reveal rule wins if they share one.
- **Snowfall** — a single 2D canvas, flake count scaled to viewport area and capped
  at 130, delta-timed so speed is frame-rate independent, paused when the tab is hidden.
- **No-JS** — all content is server-rendered and visible without JavaScript.
  A safety net also reveals everything if the IntersectionObserver never fires.
- **Semantics** — one `<h1>`, landmark regions, a skip link, visible focus rings,
  `aria-live` on the contact form status and the diagram caption.
- **Contrast** — body and muted text meet WCAG AA against both backgrounds.
