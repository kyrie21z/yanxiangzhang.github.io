import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const environment = join(root, '.font-build');
const python = join(environment, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const requirementsPath = join(root, 'scripts/fonts/requirements.txt');
const requirements = readFileSync(requirementsPath, 'utf8');
const stamp = join(environment, 'requirements-installed.txt');

function run(binary, args) {
	const result = spawnSync(binary, args, { cwd: root, stdio: 'inherit' });
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(python)) {
	run(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'venv', environment]);
}
if (!existsSync(stamp) || readFileSync(stamp, 'utf8') !== requirements) {
	run(python, ['-m', 'pip', 'install', '--quiet', '--disable-pip-version-check', '-r', requirementsPath]);
	writeFileSync(stamp, requirements);
}
const characters = new Set(Array.from({ length: 95 }, (_, index) => index + 32));
const extensions = new Set(['.md', '.mdx', '.astro', '.css', '.ts', '.js', '.mjs']);
function collect(directory) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) collect(path);
		else if (extensions.has(extname(path))) {
			for (const character of readFileSync(path, 'utf8')) characters.add(character.codePointAt(0));
		}
	}
}
collect(join(root, 'src'));
const signature = createHash('sha256')
	.update(readFileSync(join(root, 'scripts/fonts/maple-mono-full.woff2')))
	.update(readFileSync(join(root, 'scripts/subset-font.py')))
	.update(requirements)
	.update([...characters].sort((a, b) => a - b).join(','))
	.digest('hex');
const output = join(root, 'src/assets/fonts/maple-mono-subset.woff2');
const cachePath = join(environment, 'subset-cache.json');
const digest = () => createHash('sha256').update(readFileSync(output)).digest('hex');
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : null;
if (existsSync(output) && cache?.signature === signature && cache.outputHash === digest()) {
	console.log('Code font: source character set unchanged; using verified cached subset');
} else {
	run(python, [join(root, 'scripts/subset-font.py')]);
	writeFileSync(cachePath, JSON.stringify({ signature, outputHash: digest() }) + '\n');
}
