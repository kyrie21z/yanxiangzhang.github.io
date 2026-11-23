import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { publishObsidianNotes } from '../scripts/lib/obsidian-publisher.mjs';

function createFixtureWorkspace() {
	const root = mkdtempSync(join(tmpdir(), 'obsidian-publisher-test-'));
	const vaultDir = join(root, 'vault');
	const blogDir = join(root, 'blog');
	const assetsDir = join(root, 'assets');
	mkdirSync(join(vaultDir, 'images'), { recursive: true });
	mkdirSync(blogDir, { recursive: true });
	mkdirSync(assetsDir, { recursive: true });
	return {
		root,
		vaultDir,
		blogDir,
		assetsDir,
		cleanup: () => rmSync(root, { recursive: true, force: true }),
	};
}

describe('publishObsidianNotes', () => {
	it('publishes a root-graph course cluster with headings, aliases, images, and safe YAML', () => {
		const fx = createFixtureWorkspace();
		try {
			writeFileSync(
				join(fx.vaultDir, 'Course Root.md'),
				[
					'---',
					'title: "Intro: Algorithms & Complexity"',
					'created: 2026-10-10',
					'---',
					'See [[Merge Sort#Recurrence|Merge Recurrence]], [[#Overview]], and [[Unpublished Note]].',
					'![[merge chart.png|480]]',
				].join('\n'),
			);
			writeFileSync(
				join(fx.vaultDir, 'Merge Sort.md'),
				'Divide and conquer sorting algorithm with O(n log n) time complexity.\n',
			);
			writeFileSync(join(fx.vaultDir, 'images', 'merge chart.png'), 'png-bytes');

			const result = publishObsidianNotes({
				mode: 'root-graph',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				rootNote: 'Course Root',
				category: 'CS-Major-Courses/Introduction-To-Algorithms',
			});

			assert.equal(result.published, 2);
			assert.equal(result.copiedImages, 1);
			assert.deepEqual(result.missingNotes, ['Unpublished Note']);
			assert.deepEqual(result.missingImages, []);

			const publishedRoot = readFileSync(
				join(fx.blogDir, 'CS-Major-Courses/Introduction-To-Algorithms/Course Root.md'),
				'utf8',
			);
			assert.match(publishedRoot, /title: "Intro: Algorithms & Complexity"/);
			assert.match(publishedRoot, /pubDate: "2026-10-10"/);
			assert.match(
				publishedRoot,
				/\[Merge Recurrence\]\(\/blog\/cs-major-courses\/introduction-to-algorithms\/merge-sort\/#recurrence\)/,
			);
			assert.match(publishedRoot, /\[Overview\]\(#overview\)/);
			assert.match(publishedRoot, /and Unpublished Note\./);
			assert.match(publishedRoot, /!\[merge-chart\.png\]\(\.\.\/\.\.\/\.\.\/\.\.\/assets\/merge-chart\.png\)/);
			assert.equal(existsSync(join(fx.assetsDir, 'merge-chart.png')), true);
		} finally {
			fx.cleanup();
		}
	});

	it('deduplicates hash variants, tracks incremental manifest, and cleans ONLY managed categories', () => {
		const fx = createFixtureWorkspace();
		try {
			const unmanagedPath = join(fx.blogDir, 'Research-Notes', 'keep-me.md');
			const staleManagedPath = join(fx.blogDir, 'Personal-Insights', 'stale.md');
			mkdirSync(join(fx.blogDir, 'Research-Notes'), { recursive: true });
			mkdirSync(join(fx.blogDir, 'Personal-Insights'), { recursive: true });
			writeFileSync(unmanagedPath, '---\ntitle: "Keep"\n---\nImportant research note.\n');
			writeFileSync(staleManagedPath, '---\ntitle: "Stale"\n---\nOld synced note.\n');

			writeFileSync(join(fx.vaultDir, 'Deep Note.md'), '[[Other]]');
			writeFileSync(
				join(fx.vaultDir, 'Deep Note-a1b2c3d4e5f6.md'),
				'A full note with enough real content to exceed the eighty-character threshold and test (\\alpha + 1) conversion cleanly.',
			);

			const manifestPath = join(fx.root, '.publish-manifest.json');
			const options = {
				mode: 'category-map',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				manifestPath,
				resolveCategory: (filename) =>
					filename === 'Deep Note.md' ? 'Personal-Insights' : null,
				managedCategories: ['Personal-Insights'],
				convertLegacyLatex: true,
			};

			const first = publishObsidianNotes(options);
			assert.equal(first.published, 1);
			assert.equal(first.cleaned, 1);
			assert.equal(existsSync(unmanagedPath), true);
			assert.equal(existsSync(staleManagedPath), false);

			const rendered = readFileSync(join(fx.blogDir, 'Personal-Insights/Deep Note.md'), 'utf8');
			assert.match(rendered, /\$\\alpha \+ 1\$/);

			const second = publishObsidianNotes(options);
			assert.equal(second.published, 0);
			assert.equal(second.unchanged, 1);
			assert.equal(second.cleaned, 0);
		} finally {
			fx.cleanup();
		}
	});

	it('never deletes any existing blog notes when managedCategories is empty', () => {
		const fx = createFixtureWorkspace();
		try {
			const existing = join(fx.blogDir, 'Research-Notes', 'paper.md');
			mkdirSync(join(fx.blogDir, 'Research-Notes'), { recursive: true });
			writeFileSync(existing, '---\ntitle: "Paper"\n---\nContent.\n');
			writeFileSync(join(fx.vaultDir, 'Unmapped.md'), 'Long enough content '.repeat(10));

			const result = publishObsidianNotes({
				mode: 'category-map',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				resolveCategory: () => null,
				managedCategories: [],
			});

			assert.equal(result.published, 0);
			assert.equal(result.cleaned, 0);
			assert.equal(existsSync(existing), true);
		} finally {
			fx.cleanup();
		}
	});
});
