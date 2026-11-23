import { createHash } from 'node:crypto';
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { slug } from 'github-slugger';

const HASH_SUFFIX_RE = /-[0-9a-f]{12}\.md$/i;
const IMAGE_WIKILINK_RE = /!\[\[([^\]]+\.(?:png|jpe?g|gif|svg|webp))(?:\|[^\]]+)?\]\]/gi;
const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;
const LATEX_COMMANDS =
	'text|alpha|beta|gamma|delta|theta|Theta|lambda|sigma|Sigma|pi|Pi|mu|nu|omega|Omega|epsilon|varepsilon|phi|varphi|psi|rho|tau|chi|zeta|eta|kappa|iota|xi|Xi|infty|partial|nabla|sum|prod|int|sqrt|frac|mathbb|mathrm|mathcal|rightarrow|Rightarrow|leftarrow|Leftarrow|leftrightarrow|xrightarrow|ne|neq|le|ge|leq|geq|quad|qquad|cdot|cdots|ldots|bmod|pmod|gcd|log|ln|exp|sin|cos|tan|lim|max|min|sup|inf|det|dim|ker|hom|arg|deg|Pr';
const INLINE_LATEX_RE = new RegExp(`\\(\\\\(${LATEX_COMMANDS})([^)]*)\\)`, 'g');
const BLOCK_LATEX_RE = /^\[ {2}\n(.+)\n\]/gm;

function getBaseFilename(filename) {
	return HASH_SUFFIX_RE.test(filename) ? filename.replace(HASH_SUFFIX_RE, '.md') : filename;
}

function sanitizeImageName(filename) {
	return basename(filename.trim()).replace(/\s+/g, '-');
}

function buildNoteUrl(category, noteName) {
	const categoryPath = category
		.split('/')
		.filter(Boolean)
		.map((part) => slug(part))
		.join('/');
	return `/blog/${categoryPath}/${slug(noteName)}/`;
}

function imageRelativePrefix(category) {
	const depth = category.split('/').filter(Boolean).length;
	return `${'../'.repeat(depth + 2)}assets/`;
}

function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { body: content, metadata: {} };

	const metadata = {};
	for (const line of match[1].split(/\r?\n/)) {
		const field = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/);
		if (field && field[2]) {
			metadata[field[1]] = field[2].replace(/^['"]|['"]$/g, '');
		}
	}
	return { body: content.slice(match[0].length), metadata };
}

function linkedNoteNames(content) {
	const names = new Set();
	for (const match of content.matchAll(/(?<!!)\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
		const name = match[1].trim();
		if (name) names.add(name);
	}
	return names;
}

function hasRealContent(content) {
	const stripped = content
		.replace(/\[\[.*?\]\]/g, '')
		.replace(/^\s*\d+\.\s*$/gm, '')
		.replace(/^\s*-\s*$/gm, '')
		.trim();
	return stripped.length > 80;
}

function extractDescription(body, fallbackTitle, maxLen = 160) {
	const text = body
		.replace(/^---[\s\S]*?---\s*/m, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]+`/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/!\[\[.*?\]\]/g, '')
		.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, note, display) => display || note)
		.replace(/<[^>]+>/g, '')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/^>\s*\[![^\]]+\].*$/gm, '')
		.replace(/[*_=`>|-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	const summary = text || `${fallbackTitle} note`;
	if (summary.length <= maxLen) return summary;
	return `${summary.slice(0, maxLen - 3)}...`;
}

function resolvePublishDate(filepath, metadata) {
	const candidate = metadata.created || metadata.updated;
	if (/^\d{4}-\d{2}-\d{2}$/.test(candidate || '')) return candidate;
	return statSync(filepath).mtime.toISOString().slice(0, 10);
}

function contentHash(filepath) {
	return createHash('md5').update(readFileSync(filepath)).digest('hex');
}

function loadManifest(manifestPath) {
	if (!manifestPath || !existsSync(manifestPath)) return { files: {}, images: {} };
	try {
		const parsed = JSON.parse(readFileSync(manifestPath, 'utf8'));
		return {
			files: parsed?.files && typeof parsed.files === 'object' ? parsed.files : {},
			images: parsed?.images && typeof parsed.images === 'object' ? parsed.images : {},
		};
	} catch {
		return { files: {}, images: {} };
	}
}

function deduplicateVaultFiles(files, vaultDir, skipSet) {
	const groups = new Map();
	for (const file of files) {
		const base = getBaseFilename(file);
		if (!groups.has(base)) groups.set(base, []);
		groups.get(base).push(file);
	}

	const selected = [];
	for (const [base, variants] of groups) {
		if (variants.length === 1) {
			selected.push(variants[0]);
			continue;
		}

		const original = variants.find((name) => name === base);
		const hashed = variants.filter((name) => name !== base).sort();

		if (original) {
			const originalPath = join(vaultDir, original);
			const originalContent = readFileSync(originalPath, 'utf8');
			if (
				!skipSet.has(original) &&
				statSync(originalPath).size >= 50 &&
				hasRealContent(originalContent)
			) {
				selected.push(original);
				continue;
			}
		}

		selected.push(hashed[0] || original);
	}

	return selected.sort();
}

function transformMarkdown(body, { category, noteUrlMap, convertLegacyLatex = false, onImage }) {
	const imgPrefix = imageRelativePrefix(category);

	let result = body.replace(IMAGE_WIKILINK_RE, (_, rawFilename) => {
		const cleanName = rawFilename.trim();
		const sanitized = sanitizeImageName(cleanName);
		onImage?.(cleanName, sanitized);
		return `![${sanitized}](${imgPrefix}${sanitized})`;
	});

	result = result.replace(WIKILINK_RE, (_, target) => {
		const [rawLink, alias] = target.split('|');
		const [rawName, heading] = rawLink.split('#');
		const name = rawName.trim();
		const label = (alias || heading || name).trim();

		if (!name) {
			const anchor = slug(heading || '');
			return anchor ? `[${label}](#${anchor})` : label;
		}

		const url = noteUrlMap.get(name);
		if (!url) return label;

		const anchor = heading ? `#${slug(heading)}` : '';
		return `[${label}](${url}${anchor})`;
	});

	if (convertLegacyLatex) {
		result = result.replace(BLOCK_LATEX_RE, '$$$$\n$1\n$$$$');
		result = result.replace(INLINE_LATEX_RE, (_, cmd, rest) => `$\\${cmd}${rest}$`);
	}

	return result;
}

function serializeFrontmatter({ title, description, pubDate }) {
	return [
		'---',
		`title: ${JSON.stringify(title)}`,
		`description: ${JSON.stringify(description)}`,
		`pubDate: ${JSON.stringify(pubDate)}`,
		'---',
		'',
	].join('\n');
}

function copyReferencedImage(cleanName, sanitized, { vaultDir, assetsDir, manifest, nextManifest, dryRun, log }) {
	const candidates = [join(vaultDir, cleanName), join(vaultDir, 'images', cleanName)];
	const source = candidates.find(existsSync);
	if (!source) return { status: 'missing', sanitized };

	const dest = join(assetsDir, sanitized);
	const hash = contentHash(source);
	nextManifest.images[sanitized] = hash;

	if (manifest && manifest.images[sanitized] === hash && existsSync(dest)) {
		return { status: 'unchanged', sanitized };
	}

	if (!dryRun) {
		mkdirSync(assetsDir, { recursive: true });
		copyFileSync(source, dest);
	}
	log(`  [image] ${cleanName} -> ${dest}`);
	return { status: 'copied', sanitized };
}

function cleanScopedCategories({ blogDir, managedCategories, publishedPaths, dryRun, log }) {
	if (!managedCategories || managedCategories.length === 0) return 0;

	let cleaned = 0;
	const resolvedBlogDir = resolve(blogDir);

	function walk(dir) {
		if (!existsSync(dir)) return;
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (entry.name.endsWith('.md') && !publishedPaths.has(resolve(fullPath))) {
				if (!dryRun) unlinkSync(fullPath);
				log(`  [cleaned] ${fullPath}`);
				cleaned++;
			}
		}
	}

	for (const category of managedCategories) {
		if (!category || !category.trim()) continue;
		const targetDir = resolve(blogDir, category);
		if (!targetDir.startsWith(`${resolvedBlogDir}/`) && targetDir !== resolvedBlogDir) {
			throw new Error(`Refusing to clean outside blogDir: ${category}`);
		}
		if (targetDir === resolvedBlogDir) {
			throw new Error('Refusing to clean entire blogDir; specify explicit managedCategories');
		}
		walk(targetDir);
	}

	return cleaned;
}

function collectRootGraphNotes({ vaultDir, rootNote, category }) {
	const rootPath = join(vaultDir, `${rootNote}.md`);
	if (!existsSync(rootPath)) {
		throw new Error(`Root note not found: ${rootPath}`);
	}

	const rootContent = readFileSync(rootPath, 'utf8');
	const noteNames = [...new Set([rootNote, ...linkedNoteNames(rootContent)])].sort();
	const items = [];
	const missingNotes = [];

	for (const name of noteNames) {
		const sourcePath = join(vaultDir, `${name}.md`);
		if (!existsSync(sourcePath)) {
			missingNotes.push(name);
			continue;
		}
		items.push({
			sourcePath,
			noteName: name,
			outputFilename: `${name}.md`,
			category,
		});
	}

	return { items, missingNotes, skipped: 0 };
}

function collectCategoryMapNotes({ vaultDir, resolveCategory, skipFiles }) {
	if (typeof resolveCategory !== 'function') {
		throw new Error('category-map mode requires a resolveCategory(filename) function');
	}
	if (!existsSync(vaultDir)) {
		throw new Error(`Vault directory not found: ${vaultDir}`);
	}

	const skipSet = new Set(skipFiles || []);
	const allFiles = readdirSync(vaultDir).filter((file) => file.endsWith('.md'));
	const deduped = deduplicateVaultFiles(allFiles, vaultDir, skipSet);
	const items = [];
	let skipped = 0;

	for (const file of deduped) {
		const baseFilename = getBaseFilename(file);
		if (skipSet.has(file) || skipSet.has(baseFilename)) {
			skipped++;
			continue;
		}

		const sourcePath = join(vaultDir, file);
		if (statSync(sourcePath).size < 50) {
			skipped++;
			continue;
		}

		const category = resolveCategory(baseFilename);
		if (!category) {
			skipped++;
			continue;
		}

		const content = readFileSync(sourcePath, 'utf8');
		if (!hasRealContent(content)) {
			skipped++;
			continue;
		}

		items.push({
			sourcePath,
			noteName: basename(baseFilename, '.md'),
			outputFilename: baseFilename,
			category,
		});
	}

	return { items, missingNotes: [], skipped };
}

export function publishObsidianNotes(options) {
	const {
		vaultDir,
		blogDir,
		assetsDir,
		mode,
		rootNote,
		category,
		resolveCategory,
		skipFiles = [],
		managedCategories = [],
		manifestPath = null,
		convertLegacyLatex = false,
		dryRun = false,
		logger = () => {},
	} = options;

	if (!vaultDir) throw new Error('vaultDir is required');
	if (!blogDir) throw new Error('blogDir is required');
	if (!assetsDir) throw new Error('assetsDir is required');

	const manifest = manifestPath ? loadManifest(manifestPath) : null;
	const nextManifest = { files: {}, images: {} };

	const collected =
		mode === 'root-graph'
			? collectRootGraphNotes({ vaultDir, rootNote, category })
			: mode === 'category-map'
				? collectCategoryMapNotes({ vaultDir, resolveCategory, skipFiles })
				: (() => {
						throw new Error(`Unsupported publish mode: ${mode}`);
					})();

	const noteUrlMap = new Map(
		collected.items.map((item) => [item.noteName, buildNoteUrl(item.category, item.noteName)]),
	);

	const publishedPaths = new Set();
	const referencedImages = new Map();
	const missingImages = new Set();
	let published = 0;
	let unchanged = 0;
	let copiedImages = 0;

	for (const item of collected.items) {
		const outDir = join(blogDir, item.category);
		const outPath = join(outDir, item.outputFilename);
		const resolvedOut = resolve(outPath);
		publishedPaths.add(resolvedOut);

		const source = readFileSync(item.sourcePath, 'utf8');
		const { body, metadata } = parseFrontmatter(source);
		const hash = contentHash(item.sourcePath);

		const transformed = transformMarkdown(body, {
			category: item.category,
			noteUrlMap,
			convertLegacyLatex,
			onImage: (cleanName, sanitized) => {
				referencedImages.set(sanitized, cleanName);
			},
		});

		if (manifest && manifest.files[resolvedOut] === hash && existsSync(outPath)) {
			nextManifest.files[resolvedOut] = hash;
			unchanged++;
			continue;
		}

		const title = metadata.title || item.noteName;
		const description = extractDescription(transformed, title);
		const pubDate = resolvePublishDate(item.sourcePath, metadata);
		const output = `${serializeFrontmatter({ title, description, pubDate })}${transformed}`;

		if (!dryRun) {
			mkdirSync(outDir, { recursive: true });
			writeFileSync(outPath, output, 'utf8');
		}
		nextManifest.files[resolvedOut] = hash;
		logger(`  [published] [${item.category}] ${item.outputFilename}`);
		published++;
	}

	for (const [sanitized, cleanName] of referencedImages) {
		const outcome = copyReferencedImage(cleanName, sanitized, {
			vaultDir,
			assetsDir,
			manifest,
			nextManifest,
			dryRun,
			log: logger,
		});
		if (outcome.status === 'copied') copiedImages++;
		else if (outcome.status === 'missing') missingImages.add(cleanName);
	}

	const cleaned = cleanScopedCategories({
		blogDir,
		managedCategories,
		publishedPaths,
		dryRun,
		log: logger,
	});

	if (manifestPath && !dryRun) {
		writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
	}

	return {
		published,
		unchanged,
		skipped: collected.skipped,
		cleaned,
		copiedImages,
		missingNotes: collected.missingNotes,
		missingImages: [...missingImages].sort(),
	};
}
