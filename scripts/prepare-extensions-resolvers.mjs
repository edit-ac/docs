import {assertExtensionsProof} from './check-extensions-resolvers.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),architecture=resolve(root,'../architecture');
const hash=b=>createHash('sha256').update(b).digest('hex');
const raw=readFileSync(join(architecture,'evidence/local-consumer-return/20261018/local-candidates-v5.json'));
assert.equal(hash(raw),'27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729');
const candidate=JSON.parse(raw).candidates.find(c=>c.id==='extension-authoring-v1');
for(const pin of candidate.packages)assert.equal(hash(readFileSync(join(architecture,'evidence/local-consumer-return/20261018',pin.path))),pin.sha256);
const recipe=readFileSync(join(root,'examples/extensions/recipes.mjs'),'utf8'),lines=recipe.trimEnd().split('\n');
const range=(start,end)=>{const from=lines.findIndex(l=>l.includes(start))+1,to=lines.findIndex(l=>l.includes(end))+1;assert.ok(from>0&&to>=from);return {path:'recipes.mjs',from,to,sha256:hash(lines.slice(from-1,to).join('\n')+'\n')};};
const manifest={schemaVersion:1,parent:'DWF-1.6',scope:'local-only',published:false,releaseQualified:false,candidate:candidate.id,sourceCommit:candidate.sourceCommit,candidateManifest:{path:'evidence/local-consumer-return/20261018/local-candidates-v5.json',sha256:hash(raw)},packages:candidate.packages,profile:{engine:'editac.yrs-yjs.editor.v5',schema:'editac.registry.editor.v5',host:'Chromium / BrowserEditor / IndexedDB; prepared resolver and upload callbacks',durableServiceQualified:false,manualPlatformQualified:false},fixture:{id:'project-kickoff/1',source:'examples/concepts/kickoff-v1.md',sha256:hash(readFileSync(join(root,'examples/concepts/kickoff-v1.md'))),uploadUtf8:'Project kickoff attachment\n'},files:{},ranges:{initialization:range('const runtime =','await editor.ready;'),reference:range('const lookup =','const recovery ='),upload:range(' async upload(',' finishUpload('),cleanup:range(' async close(','window.recipe =')},upstreamEvidence:[]};
for(const f of ['recipes.mjs','kickoff.mjs','harness.test.mjs','README.md'])manifest.files[f]=hash(readFileSync(join(root,'examples/extensions',f)));
for(const path of ['evidence/extension-references/receipt.json','evidence/asset-descriptors/receipt.json','evidence/asset-lifecycle/receipt.json','evidence/link-resolution/lnk-1.11-20261015/receipt.json','evidence/architecture-fitness/service-lifecycle/browser-1/chromium/receipt.json']){const bytes=readFileSync(join(architecture,path));manifest.upstreamEvidence.push({path,sha256:hash(bytes),role:'retained owning25/26 prerequisite, not a new execution or service/deployment claim'});}
if(process.argv.includes('--check')) {
 const q=JSON.parse(readFileSync(join(root,'examples/extensions/qualification.json')));
 assert.equal(q.scope,'local-only');assert.equal(q.candidate,manifest.candidate);assert.deepEqual(q.sourceFiles,manifest.files);
 const summaryBytes=readFileSync(join(root,q.summary.path)),proofBytes=readFileSync(join(root,q.proof.path));
 assert.equal(hash(summaryBytes),q.summary.sha256);assert.equal(hash(proofBytes),q.proof.sha256);
 const summary=JSON.parse(summaryBytes),proof=JSON.parse(proofBytes);assert.equal(summary.exit,0);assertExtensionsProof(summary.counts,proof);
 assert.equal(proof.candidateManifestSha256,manifest.candidateManifest.sha256);assert.deepEqual(proof.packages,manifest.packages);
 for(const p of proof.sources)assert.equal(hash(readFileSync(join(root,p.path))),p.sha256);
 for(const p of q.artifacts)assert.equal(hash(readFileSync(join(root,p.path))),p.sha256);
}
const outputs=new Map();outputs.set('examples/extensions/manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const f of ['recipes.mjs','kickoff.mjs','harness.test.mjs','README.md'])outputs.set('static/examples/extensions-resolvers/'+f,readFileSync(join(root,'examples/extensions',f),'utf8'));
outputs.set('static/examples/extensions-resolvers/manifest.json',JSON.stringify(manifest,null,2)+'\n');
const page='content/docs/examples/extensions-resolvers.md',text=readFileSync(join(root,page),'utf8');
const section='<!-- checked-source:start -->\n## Checked upload boundary\n\nThis excerpt is generated from the downloadable source; the host responses are prepared.\n\n```js\n'+lines.slice(manifest.ranges.upload.from-1,manifest.ranges.upload.to).join('\n')+'\n```\n<!-- checked-source:end -->';
outputs.set(page,text.replace(/<!-- checked-source:start -->[\s\S]*<!-- checked-source:end -->/,section));
for(const [path,text] of outputs){const full=join(root,path);if(process.argv.includes('--check'))assert.equal(readFileSync(full,'utf8'),text,'Stale generated source: '+path);else{mkdirSync(resolve(full,'..'),{recursive:true});writeFileSync(full,text);}}
console.log('Extension/resolver manifest, source ranges and downloads verified ('+outputs.size+' artifacts; no runtime qualification by generation)');
