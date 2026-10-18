import assert from 'node:assert/strict';
import {readFile,mkdir,cp,mkdtemp,rm,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function buildPlayground(destination=join(root,'dist/playground')){
 assert.equal(process.version,'v24.19.0','Use Node 24.19.0');
 const producer=resolve(root,'../architecture/evidence/local-consumer-return/20261018');
 const bytes=await readFile(join(producer,'local-candidates-v5.json'));
 assert.equal(sha(bytes),'27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729');
 const candidate=JSON.parse(bytes).candidates.find(c=>c.id==='sdk-framework-v1');
 const temp=await mkdtemp(join(root,'.playground-build-'));
 const facts={parent:'DWF-1.9',candidate:candidate.id,published:false,releaseQualified:false,manifestSha256:sha(bytes),packages:[],sources:{}};
 try{
  await mkdir(destination,{recursive:true});
  for(const name of ['core','web']){
   const pin=candidate.packages.find(p=>p.name==='@edit-ac/'+name),archive=await readFile(join(producer,pin.path));assert.equal(sha(archive),pin.sha256);
   const tgz=join(temp,name+'.tgz'),dir=join(temp,name);await writeFile(tgz,archive);await mkdir(dir);
   const r=spawnSync('tar',['-xzf',tgz,'-C',dir],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
   const pkg=JSON.parse(await readFile(join(dir,'package/package.json')));assert.equal(pkg.name,pin.name);assert.equal(pkg.version,'0.0.0');
   await cp(join(dir,'package/dist'),join(destination,name),{recursive:true});facts.packages.push(pin);
  }
  for(const name of ['index.html','app.mjs','kickoff.mjs','recovery.mjs','README.md']){const raw=await readFile(join(root,'playground',name));facts.sources[name]=sha(raw);await writeFile(join(destination,name),raw);}
  await writeFile(join(destination,'profile.json'),JSON.stringify(facts,null,2)+'\n');
  return facts;
 }finally{await rm(temp,{recursive:true,force:true});}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await buildPlayground(process.argv[2]?resolve(process.argv[2]):undefined)));
