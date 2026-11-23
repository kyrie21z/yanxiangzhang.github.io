import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from 'node:fs';
import { dirname, extname, join } from 'node:path';

export const DEFAULT_TEXT_EXTENSIONS = new Set([
	'.md',
	'.mdx',
	'.astro',
	'.css',
	'.ts',
	'.js',
	'.mjs',
]);

function collectCodepoints(srcDir, extensions) {
	const characters = new Set(Array.from({ length: 95 }, (_, index) => index + 32));

	function walk(directory) {
		if (!existsSync(directory)) return;
		const entries = readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
			a.name.localeCompare(b.name),
		);
		for (const entry of entries) {
			const fullPath = join(directory, entry.name);
			if (entry.isDirectory()) {
				walk(fullPath);
			} else if (extensions.has(extname(fullPath))) {
				for (const ch of readFileSync(fullPath, 'utf8')) {
					characters.add(ch.codePointAt(0));
				}
			}
		}
	}

	walk(srcDir);
	return [...characters].sort((a, b) => a - b);
}

function sha256File(filepath) {
	return createHash('sha256').update(readFileSync(filepath)).digest('hex');
}

function defaultRunCommand(binary, args, cwd) {
	const result = spawnSync(binary, args, { cwd, stdio: 'inherit' });
	if (result.error) throw result.error;
	if (result.status !== 0) {
		throw new Error(`Command failed (${result.status ?? 1}): ${binary} ${args.join(' ')}`);
	}
}

function readCache(cachePath) {
	if (!existsSync(cachePath)) return null;
	try {
		return JSON.parse(readFileSync(cachePath, 'utf8'));
	} catch {
		return null;
	}
}

export function syncCodeFont(options) {
	const {
		rootDir,
		srcDir = join(rootDir, 'src'),
		sourceFontPath = join(rootDir, 'scripts/fonts/maple-mono-full.woff2'),
		outputFontPath = join(rootDir, 'src/assets/fonts/maple-mono-subset.woff2'),
		envDir = join(rootDir, '.font-build'),
		requirementsPath = join(rootDir, 'scripts/fonts/requirements.txt'),
		subsetScriptPath = join(rootDir, 'scripts/subset-font.py'),
		cachePath = join(envDir, 'subset-cache.json'),
		extensions = DEFAULT_TEXT_EXTENSIONS,
		platform = process.platform,
		runCommand = defaultRunCommand,
		logger = (msg) => console.log(msg),
	} = options;

	if (!rootDir) throw new Error('rootDir is required');

	const pythonBinary = join(
		envDir,
		platform === 'win32' ? 'Scripts/python.exe' : 'bin/python',
	);
	const requirements = readFileSync(requirementsPath, 'utf8');
	const stampPath = join(envDir, 'requirements-installed.txt');

	const codepoints = collectCodepoints(srcDir, extensions);
	const serializedCodepoints = codepoints.join(',');
	const signature = createHash('sha256')
		.update(readFileSync(sourceFontPath))
		.update(readFileSync(subsetScriptPath))
		.update(requirements)
		.update(serializedCodepoints)
		.digest('hex');

	const cache = readCache(cachePath);
	if (
		existsSync(outputFontPath) &&
		cache?.signature === signature &&
		cache.outputHash === sha256File(outputFontPath)
	) {
		logger('Code font: source character set unchanged; using verified cached subset');
		return {
			status: 'cached',
			signature,
			codepointCount: codepoints.length,
			outputHash: cache.outputHash,
		};
	}

	if (!existsSync(pythonBinary)) {
		runCommand(platform === 'win32' ? 'python' : 'python3', ['-m', 'venv', envDir], rootDir);
	}
	if (!existsSync(stampPath) || readFileSync(stampPath, 'utf8') !== requirements) {
		runCommand(
			pythonBinary,
			['-m', 'pip', 'install', '--quiet', '--disable-pip-version-check', '-r', requirementsPath],
			rootDir,
		);
		mkdirSync(dirname(stampPath), { recursive: true });
		writeFileSync(stampPath, requirements);
	}

	mkdirSync(envDir, { recursive: true });
	const codepointsPath = join(envDir, `codepoints-${process.pid}-${Date.now()}.txt`);
	writeFileSync(codepointsPath, `${serializedCodepoints}\n`, 'utf8');

	try {
		runCommand(
			pythonBinary,
			[
				subsetScriptPath,
				'--source',
				sourceFontPath,
				'--output',
				outputFontPath,
				'--codepoints-file',
				codepointsPath,
			],
			rootDir,
		);
	} finally {
		if (existsSync(codepointsPath)) unlinkSync(codepointsPath);
	}

	const outputHash = sha256File(outputFontPath);
	mkdirSync(dirname(cachePath), { recursive: true });
	writeFileSync(cachePath, `${JSON.stringify({ signature, outputHash })}\n`, 'utf8');

	return {
		status: 'rebuilt',
		signature,
		codepointCount: codepoints.length,
		outputHash,
	};
}
