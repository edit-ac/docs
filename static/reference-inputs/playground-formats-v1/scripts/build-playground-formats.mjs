import assert from 'node:assert/strict';
import {readFile,mkdir,cp,mkdtemp,rm,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
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
 const facts={parent:'DPG-1.2',candidate:'CNV-1.18-C2-EI-canonical2',version:'0.0.0',published:false,releaseQualified:false,receipt:'consumers-epub-import-20261018/delivery.json',receiptSha256:sha(await readFile(join(producer,'delivery.json'))),packages:[],sources:{},members:{},fixture:'project-kickoff/1'};
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
  for(const name of ['index.html','formats.mjs','README.md','app.mjs','document.mjs']){const b=await readFile(join(root,'playground/scenarios/extensions-formats',name));await writeFile(join(destination,name),b);facts.sources[name]=sha(b);}
  const fixtureManifest=JSON.parse(await readFile(join(producer,'canonical2/docx-import-fixtures/manifest.json')));
  await mkdir(join(destination,'fixtures'),{recursive:true});facts.fixtures={};
  for(const name of ['media','media-loss','corrupt']){const bytes=await readFile(join(producer,'canonical2/docx-import-fixtures',name+'.docx'));assert.equal(sha(bytes),fixtureManifest[name].sha256);assert.equal(bytes.length,fixtureManifest[name].bytes);await writeFile(join(destination,'fixtures',name+'.docx'),bytes);facts.fixtures[name]={sha256:sha(bytes),bytes:bytes.length};}
  const pixel=await readFile(resolve(root,'../core/fixtures/formats/docx/probe/pixel.png'));
  const grant={identity:{host:'fixture-host',key:'docx-original-png'},actions:['ingest','read','cancel','release-reference'],sha256:Array.from(createHash('sha256').update(pixel).digest())};
  await writeFile(join(destination,'fixtures/docx.json'),JSON.stringify({fixtures:facts.fixtures,grant},null,2));facts.sources['fixtures/docx.json']=sha(await readFile(join(destination,'fixtures/docx.json')));
  await writeFile(join(destination,'profile.json'),JSON.stringify(facts,null,2)+'\n');return facts;
 }finally{await rm(temp,{recursive:true,force:true});}
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const {buildPlayground}=await import('./build-playground.mjs');
 const destination=process.argv[2]?resolve(process.argv[2]):join(root,'dist/playground');
 await buildPlayground(destination);
 const facts=await buildFormatsPlayground(join(destination,'scenarios/extensions-formats'));
 console.log(JSON.stringify({parent:facts.parent,candidate:facts.candidate,packages:facts.packages,destination}));
}
