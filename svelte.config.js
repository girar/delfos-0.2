// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // use the official vitePreprocess from the plugin
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),

    alias: {
      // allow $lib/… to resolve to src/lib/…
      $lib: path.resolve('src/lib'),
      // add more aliases here if you need them (e.g. $assets, etc.)
    }
  }
};

export default config;
