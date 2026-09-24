import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const banner = `/*! A11yAdjust v${pkg.version} | MIT License | https://github.com/0s1r1s/a11y-adjust */`;

export const options = {
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'iife',
  target: ['es2020', 'chrome100', 'firefox100', 'safari15'],
  define: { __VERSION__: JSON.stringify(pkg.version) },
  banner: { js: banner },
  legalComments: 'none',
  logLevel: 'info'
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await build({ ...options, outfile: 'dist/a11y-adjust.js' });
  await build({ ...options, outfile: 'dist/a11y-adjust.min.js', minify: true });
}
