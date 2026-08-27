// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://reyna.example.com', // PLACEHOLDER — swap for the real domain
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
  image: {
    // Portrait-heavy source material (~78%); widths cover 1-col phone
    // through 3-col desktop at 2x.
    responsiveStyles: false,
  },
});
