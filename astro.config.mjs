// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` drives canonical URLs, sitemap and OG tags — update after the domain is live.
export default defineConfig({
  site: 'https://ankitsaklani.dev',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  // The single page's CSS was a render-blocking request on the critical path.
  // Inlining trades a slightly larger HTML payload for one fewer round trip.
  build: { inlineStylesheets: 'always' },
  compressHTML: true,
});
