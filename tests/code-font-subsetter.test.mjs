import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { syncCodeFont } from '../scripts/lib/code-font-subsetter.mjs';

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function createFontFixture() {
	const rootDir = mkdtempSync(join(tmpdir(), 'code-font-subsetter-test-'));
	const srcDir = join(rootDir, 'src');
	const envDir = join(rootDir, '.font-build');
	const binDir = join(envDir, 'bin');
	const sourceFontPath = join(rootDir, 'source.woff2');
	const outputFontPath = join(rootDir, 'out/subset.woff2');
	const requirementsPath = join(rootDir, 'requirements.txt');
	const subsetScriptPath = join(rootDir, 'subset-font.py');

	mkdirSync(srcDir, { recursive: true });
	mkdirSync(binDir, { recursive: true });
	writeFileSync(join(binDir, 'python'), '#!/bin/sh\n');
	writeFileSync(join(envDir, 'requirements-installed.txt'), 'fonttools==4.60.1\n');
	writeFileSync(requirementsPath, 'fonttools==4.60.1\n');
	writeFileSync(sourceFontPath, 'fake-source-font');
	writeFileSync(subsetScriptPath, '# fake subsetter');
	writeFileSync(join(srcDir, 'note.md'), 'Hello 算法');
	writeFileSync(join(srcDir, 'ignored.json'), '忽略这个字符：龙');

	return {
		rootDir,
		srcDir,
		envDir,
		sourceFontPath,
		outputFontPath,
		requirementsPath,
		subsetScriptPath,
		cleanup: () => rmSync(rootDir, { recursive: true, force: true }),
	};
}

describe('syncCodeFont', () => {
	it('scans allowed extensions once, passes codepoints across the seam, and reuses verified cache', () => {
		const fx = createFontFixture();
		try {
			const calls = [];
			const stubRunner = (binary, args) => {
				const outPath = args[args.indexOf('--output') + 1];
				const cpPath = args[args.indexOf('--codepoints-file') + 1];
				const codepoints = readFileSync(cpPath, 'utf8').trim().split(',').map(Number);
				calls.push({ binary, args, codepoints });
				mkdirSync(dirname(outPath), { recursive: true });
				writeFileSync(outPath, `subset:${codepoints.length}`);
			};

			const opts = {
				rootDir: fx.rootDir,
				srcDir: fx.srcDir,
				envDir: fx.envDir,
				sourceFontPath: fx.sourceFontPath,
				outputFontPath: fx.outputFontPath,
				requirementsPath: fx.requirementsPath,
				subsetScriptPath: fx.subsetScriptPath,
				platform: 'linux',
				runCommand: stubRunner,
				logger: () => {},
			};

			const first = syncCodeFont(opts);
			assert.equal(first.status, 'rebuilt');
			assert.equal(calls.length, 1);
			assert.ok(calls[0].codepoints.includes('算'.codePointAt(0)));
			assert.ok(calls[0].codepoints.includes('法'.codePointAt(0)));
			assert.equal(calls[0].codepoints.includes('龙'.codePointAt(0)), false);

			const second = syncCodeFont(opts);
			assert.equal(second.status, 'cached');
			assert.equal(calls.length, 1);

			writeFileSync(join(fx.srcDir, 'extra.astro'), '新');
			const third = syncCodeFont(opts);
			assert.equal(third.status, 'rebuilt');
			assert.equal(calls.length, 2);
			assert.ok(calls[1].codepoints.includes('新'.codePointAt(0)));

			writeFileSync(fx.outputFontPath, 'corrupted-bytes');
			const fourth = syncCodeFont(opts);
			assert.equal(fourth.status, 'rebuilt');
			assert.equal(calls.length, 3);
		} finally {
			fx.cleanup();
		}
	});

	it('produces a valid subset via the real Python fontTools adapter when local venv is present', (t) => {
		const realPython = join(REPO_ROOT, '.font-build/bin/python');
		const smallSourceFont = join(REPO_ROOT, 'public/fonts/atkinson-regular.woff2');
		if (!existsSync(realPython) || !existsSync(smallSourceFont)) {
			t.skip('Local .font-build virtualenv or fixture font not available');
			return;
		}

		const tempRoot = mkdtempSync(join(tmpdir(), 'code-font-real-test-'));
		try {
			const srcDir = join(tempRoot, 'src');
			const outputFontPath = join(tempRoot, 'subset.woff2');
			const cachePath = join(tempRoot, 'subset-cache.json');
			mkdirSync(srcDir, { recursive: true });
			writeFileSync(join(srcDir, 'sample.md'), 'const x = 42; // Architecture');

			const first = syncCodeFont({
				rootDir: REPO_ROOT,
				srcDir,
				sourceFontPath: smallSourceFont,
				outputFontPath,
				cachePath,
				logger: () => {},
			});
			assert.equal(first.status, 'rebuilt');
			assert.equal(existsSync(outputFontPath), true);

			const second = syncCodeFont({
				rootDir: REPO_ROOT,
				srcDir,
				sourceFontPath: smallSourceFont,
				outputFontPath,
				cachePath,
				logger: () => {},
			});
			assert.equal(second.status, 'cached');
			assert.equal(second.outputHash, first.outputHash);
		} finally {
			rmSync(tempRoot, { recursive: true, force: true });
		}
	});
});
