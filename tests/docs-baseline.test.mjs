import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDocs } from '../scripts/check-docs.mjs';

function fixture(t, { body = '', nav = ['content/_index.md'], extra = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'editac-docs-links-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const [name, text] of Object.entries({
    'navigation.json': JSON.stringify({ schemaVersion: 1, pages: nav }),
    'content/_index.md': `+++\ntitle = "Home"\n+++\n${body}`,
    ...extra,
  })) {
    const path = join(root, name);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, text);
  }
  return root;
}

test('checks an intact prose link and reference link without treating code as content', t => {
  const root = fixture(t, { body: '[Home](@/_index.md)\n[again][home]\n[home]: @/_index.md\n```md\n[illustration](missing.md)\n```' });
  assert.deepEqual(checkDocs(root), { pages: 1, navigation: 1, errors: [] });
});

test('reports a broken Markdown page link', t => {
  assert.deepEqual(checkDocs(fixture(t, { body: '[Missing](@/missing.md)' })).errors,
    ['Broken local link: content/_index.md -> @/missing.md']);
});

test('reports a broken homepage action in TOML front matter', t => {
  const root = fixture(t, { extra: { 'content/_index.md': '+++\ntitle = "Home"\nactions = [{ label = "Guide", path = "@/missing.md" }]\n+++\n' } });
  assert.deepEqual(checkDocs(root).errors, ['Broken local link: content/_index.md -> @/missing.md']);
});

test('reports broken reference-link targets in repository documentation', t => {
  const root = fixture(t, { extra: { 'README.md': '# Read\n[Guide][guide]\n[guide]: content/missing.md' } });
  assert.deepEqual(checkDocs(root).errors, ['Broken local link: README.md -> content/missing.md']);
});

test('requires all public content to be inventoried and titled', t => {
  const result = checkDocs(fixture(t, { extra: { 'content/orphan.md': 'No front matter' } }));
  assert.deepEqual(result.errors, ['Missing Zola page title: content/orphan.md', 'Unlisted public page: content/orphan.md']);
});

test('rejects duplicate, absent and non-content navigation targets', t => {
  const root = fixture(t, { nav: ['content/_index.md', 'content/_index.md', 'content/missing.md', '../outside.md'] });
  assert.deepEqual(checkDocs(root).errors, ['Duplicate navigation entries', 'Missing navigation target: content/missing.md',
    'Invalid navigation target: ../outside.md', 'Missing navigation target: ../outside.md']);
});

test('ignores upstream themes and generated site output', t => {
  const root = fixture(t, { extra: { 'themes/upstream/README.md': '[broken](missing)', 'public/example.md': 'Generated page' } });
  assert.deepEqual(checkDocs(root), { pages: 1, navigation: 1, errors: [] });
});
