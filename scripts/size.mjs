// Fails when the production bundle exceeds the gzip budget.
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const LIMIT = 15 * 1024;
const STRETCH = 10 * 1024;
const file = 'dist/a11y-adjust.min.js';
const source = await readFile(file);
const gzip = gzipSync(source, { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(2) + ' KB';

console.log(`${file}: ${kb(source.length)} raw, ${kb(gzip)} gzip (budget ${kb(LIMIT)}, stretch ${kb(STRETCH)})`);
if (gzip > LIMIT) {
  console.error('Bundle exceeds the gzip size budget.');
  process.exit(1);
}
