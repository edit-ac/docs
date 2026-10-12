import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Preserve the supplied CC0 geometry. Rendering is deterministic and offline.
const root = fileURLToPath(new URL('../', import.meta.url));
const brand = join(root, 'static/brand');
const source = readFileSync(join(brand, 'editac-source.svg'), 'utf8');
const paths = [...source.matchAll(/<path\s+d="([^"]+)"\s*\/>/g)]
  .map((match) => `  <path d="${match[1].replace(/\s+/g, ' ').trim()}"/>`).join('\n');
if (!paths || [...source.matchAll(/<path\s/g)].length !== 2) {
  throw new Error('Expected the two original SVG paths; review a source change before generating assets.');
}
mkdirSync(brand, { recursive: true });
const svg = (viewBox, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${content}\n</svg>\n`;
const mark = `<g fill="#0c0c0c">\n${paths}\n</g>`;
writeFileSync(join(brand, 'editac-mark.svg'), svg('0 0 512 512', `<title>edit.ac</title>\n${mark}`));
writeFileSync(join(root, 'static/favicon.svg'), svg('-32 -32 576 576',
  `<style>path{fill:#0c0c0c}@media(prefers-color-scheme:dark){path{fill:#fff}}</style>\n${paths}`));
const app = svg('0 0 768 768', `<rect width="768" height="768" fill="#fff"/>\n<g transform="translate(128 128)">\n${mark}\n</g>`);
writeFileSync(join(brand, 'editac-app-icon.svg'), app);
for (const size of [180, 192, 512, 1024]) {
  const name = size === 1024 ? 'editac-github-avatar.png' : `editac-app-icon-${size}.png`;
  execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), '-o', join(brand, name), join(brand, 'editac-app-icon.svg')]);
}
execFileSync('magick', [join(brand, 'editac-github-avatar.png'), '-define', 'icon:auto-resize=48,32,16', join(root, 'static/favicon.ico')]);
console.log('Generated canonical mark, automatic favicon, padded GitHub avatar and touch/install artwork.');
