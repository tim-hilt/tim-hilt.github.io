import { getPublishedPosts } from '../lib/posts';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

/** Make root-relative `href`/`src` URLs absolute so they work inside feed readers. */
function absolutizeUrls(html, site) {
	return html.replace(/(\s(?:href|src)=")(\/[^/"][^"]*|\/)"/g, (_, attr, path) => {
		return `${attr}${new URL(path, site).href}"`;
	});
}

export async function GET(context) {
	const posts = await getPublishedPosts();
	const container = await AstroContainer.create();

	const items = await Promise.all(
		posts.map(async (post) => {
			// Render the full post body so feed readers can show the entire article.
			const { Content } = await render(post);
			const html = await container.renderToString(Content);
			return {
				...post.data,
				link: `/blog/${post.id}/`,
				content: absolutizeUrls(html, context.site),
			};
		}),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
