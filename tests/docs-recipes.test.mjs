import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {openSharedHarness} from '../examples/recipes/shared-harness.mjs';
import {openHarness} from '../examples/commands/harness.mjs';
const output=resolve(process.env.DOCS_RECIPES_OUTPUT||'evidence/recipes-20261018/run-1');
const hash=b=>createHash('sha256').update(b).digest('hex');
let harness;
before(async()=>{mkdirSync(output,{recursive:true});harness=await openSharedHarness(output);});
after(async()=>{await harness?.close();});
test('recipe sources, generated ranges, fixture, profile and source download are exact',()=>{
 execFileSync('python3',['scripts/prepare-recipes.py','--check']);
 const m=JSON.parse(readFileSync('examples/recipes/manifest.json'));
 assert.equal(m.parent,'DWF-1.37');assert.equal(m.published,false);assert.equal(m.entries.length,6);
 for(const e of m.entries){assert.equal(hash(readFileSync(e.source)),e.sourceSha256);assert.equal(hash(readFileSync(e.profile)),e.profileSha256);assert.equal(hash(readFileSync(e.fixture)),e.fixtureSha256);assert.ok(e.input&&e.action&&e.output&&e.recovery&&e.cleanup);const lines=readFileSync(e.source,'utf8').split('\n');const snippet=lines.slice(e.start-1,e.end).join('\n')+'\n';assert.equal(hash(snippet),e.snippetSha256);execFileSync(process.execPath,['--input-type=module','--check'],{input:snippet});}
 assert.equal(hash(readFileSync('static'+m.download)),m.downloadSha256);
 execFileSync('python3',['-c',"import hashlib,json,zipfile; m=json.load(open('examples/recipes/manifest.json')); z=zipfile.ZipFile('static'+m['download']); assert set(z.namelist())==set(m['files']); assert all(hashlib.sha256(z.read(p)).hexdigest()==h for p,h in m['files'].items())"]);
});
test('SHR-01–08 admission authenticates all retained cells, bodies, graphs and immutable source pins',()=>{
 const pin=JSON.parse(readFileSync('examples/recipes/shared-profile.json')),receipt=harness.receipt;
 assert.equal(receipt.scope,'packed-resource-prerequisite');assert.equal(receipt.complete,false);assert.equal(receipt.prerequisiteComplete,true);assert.equal(receipt.provenance,'actual-packed-browser-runtime');
 const root=resolve(pin.receiptRoot);
 let artifacts=0,sources=0,cells=0;
 for(const [path,digest] of Object.entries(receipt.artifacts)){assert.equal(hash(readFileSync(join(root,path))),digest,path);artifacts++;}
 for(const [path,digest] of Object.entries(receipt.sources)){assert.equal(hash(execFileSync('git',['-C','../core','show',pin.sourceCommit+':'+path],{maxBuffer:16*1024*1024})),digest,path);sources++;}
 const required={'SHR-01':2,'SHR-02':3,'SHR-03':5,'SHR-04':5,'SHR-05':1,'SHR-06':3,'SHR-07':5,'SHR-08':2};
 for(const browser of receipt.browsers){assert.equal(browser.failed,0);assert.equal(browser.skipped,0);for(const [id,count] of Object.entries(required))assert.equal(browser.cases.filter(c=>c.requirement===id&&c.passed).length,count);for(const c of browser.cases){const observation=JSON.parse(readFileSync(join(root,c.evidence)));assert.equal(hash(readFileSync(join(root,c.evidence))),c.evidenceSha256);assert(observation.cases.some(x=>x.name===c.probe&&x.requirement===c.requirement&&x.passed&&!x.failure));assert(observation.cleanup.browserExited&&observation.cleanup.serverClosed&&observation.cleanup.consumerRemoved);cells++;}}
 assert.equal(cells,78);writeFileSync(join(output,'admission.json'),JSON.stringify({artifacts,sources,cells,newRuntimeCases:0,scope:receipt.scope,aggregateComplete:false},null,2)+'\n');
});
const fresh=async page=>{await page.evaluate(()=>window.shared.seed());await page.reload();await page.waitForFunction(()=>!!window.shared);};
const mount=page=>page.evaluate(async()=>{const keys=['description','comment'].map(n=>window.shared.mount(n));await Promise.all(keys.map(k=>window.shared.ready(k)));return keys;});
test('same-page description/comment isolate edits, undo, read-only, save and reopen',()=>harness.inspect('same-page',async page=>{
 await fresh(page);const keys=await mount(page);
 const result=await page.evaluate(async keys=>{const f=window.shared;const identities=keys.map(k=>f.get(k).read().identity.documentId);f.append(keys[0],' authored');await f.flush(keys[0]);const untouched=f.text(keys[1]);await f.destroy(keys[0]);const next=f.mount('description');await f.ready(next);const reopened=f.text(next);f.get(keys[1]).setReadOnly(true);let denied=false;try{f.append(keys[1],' forbidden');}catch{denied=true;}f.get(keys[1]).setReadOnly(false);f.append(keys[1],' independent');await f.flush(keys[1]);return {identities,untouched,reopened,denied,comment:f.text(keys[1])};},keys);
 assert.notEqual(...result.identities);assert.equal(result.untouched,'comment');assert.equal(result.reopened,'description authored');assert.equal(result.denied,true);assert.equal(result.comment,'comment independent');
 await page.locator('#'+keys[1]).focus();await page.keyboard.press('ControlOrMeta+z');assert.equal(await page.evaluate(k=>window.shared.text(k),keys[1]),'comment');
 await page.evaluate(()=>window.shared.cleanup());const state=await page.evaluate(()=>window.shared.state());assert.equal(state.nativeHandles.live,0);assert.equal(state.domNodes,0);assert.equal(state.recovered,state.released);
}));
test('shared core loading failure settles both waiters and retry creates independent editors',()=>harness.inspect('loading-retry',async page=>{
 await fresh(page);let attempts=0;await page.route('**/core/wasm/editac_wasm_bg.wasm',r=>++attempts===1?r.fulfill({status:503,body:'prepared loading failure'}):r.continue());
 const result=await page.evaluate(async()=>{const f=window.shared,keys=['description','comment'].map(n=>f.mount(n));const states=(await Promise.allSettled(keys.map(k=>f.ready(k)))).map(r=>r.status);await f.cleanup();return states;});assert.deepEqual(result,['rejected','rejected']);assert.equal(attempts,1);const keys=await mount(page);await page.evaluate(k=>window.shared.append(k,' retry'),keys[1]);assert.equal(await page.evaluate(k=>window.shared.text(k),keys[0]),'description');assert.equal(attempts,2);
}));
test('disposing a loading waiter cancels its view without retiring the shared survivor',()=>harness.inspect('cancelled-waiter',async page=>{
 await fresh(page);let resume,requested;const gate=new Promise(r=>{resume=r;}),seen=new Promise(r=>{requested=r;});
 await page.route('**/core/wasm/editac_wasm_bg.wasm',async route=>{requested();await gate;await route.continue();});
 const keys=await page.evaluate(()=>['description','comment'].map(n=>window.shared.mount(n)));
 try{await seen;const report=await page.evaluate(k=>window.shared.destroy(k,'report'),keys[0]);assert.equal(report.unsaved,false);}finally{resume();}
 await page.evaluate(k=>window.shared.ready(k),keys[1]);await page.evaluate(async k=>{window.shared.append(k,' survivor');await window.shared.flush(k);},keys[1]);assert.equal(await page.evaluate(k=>window.shared.text(k),keys[1]),'comment survivor');await page.evaluate(()=>window.shared.cleanup());const state=await page.evaluate(()=>window.shared.state());assert.equal(state.nativeHandles.live,0);assert.equal(state.domNodes,0);assert.deepEqual(state.late,[]);assert.equal(state.recovered,state.released);
}));
test('quota failure retains recovery while independent sibling save survives',()=>harness.inspect('quota-preservation',async page=>{
 await fresh(page);const keys=await mount(page);const result=await page.evaluate(async keys=>{const f=window.shared,add=IDBObjectStore.prototype.add,db=f.records.get('description').databaseName;IDBObjectStore.prototype.add=function(...args){if(this.name==='updates'&&this.transaction.db.name===db)throw new DOMException('prepared quota','QuotaExceededError');return add.apply(this,args);};try{f.append(keys[0],' pending');let error;try{await f.flush(keys[0]);}catch(e){error=e.message;}const report=await f.destroy(keys[0],'report');f.append(keys[1],' durable');await f.flush(keys[1]);return {error,unsaved:report.unsaved,updates:report.recovery.unsavedUpdates.length,bytes:report.recovery.checkpoint.bytes.length,sibling:f.text(keys[1])};}finally{IDBObjectStore.prototype.add=add;}},keys);
 assert(result.error);assert.equal(result.unsaved,true);assert(result.updates>0&&result.bytes>0);assert.equal(result.sibling,'comment durable');
}));
test('Markdown plain-text paste uses the qualified semantic parser and survives reopen',()=>harness.inspect('markdown-paste',async page=>{
 await fresh(page);const key=await page.evaluate(async()=>{const f=window.shared,optional=await f.markdown(),key=f.mount('description',{optional});await f.ready(key);return key;});
 await page.locator('#'+key).focus();await page.keyboard.press('ControlOrMeta+End');
 await page.evaluate(({key,input})=>{const data=new DataTransfer();data.setData('text/plain',input);document.getElementById(key).dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}));},{key,input:readFileSync('examples/recipes/markdown-paste.txt','utf8')});
 await page.waitForFunction(key=>window.shared.text(key).includes('Release notes'),key);
 const blocks=await page.evaluate(key=>window.shared.get(key).read().visible.filter(n=>n.kind==='block').map(n=>({text:n.runs.map(r=>r.text).join(''),attributes:n.blockAttributes,runs:n.runs})),key);
 assert(blocks.some(b=>b.text==='Release notes'&&b.attributes[0]==='heading'&&b.attributes[1]===2));assert(blocks.some(b=>b.runs.some(r=>r.text==='Friday'&&r.attributes.bold)));
 await page.evaluate(async key=>{await window.shared.flush(key);await window.shared.destroy(key);},key);const reopened=await page.evaluate(async()=>{const key=window.shared.mount('description');await window.shared.ready(key);return window.shared.text(key);});assert(reopened.includes('Release notes'));assert(reopened.includes('Friday'));
}));
test('route consumers share stable assets, isolate documents and dispose before client/full navigation',()=>harness.inspect('routes',async(page,origin)=>{
 await page.evaluate(()=>window.site.seed());const key=await page.evaluate(()=>window.site.mount('plain','description'));await page.evaluate(k=>window.site.append(k,' saved task'),key);await page.evaluate(()=>window.site.cleanup());
 const task=await page.evaluate(()=>window.site.mount('plain','description'));assert.equal(await page.evaluate(k=>window.site.text(k),task),'description saved task');
 const documentKey=await page.evaluate(()=>window.site.route('document'));assert.equal(await page.evaluate(k=>window.site.text(k),documentKey),'document');await page.evaluate(k=>window.site.append(k,' saved document'),documentKey);await page.evaluate(()=>window.site.cleanup());
 const state=await page.evaluate(()=>window.site.state());assert.equal(state.roots,0);assert(state.reports.every(r=>!r.unsaved));const asset=await page.evaluate(()=>window.site.assetUrl);
 await page.goto(origin+'/fixture/document/');await page.waitForFunction(()=>!!window.site);const full=await page.evaluate(()=>window.site.mount('plain','document',true));assert.equal(await page.evaluate(k=>window.site.text(k),full),'document saved document');assert.equal(await page.evaluate(()=>window.site.assetUrl),asset);assert.equal(await page.evaluate(()=>window.siteEvaluations),1);
},true));
test('native toolbar buttons support keyboard bold, heading, undo, read-only and disposal',async()=>{
 process.env.DOCS_COMMANDS_OUTPUT=join(output,'toolbar');process.env.DOCS_PLAYWRIGHT_MODULE||=resolve('../core/node_modules/playwright/index.mjs');const h=await openHarness();try{const p=h.page;await p.evaluate(()=>window.commandsExample.mount());await p.addScriptTag({type:'module',content:readFileSync('examples/recipes/toolbar.mjs','utf8')+'\nwindow.disposeRecipeToolbar=attachToolbar(window.commandsExample);'});await p.waitForFunction(()=>!!window.disposeRecipeToolbar);
 await p.locator('#editor').focus();await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.textContent),'Bold');await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>!!window.commandsExample.blocks()[2].runs.find(r=>r.text.includes('Friday')).attributes.bold),false);
 await p.getByRole('button',{name:'Heading 2',exact:true}).focus();await p.keyboard.press('Enter');assert.deepEqual(await p.evaluate(()=>window.commandsExample.blocks()[0].blockAttributes),['heading',2]);
 await p.getByRole('button',{name:'Undo',exact:true}).focus();await p.keyboard.press('Enter');assert.deepEqual(await p.evaluate(()=>window.commandsExample.blocks()[0].blockAttributes),['heading',1]);
 await p.evaluate(()=>window.commandsExample.select(2,4,10));await p.getByRole('button',{name:'Bold',exact:true}).focus();await p.evaluate(()=>window.commandsExample.heading(2));await p.keyboard.press('Enter');assert.ok((await p.getByRole('status',{name:'Formatting status'}).innerText()).includes('stale'));assert.equal(await p.evaluate(()=>!!window.commandsExample.blocks()[2].runs.find(r=>r.text.includes('Friday')).attributes.bold),false);await p.evaluate(()=>window.commandsExample.select(2,4,10));await p.getByRole('button',{name:'Bold',exact:true}).focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>!!window.commandsExample.blocks()[2].runs.find(r=>r.text.includes('Friday')).attributes.bold),true);
 await p.evaluate(()=>window.commandsExample.editor.setReadOnly(true));assert.equal(await p.getByRole('button',{name:'Bold',exact:true}).isDisabled(),true);await p.evaluate(async()=>{window.disposeRecipeToolbar();await window.commandsExample.close();});assert.equal(await p.getByRole('group',{name:'Document formatting'}).count(),0);h.observe('toolbar',{bold:false,heading:2,undoHeading:1,readOnly:true,disposed:true});
 }finally{await h.close();}
});
