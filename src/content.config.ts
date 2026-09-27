import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Each file's path relative to `base`, minus the extension, becomes the post id and URL slug.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Frontmatter dates are strings like `2025-01-31`.
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// Drafts are visible in dev but excluded from production builds (see lib/posts.ts).
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
