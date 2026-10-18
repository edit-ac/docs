import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, relative, dirname } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function loadManifest() {
  const manifest = JSON.parse(readFileSync(resolve(root, 'examples/formats/manifest.json')));
  return validateManifest(manifest);
}
export function validateManifest(manifest) {
  if (manifest.schemaVersion !== 1 || manifest.id !== 'formats-native/1' || manifest.records.length !== 9)
    throw Error('Invalid format manifest');
  const ids = new Set();
  for (const row of manifest.records) {
    if (ids.has(row.id) || !['import', 'export'].includes(row.direction)
      || !/^[a-f0-9]{40}$/.test(row.coreCommit) || !/^[a-f0-9]{40}$/.test(row.architectureCommit))
      throw Error('Invalid or duplicate format identity');
    ids.add(row.id);
    const file = resolve(root, 'examples/formats', row.profile.file);
    if (relative(resolve(root, 'examples/formats'), file).startsWith('..')
      || digest(readFileSync(file)) !== row.profile.sha256) throw Error(`Profile drift: ${row.id}`);
    const counts = row.receipt.counts;
    if (!counts || counts.passed <= 0 || counts.failed !== 0 || counts.skipped !== 0
      || counts.executed !== counts.passed) throw Error(`Unqualified receipt counts: ${row.id}`);
  }
  if (manifest.records.some(row => row.format === 'PDF' && row.direction === 'import')) throw Error('PDF is export-only');
  return manifest;
}
export function renderMatrix(manifest) {
  const lines = [
    '+++', 'title = "Format versions and fidelity"',
    'description = "Pinned local conversion subsets and their host qualification limits."', 'weight = 7', '+++', '',
    '**Status: local source evidence; packaged host integration pending.** These are optional converter subsets, not install-ready browser/native support. All artifacts are unpublished. Counts below are reused owning receipts, not new runtime checks.', '',
    '## Before you start', '',
    '**Prerequisites:** an exact converter profile, original file retention and a separately qualified host. **Tested version:** each row names its immutable implementation commit. Download the <a href="{{ get_url(path="formats-native/v1/manifest.json") }}">evidence manifest</a> for receipt hashes, profile hashes and owning consumer source identities.', '',
    '## Directional subsets', '',
    '| Format / direction | Version and profile | Fidelity and exclusions | Retained proof |',
    '| --- | --- | --- | --- |',
  ];
  for (const row of manifest.records) lines.push(`| ${row.format} / ${row.direction} | Core \`${row.coreCommit}\`; <a href="{{ get_url(path="formats-native/v1/${row.profile.file}") }}">profile</a> | ${row.fidelity} | ${row.gate}: ${row.receipt.counts.passed} passed, 0 failed/skipped; receipt SHA256 \`${row.receipt.sha256}\` |`);
  lines.push('', '**PDF is export-only.** PDF input and OCR are unsupported, including renamed files detected by signature. CSV/TSV conversion is not qualified by these receipts. Markdown, safe HTML, plain text and semantic JSON are separate baseline codecs; this matrix makes no new baseline install claim.', '',
    '## Platform admission', '', '| Host | Guide status | Required owner evidence |', '| --- | --- | --- |');
  for (const host of manifest.platforms) lines.push(`| ${host.name} | **${host.status}**; no runnable conversion-host claim | Roadmap ${host.ownerRoadmap}; immutable packaged consumer plus applicable platform proof |`);
  lines.push('', 'WASM compilation proves a build target only. A native Rust Session test, macOS output-reader check or isolated PDF executable does not prove a Swift/Kotlin/desktop picker, platform sandbox, browser worker or CLI save lifecycle.', '',
    '## Example and expected outcome', '', 'Follow [preview, cancel and restore](@/docs/guides/document-formats.md) for the host workflow and [native integration boundaries](@/docs/guides/native-formats.md) for platform-specific prerequisites. These guides are conceptual until the named host boundary qualifies.', '',
    '## Failure and recovery', '', 'An unavailable adapter or missing isolation capability must fail before mutation. Retain the original input and current document; never substitute a remote converter or silently accept loss.', '',
    '## Migration and compatibility', '', 'See [compatibility](@/docs/reference/compatibility.md), [Migrate to edit.ac](@/docs/migrate/_index.md) and [Compare editors](@/docs/compare/_index.md). Import/export does not transfer plugin behavior, live CRDT identity or collaborative history.', '');
  return lines.join('\n');
}
export function outputs(manifest) {
  const files = { 'static/formats-native/v1/manifest.json': readFileSync(resolve(root, 'examples/formats/manifest.json')),
    'content/docs/guides/format-support.md': Buffer.from(renderMatrix(manifest)) };
  for (const row of manifest.records) files[`static/formats-native/v1/${row.profile.file}`] = readFileSync(resolve(root, 'examples/formats', row.profile.file));
  return files;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const files = outputs(loadManifest());
  for (const [name, bytes] of Object.entries(files)) {
    const target = resolve(root, name);
    if (check) { if (!readFileSync(target).equals(bytes)) throw Error(`Generated format drift: ${name}`); }
    else { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes); }
  }
  const downloads = resolve(root, 'static/formats-native/v1');
  const actual = readdirSync(downloads, { recursive: true, withFileTypes: true }).filter(x => x.isFile()).length;
  if (actual !== 10) throw Error('Unexpected format download inventory');
  console.log(`Formats: 9 pinned profiles, 7 conceptual hosts, ${Object.keys(files).length} generated files; runtime executions: 0`);
}
