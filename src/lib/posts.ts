import { getCollection } from 'astro:content';

/**
 * Returns blog posts, excluding drafts in production builds.
 * Drafts remain visible in `astro dev` for previewing.
 */
export function getPublishedPosts() {
	return getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
}
