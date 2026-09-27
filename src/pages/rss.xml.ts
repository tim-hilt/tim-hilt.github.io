// The feed's URL is this file's route; keep `RSS_URL` in consts.ts in sync.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedPosts, postUrl } from '../lib/posts';

/**
 * Makes root-relative `href`/`src` URLs (`/path`) absolute against `site` so
 * they resolve inside feed readers. Protocol-relative (`//host`) and already
 * absolute URLs are left untouched.
 */
function absolutizeUrls(html: string, site: URL): string {
	return html.replace(/(\s(?:href|src)=")(\/[^/"][^"]*|\/)"/g, (_, attr, path) => {
		return `${attr}${new URL(path, site).href}"`;
	});
}

export async function GET(context: APIContext) {
	// `site` is always set in astro.config.mjs.
	const site = context.site!;
	const posts = await getPublishedPosts();
	const container = await AstroContainer.create();

	const items = await Promise.all(
		posts.map(async (post) => {
			// Render the full post body so feed readers can show the entire article.
			const { Content } = await render(post);
			const html = await container.renderToString(Content);
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: postUrl(post),
				content: absolutizeUrls(html, site),
			};
		}),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site,
		items,
	});
}
