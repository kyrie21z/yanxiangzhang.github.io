// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkCallouts from './src/plugins/remark-callouts.mjs';
import remarkHighlights from './src/plugins/remark-highlights.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://yanxiangzhang.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark-dimmed',
			},
			defaultColor: false,
		},
		remarkPlugins: [remarkMath, remarkCallouts, remarkHighlights],
		rehypePlugins: [rehypeKatex],
	},
	devToolbar: {
		enabled: false,
	},
});
