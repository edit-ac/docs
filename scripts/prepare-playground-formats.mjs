import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
export const sources=['index.html','formats.mjs','reader.mjs','README.md','app.mjs','document.mjs','fixtures/review.json','fixtures/rtf/media.rtf','fixtures/rtf/media-loss.rtf','fixtures/rtf/corrupt.rtf'].map(p=>'playground/scenarios/extensions-formats/'+p);
sources.push('package.json','package-lock.json','scripts/build-playground-formats.mjs','scripts/build-playground-collaboration.mjs','playground/scenarios/collaboration/index.html','playground/scenarios/collaboration/app.mjs','playground/scenarios/collaboration/channel.mjs','playground/scenarios/collaboration/README.md','playground/scenarios/collaboration/manifest.json','scripts/prepare-playground-formats.mjs','scripts/build-playground.mjs','playground/app.mjs','playground/kickoff.mjs','playground/recovery.mjs','playground/index.html','playground/README.md','scripts/check-playground.mjs','tests/playground-extensions.spec.ts','tests/inspect-playground-docx.py','tests/inspect-playground-odt-epub.py','tests/inspect-playground-table-pdf.py','tests/inspect-playground-pdf.swift','tests/inspect-playground-rtf.py');
export function sourceBundle(){
 const files=Object.fromEntries(sources.map(p=>[p,createHash('sha256').update(readFileSync(resolve(root,p))).digest('hex')]));
 const manifest={parent:'DPG-1.6',candidate:'CNV-1.18-C2-EI-canonical2',version:'0.0.0',scope:'unpublished local browser extensions, readonly shared diff examples and formats; no hosted/native/device/performance/release claim',fixture:'project-kickoff/1',license:'Apache-2.0',files};
 return new Map([...sources.map(p=>[p,readFileSync(resolve(root,p))]),['manifest.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n')]]);
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 let stale=0;for(const [path,bytes] of sourceBundle()){
  const target=resolve(root,'static/reference-inputs/playground-formats-v1',path);
  if(!existsSync(target)||!readFileSync(target).equals(bytes)){
   if(process.argv.includes('--check')){console.error('Stale formats output: '+path);stale++;}
   else{mkdirSync(dirname(target),{recursive:true});writeFileSync(target,bytes);}
  }
 }if(stale)process.exitCode=1;
}
