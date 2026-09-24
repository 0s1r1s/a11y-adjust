// Writes SHA-256 checksums and SHA-384 Subresource Integrity hashes for the release bundles.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const files = ['a11y-adjust.js', 'a11y-adjust.min.js'];
const sums = [];
const sri = [];
for (const name of files) {
  const data = await readFile(`dist/${name}`);
  sums.push(`${createHash('sha256').update(data).digest('hex')}  ${name}`);
  sri.push(`${name} sha384-${createHash('sha384').update(data).digest('base64')}`);
}
await writeFile('dist/SHA256SUMS', sums.join('\n') + '\n');
await writeFile('dist/SRI.txt', sri.join('\n') + '\n');
console.log(sums.join('\n') + '\n\n' + sri.join('\n'));
