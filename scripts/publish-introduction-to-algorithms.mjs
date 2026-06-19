import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug } from 'github-slugger';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SCRIPT_DIR, '..');
const VAULT_DIR =
	process.env.OBSIDIAN_VAULT || '/mnt/c/Users/52747/OneDrive/Obsidian/SyncVault';
const ROOT_NOTE = 'Introduction to Algorithms 算法导论';
const CATEGORY = 'CS-Major-Courses/Introduction-To-Algorithms';
const OUTPUT_DIR = join(ROOT, 'src/content/blog', CATEGORY);
const ASSETS_DIR = join(ROOT, 'src/assets');

function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { body: content, metadata: {} };

	const metadata = {};
	for (const line of match[1].split(/\r?\n/)) {
		const field = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/);
		if (field && field[2]) metadata[field[1]] = field[2].replace(/^['"]|['"]$/g, '');
	}
	return { body: content.slice(match[0].length), metadata };
}

function linkedNoteNames(content) {
	const names = new Set();
	for (const match of content.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
		names.add(match[1].trim());
	}
	return names;
}

function noteUrl(name) {
	const categoryPath = CATEGORY.split('/').map((part) => slug(part)).join('/');
	return `/blog/${categoryPath}/${slug(name)}/`;
}

function sanitizeImageName(filename) {
	return basename(filename.trim()).replace(/\s+/g, '-');
}

function copyImage(filename) {
	const cleanName = filename.trim();
	const candidates = [join(VAULT_DIR, cleanName), join(VAULT_DIR, 'images', cleanName)];
	const source = candidates.find(existsSync);
	if (!source) {
		console.warn(`  [missing image] ${cleanName}`);
		return sanitizeImageName(cleanName);
	}

	mkdirSync(ASSETS_DIR, { recursive: true });
	const outputName = sanitizeImageName(cleanName);
	copyFileSync(source, join(ASSETS_DIR, outputName));
	console.log(`  [image] ${cleanName} -> src/assets/${outputName}`);
	return outputName;
}

function transformContent(content, publishedNotes) {
	let result = content.replace(
		/!\[\[([^\]]+\.(?:png|jpe?g|gif|svg|webp))(?:\|[^\]]+)?\]\]/gi,
		(_, filename) => {
			const outputName = copyImage(filename);
			return `![${outputName}](../../../../assets/${outputName})`;
		},
	);

	result = result.replace(/\[\[([^\]]+)\]\]/g, (_, target) => {
		const [rawLink, alias] = target.split('|');
		const [rawName, heading] = rawLink.split('#');
		const name = rawName.trim();
		const label = (alias || heading || name).trim();

		if (!name) {
			const anchor = slug(heading || '');
			return anchor ? `[${label}](#${anchor})` : label;
		}
		if (!publishedNotes.has(name)) return label;

		const anchor = heading ? `#${slug(heading)}` : '';
		return `[${label}](${noteUrl(name)}${anchor})`;
	});

	return result;
}

function descriptionFrom(body, title) {
	const text = body
		.replace(/```[\s\S]*?```/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^>\s*\[![^\]]+\].*$/gm, '')
		.replace(/[*_=`>|-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	return (text || `${title} course note`).slice(0, 157) + (text.length > 157 ? '...' : '');
}

function fileDate(path, metadata) {
	const value = metadata.created || metadata.updated;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return value;
	return statSync(path).mtime.toISOString().slice(0, 10);
}

function main() {
	const rootPath = join(VAULT_DIR, `${ROOT_NOTE}.md`);
	if (!existsSync(rootPath)) throw new Error(`Root note not found: ${rootPath}`);

	const rootContent = readFileSync(rootPath, 'utf8');
	const publishedNotes = new Set([ROOT_NOTE, ...linkedNoteNames(rootContent)]);
	mkdirSync(OUTPUT_DIR, { recursive: true });

	let published = 0;
	for (const name of [...publishedNotes].sort()) {
		const sourcePath = join(VAULT_DIR, `${name}.md`);
		if (!existsSync(sourcePath)) {
			console.warn(`  [missing note] ${name}`);
			continue;
		}

		const source = readFileSync(sourcePath, 'utf8');
		const { body, metadata } = parseFrontmatter(source);
		const title = metadata.title || name;
		const transformed = transformContent(body, publishedNotes);
		const description = descriptionFrom(transformed, title);
		const frontmatter = [
			'---',
			`title: ${JSON.stringify(title)}`,
			`description: ${JSON.stringify(description)}`,
			`pubDate: ${JSON.stringify(fileDate(sourcePath, metadata))}`,
			...(name === ROOT_NOTE ? ['pinned: true'] : []),
			'---',
			'',
		].join('\n');

		writeFileSync(join(OUTPUT_DIR, `${name}.md`), `${frontmatter}${transformed}`, 'utf8');
		console.log(`  [published] ${name}`);
		published++;
	}

	console.log(`\nPublished ${published} notes to ${CATEGORY}.`);
}

main();
