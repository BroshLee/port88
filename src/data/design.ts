/**
 * Which visual design the site ships with.
 *
 *   'ember'  — always graphite page, warm ember accent, warm-paper light mode.
 *   'winter' — always polar-night page, ice-cyan accent, snowfall, aurora,
 *              spinning snowflake, snowfield light mode.
 *   'random' — each visitor gets one of the two at random on their first visit,
 *              then keeps it (stored in localStorage) so it never changes
 *              under them on reload.
 *
 * Everything else — content, layout, sections, the light/dark toggle and the
 * shared 3D — is identical across designs.
 *
 * Kept in its own module on purpose: `main.ts` imports it, and importing from
 * `site.ts` would drag every project and job description into the client bundle.
 */
export type Design = 'ember' | 'winter';
export type DesignMode = Design | 'random';

/* `as DesignMode` rather than a type annotation: with a plain annotation
   TypeScript narrows the const to its literal and flags every comparison
   against the other values as impossible. This compiles to the bare string, so
   the bundler can still constant-fold the checks below and drop dead branches. */
export const DESIGN_MODE = 'random' as DesignMode;

/** The design to stamp server-side, or null when the visitor's script decides. */
export const FIXED_DESIGN: Design | null = DESIGN_MODE === 'random' ? null : DESIGN_MODE;

/** Whether winter's markup, styles and snowfall need to be in the build at all. */
export const SHIPS_WINTER: boolean = DESIGN_MODE !== 'ember';

/**
 * Social-card image. Link previews are read from static HTML by crawlers that
 * never run our script, so a random build has to commit to one card.
 */
export const OG_DESIGN: Design = FIXED_DESIGN ?? 'ember';
