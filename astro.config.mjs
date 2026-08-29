// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin, in precedence order:
 *   1. SITE_URL           — set this once rjmnzphoto.com resolves
 *   2. Vercel's own production URL, injected at build
 *   3. rjmnzphoto.com, the domain Reyna is registering
 * Getting this wrong silently ships wrong <link rel="canonical"> and og:url,
 * which is the kind of thing nobody notices until search results are wrong.
 */
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://rjmnzphoto.com');

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  image: {
    // Portrait-heavy source material (~78%); widths cover 1-col phone
    // through 3-col desktop at 2x.
    responsiveStyles: false,
  },
});
