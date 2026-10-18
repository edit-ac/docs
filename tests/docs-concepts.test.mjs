import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');
const manifest = JSON.parse(read('examples/manifest.json'));
const example = manifest.examples.find(x => x.id === 'project-kickoff/1');
const transcript = JSON.parse(read(example.transcript));
const steps = transcript.steps;
const step = id => steps.find(x => x.id === id);
const snapshot = id => read(`examples/concepts/${id}.md`);
const initial = '# Project kickoff\n\nOwner: Alex\n\nDue **Friday**\n\n- [ ] Draft agenda\n- [ ] Confirm attendees\n\n[Reference](https://example.invalid/project-kickoff)\n';

test('one original versioned corpus and four independently expected semantic snapshots', () => {
  assert.equal(transcript.fixtureId, 'project-kickoff/1');
  assert.equal(snapshot('kickoff-v1'), initial);
  assert.equal(snapshot('friday-plain-v1'), '# Project kickoff\n\nOwner: Alex\n\nDue Friday\n\n- [ ] Draft agenda\n- [ ] Confirm attendees\n\n[Reference](https://example.invalid/project-kickoff)\n');
  assert.equal(snapshot('paragraph-split-v1'), '# Project kickoff\n\nOwner: Alex\n\nDue\n\n**Friday**\n\n- [ ] Draft agenda\n- [ ] Confirm attendees\n\n[Reference](https://example.invalid/project-kickoff)\n');
  assert.equal(snapshot('remote-owner-v1'), '# Project kickoff\n\nOwner: Alex and Sam\n\nDue **Friday**\n\n- [ ] Draft agenda\n- [ ] Confirm attendees\n\n[Reference](https://example.invalid/project-kickoff)\n');
});
test('stable transcript IDs name complete before/after states without an invented command API', () => {
  assert.deepEqual(steps.map(s => s.id), Array.from({ length: 16 }, (_, i) => `PK-${String(i + 1).padStart(2, '0')}`));
  assert.equal(new Set(steps.map(s => s.state)).size, 16);
  for (const s of steps) {
    for (const field of ['action','selection','history','local','remote']) assert.ok(s[field]?.length, `${s.id} ${field}`);
    assert.ok(snapshot(s.before)); assert.ok(snapshot(s.after));
  }
  for (let i = 1; i < steps.length; i++) assert.equal(steps[i].before, steps[i - 1].after);
  assert.match(transcript.notation, /not an edit.ac schema, API/);
});
test('selection changes no content, bold removal/application preserve words and target Friday', () => {
  assert.equal(step('PK-02').before, step('PK-02').after);
  assert.equal(step('PK-02').selection, 'Friday in due paragraph');
  assert.equal(step('PK-03').after, 'friday-plain-v1');
  assert.equal(step('PK-04').after, 'kickoff-v1');
  assert.equal(snapshot(step('PK-03').after), snapshot(step('PK-04').after).replaceAll('**', ''));
});
test('split/join and undo/redo have independent block and history expectations', () => {
  assert.deepEqual(['PK-05','PK-06','PK-07','PK-08'].map(id => step(id).after), ['paragraph-split-v1','kickoff-v1','paragraph-split-v1','kickoff-v1']);
  assert.deepEqual(['PK-05','PK-06','PK-07','PK-08'].map(id => step(id).history), ['third local history entry','fourth local history entry','join undone','join restored']);
  assert.match(snapshot(step('PK-07').after), /Due\n\n\*\*Friday\*\*/);
});
test('local commit and compatible reopen preserve exact semantic bytes without claiming restored history', () => {
  assert.equal(step('PK-09').local, 'localCommitted'); assert.equal(step('PK-09').remote, 'pending');
  assert.equal(snapshot(step('PK-10').after), initial);
  assert.match(step('PK-10').history, /history restoration not claimed/);
});
test('prepared insertion preserves other blocks and convergence does not confer remote durability', () => {
  assert.equal(step('PK-11').after, 'remote-owner-v1');
  assert.equal(snapshot(step('PK-11').after).replace(' and Sam', ''), initial);
  assert.equal(step('PK-11').local, 'pending'); assert.equal(step('PK-11').remote, 'pending');
  assert.equal(step('PK-12').local, 'localCommitted'); assert.equal(step('PK-12').remote, 'pending');
  assert.equal(step('PK-13').remote, 'remoteCommitted'); assert.match(step('PK-13').action, /covered update/);
  assert.equal(step('PK-11').history, 'remote edit is not a local undo entry');
});
test('read-only and stale rejection preserve content/history; quota failure preserves only last durable snapshot', () => {
  for (const id of ['PK-14','PK-15']) {
    assert.equal(step(id).after, step(id).before); assert.equal(step(id).history, 'no new entry');
  }
  assert.equal(step('PK-16').local, 'failed'); assert.equal(step('PK-16').remote, 'pending');
  assert.equal(step('PK-16').after, 'remote-owner-v1'); assert.equal(step('PK-16').history, 'preserve recovery data');
  assert.match(read('examples/concepts/README.md'), /attempted new edit exists only in recovery data/);
});
test('maturity and artifact fields cannot silently promote conceptual fixtures to runtime evidence', () => {
  assert.equal(manifest.schemaVersion, 1); assert.equal(example.parent, 'DWF-1.31');
  for (const item of [example, transcript]) { assert.equal(item.maturity, 'conceptual'); assert.equal(item.runtimeQualified, false); }
  assert.equal(example.testedSdkVersion, null); assert.equal(example.profile, null); assert.equal(example.license, 'Apache-2.0');
  assert.match(example.relatedEvidence.scope, /not Project kickoff runtime proof/);
  assert.ok(existsSync(join(root, example.relatedEvidence.manifest)));
  const evidence = JSON.parse(read(example.relatedEvidence.manifest));
  assert.ok(Object.keys(evidence).length > 0);
});
test('all download/source bytes and hashes agree and manifest links every immutable fixture', () => {
  for (const [name, hash] of Object.entries(example.files)) {
    const bytes = readFileSync(join(root, 'examples/concepts', name));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.deepEqual(readFileSync(join(root, 'static', example.downloadBase, name)), bytes);
  }
  execFileSync(process.execPath, ['scripts/prepare-concepts.mjs', '--check'], { cwd: root });
});
test('concept pages are navigable, linked to real references and explicit about failure/recovery and maturity', () => {
  const nav = JSON.parse(read('navigation.json')).pages;
  for (const path of ['content/docs/concepts/_index.md', ...example.pages]) {
    const text = read(path); assert.ok(nav.includes(path));
    for (const label of ['Status: conceptual','Prerequisites:','Tested version:','Example and expected outcome','Failure and recovery','Migration and compatibility']) assert.ok(text.includes(label), `${path}: ${label}`);
    assert.doesNotMatch(text, /```(?:js|ts|javascript|typescript)\n|npm (?:install|add)/);
    for (const match of text.matchAll(/\]\(@\/([^\)]+)\)/g)) assert.ok(existsSync(join(root, 'content', match[1])), `${path}: ${match[1]}`);
    for (const match of text.matchAll(/\]\((\/concepts\/[^\)]+)\)/g)) assert.ok(existsSync(join(root, 'static', match[1])), `${path}: ${match[1]}`);
  }
  const editing = read(example.pages[1]); const saving = read(example.pages[2]);
  for (const id of ['PK-02','PK-03','PK-04','PK-05','PK-06','PK-07','PK-08','PK-14','PK-15']) assert.ok(editing.includes(id));
  for (const id of ['PK-09','PK-10','PK-11','PK-12','PK-13','PK-16']) assert.ok(saving.includes(id));
  for (const name of ['api-document','api-commands','api-selection','api-events','api-storage','api-sync']) assert.ok(read('content/docs/concepts/_index.md').includes(`@/docs/reference/${name}.md`));
  assert.match(saving, /unsubscribe.*detach.*destroy.*close/);
});
