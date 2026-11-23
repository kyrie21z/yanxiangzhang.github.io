import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	createNoteCatalog,
	formatTaxonomyLabel,
	formatUtcDate,
	serializeForScript,
} from '../src/lib/note-catalog.mjs';

function makeEntry(id, { title, description = '', pubDate, pinned = false }) {
	return {
		id,
		data: {
			title,
			description,
			pubDate: new Date(`${pubDate}T00:00:00.000Z`),
			pinned,
		},
	};
}

const FIXTURE_ENTRIES = [
	makeEntry('research-notes/mae-scaling', {
		title: 'MAE Scaling',
		description: 'Domain alignment note',
		pubDate: '2026-11-01',
	}),
	makeEntry('personal-insights/swe-first-principles', {
		title: 'First Principles',
		description: 'Engineering reflection',
		pubDate: '2026-11-10',
	}),
	makeEntry('personal-insights/pinned-talk', {
		title: 'Agent Memory Talk',
		description: 'Talk slides and replay',
		pubDate: '2026-10-20',
		pinned: true,
	}),
	makeEntry('personal-insights/example-personal-insights', {
		title: 'Example Personal Insight',
		description: 'Placeholder template',
		pubDate: '2026-11-15',
	}),
	makeEntry('paper-sharing/example-paper-sharing', {
		title: 'Example Paper',
		description: 'Placeholder paper',
		pubDate: '2026-11-14',
	}),
	makeEntry('cs-major-courses/introduction-to-algorithms/merge-sort', {
		title: 'Merge Sort',
		description: 'Divide and conquer',
		pubDate: '2026-09-10',
	}),
	makeEntry('cs-major-courses/introduction-to-algorithms/quick-sort', {
		title: 'Quick Sort',
		description: 'Partition sort',
		pubDate: '2026-09-10',
	}),
	makeEntry('cs-major-courses/game-development/ai-games', {
		title: 'AI Games',
		description: 'Game research',
		pubDate: '2026-11-12',
	}),
];

describe('formatTaxonomyLabel', () => {
	it('uppercases known acronyms and preserves minor words after the first token', () => {
		assert.equal(formatTaxonomyLabel('cs-major-courses'), 'CS Major Courses');
		assert.equal(formatTaxonomyLabel('introduction-to-algorithms'), 'Introduction to Algorithms');
		assert.equal(formatTaxonomyLabel('research-notes'), 'Research Notes');
		assert.equal(formatTaxonomyLabel('ai-and-ml-notes'), 'AI and ML Notes');
		assert.equal(formatTaxonomyLabel('to-be-sorted'), 'To Be Sorted');
	});
});

describe('formatUtcDate', () => {
	it('formats date-only timestamps in UTC without local-timezone day drift', () => {
		assert.equal(formatUtcDate(new Date('2026-11-05T00:00:00.000Z')), 'Nov 5, 2026');
		assert.equal(formatUtcDate('2026-01-01T00:00:00.000Z'), 'Jan 1, 2026');
	});
});

describe('createNoteCatalog', () => {
	const catalog = createNoteCatalog(FIXTURE_ENTRIES);

	it('builds the home feed excluding course notes and examples, featuring research notes first', () => {
		const { featured, remaining } = catalog.homeFeed();
		assert.equal(featured?.id, 'research-notes/mae-scaling');
		assert.equal(featured?.categoryLabel, 'Research Notes');
		assert.deepEqual(
			remaining.map((note) => note.id),
			['personal-insights/pinned-talk', 'personal-insights/swe-first-principles'],
		);
	});

	it('builds top-level categories with formatted labels and archive counts', () => {
		assert.deepEqual(catalog.topCategories(), [
			{
				slug: 'cs-major-courses',
				label: 'CS Major Courses',
				count: 3,
				url: '/blog/cs-major-courses/',
			},
			{
				slug: 'paper-sharing',
				label: 'Paper Sharing',
				count: 1,
				url: '/blog/paper-sharing/',
			},
			{
				slug: 'personal-insights',
				label: 'Personal Insights',
				count: 3,
				url: '/blog/personal-insights/',
			},
			{
				slug: 'research-notes',
				label: 'Research Notes',
				count: 1,
				url: '/blog/research-notes/',
			},
		]);
	});

	it('separates subcategories from direct posts on category pages', () => {
		const courses = catalog.categoryPages().find((page) => page.slug === 'cs-major-courses');
		assert.ok(courses);
		assert.equal(courses.directPosts.length, 0);
		assert.deepEqual(courses.subCategories, [
			{
				slug: 'game-development',
				label: 'Game Development',
				count: 1,
				url: '/blog/cs-major-courses/game-development/',
			},
			{
				slug: 'introduction-to-algorithms',
				label: 'Introduction to Algorithms',
				count: 2,
				url: '/blog/cs-major-courses/introduction-to-algorithms/',
			},
		]);
	});

	it('attaches subcategory disclosures and deterministic tie-breaking on equal dates', () => {
		const algo = catalog
			.subcategoryPages()
			.find((page) => page.subcategory === 'introduction-to-algorithms');
		assert.ok(algo);
		assert.equal(algo.categoryLabel, 'CS Major Courses');
		assert.equal(algo.subcategoryLabel, 'Introduction to Algorithms');
		assert.equal(algo.disclosure, 'Mostly AI generated, but well organized.');
		assert.deepEqual(
			algo.posts.map((note) => note.data.title),
			['Merge Sort', 'Quick Sort'],
		);

		const game = catalog.subcategoryPages().find((page) => page.subcategory === 'game-development');
		assert.equal(game?.disclosure, null);
	});

	it('resolves sibling directory context directly from note id without URL parsing', () => {
		const ctx = catalog.directoryContext('cs-major-courses/introduction-to-algorithms/quick-sort');
		assert.equal(ctx.directoryLabel, 'Introduction to Algorithms');
		assert.equal(ctx.directoryUrl, '/blog/cs-major-courses/introduction-to-algorithms/');
		assert.deepEqual(
			ctx.posts.map((note) => note.id),
			[
				'cs-major-courses/introduction-to-algorithms/merge-sort',
				'cs-major-courses/introduction-to-algorithms/quick-sort',
			],
		);
	});

	it('builds search index with formatted category trails, raw category slugs, and pre-formatted UTC dates', () => {
		const index = catalog.searchIndex();
		const algoEntry = index.find(
			(item) => item.url === '/blog/cs-major-courses/introduction-to-algorithms/merge-sort/',
		);
		assert.deepEqual(algoEntry, {
			title: 'Merge Sort',
			description: 'Divide and conquer',
			url: '/blog/cs-major-courses/introduction-to-algorithms/merge-sort/',
			date: '2026-09-10T00:00:00.000Z',
			formattedDate: 'Sep 10, 2026',
			category: 'CS Major Courses / Introduction to Algorithms',
			categorySlug: 'cs-major-courses/introduction-to-algorithms',
			pinned: false,
		});
	});

	it('escapes HTML script-breakout characters when serializing search index JSON', () => {
		const serialized = serializeForScript([
			{ title: '</SCRIPT ><!-- x -->', description: 'a < b' },
		]);
		assert.equal(serialized.includes('<'), false);
		assert.deepEqual(JSON.parse(serialized), [
			{ title: '</SCRIPT ><!-- x -->', description: 'a < b' },
		]);
	});

	it('filters out example notes from RSS and orders strictly newest-first', () => {
		const rss = catalog.rssItems();
		assert.deepEqual(
			rss.map((item) => item.link),
			[
				'/blog/cs-major-courses/game-development/ai-games/',
				'/blog/personal-insights/swe-first-principles/',
				'/blog/research-notes/mae-scaling/',
				'/blog/personal-insights/pinned-talk/',
				'/blog/cs-major-courses/introduction-to-algorithms/merge-sort/',
				'/blog/cs-major-courses/introduction-to-algorithms/quick-sort/',
			],
		);
	});
});
