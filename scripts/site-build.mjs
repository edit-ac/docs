import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const siteRoot = fileURLToPath(new URL('../', import.meta.url));
export function verifyToolchain(root = siteRoot) {
  const lock = JSON.parse(readFileSync(resolve(root, 'maintenance/site-toolchain.json'), 'utf8'));
  const expected = readFileSync(resolve(root, '.zola-version'), 'utf8').trim();
  const actual = execFileSync('zola', ['--version'], { encoding: 'utf8' }).trim();
  if (expected !== lock.zola.version || actual !== `zola ${expected}`) {
    throw new Error(`Zola version mismatch: expected ${lock.zola.version}, got ${actual}`);
  }
  const theme = execFileSync('git', ['-C', root, 'ls-tree', 'HEAD', 'themes/devlab-theme'], { encoding: 'utf8' }).split(/\s+/)[2];
  const installed = execFileSync('git', ['-C', resolve(root, 'themes/devlab-theme'), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (theme !== lock.theme.commit || installed !== theme) throw new Error('DevLab theme pin mismatch; initialize the pinned submodule');
  return lock;
}

export function buildSite({ root = siteRoot, outputDir, baseUrl } = {}) {
  verifyToolchain(root);
  const args = ['build'];
  if (outputDir) args.push('--output-dir', outputDir);
  if (baseUrl) args.push('--base-url', baseUrl);
  return execFileSync('zola', args, { cwd: root, encoding: 'utf8', timeout: 120000 });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length > 2) throw new Error('Use zola build directly for explicit output/base-url overrides');
  process.stdout.write(buildSite());
}
