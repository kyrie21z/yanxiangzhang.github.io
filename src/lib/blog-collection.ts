import { getCollection, type CollectionEntry } from 'astro:content';
import { createNoteCatalog, type NoteCatalog } from './note-catalog.mjs';

export type BlogEntry = CollectionEntry<'blog'>;

export async function loadNoteCatalog(): Promise<NoteCatalog<BlogEntry>> {
	const entries = await getCollection('blog');
	return createNoteCatalog(entries);
}
