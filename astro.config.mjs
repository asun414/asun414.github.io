import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
export default defineConfig({ site: 'https://hongliangsun.github.io', integrations: [mdx(), sitemap()] });
