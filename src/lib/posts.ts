import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * Returns blog posts newest first. Drafts are included in `astro dev` for
 * previewing but excluded from production builds.
 */
export async function getPublishedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * Root-relative URL of a post's page, with trailing slash.
 * Must match the route in `src/pages/blog/[...slug].astro`.
 */
export function postUrl(post: Post): string {
	return `/blog/${post.id}/`;
}
