import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			return {
				...post.data,
				link: `/blog/${post.id}/`,
			};
		})
	);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
