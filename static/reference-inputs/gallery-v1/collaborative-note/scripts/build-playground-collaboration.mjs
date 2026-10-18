import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildPlayground} from './build-playground.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function buildCollaboration(destination=resolve(root,'dist/playground')){
 const base=await buildPlayground(destination),out=join(destination,'scenarios/collaboration');await mkdir(out,{recursive:true});
 const manifest=JSON.parse(await readFile(join(root,'playground/scenarios/collaboration/manifest.json')));
 for(const [name,digest] of Object.entries(manifest.files)){
  const bytes=await readFile(join(root,name));assert.equal(createHash('sha256').update(bytes).digest('hex'),digest,'Stale scenario source '+name);
 }
 for(const name of ['index.html','app.mjs','channel.mjs','README.md','manifest.json'])await writeFile(join(out,name),await readFile(join(root,'playground/scenarios/collaboration',name)));
 const profile={...base,parent:'DWF-1.11',scenario:manifest,prerequisites:JSON.parse(await readFile(join(root,'evidence/playground-collaboration-20261018/prerequisite-receipt.json')))};
 await writeFile(join(out,'profile.json'),JSON.stringify(profile,null,2)+'\n');return profile;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await buildCollaboration(process.argv[2]?resolve(process.argv[2]):undefined)));
