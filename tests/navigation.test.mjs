import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { buildSite, siteRoot } from '../scripts/site-build.mjs';
import { checkSiteAssets } from '../scripts/check-site-assets.mjs';
const read = path => readFileSync(join(siteRoot, path), 'utf8');
const nav = JSON.parse(read('navigation.json')).pages;
const map = JSON.parse(read('maintenance/reader-navigation.json'));
const sections = ['getting-started', 'concepts', 'extensions', 'reference', 'guides', 'examples', 'migrate', 'compare', 'troubleshooting'];
const titles = ['Getting started', 'Core concepts', 'Extensions', 'API reference', 'Guides', 'Examples', 'Migrate to edit.ac', 'Compare editors', 'Troubleshooting'];
let work, temporary;
const url = 'https://navigation.invalid/';
const route = path => path.replace(/^content\//, '').replace(/_index\.md$/, 'index.html').replace(/(?<!index)\.md$/, '/index.html');
const html = path => readFileSync(join(work, route(path)), 'utf8');
before(() => { temporary = mkdtempSync(join(siteRoot, '.site-build-test-navigation-')); work = join(temporary, 'site'); buildSite({ outputDir: work, baseUrl: url }); });
after(() => { if (temporary) rmSync(temporary, { recursive: true, force: true }); });

test('all nine reader sections are real weighted sections in configured sidebar order', () => {
  const config = read('zola.toml').split('[extra.devlab.collections.manual]')[1].split('[extra.devlab.docs.page_actions]')[0];
  let previous = -1;
  sections.forEach((section, i) => {
    const page = `content/docs/${section}/_index.md`;
    assert.ok(nav.includes(page));
    assert.match(read(page), new RegExp(`weight = ${i + 1}\\n`));
    assert.match(read(page), /sort_by = "weight"/);
    const next = config.indexOf(`section = "docs/${section}/_index.md"`);
    assert.ok(next > previous, `${section} sidebar order`); previous = next;
    assert.equal(map.sections[i].title, titles[i]);
  });
});
test('rendered landing and every sidebar expose the reader structure', () => {
  const landing = html('content/docs/_index.md');
  for (const section of sections) {
    const href = `${url}docs/${section}/`;
    assert.ok(landing.includes(`href="${href}"`), href);
    const page = html(`content/docs/${section}/_index.md`);
    for (const other of sections) assert.ok(page.includes(`href="${url}docs/${other}/"`), `${section} → ${other}`);
  }
});
test('all fifteen previous canonical pages retain their URLs and content routes', () => {
  assert.equal(map.preservedBaseline.pages.length, 15);
  for (const page of map.preservedBaseline.pages) {
    assert.ok(nav.includes(page), page); assert.match(html(page), /<!DOCTYPE html>/i);
    assert.doesNotMatch(read(page), /redirect_to\s*=/);
  }
});
test('Web React Astro native and CLI entry paths disclose status and link to the canonical overview', () => {
  const entry = read('content/docs/getting-started/_index.md');
  for (const platform of ['web', 'react', 'astro', 'native', 'cli']) {
    const path = `content/docs/getting-started/${platform}.md`;
    assert.ok(nav.includes(path)); assert.ok(entry.includes(`@/docs/getting-started/${platform}.md`));
    assert.match(read(path), /\*\*Status:.*(?:planned|pending|Conceptual)/i);
    assert.match(read(path), /No SDK consumer is qualified/);
  }
  assert.match(entry, /framework-independent/);
  assert.match(entry, /@\/docs\/guides\/getting-started.md/);
  assert.match(read('content/docs/getting-started/astro.md'), /without React/);
});
test('all eight content families remain discoverable with accurate conceptual or planned maturity', () => {
  assert.deepEqual(Object.keys(map.reservations), ['DWF-1.31','DWF-1.32','DWF-1.33','DWF-1.34','DWF-1.35','DWF-1.36','DWF-1.37','DWF-1.38']);
  for (const [id, { page, status, runtimeQualified }] of Object.entries(map.reservations)) {
    assert.equal(status, id === 'DWF-1.31' ? 'conceptual' : 'planned'); assert.equal(runtimeQualified, false);
    assert.ok(nav.includes(page)); assert.match(read(page), /planned/i); assert.ok(html(page));
    assert.doesNotMatch(read(page), /```(?:js|ts|javascript|typescript)\n|npm (?:install|add)/);
  }
});
test('landing getting-started import-export and compatibility all link migration and comparison', () => {
  for (const page of ['_index.md','getting-started/_index.md','guides/getting-started.md','guides/document-formats.md','reference/compatibility.md']) {
    const content = read(`content/docs/${page}`);
    for (const section of ['migrate','compare']) assert.ok(content.includes(`@/docs/${section}/_index.md`), `${page} → ${section}`);
  }
});
test('guide template and owned integration guides state prerequisites versions examples recovery and migration', () => {
  for (const path of ['maintenance/guide-template.md', ...['getting-started','local-first','extensions','document-formats','cloud-hosting'].map(x=>`content/docs/guides/${x}.md`)]) {
    const text = read(path);
    for (const field of ['Prerequisites','Tested version','Example and expected outcome','Failure and recovery','Migration and compatibility']) assert.ok(text.includes(field), `${path}: ${field}`);
  }
});
test('search index includes every reader entry and planned destination but no maintenance or internal roadmap', () => {
  const index = readFileSync(join(work, 'search_index.en.js'), 'utf8');
  for (const page of nav.filter(x=>x.startsWith('content/docs/'))) {
    const path = route(page).replace(/index\.html$/, '');
    assert.ok(index.includes(url + path), path);
  }
  assert.doesNotMatch(index, /maintenance\/guide-template|\.roadmap-runner|DWF-1\.|DOC-1\./);
});
test('production asset and internal-link checks cover the expanded reader site', () => {
  const result = checkSiteAssets(work, url);
  assert.equal(result.html, nav.length + 1); assert.ok(result.references > 1000);
  assert.deepEqual(result.errors, []);
});
test('comparison and migration entries preserve absent evidence and data safety boundaries', () => {
  assert.match(read('content/docs/compare/_index.md'), /Not yet measured/);
  assert.match(read('content/docs/migrate/_index.md'), /Rollback must preserve edits made after cutover/);
  assert.match(read('content/docs/troubleshooting/_index.md'), /Never silently clear documents, downgrade schemas/);
  assert.match(read('content/docs/guides/document-formats.md'), /PDF.*export.only/);
});
