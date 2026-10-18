import {assertQuickstartProof} from './check-quickstarts.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function quickstartOutputs() {
 const directory=join(root,'examples/quickstarts');
 const raw=readFileSync(join(directory,'manifest.json'));const manifest=JSON.parse(raw);
 assert.equal(manifest.parent,'DWF-1.5');assert.equal(manifest.published,false);
 assert.equal(manifest.candidate,'sdk-framework-v1');assert.equal(manifest.fixture,'project-kickoff/1');
 assert.ok(Object.keys(manifest.files).length>=15);
 const proof=JSON.parse(readFileSync(join(directory,manifest.qualification)));
 assert.equal(proof.candidate,manifest.candidate);assert.equal(proof.published,false);
 assert.deepEqual(Object.keys(proof.suites).sort(),['astro','web-react']);
 assert.deepEqual(Object.keys(proof.sourceFiles).sort(),Object.keys(manifest.files).filter(f=>f!==manifest.qualification).sort());
 for(const [file,digest] of Object.entries(proof.sourceFiles))assert.equal(digest,manifest.files[file],`Runtime proof source drift: ${file}`);
 for(const [name,suite] of Object.entries(proof.suites))assertQuickstartProof(name,suite.summary.counts,suite);
 const outputs=new Map([['static/reference-inputs/quickstarts-v1/manifest.json',raw]]);
 for(const [file,digest] of Object.entries(manifest.files)) {
  assert.ok(!file.split('/').includes('..')&&!file.startsWith('/'));
  const bytes=readFileSync(join(directory,file));assert.equal(hash(bytes),digest,`Quickstart source drift: ${file}`);
  outputs.set(`static/reference-inputs/quickstarts-v1/${file}`,bytes);
 }
 for(const [id,snippet] of Object.entries(manifest.snippets)) {
  const lines=readFileSync(join(directory,snippet.file),'utf8').split('\n');
  assert.ok(snippet.start>=1&&snippet.end>=snippet.start&&snippet.end<=lines.length);
  const bytes=Buffer.from(lines.slice(snippet.start-1,snippet.end).join('\n')+'\n');assert.equal(hash(bytes),snippet.sha256,`Quickstart range drift: ${id}`);
  outputs.set(`static/reference-inputs/quickstarts-v1/${id}.mjs`,bytes);
  const page=`content/docs/getting-started/${id}.md`;let text=readFileSync(join(root,page),'utf8');
  const start=`<!-- quickstart:${id}:start -->`,end=`<!-- quickstart:${id}:end -->`;
  assert.equal(text.split(start).length,2);assert.equal(text.split(end).length,2);
  text=text.slice(0,text.indexOf(start)+start.length)+'\n```js\n'+bytes+'```\n'+text.slice(text.indexOf(end));
  outputs.set(page,Buffer.from(text));
 }
 return outputs;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 let stale=0;for(const [file,bytes] of quickstartOutputs()) {
  const path=join(root,file);if(!existsSync(path)||!readFileSync(path).equals(bytes)) {
   if(process.argv.includes('--check')){console.error(`Stale quickstart output: ${file}`);stale++;}
   else {mkdirSync(dirname(path),{recursive:true});writeFileSync(path,bytes);}
  }
 }
 if(stale)process.exitCode=1;
}
