// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  base: '/wiki',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [react(), tailwind({
    applyBaseStyles: false
  }), db()],
  server: {
    port: 4321,
    host: true
  }
});