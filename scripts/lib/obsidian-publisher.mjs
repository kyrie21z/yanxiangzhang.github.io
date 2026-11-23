import { createHash } from 'node:crypto';
import {
	copyFileSync,
	existsSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	realpathSync,
	statSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { slug } from 'github-slugger';

const HASH_SUFFIX_RE = /-[0-9a-f]{12}\.md$/i;
const IMAGE_WIKILINK_RE = /!\[\[([^\]]+\.(?:png|jpe?g|gif|svg|webp))(?:\|[^\]]+)?\]\]/gi;
const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;
const LATEX_COMMANDS =
	'text|alpha|beta|gamma|delta|theta|Theta|lambda|sigma|Sigma|pi|Pi|mu|nu|omega|Omega|epsilon|varepsilon|phi|varphi|psi|rho|tau|chi|zeta|eta|kappa|iota|xi|Xi|infty|partial|nabla|sum|prod|int|sqrt|frac|mathbb|mathrm|mathcal|rightarrow|Rightarrow|leftarrow|Leftarrow|leftrightarrow|xrightarrow|ne|neq|le|ge|leq|geq|quad|qquad|cdot|cdots|ldots|bmod|pmod|gcd|log|ln|exp|sin|cos|tan|lim|max|min|sup|inf|det|dim|ker|hom|arg|deg|Pr';
const INLINE_LATEX_RE = new RegExp(`\\(\\\\(${LATEX_COMMANDS})([^)]*)\\)`, 'g');
const BLOCK_LATEX_RE = /^\[ {2}\n(.+)\n\]/gm;

function toPosixPath(filepath) {
	return filepath.split(sep).join('/');
}

function isWithinDirectory(rootPath, candidatePath, { strict = false } = {}) {
	const rel = relative(rootPath, candidatePath);
	if (rel === '') return !strict;
	return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

function deepestExistingRealPath(targetPath) {
	let current = resolve(targetPath);
	const trailing = [];
	while (!existsSync(current)) {
		const parent = dirname(current);
		if (parent === current) break;
		trailing.unshift(basename(current));
		current = parent;
	}
	const realBase = existsSync(current) ? realpathSync(current) : current;
	return trailing.length > 0 ? join(realBase, ...trailing) : realBase;
}

function assertPathWithinRoot(rootRealPath, targetPath, { strict = false, label = 'path' } = {}) {
	const resolvedTarget = resolve(targetPath);
	const realTarget = deepestExistingRealPath(resolvedTarget);
	if (!isWithinDirectory(rootRealPath, realTarget, { strict })) {
		throw new Error(`Refusing ${label} outside root (${rootRealPath}): ${targetPath}`);
	}
	return realTarget;
}

function assertExistingFileWithinRoot(rootRealPath, targetPath, label) {
	if (!existsSync(targetPath)) return null;
	const realTarget = realpathSync(targetPath);
	if (!isWithinDirectory(rootRealPath, realTarget, { strict: true })) {
		throw new Error(`Refusing ${label} outside root (${rootRealPath}): ${targetPath}`);
	}
	return realTarget;
}

function getBaseFilename(filename) {
	return HASH_SUFFIX_RE.test(filename) ? filename.replace(HASH_SUFFIX_RE, '.md') : filename;
}

function sanitizeImageName(rawFilename) {
	const normalized = rawFilename.trim().replace(/\\/g, '/').replace(/^\/+/, '');
	const segments = normalized
		.split('/')
		.filter((part) => part && part !== '.' && part !== '..')
		.map((part) => part.replace(/\s+/g, '-'));
	if (segments.length === 0) {
		throw new Error(`Invalid image reference: ${rawFilename}`);
	}
	return segments.join('-');
}

function buildNoteUrl(category, noteName) {
	const categoryPath = category
		.split('/')
		.filter(Boolean)
		.map((part) => slug(part))
		.join('/');
	const noteSlug = slug(noteName);
	if (noteSlug === 'index') {
		return `/blog/${categoryPath}/`;
	}
	return `/blog/${categoryPath}/${noteSlug}/`;
}

function imageRelativePrefix(category) {
	const depth = category.split('/').filter(Boolean).length;
	return `${'../'.repeat(depth + 2)}assets/`;
}

function decodeDoubleQuotedYaml(raw) {
	let output = '';
	for (let i = 0; i < raw.length; i++) {
		if (raw[i] !== '\\') {
			output += raw[i];
			continue;
		}
		const next = raw[++i];
		if (next === undefined) {
			output += '\\';
			break;
		}
		switch (next) {
			case '"':
				output += '"';
				break;
			case '\\':
				output += '\\';
				break;
			case '/':
				output += '/';
				break;
			case 'n':
				output += '\n';
				break;
			case 'r':
				output += '\r';
				break;
			case 't':
				output += '\t';
				break;
			case 'u': {
				const hex = raw.slice(i + 1, i + 5);
				if (/^[0-9a-fA-F]{4}$/.test(hex)) {
					output += String.fromCharCode(parseInt(hex, 16));
					i += 4;
				} else {
					output += '\\u';
				}
				break;
			}
			default:
				output += next;
		}
	}
	return output;
}

function parseYamlScalar(rawValue) {
	const trimmed = rawValue.trim();
	if (!trimmed) return '';

	if (trimmed.startsWith('"')) {
		let escaped = false;
		for (let i = 1; i < trimmed.length; i++) {
			const ch = trimmed[i];
			if (escaped) {
				escaped = false;
				continue;
			}
			if (ch === '\\') {
				escaped = true;
				continue;
			}
			if (ch === '"') {
				return decodeDoubleQuotedYaml(trimmed.slice(1, i));
			}
		}
		return decodeDoubleQuotedYaml(trimmed.slice(1));
	}

	if (trimmed.startsWith("'")) {
		let result = '';
		for (let i = 1; i < trimmed.length; i++) {
			if (trimmed[i] === "'") {
				if (trimmed[i + 1] === "'") {
					result += "'";
					i++;
				} else {
					return result;
				}
			} else {
				result += trimmed[i];
			}
		}
		return result;
	}

	return trimmed.replace(/\s+#.*$/, '').trim();
}

function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { body: content, metadata: {} };

	const metadata = {};
	for (const line of match[1].split(/\r?\n/)) {
		if (!line.trim() || line.trimStart().startsWith('#')) continue;
		const field = line.match(/^([A-Za-z][\w-]*):(?:\s+(.*))?$/);
		if (!field) continue;
		const parsed = parseYamlScalar(field[2] || '');
		if (parsed) metadata[field[1]] = parsed;
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

function sha256Text(text) {
	return createHash('sha256').update(text, 'utf8').digest('hex');
}

function sha256File(filepath) {
	return createHash('sha256').update(readFileSync(filepath)).digest('hex');
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

function deduplicateVaultFiles(files, vaultRealDir, skipSet) {
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
			const originalPath = assertExistingFileWithinRoot(
				vaultRealDir,
				join(vaultRealDir, original),
				'vault note',
			);
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

function resolveVaultImageSource(cleanName, vaultRealDir) {
	const candidates = [join(vaultRealDir, cleanName), join(vaultRealDir, 'images', cleanName)];
	for (const candidate of candidates) {
		if (!existsSync(candidate)) continue;
		return assertExistingFileWithinRoot(vaultRealDir, candidate, 'vault image');
	}
	return null;
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

function validateManagedCategories(blogRealDir, managedCategories) {
	const validated = [];
	for (const category of managedCategories || []) {
		if (!category || !category.trim()) {
			throw new Error('managedCategories entries must be non-empty relative paths');
		}
		if (isAbsolute(category)) {
			throw new Error(`Refusing absolute managedCategories entry: ${category}`);
		}
		const targetDir = resolve(blogRealDir, category);
		if (existsSync(targetDir) && lstatSync(targetDir).isSymbolicLink()) {
			throw new Error(`Refusing symlinked managed category directory: ${category}`);
		}
		const realTarget = assertPathWithinRoot(blogRealDir, targetDir, {
			strict: true,
			label: 'managed category',
		});
		validated.push({ category, targetDir: realTarget });
	}
	return validated;
}

function cleanScopedCategories({
	blogRealDir,
	validatedManagedCategories,
	publishedKeys,
	ownedKeys,
	dryRun,
	log,
}) {
	if (validatedManagedCategories.length === 0 || publishedKeys.size === 0) return 0;

	let cleaned = 0;

	function walk(dir, rootRealDir) {
		if (!existsSync(dir)) return;
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const fullPath = join(dir, entry.name);
			if (entry.isSymbolicLink()) continue;
			if (entry.isDirectory()) {
				const realSubdir = realpathSync(fullPath);
				if (!isWithinDirectory(rootRealDir, realSubdir, { strict: true })) continue;
				walk(realSubdir, rootRealDir);
			} else if (entry.name.endsWith('.md')) {
				const realFile = realpathSync(fullPath);
				if (!isWithinDirectory(rootRealDir, realFile, { strict: true })) continue;
				const relKey = toPosixPath(relative(blogRealDir, realFile));
				if (publishedKeys.has(relKey)) continue;
				if (ownedKeys && !ownedKeys.has(relKey)) continue;

				if (!dryRun) unlinkSync(realFile);
				log(`  [cleaned] ${relKey}`);
				cleaned++;
			}
		}
	}

	for (const { targetDir } of validatedManagedCategories) {
		walk(targetDir, targetDir);
	}

	return cleaned;
}

function collectRootGraphNotes({ vaultRealDir, rootNote, category }) {
	const rootPath = assertPathWithinRoot(vaultRealDir, join(vaultRealDir, `${rootNote}.md`), {
		strict: true,
		label: 'root note',
	});
	if (!existsSync(rootPath)) {
		throw new Error(`Root note not found: ${rootPath}`);
	}

	const rootContent = readFileSync(rootPath, 'utf8');
	const noteNames = [...new Set([rootNote, ...linkedNoteNames(rootContent)])].sort();
	const items = [];
	const missingNotes = [];

	for (const name of noteNames) {
		const candidatePath = join(vaultRealDir, `${name}.md`);
		if (!existsSync(candidatePath)) {
			missingNotes.push(name);
			continue;
		}
		const sourcePath = assertExistingFileWithinRoot(vaultRealDir, candidatePath, 'linked note');
		items.push({
			sourcePath,
			noteName: name,
			outputFilename: `${name}.md`,
			category,
		});
	}

	return { items, missingNotes, skipped: 0 };
}

function collectCategoryMapNotes({ vaultRealDir, resolveCategory, skipFiles }) {
	if (typeof resolveCategory !== 'function') {
		throw new Error('category-map mode requires a resolveCategory(filename) function');
	}

	const skipSet = new Set(skipFiles || []);
	const allFiles = readdirSync(vaultRealDir).filter((file) => file.endsWith('.md'));
	const deduped = deduplicateVaultFiles(allFiles, vaultRealDir, skipSet);
	const items = [];
	let skipped = 0;

	for (const file of deduped) {
		const baseFilename = getBaseFilename(file);
		if (skipSet.has(file) || skipSet.has(baseFilename)) {
			skipped++;
			continue;
		}

		const sourcePath = assertExistingFileWithinRoot(
			vaultRealDir,
			join(vaultRealDir, file),
			'vault note',
		);
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
	if (!existsSync(vaultDir)) throw new Error(`Vault directory not found: ${vaultDir}`);

	const vaultRealDir = realpathSync(vaultDir);
	const blogRealDir = deepestExistingRealPath(blogDir);
	const assetsRealDir = deepestExistingRealPath(assetsDir);

	// Validate all managed cleanup roots upfront before touching disk.
	const validatedManagedCategories = validateManagedCategories(blogRealDir, managedCategories);

	const manifest = manifestPath ? loadManifest(manifestPath) : null;
	const nextManifest = { files: {}, images: {} };

	const collected =
		mode === 'root-graph'
			? collectRootGraphNotes({ vaultRealDir, rootNote, category })
			: mode === 'category-map'
				? collectCategoryMapNotes({ vaultRealDir, resolveCategory, skipFiles })
				: (() => {
						throw new Error(`Unsupported publish mode: ${mode}`);
					})();

	const noteUrlMap = new Map(
		collected.items.map((item) => [item.noteName, buildNoteUrl(item.category, item.noteName)]),
	);

	// Phase 1: Plan & validate every output note and image before mutating disk.
	const plannedNotes = [];
	const plannedImages = new Map();
	const missingImages = new Set();

	for (const item of collected.items) {
		const outDir = assertPathWithinRoot(blogRealDir, join(blogRealDir, item.category), {
			strict: true,
			label: 'output category directory',
		});
		const outPath = assertPathWithinRoot(blogRealDir, join(outDir, item.outputFilename), {
			strict: true,
			label: 'output note',
		});
		const relKey = toPosixPath(relative(blogRealDir, outPath));

		const source = readFileSync(item.sourcePath, 'utf8');
		const { body, metadata } = parseFrontmatter(source);
		const transformed = transformMarkdown(body, {
			category: item.category,
			noteUrlMap,
			convertLegacyLatex,
			onImage: (cleanName, sanitized) => {
				const resolvedSource = resolveVaultImageSource(cleanName, vaultRealDir);
				if (!resolvedSource) {
					missingImages.add(cleanName);
					return;
				}
				const destPath = assertPathWithinRoot(assetsRealDir, join(assetsRealDir, sanitized), {
					strict: true,
					label: 'output image',
				});
				const existing = plannedImages.get(sanitized);
				if (existing && existing.sourcePath !== resolvedSource) {
					throw new Error(
						`Image filename collision for "${sanitized}": "${existing.cleanName}" and "${cleanName}"`,
					);
				}
				plannedImages.set(sanitized, { cleanName, sanitized, sourcePath: resolvedSource, destPath });
			},
		});

		const title = metadata.title || item.noteName;
		const description = extractDescription(transformed, title);
		const pubDate = resolvePublishDate(item.sourcePath, metadata);
		const output = `${serializeFrontmatter({ title, description, pubDate })}${transformed}`;
		const outputHash = sha256Text(output);

		plannedNotes.push({ item, outDir, outPath, relKey, output, outputHash });
	}

	// Phase 2: Apply validated writes, copies, and ownership-verified scoped cleanup.
	const publishedKeys = new Set();
	let published = 0;
	let unchanged = 0;
	let copiedImages = 0;

	for (const plan of plannedNotes) {
		publishedKeys.add(plan.relKey);
		nextManifest.files[plan.relKey] = plan.outputHash;

		if (
			manifest &&
			manifest.files[plan.relKey] === plan.outputHash &&
			existsSync(plan.outPath) &&
			sha256File(plan.outPath) === plan.outputHash
		) {
			unchanged++;
			continue;
		}

		if (!dryRun) {
			mkdirSync(plan.outDir, { recursive: true });
			writeFileSync(plan.outPath, plan.output, 'utf8');
		}
		logger(`  [published] [${plan.item.category}] ${plan.item.outputFilename}`);
		published++;
	}

	for (const img of plannedImages.values()) {
		const hash = sha256File(img.sourcePath);
		nextManifest.images[img.sanitized] = hash;

		if (
			manifest &&
			manifest.images[img.sanitized] === hash &&
			existsSync(img.destPath) &&
			sha256File(img.destPath) === hash
		) {
			continue;
		}

		if (!dryRun) {
			mkdirSync(assetsRealDir, { recursive: true });
			copyFileSync(img.sourcePath, img.destPath);
		}
		logger(`  [image] ${img.cleanName} -> ${img.destPath}`);
		copiedImages++;
	}

	const ownedKeys = manifest ? new Set(Object.keys(manifest.files)) : new Set();
	const cleaned = cleanScopedCategories({
		blogRealDir,
		validatedManagedCategories,
		publishedKeys,
		ownedKeys,
		dryRun,
		log: logger,
	});

	if (manifestPath && !dryRun && publishedKeys.size > 0) {
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
