// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` drives canonical URLs, sitemap and OG tags — update after the domain is live.
export default defineConfig({
  site: 'https://ankitsaklani.dev',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
