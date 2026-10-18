import assert from 'node:assert/strict';
import {readFile,mkdir,cp,mkdtemp,rm,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {sourceBundle} from './prepare-playground-formats.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const pins={core:'5ab37e06a8438a150227dd7d1eeb40d27b889d9d5cea979ad067c6236b4437fe',web:'5141c7b8b7b09c77d127b655f21b21a0431b57d8de61d21145649d116d16b003',formats:'f123c85f410fdb294a0ef880cccbe722f142e63fbb75622c07f4f8424adde0ec'};
export async function buildFormatsPlayground(destination){
 assert.equal(process.version,'v24.19.0');
 const producer=resolve(root,'../architecture/evidence/document-conversion/consumers-epub-import-20261018');
 const receipt=JSON.parse(await readFile(join(producer,'delivery.json')));
 assert.equal(receipt.coreCommit,'c15ac91d47f2ddf51bf20056686bc912f5c76a36');
 assert.equal(spawnSync('git',['merge-base','--is-ancestor',receipt.coreCommit,'HEAD'],{cwd:resolve(root,'../core')}).status,0,'Qualified return must be adopted first');
 const temp=await mkdtemp(join(root,'.formats-build-'));
 const facts={parent:'DPG-1.6',candidate:'CNV-1.18-C2-EI-canonical2',version:'0.0.0',published:false,releaseQualified:false,receipt:'consumers-epub-import-20261018/delivery.json',receiptSha256:sha(await readFile(join(producer,'delivery.json'))),packages:[],sources:{},members:{},fixture:'project-kickoff/1'};
 try{
  await mkdir(destination,{recursive:true});
  for(const [name,hash] of Object.entries(pins)){
   const archive=join(producer,'canonical2',`edit-ac-${name}-0.0.0.tgz`),bytes=await readFile(archive);assert.equal(sha(bytes),hash);
   const dir=join(temp,name);await mkdir(dir);const r=spawnSync('tar',['-xzf',archive,'-C',dir],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
   const pkg=JSON.parse(await readFile(join(dir,'package/package.json')));assert.equal(pkg.name,'@edit-ac/'+name);assert.equal(pkg.version,'0.0.0');
   await cp(join(dir,'package/dist'),join(destination,name),{recursive:true});
   if(name==='formats')await cp(join(dir,'package/capabilities.json'),join(destination,name,'capabilities.json'));
   async function inventory(path,relative=''){for(const entry of await readdir(path,{withFileTypes:true})){const key=relative+entry.name;if(entry.isDirectory())await inventory(join(path,entry.name),key+'/');else{const b=await readFile(join(path,entry.name));facts.members[name+'/'+key]={bytes:b.length,sha256:sha(b)};}}}
   await inventory(join(dir,'package'));facts.packages.push({name:pkg.name,version:pkg.version,sha256:hash,bytes:bytes.length});
  }
  for(const name of ['kickoff.mjs','recovery.mjs']){const b=await readFile(join(root,'playground',name));await writeFile(join(destination,name),b);facts.sources[name]=sha(b);}
  for(const name of ['index.html','formats.mjs','reader.mjs','README.md','app.mjs','document.mjs']){const b=await readFile(join(root,'playground/scenarios/extensions-formats',name));await writeFile(join(destination,name),b);facts.sources[name]=sha(b);}
  const fixtureManifest=JSON.parse(await readFile(join(producer,'canonical2/docx-import-fixtures/manifest.json')));
  await mkdir(join(destination,'fixtures'),{recursive:true});facts.fixtures={};
  for(const name of ['media','media-loss','corrupt']){const bytes=await readFile(join(producer,'canonical2/docx-import-fixtures',name+'.docx'));assert.equal(sha(bytes),fixtureManifest[name].sha256);assert.equal(bytes.length,fixtureManifest[name].bytes);await writeFile(join(destination,'fixtures',name+'.docx'),bytes);facts.fixtures[name]={sha256:sha(bytes),bytes:bytes.length};}
  const pixel=await readFile(resolve(root,'../core/fixtures/formats/docx/probe/pixel.png'));
  const grant={identity:{host:'fixture-host',key:'docx-original-png'},actions:['ingest','read','cancel','release-reference'],sha256:Array.from(createHash('sha256').update(pixel).digest())};
  await writeFile(join(destination,'fixtures/docx.json'),JSON.stringify({fixtures:facts.fixtures,grant},null,2));facts.sources['fixtures/docx.json']=sha(await readFile(join(destination,'fixtures/docx.json')));
  facts.directionFixtures={};
  const fixturePins={odt:'01f0ad59b50a209d6d3b62cc9f3d4613b940ae23e05c0bb8fe8d555f320f2060',epub:'4da7c21e1afeadad7f82a5c17a2401b4aed3650d22eb8d8317fce80ae727a0b2'};
  for(const kind of ['odt','epub']){
   const manifestBytes=await readFile(join(producer,'canonical2',kind+'-import-fixtures/manifest.json'));
   assert.equal(sha(manifestBytes),fixturePins[kind]);const manifest=JSON.parse(manifestBytes);
   await mkdir(join(destination,'fixtures',kind),{recursive:true});const fixtures={};
   for(const name of ['media','media-loss','corrupt']){
    const bytes=await readFile(join(producer,'canonical2',kind+'-import-fixtures',name+'.'+kind));
    assert.equal(sha(bytes),manifest[name].sha256);assert.equal(bytes.length,manifest[name].bytes);
    await writeFile(join(destination,'fixtures',kind,name+'.'+kind),bytes);fixtures[name]=manifest[name];
   }
   const policy={fixtures,grant:{...grant,identity:{host:'fixture-host',key:kind+'-original-png'}}};
   await writeFile(join(destination,'fixtures',kind+'.json'),JSON.stringify(policy,null,2));
   facts.sources['fixtures/'+kind+'.json']=sha(await readFile(join(destination,'fixtures',kind+'.json')));
   facts.directionFixtures[kind]={manifestSha256:fixturePins[kind],source:'consumers-epub-import-20261018/canonical2/'+kind+'-import-fixtures',fixtures};
  }
  // Prepared public table fixtures, pinned independently of mutable source paths.
  facts.tableFixtures={};
  {const bytes=await readFile(resolve(root,'../core/fixtures/formats/table-text/quoted.csv'));assert.equal(sha(bytes),'ad57e0135fc1096bf16be0dbecb78414fc8aa86bfa6c287a79bfce61f2c328bc');
   await mkdir(join(destination,'fixtures/csv'),{recursive:true});await writeFile(join(destination,'fixtures/csv/media.csv'),bytes);
   const fixtures={media:{sha256:sha(bytes),bytes:bytes.length}};await writeFile(join(destination,'fixtures/csv.json'),JSON.stringify({fixtures}));facts.tableFixtures.csv=fixtures;}
  {const bytes=await readFile(resolve(root,'../core/fixtures/formats/table-text/quoted.tsv'));assert.equal(sha(bytes),'e8466f505d35a8633d2b716ff1db246bfb36d704862b2975089fd77a9f7fcf20');
   await mkdir(join(destination,'fixtures/tsv'),{recursive:true});await writeFile(join(destination,'fixtures/tsv/media.tsv'),bytes);
   const fixtures={media:{sha256:sha(bytes),bytes:bytes.length}};await writeFile(join(destination,'fixtures/tsv.json'),JSON.stringify({fixtures}));facts.tableFixtures.tsv=fixtures;}
  {const bytes=Buffer.from('%PDF-1.7\nPrepared export-only rejection fixture.\n');await mkdir(join(destination,'fixtures/pdf'),{recursive:true});await writeFile(join(destination,'fixtures/pdf/media.pdf'),bytes);const fixtures={media:{sha256:sha(bytes),bytes:bytes.length}};await writeFile(join(destination,'fixtures/pdf.json'),JSON.stringify({fixtures}));facts.tableFixtures.pdf=fixtures;}
  facts.rtfFixtures={};await mkdir(join(destination,'fixtures/rtf'),{recursive:true});
  for(const [name,hash] of Object.entries({media:'39636cd063f6cd74a40bbb12368975c975cc4f49b3b0c86087fea7a9d8e15b04','media-loss':'89d20412f06fcbbc115d52a97bade73454d756e58fe09fb0cc7eb0b328429135'})){
   const bytes=await readFile(join(root,'playground/scenarios/extensions-formats/fixtures/rtf',name+'.rtf'));assert.equal(sha(bytes),hash);await writeFile(join(destination,'fixtures/rtf',name+'.rtf'),bytes);facts.rtfFixtures[name]={sha256:hash,bytes:bytes.length};
  }
  {const bytes=await readFile(join(root,'playground/scenarios/extensions-formats/fixtures/rtf/corrupt.rtf'));await writeFile(join(destination,'fixtures/rtf/corrupt.rtf'),bytes);facts.rtfFixtures.corrupt={sha256:sha(bytes),bytes:bytes.length};}
  await writeFile(join(destination,'fixtures/rtf.json'),JSON.stringify({fixtures:facts.rtfFixtures}));
  const review=await readFile(join(root,'playground/scenarios/extensions-formats/fixtures/review.json'));
  const originalReview=await readFile(resolve(root,'../core/fixtures/browser-review/model.json'));
  assert.equal(sha(originalReview),'69c0d440a5100a6ecb09c00dfee265184ec0601dc845244fffed036a13b12c20');
  const models=JSON.parse(originalReview),subset=JSON.parse(review);
  assert.deepEqual(subset,Object.fromEntries(['source','format','semantic'].map(k=>[k,models[k]])));
  await writeFile(join(destination,'fixtures/review.json'),review);facts.sources['fixtures/review.json']=sha(review);
  facts.review={producer:'editac-diff/tests/web_review_fixture.rs::generate_canonical_browser_review_inputs',inputSha256:sha(originalReview),subsetSha256:sha(review),readonly:true};
  for(const [name,bytes] of sourceBundle()){const path=join(destination,'source',name);await mkdir(resolve(path,'..'),{recursive:true});await writeFile(path,bytes);}
  facts.sourceManifestSha256=sha(await readFile(join(destination,'source/manifest.json')));
  await writeFile(join(destination,'profile.json'),JSON.stringify(facts,null,2)+'\n');return facts;
 }finally{await rm(temp,{recursive:true,force:true});}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const {buildCollaboration}=await import('./build-playground-collaboration.mjs');
 const destination=process.argv[2]?resolve(process.argv[2]):join(root,'dist/playground');
 await buildCollaboration(destination);
 const facts=await buildFormatsPlayground(join(destination,'scenarios/extensions-formats'));
 console.log(JSON.stringify({parent:facts.parent,candidate:facts.candidate,packages:facts.packages,destination}));
}
