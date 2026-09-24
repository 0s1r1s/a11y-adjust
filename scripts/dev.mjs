// Rebuilds the bundles on change and serves the demo at http://localhost:4173/demo/.
import { context } from 'esbuild';
import { options } from './build.mjs';

for (const [outfile, minify] of [['dist/a11y-adjust.js', false], ['dist/a11y-adjust.min.js', true]]) {
  const ctx = await context({ ...options, outfile, minify });
  await ctx.watch();
}
await import('./serve.mjs');
