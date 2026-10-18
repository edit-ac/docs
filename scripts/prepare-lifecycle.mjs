import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function lifecycleOutputs() {
  const directory=join(root,'examples/lifecycle'),bytes=readFileSync(join(directory,'manifest.json')),manifest=JSON.parse(bytes);
  assert.equal(manifest.parent,'DWF-1.33');assert.equal(manifest.published,false);
  assert.ok(Object.keys(manifest.files).length>=7,'Complete nonempty consumer inventory');
  const outputs=new Map([['static/reference-inputs/lifecycle-v1/manifest.json',bytes]]);
  for(const [file,digest] of Object.entries(manifest.files)) {
    assert.match(file,/^[a-zA-Z0-9_.-]+$/);const content=readFileSync(join(directory,file));assert.equal(hash(content),digest,`Lifecycle source drift: ${file}`);
    outputs.set(`static/reference-inputs/lifecycle-v1/${file}`,content);
  }
  for(const [file,digest] of Object.entries(manifest.declarations))assert.equal(hash(readFileSync(join(root,'static/reference-inputs/local-pin-1.3',file))),digest,`Lifecycle declaration drift: ${file}`);
  const source=readFileSync(join(directory,'consumer.mjs'),'utf8').split('\n');
  for(const [id,snippet] of Object.entries(manifest.snippets)) {
    assert.equal(source[snippet.start-2],`// snippet:${id}:start`);assert.equal(source[snippet.end],`// snippet:${id}:end`);
    const content=Buffer.from(source.slice(snippet.start-1,snippet.end).join('\n')+'\n');assert.equal(hash(content),snippet.sha256,`Lifecycle snippet drift: ${id}`);
    outputs.set(`static/reference-inputs/lifecycle-v1/${id}.mjs`,content);
  }
  const page='content/docs/reference/lifecycle.md';let text=readFileSync(join(root,page),'utf8');
  for(const id of Object.keys(manifest.snippets)) {
    const start=`<!-- snippet:${id}:start -->`,end=`<!-- snippet:${id}:end -->`;assert.equal(text.split(start).length,2);assert.equal(text.split(end).length,2);
    const a=text.indexOf(start)+start.length,b=text.indexOf(end);text=text.slice(0,a)+'\n```js\n'+outputs.get(`static/reference-inputs/lifecycle-v1/${id}.mjs`)+ '```\n'+text.slice(b);
  }
  outputs.set(page,Buffer.from(text));return outputs;
}
export function prepareLifecycle(check=false) {
  const outputs=lifecycleOutputs(),directory=join(root,'static/reference-inputs/lifecycle-v1');
  if(check)assert.deepEqual(readdirSync(directory).sort(),[...outputs.keys()].filter(f=>f.startsWith('static/')).map(f=>f.split('/').at(-1)).sort());
  else mkdirSync(directory,{recursive:true});
  for(const [file,bytes] of outputs)if(check)assert.deepEqual(readFileSync(join(root,file)),bytes,`Lifecycle generated drift: ${file}`);else writeFileSync(join(root,file),bytes);
  return outputs.size;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(`Lifecycle source/snippet/download files: ${prepareLifecycle(process.argv.includes('--check'))}; runtime cases: 0`);
