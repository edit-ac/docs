import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { buildSite, siteRoot, verifyToolchain } from '../scripts/site-build.mjs';
import { artifactManifest, checkSiteAssets } from '../scripts/check-site-assets.mjs';

let work, production, repeated, nested;
const productionUrl = 'https://edit.ac/';
const nestedUrl = 'https://docs.invalid/packed-docs/';
before(() => {
  // Worktree-owned output; always remove even after an assertion fails.
  work = mkdtempSync(join(siteRoot, '.site-build-test-'));
  production = join(work, 'production'); repeated = join(work, 'repeated'); nested = join(work, 'nested');
  buildSite({ outputDir: production, baseUrl: productionUrl });
  buildSite({ outputDir: repeated, baseUrl: productionUrl });
  buildSite({ outputDir: nested, baseUrl: nestedUrl });
});
after(() => { if (work) rmSync(work, { recursive: true, force: true }); });

test('build uses the pinned generator and initialized immutable theme', () => {
  const lock = verifyToolchain();
  assert.equal(lock.theme.minimumZola, lock.zola.version);
  for (const [file, field] of [['LICENSE', 'licenseSha256'], ['THIRD_PARTY_NOTICES.md', 'thirdPartyNoticesSha256']]) {
    assert.equal(createHash('sha256').update(readFileSync(resolve(siteRoot, 'themes/devlab-theme', file))).digest('hex'), lock.theme[field]);
  }
});
test('npm lock records the private dependency-free documentation build', () => {
  const lock = JSON.parse(readFileSync(resolve(siteRoot, 'package-lock.json')));
  assert.equal(lock.lockfileVersion, 3);
  assert.deepEqual(Object.keys(lock.packages), ['']);
  assert.equal(lock.packages[''].name, '@edit-ac/docs');
});
test('production build retains all navigation pages plus homepage and 404', () => {
  const pages = JSON.parse(readFileSync(resolve(siteRoot, 'navigation.json'))).pages;
  const manifest = artifactManifest(production);
  for (const page of pages) {
    const path = page.replace(/^content\//, '').replace(/(?:_index|\.md$)/g, match => match === '_index' ? 'index' : '').replace(/\.md$/, '');
    const target = page.endsWith('_index.md') ? page.replace(/^content\//, '').replace('_index.md', 'index.html') : `${path}/index.html`;
    assert.ok(manifest[target], `missing ${target}`);
  }
  assert.ok(manifest['404.html']);
});
test('production HTML, styles, icons and internal page URLs resolve', () => {
  const result = checkSiteAssets(production, productionUrl);
  assert.ok(result.html >= 16); assert.ok(result.references > 100);
  assert.deepEqual(result.errors, []);
});
test('nested production base path retains all local assets and links', () => {
  const result = checkSiteAssets(nested, nestedUrl);
  assert.ok(result.references > 100); assert.deepEqual(result.errors, []);
});
test('identical pinned inputs produce identical file sets and bytes', () => {
  const first = artifactManifest(production);
  assert.deepEqual(first, artifactManifest(repeated));
  for (const [name, dir, url] of [['production', production, productionUrl], ['subpath', nested, nestedUrl]]) {
    console.log(JSON.stringify({ build: name, ...checkSiteAssets(dir, url), manifestSha256: createHash('sha256').update(JSON.stringify(artifactManifest(dir))).digest('hex') }));
  }
});
test('search index and script loader use each configured base URL', () => {
  for (const [dir, url] of [[production, productionUrl], [nested, nestedUrl]]) {
    const manifest = artifactManifest(dir);
    assert.ok(manifest['search_index.en.js']);
    const html = readFileSync(join(dir, 'docs/index.html'), 'utf8');
    assert.ok(html.includes(`${url}search_index.en.js`));
    assert.ok(html.includes(`${url}elasticlunr.min.js`));
    const index = readFileSync(join(dir, 'search_index.en.js'), 'utf8');
    assert.ok(index.includes(`${url}docs/guides/getting-started/`));
  }
});
test('analytics is explicit and optional; local subpath preview loads no analytics', () => {
  assert.match(readFileSync(join(production, 'index.html'), 'utf8'), /https:\/\/cloud\.umami\.is\/script\.js/);
  const html = readFileSync(join(nested, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /cloud\.umami\.is/);
  const externalScripts = [...html.matchAll(/<script[^>]+src="(https?:[^\"]+)"/g)].map(m => new URL(m[1]).origin);
  assert.deepEqual([...new Set(externalScripts)], ['https://docs.invalid']);
});
test('asset checker rejects a missing file and a root path escaping a subpath', () => {
  const dir = join(work, 'invalid'); mkdirSync(dir);
  writeFileSync(join(dir, 'index.html'), '<link href="/main.css"><img src="missing.svg"><a href="/packed-docs-other/page">Wrong mount</a>');
  const result = checkSiteAssets(dir, nestedUrl);
  assert.equal(result.references, 3); assert.equal(result.errors.length, 3);
  assert.match(result.errors[0], /escapes base path/); assert.match(result.errors[1], /missing local target/);
});

test('asset checker accepts a static mount directory redirect', () => {
  const dir = join(work, 'mount'); mkdirSync(dir);
  writeFileSync(join(dir, 'index.html'), '<a href="https://docs.invalid/packed-docs">Home</a>');
  assert.deepEqual(checkSiteAssets(dir, nestedUrl).errors, []);
});
