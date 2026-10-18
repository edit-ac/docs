import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function catalogOutputs(){
 const base=join(root,'examples/extension-configurations'),ad=JSON.parse(readFileSync(join(base,'admission.json'))),recipes=JSON.parse(readFileSync(join(base,'owner-recipes.json')));
 assert.equal(ad.parent,'DWF-1.34');assert.equal(ad.published,false);assert.equal(recipes.recipes.length,9);assert.equal(recipes.guides.length,6);
 for(const p of [...ad.pins,...ad.receipts])assert.equal(hash(readFileSync(join(base,p.file))),p.sha256,`Immutable catalog input drift: ${p.file}`);
 for(const r of recipes.recipes){const original=ad.pins.find(p=>p.path===r.source);assert.ok(original);const text=readFileSync(join(base,original.file),'utf8').split('\n').slice(r.startLine-1,r.endLine).join('\n')+'\n';assert.equal(hash(text),r.sha256);assert.equal(readFileSync(join(base,r.output),'utf8'),text);}
 for(const guide of recipes.guides){const pin=ad.pins.find(p=>p.path===guide.path);assert.ok(pin);assert.equal(pin.sha256,guide.sha256,'Owning guide manifest drift');}
 const catalog=JSON.parse(readFileSync(join(base,'catalog.json')));assert.equal(catalog.sdkVersion,'0.0.0');assert.equal(catalog.entries.length,6);
 for(const entry of catalog.entries){for(const field of ['options','dependencies','conflicts','cost','input','action','output','serialization','accessibility','cancel','page'])assert.ok(entry[field]);const text=readFileSync(join(root,entry.page),'utf8');for(const field of ['kind','options','dependencies','conflicts','cost','input','action','output','serialization','accessibility','cancel'])assert.ok(text.toLowerCase().includes(entry[field].toLowerCase()),`Stale catalog ${field}: ${entry.id}`);}
 const outputs=new Map();function walk(dir){for(const file of readdirSync(join(base,dir),{withFileTypes:true})){const path=join(dir,file.name);if(file.isDirectory())walk(path);else outputs.set('static/reference-inputs/extension-configurations-v1/'+path,readFileSync(join(base,path)));}}walk('');
 outputs.set('static/reference-inputs/extension-configurations-v1/prepare-extension-catalog.mjs',readFileSync(join(root,'scripts/prepare-extension-catalog.mjs')));
 outputs.set('static/reference-inputs/extension-configurations-v1/catalog.test.mjs',readFileSync(join(root,'tests/docs-extension-catalog.test.mjs')));return outputs;
}
export function prepareCatalog(check=false){const outputs=catalogOutputs();for(const [path,bytes] of outputs){const p=join(root,path);if(check)assert.equal(hash(readFileSync(p)),hash(bytes),`Generated catalog drift: ${path}`);else{mkdirSync(dirname(p),{recursive:true});writeFileSync(p,bytes);}}return outputs.size;}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(`Catalog ${process.argv.includes('--check')?'checked':'prepared'}: ${prepareCatalog(process.argv.includes('--check'))} files`);
