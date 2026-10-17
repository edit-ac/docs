import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { renderReference, declaration, digest } from '../scripts/generate-reference.mjs';
import { checkDocs } from '../scripts/check-docs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(resolve(root, name), 'utf8');
const manifest = JSON.parse(read('releases/local-pin-1.3.json'));
const result = renderReference(root);
function fixture(t) {
  const base = mkdtempSync(resolve(tmpdir(), 'editac-reference-'));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  cpSync(resolve(root, 'releases'), resolve(base, 'releases'), { recursive: true });
  cpSync(resolve(root, 'static/reference-inputs'), resolve(base, 'static/reference-inputs'), { recursive: true });
  return base;
}
function edit(base, path, change) {
  const file = resolve(base, path);
  const value = JSON.parse(readFileSync(file, 'utf8'));
  change(value); writeFileSync(file, JSON.stringify(value));
}

test('all eight required public families and four actual core profiles generate deterministically', () => {
  assert.equal(result.families, 8); assert.equal(result.profiles, 4);
  assert.equal(result.signatureCount, 28); assert.equal(result.inputCount, 141);
  assert.equal(result.outputs.size, 10);
  assert.deepEqual(renderReference(root).outputs, result.outputs);
  for (const [path, bytes] of result.outputs) assert.equal(read(path), bytes, `generated drift: ${path}`);
});
test('published declaration excerpts retain exact parameters and outcome types from the packed consumer', () => {
  const document = result.outputs.get('content/docs/reference/api-document.md');
  assert.ok(document.includes('read(): Snapshot;'));
  assert.ok(document.includes('commit(request: PrepareRequest): CommitResult;'));
  const lifecycle = result.outputs.get('content/docs/reference/api-lifecycle.md');
  assert.ok(lifecycle.includes('createEditor(root: HTMLElement, options: EditorOptions): BrowserEditor;'));
  assert.ok(lifecycle.includes("policy: 'flush' | 'report';"));
  const events = result.outputs.get('content/docs/reference/api-events.md');
  assert.ok(events.includes('subscribe(scope: PatchScope, listener: (patch: Patch) => void): () => void;'));
  assert.ok(events.includes('localCommitted: LocalCommit | null;'));
});
test('absent, private and protected methods cannot become public reference entries', () => {
  const input = 'export declare class Editor { private hidden(): void; protected base(): void; read(): string; }';
  assert.throws(() => declaration(input, 'Editor.missing'), /Absent public member/);
  assert.throws(() => declaration(input, 'Editor.hidden'), /Private declaration/);
  assert.throws(() => declaration(input, 'Editor.base'), /Private declaration/);
  assert.doesNotMatch(declaration(input, 'Editor'), /hidden|base/);
  assert.match(declaration(input, 'Editor'), /read\(\): string/);
});
test('changed package declaration bytes fail before a new reference can be generated', t => {
  const base = fixture(t);
  writeFileSync(resolve(base, 'static/reference-inputs/local-pin-1.3/web/dist/editor.d.ts'), 'export declare class Fake {}');
  assert.throws(() => renderReference(base), /Input drift: web\/dist\/editor.d.ts/);
});
test('unknown format, missing family and unexported symbols cannot silently reduce coverage', t => {
  const base = fixture(t);
  const path = 'releases/reference-entries.json';
  const original = readFileSync(resolve(base, path));
  edit(base, path, v => v.schemaVersion = 2);
  assert.throws(() => renderReference(base), /Unknown reference format/);
  writeFileSync(resolve(base, path), original);
  edit(base, path, v => v.entries.pop());
  assert.throws(() => renderReference(base), /Missing\/duplicate reference family/);
  writeFileSync(resolve(base, path), original);
  edit(base, path, v => v.entries[0].signatures[0] = ['editor.d.ts', 'FakeEditor']);
  assert.throws(() => renderReference(base), /Not exported/);
});
test('unsafe source paths and empty manifests are rejected', t => {
  const base = fixture(t), path = 'releases/local-pin-1.3.json';
  edit(base, path, v => v.inputs[0].path = '../escape');
  assert.throws(() => renderReference(base), /Unsafe input path/);
  edit(base, path, v => v.inputs = []);
  assert.throws(() => renderReference(base), /Empty\/duplicate inputs/);
});
test('reviewed archive identities and exact reused runtime scope remain explicit', () => {
  assert.equal(manifest.packages[0].sha256, '8c31e6f6ce4ed4f61b2b3c7a06b4204a4fad3349af07c61c03184f69a80a265c');
  assert.equal(manifest.packages[1].sha256, 'a057d623d3a24e609b400c2535158e9cc28e2c091f214464a93133c0758910ba');
  assert.equal(manifest.runtimeEvidence.sha256, '4ec8439f234acb12b88b69d76a4893755eaa88e1d7c8b3f3881dc62bf05fea0c');
  assert.deepEqual(manifest.runtimeEvidence.counts, { executed: 12, passed: 12, failed: 0, skipped: 0 });
  assert.deepEqual(manifest.entryEvidence.map(e => e.roadmap), ['08-sdk-integration', '30-architecture-fitness']);
  assert.ok(manifest.packages.every(p => p.version === '0.0.0' && p.published === false));
});
test('failed or skipped reused runtime evidence cannot be represented as qualified', t => {
  const base = fixture(t);
  edit(base, 'releases/local-pin-1.3.json', v => v.runtimeEvidence.counts.skipped = 1);
  assert.throws(() => renderReference(base), /Unqualified reused receipt/);
});
test('capability states and version axes come from raw profiles without native promotion', () => {
  const table = result.outputs.get('content/docs/reference/api-capabilities.md');
  assert.match(table, /historical reviewed core metadata/);
  assert.match(table, /current release-profile producer rejects stale package input hashes/);
  const profile = JSON.parse(read('static/reference-inputs/local-pin-1.3/source/contracts/profiles/portable-editor-v5.json'));
  assert.equal(profile.resources.qualified, false);
  assert.deepEqual(profile.capabilities.map(c => c.state), [
    { available: true, enabled: false, authorized: null, qualified: false },
    { available: true, enabled: false, authorized: null, qualified: false },
  ]);
  assert.match(table, /editor.read \| true \| false \| null \| false/);
  for (const value of Object.values(profile.versions)) assert.ok(table.includes(String(value)));
  for (const name of ['ios', 'android', 'desktop']) {
    const native = JSON.parse(read(`static/reference-inputs/local-pin-1.3/source/native/${name}/capability.json`));
    assert.ok(native.capabilities.every(c => !c.state.qualified));
    assert.ok(native.capabilities.filter(c => c.id.startsWith('editor.')).every(c => !c.state.available));
  }
});
test('every reference has source, qualified consumer, concepts, contracts, errors and version history', () => {
  const nav = JSON.parse(read('navigation.json')).pages;
  for (const [path, page] of result.outputs) {
    if (!path.endsWith('.md')) continue;
    assert.ok(nav.includes(path));
    assert.ok(page.includes('@/docs/concepts/_index.md'));
    assert.ok(page.includes('@/docs/examples/qualified-local.md'));
    if (path.endsWith('api-capabilities.md')) continue;
    for (const title of ['Parameters and results','Contract and outcomes','Errors and recovery','Prerequisites and platform limits','Version history']) assert.ok(page.includes(`## ${title}`));
    assert.match(page, /unpublished local packed artifact/);
    assert.doesNotMatch(page, /npm (install|add)/);
  }
});
test('all generated content, manifest and consumer download URLs resolve inside static assets', () => {
  const pages = [...result.outputs.values(), read('content/docs/examples/qualified-local.md')];
  let checked = 0;
  for (const page of pages) for (const match of page.matchAll(/\]\((\/reference-inputs\/[^)]+)\)/g)) {
    assert.ok(existsSync(resolve(root, 'static', match[1].slice(1))), match[1]); checked++;
  }
  assert.equal(checked, 59, 'all declaration, profile, manifest and consumer links');
  // Relative declaration imports resolve to the full original packed declaration graph.
  for (const input of manifest.inputs.filter(i => i.path.endsWith('.d.ts'))) {
    const path = `static/reference-inputs/local-pin-1.3/${input.path}`;
    for (const match of read(path).matchAll(/(?:from\s+|import\()['"](\.[^'"]+)['"]/g)) {
      const target = resolve(root, dirname(path), match[1].replace(/\.js$/, '.d.ts'));
      assert.ok(existsSync(target), `${input.path} -> ${match[1]}`);
    }
  }
});
test('the docs checker validates static download links while treating frozen Markdown as source', t => {
  const base = mkdtempSync(resolve(tmpdir(), 'editac-download-links-'));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  mkdirSync(resolve(base, 'content'), { recursive: true });
  mkdirSync(resolve(base, 'static/reference-inputs'), { recursive: true });
  writeFileSync(resolve(base, 'navigation.json'), JSON.stringify({ schemaVersion: 1, pages: ['content/_index.md'] }));
  writeFileSync(resolve(base, 'static/reference-inputs/README.md'), '# Original source\n[original checkout](missing-in-download.md)');
  writeFileSync(resolve(base, 'content/_index.md'), '+++\ntitle = "Home"\n+++\n[Source](/reference-inputs/README.md)');
  assert.deepEqual(checkDocs(base).errors, []);
  writeFileSync(resolve(base, 'content/_index.md'), '+++\ntitle = "Home"\n+++\n[Source](/reference-inputs/missing.md)');
  assert.deepEqual(checkDocs(base).errors, ['Broken local link: content/_index.md -> /reference-inputs/missing.md']);
});
