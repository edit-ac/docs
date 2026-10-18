import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadManifest, validateManifest, digest, outputs, renderMatrix } from '../scripts/prepare-formats.mjs';
import { selectSuite, requireFormatsConsumer } from '../scripts/check-examples.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = loadManifest();
const read = path => readFileSync(resolve(root, path), 'utf8');
const workflow = read('content/docs/guides/document-formats.md');
const native = read('content/docs/guides/native-formats.md');

test('each directional profile and receipt is authenticated against its original immutable Git blob', () => {
  // This local proof needs the adjacent owning repositories; it never fetches.
  for (const row of manifest.records) {
    for (const [repo, commit, path, hash] of [
      ['core', row.coreCommit, row.profile.path, row.profile.sha256],
      ['core', row.coreCommit, row.consumerSource.path, row.consumerSource.sha256],
      ['architecture', row.architectureCommit, row.receipt.path, row.receipt.sha256],
    ]) {
      const bytes = execFileSync('git', ['-C', resolve(root, '..', repo), 'show', `${commit}:${path}`]);
      assert.equal(digest(bytes), hash, `${row.id}: ${path}`);
      if (repo === 'architecture') {
        const receipt = JSON.parse(bytes);
        assert.equal(receipt.coreCommit, row.coreCommit);
        assert.deepEqual(receipt.totals ?? receipt.finalCounts, row.receipt.counts);
      }
    }
  }
});
test('all generated matrix and download bytes match the pinned source', () => {
  for (const [path, bytes] of Object.entries(outputs(manifest))) assert.deepEqual(readFileSync(resolve(root, path)), bytes, path);
  assert.match(renderMatrix(manifest), /Counts below are reused owning receipts/);
});
test('matrix independently covers nine supported directions and refuses PDF import', () => {
  assert.deepEqual(manifest.records.map(r => [r.format, r.direction]), [
    ['DOCX','import'],['DOCX','export'],['PDF','export'],['ODT 1.3','import'],['ODT 1.3','export'],
    ['RTF 1.9.1','import'],['RTF 1.9.1','export'],['EPUB 3.3','import'],['EPUB 3.3','export'],
  ]);
  const altered = structuredClone(manifest);
  altered.records[2].direction = 'import';
  assert.throws(() => validateManifest(altered), /PDF is export-only/);
  assert.match(workflow, /renamed PDF still fails as export-only/);
});
test('profile tampering, failed/skipped evidence and duplicate records cannot qualify', () => {
  for (const mutate of [m => m.records[0].profile.sha256 = '0'.repeat(64),
    m => m.records[0].receipt.counts.skipped = 1,
    m => m.records[0].receipt.counts.failed = 1,
    m => m.records[0].receipt.counts.passed = 0,
    m => m.records[1].id = m.records[0].id]) {
    const changed = structuredClone(manifest); mutate(changed);
    assert.throws(() => validateManifest(changed));
  }
});
test('all native/browser/CLI hosts remain conceptual without packaged consumer evidence', () => {
  assert.equal(manifest.platforms.length, 7);
  for (const host of manifest.platforms) {
    assert.equal(host.status, 'conceptual'); assert.equal(host.packageConsumer, null);
  }
  assert.deepEqual(manifest.admission.claimedHosts, []);
  assert.match(native, /no native host package version is qualified/i);
  assert.match(native, /physical or virtual platform checks/);
  assert.match(native, /hardware-only equivalents/);
});
test('import recipe preserves original, reports losses, revalidates target and cancels only owned work', () => {
  for (const text of ['Retain the original bytes','complete conversion diagnostics','explicit lossy decision',
    'revalidate the target','one shared Session insertion','retire only this job',
    'No insertion','preserve newer edits','No job, asset staging or document change']) {
    assert.ok(workflow.toLowerCase().includes(text.toLowerCase()), text);
  }
});
test('export and restore recipe distinguishes conversion, destination completion and newer revisions', () => {
  for (const text of ['Artifact contains only N; N+1 remains unsaved','write or close fails',
    'Duplicate or foreign completion','No destination write','no successful truncated file',
    'journal durability','undo path only where the host qualifies it','separate document'])
    assert.ok(workflow.toLowerCase().includes(text.toLowerCase()), text);
});
test('each native family has explicit access/cleanup and independent pending outcomes', () => {
  for (const host of ['iOS / Swift','Android / Kotlin','macOS','Windows','Linux','Terminal / CLI']) assert.ok(native.includes(host));
  for (const text of ['source bytes, diagnostics, document content','selection, history and staged-resource count',
    'confirm','actual output','newer revision stays','pending host assertions']) assert.ok(native.includes(text), text);
});
test('new pages are discoverable and explain prerequisites/version/failure/recovery', () => {
  const pages = JSON.parse(read('navigation.json')).pages;
  for (const name of ['document-formats','format-support','native-formats']) {
    const path = `content/docs/guides/${name}.md`;
    assert.ok(pages.includes(path)); assert.ok(existsSync(resolve(root,path)));
    const page = read(path);
    for (const heading of ['Before you start','Tested version','Example and expected outcome','Failure and recovery','Migration and compatibility']) assert.ok(page.includes(heading), `${name}: ${heading}`);
  }
});
test('dispatcher rejects unknown, absent, extra and empty suites and does not qualify source tests', () => {
  assert.equal(selectSuite(['--suite','formats-native']), 'formats-native');
  for (const args of [[],['--suite'],['--suite',''],['--suite','unknown'],['--suite','formats-native','extra']]) assert.throws(() => selectSuite(args));
  assert.throws(() => requireFormatsConsumer(manifest), /no immutable packaged/);
  const altered = structuredClone(manifest); altered.admission.claimedHosts = ['pretend-host'];
  assert.throws(() => requireFormatsConsumer(altered), /runner and independent outcome/);
  const child = spawnSync(process.execPath, ['scripts/check-examples.mjs','--suite','unknown'], {cwd:root,encoding:'utf8'});
  assert.equal(child.status,1);assert.match(child.stderr,/Unknown or absent/);
});
