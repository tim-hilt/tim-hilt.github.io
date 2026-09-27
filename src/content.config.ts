import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Each file's path relative to `base`, minus the extension, becomes the post id and URL slug.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Frontmatter dates are strings like `2025-01-31`.
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Drafts are visible in dev but excluded from production builds (see lib/posts.ts).
			draft: z.boolean().default(false),
			// Image shown when the post is shared (LinkedIn, Slack, ...); not rendered on the page.
			// `src` is a path relative to the post file. Omit to use the site default.
			previewImage: z.object({ src: image(), alt: z.string() }).optional(),
		}),
});

export const collections = { blog };
