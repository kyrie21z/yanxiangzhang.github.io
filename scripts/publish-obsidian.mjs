import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishObsidianNotes } from './lib/obsidian-publisher.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..');

const DEFAULT_SKIP_FILES = [
	'Desktop Application Develop 桌面应用开发.md',
	'Introduction to Algorithms 算法导论.md',
	'Python and Data Science Python 与数据科学.md',
	'Marxist Philosophy 马克思主义哲学.md',
	'Numpy.md',
	'Pandas.md',
	'Scipy.md',
	'Pickle.md',
	'AAA ProCourse.md',
	'ndarray 多维数组.md',
	'ufunc 普遍函数.md',
	'numpy文件数据存取.md',
];

function readArg(argv, flag) {
	const index = argv.indexOf(flag);
	return index !== -1 ? argv[index + 1] : null;
}

function loadCategoryConfig(configPath) {
	if (!configPath || !existsSync(configPath)) {
		console.error(
			'Category config is required to prevent unintended skips or deletions.\n' +
				'Pass --config <path-to-json> with { "categories": { "<Note.md>": "<Category>" }, "managedCategories": ["<Category>"] }.',
		);
		process.exit(1);
	}

	const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
	const categories = parsed?.categories && typeof parsed.categories === 'object' ? parsed.categories : {};
	const managedCategories = Array.isArray(parsed?.managedCategories) ? parsed.managedCategories : [];
	if (Object.keys(categories).length === 0) {
		console.error('Category config must map at least one note filename to a target category.');
		process.exit(1);
	}
	return { categories, managedCategories };
}

function main() {
	const argv = process.argv.slice(2);
	const vaultDir = readArg(argv, '--vault') || process.env.OBSIDIAN_VAULT || join(ROOT, 'Obsidian Vault');
	const configPath = readArg(argv, '--config') || process.env.OBSIDIAN_PUBLISH_CONFIG;
	const { categories, managedCategories } = loadCategoryConfig(configPath);

	const result = publishObsidianNotes({
		mode: 'category-map',
		vaultDir,
		blogDir: join(ROOT, 'src/content/blog'),
		assetsDir: join(ROOT, 'src/assets'),
		manifestPath: join(ROOT, 'scripts/.publish-manifest.json'),
		resolveCategory: (filename) => categories[filename] || null,
		skipFiles: DEFAULT_SKIP_FILES,
		managedCategories,
		convertLegacyLatex: true,
		dryRun: argv.includes('--dry-run'),
		logger: (line) => console.log(line),
	});

	console.log(
		`\nPublished: ${result.published} | Unchanged: ${result.unchanged} | Skipped: ${result.skipped} | Cleaned: ${result.cleaned}`,
	);
}

main();
