import assert from 'node:assert/strict';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
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
	it('publishes a root-graph course cluster with headings, aliases, images, index.md URLs, and YAML parsing', () => {
		const fx = createFixtureWorkspace();
		try {
			writeFileSync(
				join(fx.vaultDir, 'Course Root.md'),
				[
					'---',
					'title: "Intro: \\"Algorithms\\" & Complexity" # title note',
					'created: 2026-10-10 # editorial comment',
					'---',
					'See [[Merge Sort#Recurrence|Merge Recurrence]], [[index|Course Home]], [[#Overview]], and [[Unpublished Note]].',
					'![[merge chart.png|480]]',
				].join('\n'),
			);
			writeFileSync(
				join(fx.vaultDir, 'Merge Sort.md'),
				'Divide and conquer sorting algorithm with O(n log n) time complexity.\n',
			);
			writeFileSync(
				join(fx.vaultDir, 'index.md'),
				'Course overview index page with syllabus links and study guide.\n',
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

			assert.equal(result.published, 3);
			assert.equal(result.copiedImages, 1);
			assert.deepEqual(result.missingNotes, ['Unpublished Note']);
			assert.deepEqual(result.missingImages, []);

			const publishedRoot = readFileSync(
				join(fx.blogDir, 'CS-Major-Courses/Introduction-To-Algorithms/Course Root.md'),
				'utf8',
			);
			assert.match(publishedRoot, /title: "Intro: \\"Algorithms\\" & Complexity"/);
			assert.match(publishedRoot, /pubDate: "2026-10-10"/);
			assert.match(
				publishedRoot,
				/\[Merge Recurrence\]\(\/blog\/cs-major-courses\/introduction-to-algorithms\/merge-sort\/#recurrence\)/,
			);
			assert.match(
				publishedRoot,
				/\[Course Home\]\(\/blog\/cs-major-courses\/introduction-to-algorithms\/\)/,
			);
			assert.match(publishedRoot, /\[Overview\]\(#overview\)/);
			assert.match(publishedRoot, /and Unpublished Note\./);
			assert.match(publishedRoot, /!\[merge-chart\.png\]\(\.\.\/\.\.\/\.\.\/\.\.\/assets\/merge-chart\.png\)/);
			assert.equal(existsSync(join(fx.assetsDir, 'merge-chart.png')), true);
		} finally {
			fx.cleanup();
		}
	});

	it('deduplicates hash variants, tracks manifest ownership, preserves manual notes, and cleans only owned stale notes', () => {
		const fx = createFixtureWorkspace();
		try {
			const unmanagedPath = join(fx.blogDir, 'Research-Notes', 'keep-me.md');
			const manualManagedPath = join(fx.blogDir, 'Personal-Insights', 'hand-written.md');
			mkdirSync(join(fx.blogDir, 'Research-Notes'), { recursive: true });
			mkdirSync(join(fx.blogDir, 'Personal-Insights'), { recursive: true });
			writeFileSync(unmanagedPath, '---\ntitle: "Keep"\n---\nImportant research note.\n');
			writeFileSync(manualManagedPath, '---\ntitle: "Manual"\n---\nHand authored note.\n');

			writeFileSync(join(fx.vaultDir, 'Deep Note.md'), '[[Other]]');
			writeFileSync(
				join(fx.vaultDir, 'Deep Note-a1b2c3d4e5f6.md'),
				'A full note with enough real content to exceed the eighty-character threshold and test (\\alpha + 1) conversion cleanly.',
			);
			writeFileSync(
				join(fx.vaultDir, 'Old Synced.md'),
				'A previously synced note with plenty of content to pass the eighty-character threshold cleanly for testing cleanup.',
			);

			const manifestPath = join(fx.root, '.publish-manifest.json');
			const baseOptions = {
				mode: 'category-map',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				manifestPath,
				resolveCategory: (filename) =>
					filename === 'Deep Note.md' || filename === 'Old Synced.md' ? 'Personal-Insights' : null,
				managedCategories: ['Personal-Insights'],
				convertLegacyLatex: true,
			};

			const first = publishObsidianNotes(baseOptions);
			assert.equal(first.published, 2);
			assert.equal(first.cleaned, 0);

			const rendered = readFileSync(join(fx.blogDir, 'Personal-Insights/Deep Note.md'), 'utf8');
			assert.match(rendered, /\$\\alpha \+ 1\$/);

			// Second run unchanged
			const second = publishObsidianNotes(baseOptions);
			assert.equal(second.published, 0);
			assert.equal(second.unchanged, 2);
			assert.equal(second.cleaned, 0);

			// Remove Old Synced from vault: owned stale file is cleaned, manual & unmanaged files stay intact
			rmSync(join(fx.vaultDir, 'Old Synced.md'));
			const third = publishObsidianNotes(baseOptions);
			assert.equal(third.published, 0);
			assert.equal(third.unchanged, 1);
			assert.equal(third.cleaned, 1);
			assert.equal(existsSync(join(fx.blogDir, 'Personal-Insights/Old Synced.md')), false);
			assert.equal(existsSync(manualManagedPath), true);
			assert.equal(existsSync(unmanagedPath), true);
		} finally {
			fx.cleanup();
		}
	});

	it('invalidates cached note A when linked note B moves to a different category', () => {
		const fx = createFixtureWorkspace();
		try {
			const manifestPath = join(fx.root, '.publish-manifest.json');
			writeFileSync(
				join(fx.vaultDir, 'Note A.md'),
				'Note A discusses architecture and explicitly references [[Note B]] with plenty of text to exceed eighty characters.',
			);
			writeFileSync(
				join(fx.vaultDir, 'Note B.md'),
				'Note B is the linked target note with enough substantive content to pass the minimum length threshold easily.',
			);

			const first = publishObsidianNotes({
				mode: 'category-map',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				manifestPath,
				resolveCategory: (name) => (name === 'Note A.md' ? 'Cat-One' : 'Cat-One'),
				managedCategories: ['Cat-One', 'Cat-Two'],
			});
			assert.equal(first.published, 2);
			assert.match(
				readFileSync(join(fx.blogDir, 'Cat-One/Note A.md'), 'utf8'),
				/\[Note B\]\(\/blog\/cat-one\/note-b\/\)/,
			);

			const second = publishObsidianNotes({
				mode: 'category-map',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				manifestPath,
				resolveCategory: (name) => (name === 'Note A.md' ? 'Cat-One' : 'Cat-Two'),
				managedCategories: ['Cat-One', 'Cat-Two'],
			});
			assert.equal(second.published, 2);
			assert.equal(second.unchanged, 0);
			assert.equal(second.cleaned, 1);
			assert.match(
				readFileSync(join(fx.blogDir, 'Cat-One/Note A.md'), 'utf8'),
				/\[Note B\]\(\/blog\/cat-two\/note-b\/\)/,
			);
		} finally {
			fx.cleanup();
		}
	});

	it('disambiguates images from different subdirectories instead of silently overwriting', () => {
		const fx = createFixtureWorkspace();
		try {
			mkdirSync(join(fx.vaultDir, 'alpha'), { recursive: true });
			mkdirSync(join(fx.vaultDir, 'beta'), { recursive: true });
			writeFileSync(join(fx.vaultDir, 'alpha', 'chart.png'), 'alpha-bytes');
			writeFileSync(join(fx.vaultDir, 'beta', 'chart.png'), 'beta-bytes');
			writeFileSync(
				join(fx.vaultDir, 'Compare.md'),
				'Comparing ![[alpha/chart.png]] and ![[beta/chart.png]] with enough text to pass content checks cleanly.',
			);

			const result = publishObsidianNotes({
				mode: 'root-graph',
				vaultDir: fx.vaultDir,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				rootNote: 'Compare',
				category: 'Research-Notes',
			});

			assert.equal(result.copiedImages, 2);
			assert.equal(readFileSync(join(fx.assetsDir, 'alpha-chart.png'), 'utf8'), 'alpha-bytes');
			assert.equal(readFileSync(join(fx.assetsDir, 'beta-chart.png'), 'utf8'), 'beta-bytes');
		} finally {
			fx.cleanup();
		}
	});

	it('refuses symlinked managed categories escaping blogDir and never cleans on an empty vault', () => {
		const fx = createFixtureWorkspace();
		try {
			const outsideDir = join(fx.root, 'outside');
			mkdirSync(outsideDir, { recursive: true });
			writeFileSync(join(outsideDir, 'keep.md'), 'Outside file must never be touched.');
			symlinkSync(outsideDir, join(fx.blogDir, 'Escaped'));

			writeFileSync(
				join(fx.vaultDir, 'Valid.md'),
				'Valid note with plenty of content so that collection succeeds before cleanup validation runs.',
			);

			assert.throws(
				() =>
					publishObsidianNotes({
						mode: 'category-map',
						vaultDir: fx.vaultDir,
						blogDir: fx.blogDir,
						assetsDir: fx.assetsDir,
						resolveCategory: () => 'Personal-Insights',
						managedCategories: ['Escaped'],
						dryRun: true,
					}),
				/symlinked managed category|outside root/i,
			);
			assert.equal(existsSync(join(outsideDir, 'keep.md')), true);

			// Empty vault must never clean existing published notes even when tracked in manifest
			const emptyVault = join(fx.root, 'empty-vault');
			mkdirSync(emptyVault, { recursive: true });
			const existing = join(fx.blogDir, 'Personal-Insights', 'existing.md');
			mkdirSync(join(fx.blogDir, 'Personal-Insights'), { recursive: true });
			writeFileSync(existing, '---\ntitle: "Existing"\n---\nMust stay.\n');
			const manifestPath = join(fx.root, '.empty-manifest.json');
			writeFileSync(
				manifestPath,
				JSON.stringify({ files: { 'Personal-Insights/existing.md': 'abc' }, images: {} }),
			);

			const emptyResult = publishObsidianNotes({
				mode: 'category-map',
				vaultDir: emptyVault,
				blogDir: fx.blogDir,
				assetsDir: fx.assetsDir,
				manifestPath,
				resolveCategory: () => 'Personal-Insights',
				managedCategories: ['Personal-Insights'],
			});
			assert.equal(emptyResult.published, 0);
			assert.equal(emptyResult.cleaned, 0);
			assert.equal(existsSync(existing), true);
		} finally {
			fx.cleanup();
		}
	});
});
