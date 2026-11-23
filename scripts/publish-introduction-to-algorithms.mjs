import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishObsidianNotes } from './lib/obsidian-publisher.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..');
const ROOT_NOTE = 'Introduction to Algorithms 算法导论';
const CATEGORY = 'CS-Major-Courses/Introduction-To-Algorithms';

function resolveVaultDir(argv) {
	const flagIndex = argv.indexOf('--vault');
	if (flagIndex !== -1 && argv[flagIndex + 1]) return argv[flagIndex + 1];
	return process.env.OBSIDIAN_VAULT || '';
}

function main() {
	const vaultDir = resolveVaultDir(process.argv.slice(2));
	if (!vaultDir) {
		console.error(
			'OBSIDIAN_VAULT is required. Set OBSIDIAN_VAULT=/path/to/vault or pass --vault <path>.',
		);
		process.exit(1);
	}

	const result = publishObsidianNotes({
		mode: 'root-graph',
		vaultDir,
		blogDir: join(ROOT, 'src/content/blog'),
		assetsDir: join(ROOT, 'src/assets'),
		rootNote: ROOT_NOTE,
		category: CATEGORY,
		logger: (line) => console.log(line),
	});

	for (const note of result.missingNotes) console.warn(`  [missing note] ${note}`);
	for (const image of result.missingImages) console.warn(`  [missing image] ${image}`);

	console.log(`\nPublished ${result.published} notes to ${CATEGORY}.`);
}

main();
