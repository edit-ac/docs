import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
export const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function customOutputs(){
 const base=join(root,'examples/custom-extensions');
 const bytes=readFileSync(join(base,'manifest.json')),m=JSON.parse(bytes);
 assert.equal(m.parent,'DWF-1.35');assert.equal(m.runtimeQualified,false);assert.equal(m.runtimeCases,0);
 assert.deepEqual(m.eqlCandidateIdentities,[]);
 const owner=join(root,'examples/extension-configurations');
 assert.equal(digest(readFileSync(join(owner,'admission.json'))),m.ownerAdmissionSha256);
 const ad=JSON.parse(readFileSync(join(owner,'admission.json')));
 assert.equal(ad.coreCommit,m.ownerSourceCommit);
 assert.equal(digest(readFileSync(join(owner,'owner-recipes.json'))),m.ownerRecipesSha256);
 const recipes=JSON.parse(readFileSync(join(owner,'owner-recipes.json')));
 assert.equal(m.recipeRefs.length,9);
 for(const ref of m.recipeRefs){
  const recipe=recipes.recipes.find(r=>r.id===ref.id);assert.ok(recipe);
  for(const key of ['source','startLine','endLine','sha256'])assert.equal(ref[key],recipe[key]);
  assert.equal(ref.download,'/reference-inputs/extension-configurations-v1/'+recipe.output);
  const pin=ad.pins.find(p=>p.path===ref.source);assert.ok(pin);
  const raw=readFileSync(join(owner,pin.file));assert.equal(digest(raw),pin.sha256);
  const range=raw.toString().split('\n').slice(ref.startLine-1,ref.endLine).join('\n')+'\n';
  assert.equal(digest(range),ref.sha256);
  assert.equal(digest(readFileSync(join(owner,recipe.output))),ref.sha256);
  assert.equal(digest(readFileSync(join(root,'static',ref.download))),ref.sha256);
 }
 const outputs=new Map([['manifest.json',bytes]]);
 for(const [file,hash]of Object.entries(m.files)){
  const b=readFileSync(join(base,file));assert.equal(digest(b),hash,`Custom source drift: ${file}`);outputs.set(file,b);
 }
 for(const pin of m.pins)assert.equal(digest(readFileSync(join(base,pin.file))),pin.sha256);
 return outputs;
}
export function prepareCustom(check=false){
 const output=join(root,'static/reference-inputs/custom-authoring-v1'),files=customOutputs();
 if(check){const actual=[];function visit(dir,prefix=''){for(const e of readdirSync(dir,{withFileTypes:true}))e.isDirectory()?visit(join(dir,e.name),prefix+e.name+'/'):actual.push(prefix+e.name);}visit(output);assert.deepEqual(actual.sort(),[...files.keys()].sort());}
 for(const [file,bytes]of files){const p=join(output,file);if(check)assert.equal(digest(readFileSync(p)),digest(bytes),`Custom download drift: ${file}`);else{mkdirSync(dirname(p),{recursive:true});writeFileSync(p,bytes);}}
 return files.size;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(`Custom authoring sources/downloads: ${prepareCustom(process.argv.includes('--check'))}; runtime cases: 0`);
