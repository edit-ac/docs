import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {openCalloutHarness,hash} from '../examples/troubleshooting/callout-harness.mjs';
import {openHarness as openAuthoring} from '../examples/extension-configurations/harness.mjs';
import {cases as calloutCases} from '../examples/custom-extensions/runtime/callout-cases.mjs';
import {cases as authoringCases} from '../examples/custom-extensions/runtime/documentation-cases.mjs';
import {prepareCustom} from '../scripts/prepare-custom-extensions.mjs';
const output=resolve(process.env.DOCS_CUSTOM_OUTPUT||'evidence/custom-extensions-20261018/run-1');
const profile=JSON.parse(readFileSync('examples/custom-extensions/runtime/profile.json'));
let callout,authoring;
const results=[];
before(async()=>{assert.equal(process.version,'v24.19.0');mkdirSync(output,{recursive:true});process.env.DOCS_CATALOG_OUTPUT=join(output,'authoring');callout=await openCalloutHarness(output);authoring=await openAuthoring();});
after(async()=>{try{await authoring?.close();}finally{await callout?.close();writeFileSync(join(output,'cases.json'),JSON.stringify(results,null,2)+'\n');}});
test('both immutable source families, exact owner test ranges and nine typed recipe downloads authenticate',()=>{
 assert.equal(prepareCustom(true),5);
 const exported=JSON.parse(readFileSync('static/reference-inputs/custom-authoring-v2/manifest.json'));for(const [p,h]of Object.entries(exported.sourceFiles))assert.equal(hash(readFileSync(p)),h,p);assert.equal(hash(readFileSync('static/reference-inputs/custom-authoring-v2/source.zip')),exported.download.sha256);
 for(const pin of profile.casePins){const bytes=readFileSync('examples/custom-extensions/'+pin.file);assert.equal(hash(bytes),pin.sha256);assert.equal(hash(execFileSync('git',['-C','../core','show',pin.commit+':'+pin.source])),pin.sha256);}
 const original=readFileSync('examples/custom-extensions/runtime/documentation.test.mjs.txt','utf8').split('\n').slice(38).join('\n');
 const generated=readFileSync('examples/custom-extensions/runtime/documentation-cases.mjs','utf8');assert.ok(generated.endsWith(original));assert.equal(hash(generated),profile.documentationRange.sha256);
 assert.equal(hash(readFileSync(profile.authoring.admission)),profile.authoring.sha256);
 assert.equal(authoring.metadata.compiledRecipes,9);assert.equal(authoring.metadata.rejectedInvalidOptions,4);
 assert.equal(calloutCases.length,12);assert.equal(authoringCases.length,25);
});
for(const c of calloutCases)test('callout / '+c.name,()=>callout.inspect(c.name,async page=>{const result=await c.run(page);results.push({family:profile.candidate,name:c.name,passed:true,result});}));
for(const c of authoringCases)test('authoring / '+c.name,async()=>{const page=authoring.page;await page.reload();await page.waitForFunction(()=>!!window.documentationFixture);try{await c.run(page);results.push({family:profile.authoring.candidate,name:c.name,passed:true});}finally{await page.evaluate(()=>window.documentationFixture.close());}});
test('platform inheritance and off mode retain independent autocorrection and unknown OS capability',async()=>{
 const page=authoring.page;await page.reload();await page.waitForFunction(()=>!!window.documentationFixture);
 const cells=await page.evaluate(async()=>{const {Spelling}=await import('@edit-ac/web'),f=window.documentationFixture,cells=[];
 for(const mode of ['platform','off'])for(const autocorrection of ['inherit','on','off']){const configured=Spelling.configure({mode}),e=await f.open({...configured,platform:{...configured.platform,autocorrection}},{spellcheck:'true',autocorrect:'on'},'Due Friday');cells.push({mode,autocorrection,spelling:e.root.getAttribute('spellcheck'),correction:e.root.getAttribute('autocorrect'),observed:e.platformPreferences.observed,text:f.content(e)});await e.destroy({policy:'report'});}return cells;});
 assert.equal(cells.length,6);for(const c of cells){assert.equal(c.spelling,c.mode==='platform'?'true':'false');assert.equal(c.correction,c.autocorrection==='inherit'?'on':c.autocorrection);assert.equal(c.observed,'unknown');assert.equal(c.text,'Due Friday');}results.push({family:profile.authoring.candidate,name:'platform-off-autocorrection',passed:true,cells});
});
test('reader exposes complete runnable downloads, portable limits and local qualification',()=>{
 const guide=readFileSync('content/docs/extensions/custom.md','utf8'),example=readFileSync('content/docs/examples/custom-extensions.md','utf8');
 for(const text of [guide,example])for(const term of ['custom-authoring-v2','unpublished','EQL-1.9','Project kickoff'])assert.ok(text.includes(term),term);
 for(const term of ['ASD-123','not-found','autocorrection','unknown','Tiptap','context.cleanup','platform','Friday'])assert.ok(guide.includes(term),term);
 assert.deepEqual(authoring.metadata.errors,[]);assert.deepEqual(authoring.metadata.requestsBlocked,[]);assert.deepEqual(callout.metadata.external,[]);
});
