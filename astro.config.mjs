// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://tim-hilt.github.io',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			themes: { light: 'everforest-light', dark: 'everforest-dark' },
			// Emit light-dark() so code blocks follow the page's color-scheme.
			defaultColor: 'light-dark()',
		},
	},
});
