import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function commandOutputs() {
  const directory=join(root,'examples/commands');
  const manifestBytes=readFileSync(join(directory,'manifest.json'));
  const manifest=JSON.parse(manifestBytes);
  assert.equal(manifest.schemaVersion,1);assert.equal(manifest.parent,'DWF-1.32');
  assert.ok(Object.keys(manifest.files).length>=4,'Nonempty complete source inventory');
  const outputs=new Map([['static/reference-inputs/commands-v1/manifest.json',manifestBytes]]);
  for(const [name,digest] of Object.entries(manifest.files)) {
    assert.match(name,/^[a-zA-Z0-9_.-]+$/);
    const bytes=readFileSync(join(directory,name));assert.equal(hash(bytes),digest,`Command source drift: ${name}`);
    outputs.set(`static/reference-inputs/commands-v1/${name}`,bytes);
  }
  const source=readFileSync(join(directory,'consumer.mjs'),'utf8').split('\n');
  for(const [id,snippet] of Object.entries(manifest.snippets)) {
    assert.equal(source[snippet.start-2],`// snippet:${id}:start`);
    assert.equal(source[snippet.end],`// snippet:${id}:end`);
    const bytes=Buffer.from(source.slice(snippet.start-1,snippet.end).join('\n')+'\n');assert.equal(hash(bytes),snippet.sha256,`Snippet drift: ${id}`);
    outputs.set(`static/reference-inputs/commands-v1/${id}.mjs`,bytes);
  }
  const page='content/docs/reference/commands.md';
  let text=readFileSync(join(root,page),'utf8');
  for(const id of Object.keys(manifest.snippets)) {
    const start=`<!-- snippet:${id}:start -->`,end=`<!-- snippet:${id}:end -->`;
    assert.equal(text.split(start).length,2);assert.equal(text.split(end).length,2);
    const code=outputs.get(`static/reference-inputs/commands-v1/${id}.mjs`).toString();
    const a=text.indexOf(start)+start.length,b=text.indexOf(end);
    text=text.slice(0,a)+'\n```js\n'+code+'```\n'+text.slice(b);
  }
  outputs.set(page,Buffer.from(text));
  return outputs;
}
export function prepareCommands(check=false) {
  const outputs=commandOutputs();
  const expected=[...outputs.keys()].filter(x=>x.startsWith('static/')).map(x=>x.split('/').at(-1)).sort();
  const directory=join(root,'static/reference-inputs/commands-v1');
  if(check) assert.deepEqual(readdirSync(directory).sort(),expected,'Command download inventory drift');
  else mkdirSync(directory,{recursive:true});
  for(const [file,bytes] of outputs) {
    if(check) assert.deepEqual(readFileSync(join(root,file)),bytes,`Command generated drift: ${file}`);
    else writeFileSync(join(root,file),bytes);
  }
  return outputs.size;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) console.log(`Command source/snippet/download files: ${prepareCommands(process.argv.includes('--check'))}; runtime cases: 0`);
