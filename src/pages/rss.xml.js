import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { loadNoteCatalog } from '../lib/blog-collection';

export async function GET(context) {
	const catalog = await loadNoteCatalog();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: catalog.rssItems(),
	});
}
