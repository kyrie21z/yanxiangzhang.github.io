import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncCodeFont } from './lib/code-font-subsetter.mjs';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
syncCodeFont({ rootDir });
