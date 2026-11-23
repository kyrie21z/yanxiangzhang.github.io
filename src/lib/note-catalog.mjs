const ACRONYMS = new Set(['cs', 'ai', 'ml']);
const MINOR_WORDS = new Set(['to', 'of', 'and']);

const EXAMPLE_NOTE_IDS = new Set([
	'paper-sharing/example-paper-sharing',
	'personal-insights/example-personal-insights',
]);

const HOME_EXCLUDED_CATEGORIES = new Set(['cs-major-courses']);

const SUBCATEGORY_DISCLOSURES = {
	'cs-major-courses/introduction-to-algorithms': 'Mostly AI generated, but well organized.',
};

const UTC_DATE_OPTIONS = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC',
};

export function formatUtcDate(date) {
	const value = date instanceof Date ? date : new Date(date);
	return value.toLocaleDateString('en-us', UTC_DATE_OPTIONS);
}

export function serializeForScript(value) {
	return JSON.stringify(value)
		.replace(/</g, '\\u003c')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

export function formatTaxonomyLabel(segment) {
	if (!segment) return '';
	return segment
		.split('-')
		.filter(Boolean)
		.map((rawPart, index) => {
			const lower = rawPart.toLowerCase();
			if (ACRONYMS.has(lower)) return lower.toUpperCase();
			if (index > 0 && MINOR_WORDS.has(lower)) return lower;
			return lower[0].toUpperCase() + lower.slice(1);
		})
		.join(' ');
}

function compareDisplayOrder(a, b) {
	return (
		Number(Boolean(b.data.pinned)) - Number(Boolean(a.data.pinned)) ||
		b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
		a.data.title.localeCompare(b.data.title)
	);
}

function compareChronological(a, b) {
	return (
		b.data.pubDate.valueOf() - a.data.pubDate.valueOf() ||
		a.data.title.localeCompare(b.data.title)
	);
}

function enrichNote(entry) {
	const parts = entry.id.split('/');
	const category = parts[0] || '';
	const subcategory = parts.length > 2 ? parts[1] : null;
	const directoryParts = parts.slice(0, -1);
	const directoryPath = directoryParts.join('/');
	const categoryLabel = formatTaxonomyLabel(category);
	const subcategoryLabel = subcategory ? formatTaxonomyLabel(subcategory) : null;

	return {
		entry,
		id: entry.id,
		data: entry.data,
		url: `/blog/${entry.id}/`,
		category,
		categoryLabel,
		subcategory,
		subcategoryLabel,
		directoryParts,
		directoryPath,
		categoryTrail: directoryParts.map(formatTaxonomyLabel).join(' / '),
		formattedDate: formatUtcDate(entry.data.pubDate),
		isExample: EXAMPLE_NOTE_IDS.has(entry.id),
	};
}

export function createNoteCatalog(entries) {
	const notes = entries.map(enrichNote);
	const notesById = new Map(notes.map((note) => [note.id, note]));

	const categoryGroups = new Map();
	for (const note of notes) {
		if (!categoryGroups.has(note.category)) categoryGroups.set(note.category, []);
		categoryGroups.get(note.category).push(note);
	}

	const sortedCategoryEntries = Array.from(categoryGroups.entries()).sort((a, b) =>
		a[0].localeCompare(b[0]),
	);

	return {
		allNotes() {
			return [...notes].sort(compareDisplayOrder);
		},

		homeFeed(limit = 5) {
			const visible = notes
				.filter((note) => !note.isExample && !HOME_EXCLUDED_CATEGORIES.has(note.category))
				.sort(compareDisplayOrder)
				.slice(0, limit);
			const featured = visible.find((note) => note.category === 'research-notes') || visible[0] || null;
			const remaining = featured ? visible.filter((note) => note.id !== featured.id) : [];
			return { featured, remaining };
		},

		topCategories() {
			return sortedCategoryEntries.map(([slug, group]) => ({
				slug,
				label: formatTaxonomyLabel(slug),
				count: group.length,
				url: `/blog/${slug}/`,
			}));
		},

		categoryPages() {
			return sortedCategoryEntries.map(([slug, group]) => {
				const subGroups = new Map();
				const directPosts = [];

				for (const note of group) {
					if (note.subcategory) {
						if (!subGroups.has(note.subcategory)) subGroups.set(note.subcategory, []);
						subGroups.get(note.subcategory).push(note);
					} else {
						directPosts.push(note);
					}
				}

				const subCategories = Array.from(subGroups.entries())
					.map(([subSlug, subNotes]) => ({
						slug: subSlug,
						label: formatTaxonomyLabel(subSlug),
						count: subNotes.length,
						url: `/blog/${slug}/${subSlug}/`,
					}))
					.sort((a, b) => a.slug.localeCompare(b.slug));

				return {
					slug,
					label: formatTaxonomyLabel(slug),
					url: `/blog/${slug}/`,
					subCategories,
					directPosts: directPosts.sort(compareDisplayOrder),
				};
			});
		},

		subcategoryPages() {
			const subMap = new Map();
			for (const note of notes) {
				if (!note.subcategory) continue;
				const key = `${note.category}/${note.subcategory}`;
				if (!subMap.has(key)) subMap.set(key, []);
				subMap.get(key).push(note);
			}

			return Array.from(subMap.entries())
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([key, subNotes]) => {
					const [category, subcategory] = key.split('/');
					return {
						category,
						categoryLabel: formatTaxonomyLabel(category),
						categoryUrl: `/blog/${category}/`,
						subcategory,
						subcategoryLabel: formatTaxonomyLabel(subcategory),
						url: `/blog/${category}/${subcategory}/`,
						disclosure: SUBCATEGORY_DISCLOSURES[key] || null,
						posts: subNotes.sort(compareDisplayOrder),
					};
				});
		},

		directoryContext(noteId) {
			const current = notesById.get(noteId);
			const directoryParts = current ? current.directoryParts : [];
			const directoryPath = current ? current.directoryPath : '';
			const lastSegment = directoryParts.at(-1);
			const posts = notes
				.filter((note) => note.directoryPath === directoryPath)
				.sort(compareDisplayOrder);

			return {
				currentId: noteId,
				directoryPath,
				directoryLabel: lastSegment ? formatTaxonomyLabel(lastSegment) : 'Blog',
				directoryUrl: directoryPath ? `/blog/${directoryPath}/` : '/blog/',
				posts,
			};
		},

		searchIndex() {
			return [...notes].sort(compareDisplayOrder).map((note) => ({
				title: note.data.title,
				description: note.data.description || '',
				url: note.url,
				date: note.data.pubDate.toISOString(),
				formattedDate: note.formattedDate,
				category: note.categoryTrail,
				categorySlug: note.directoryPath,
				pinned: Boolean(note.data.pinned),
			}));
		},

		rssItems() {
			return notes
				.filter((note) => !note.isExample)
				.sort(compareChronological)
				.map((note) => ({
					...note.data,
					link: note.url,
				}));
		},
	};
}
