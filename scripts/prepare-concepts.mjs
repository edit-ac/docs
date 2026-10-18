import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifestBytes = readFileSync(join(root, 'examples/manifest.json'));
const example = JSON.parse(manifestBytes).examples.find(x => x.id === 'project-kickoff/1');
const out = join(root, 'static', example.downloadBase);
const check = process.argv.includes('--check');
if (!check) mkdirSync(out, { recursive: true });
const outputs = { 'manifest.json': manifestBytes };
for (const [name, hash] of Object.entries(example.files)) {
  const bytes = readFileSync(join(root, 'examples/concepts', name));
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error(`Concept source drift: ${name}`);
  outputs[name] = bytes;
}
if (check && readdirSync(out).sort().join() !== Object.keys(outputs).sort().join()) throw new Error('Concept download inventory drift');
for (const [name, bytes] of Object.entries(outputs)) {
  const target = join(out, name);
  if (check) { if (!readFileSync(target).equals(bytes)) throw new Error(`Concept download drift: ${name}`); }
  else writeFileSync(target, bytes);
}
console.log(`Concept sources/downloads: ${Object.keys(outputs).length} files ${check ? 'checked' : 'prepared'}; runtime cases: 0`);
