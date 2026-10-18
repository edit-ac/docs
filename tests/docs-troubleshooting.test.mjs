import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {openHarness as openLifecycle} from '../examples/lifecycle/harness.mjs';
import {openHarness as openCommands} from '../examples/commands/harness.mjs';
import {openCalloutHarness,hash} from '../examples/troubleshooting/callout-harness.mjs';
const output=resolve(process.env.DOCS_TROUBLESHOOTING_OUTPUT||'evidence/troubleshooting-20261018/run-1');
let lifecycle,commands,callout;
const initial=['Project kickoff','Owner: Alex','Due Friday','Draft agenda','Confirm attendees','Reference'];
const edited=initial.map(s=>s==='Due Friday'?'Due Thursday':s);
const observe=(id,result)=>{writeFileSync(join(output,id+'.json'),JSON.stringify(result,null,2)+'\n');};
before(async()=>{assert.equal(process.version,'v24.19.0');mkdirSync(output,{recursive:true});process.env.DOCS_LIFECYCLE_OUTPUT=join(output,'lifecycle');process.env.DOCS_COMMANDS_OUTPUT=join(output,'commands');lifecycle=await openLifecycle();commands=await openCommands();callout=await openCalloutHarness(output);});
after(async()=>{try{await callout?.close();}finally{try{await commands?.close();}finally{await lifecycle?.close();}}});
async function freshLifecycle(){const p=lifecycle.page;await p.evaluate(async()=>{const f=window.lifecycleExample;f.fault.save=false;f.releaseRecovery();f.releaseFlush();await f.close('report');await f.seed();await f.open();});return p;}
// case:assets:start
test('mismatched JS/WASM rejects initialization, preserves saved checkpoint and correct bytes recover',async()=>{
 const p=await freshLifecycle();await p.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();await f.close();});
 const record=await p.evaluate(()=>window.lifecycleExample.record),fresh=await p.context().newPage();
 // A valid WASM module with no required editor exports models an incompatible body.
 const mismatched=Buffer.from([0,97,115,109,1,0,0,0]);
 try{await fresh.route('**/core/wasm/editac_wasm_bg.wasm',r=>r.fulfill({contentType:'application/wasm',body:mismatched}));await fresh.goto(p.url());await fresh.waitForFunction(()=>!!window.lifecycleExample);
 const failed=await fresh.evaluate(async record=>{const f=window.lifecycleExample;let diagnostic;try{await f.open({record});}catch(e){diagnostic={name:e.name,message:e.message};}return {diagnostic,snapshot:f.snapshot()};},record);
 assert.equal(failed.snapshot.state.phase,'failed');assert.equal(failed.snapshot.state.ready,false);assert.equal(failed.snapshot.state.localCommitted,null);assert.match(failed.diagnostic.message,/__wbindgen|undefined|function|export/i);
 await fresh.evaluate(()=>window.lifecycleExample.close('report'));await fresh.unroute('**/core/wasm/editac_wasm_bg.wasm');
 await fresh.reload();await fresh.waitForFunction(()=>!!window.lifecycleExample);await fresh.evaluate(record=>window.lifecycleExample.open({record}),record);const recovered=await fresh.evaluate(()=>window.lifecycleExample.snapshot());assert.deepEqual(recovered.texts,edited);assert.equal(recovered.state.error,null);assert.equal(recovered.remote,'not-configured');await fresh.evaluate(()=>window.lifecycleExample.close());observe('assets',{failed,recovered,preparedWasmSha256:hash(mismatched)});
 }finally{await fresh.close();}
});
// case:assets:end
// case:content:start
test('unsupported schema refuses restore without mutation; unknown custom envelope survives compatible reopen',()=>callout.inspect('unsupported-content',async page=>{
 const result=await page.evaluate(async()=>{const f=window.callout,v=await f.open(),future={version:1,type:'future.team-callout',dataVersion:7,source:'Future kickoff',payload:{title:'Project kickoff',body:['Owner: Alex','Due Friday'],unknown:{flag:true}}};
 f.fill(v.editor,[{attributes:{type:'content',tuple:['module:editac.inert-extension',1,future]},runs:[{text:'Future kickoff',marks:[]}]},{attributes:{type:'paragraph'},runs:[{text:'Friday',marks:[],attributes:{'module:demo.highlight':[9,{label:'future highlight',extra:'retain'}]}}]}]);
 await v.editor.flush({target:'local'});const checkpoint=v.editor.recoveryExport().checkpoint,before=f.blocks(v.editor),bytes=[...checkpoint.bytes];let diagnostic;
 try{const unexpected=f.runtime.restoreEngine({...checkpoint.identity,schema:'future.schema.v99'},checkpoint);unexpected.dispose();}catch(e){diagnostic={name:e.name,code:e.code,message:e.message};}
 const unchanged=bytes.every((b,i)=>b===checkpoint.bytes[i]);v.disposeMenu();await v.editor.destroy({policy:'flush'});const reopened=await f.open({storage:v.config,enabled:false});const after=f.blocks(reopened.editor),fallback=reopened.host.textContent;
 const backup=reopened.editor.recoveryExport().checkpoint,restored=f.runtime.restoreEngine(backup.identity,backup);const restoredBlocks=restored.read().visible.filter(n=>n.kind==='block');restored.dispose();return {diagnostic,unchanged,before,after,fallback,restoredBlocks,future,bytes:bytes.length};});
 observe('content',result);assert.ok(result.diagnostic);assert.match(result.diagnostic.message,/identity|schema|mismatch|profile/i);assert.equal(result.unchanged,true);assert(result.bytes>0);assert.deepEqual(result.after,result.before);assert.deepEqual(result.restoredBlocks,result.before);assert.match(result.fallback,/Future kickoff/);assert.deepEqual(result.after.find(n=>n.blockAttributes[0]==='module:editac.inert-extension').blockAttributes[2],result.future);assert.deepEqual(result.after.flatMap(n=>n.runs).find(r=>r.text==='Friday').attributes['module:demo.highlight'],[9,{label:'future highlight',extra:'retain'}]);observe('content',result);
}));
// case:content:end
// case:loading:start
test('cancelled browser loading rejects ready, releases recovery and remounts saved data',async()=>{
 const page=await freshLifecycle();await page.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();await f.close();f.fault.holdRecovery=true;window.opening=f.open().then(()=>({ready:true}),e=>({error:e.message}));});
 const opening=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(opening.state.ready,false);
 await page.evaluate(()=>window.lifecycleExample.close('report'));const diagnostic=await page.evaluate(()=>window.opening);assert.match(diagnostic.error,/initialization canceled/);
 await page.evaluate(()=>window.lifecycleExample.releaseRecovery());await page.waitForFunction(()=>{const f=window.lifecycleExample;return f.resources.disposed===f.resources.recoveries;});
 const closed=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(closed.resources.live,0);assert.equal(closed.resources.subscriptions,0);
 await page.evaluate(()=>window.lifecycleExample.open());const recovered=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.deepEqual(recovered.texts,edited);await page.evaluate(()=>window.lifecycleExample.close());observe('loading',{opening,diagnostic,closed,recovered});
});
// case:loading:end
// case:ssr:start
test('SSR imports avoid browser globals; mounting there reports the host boundary before any document access',()=>{
 const dir=callout.temporary,script=join(dir,'ssr.mjs');
 writeFileSync(script,`import assert from 'node:assert/strict';let accesses=[];for(const n of ['window','document','indexedDB','navigator','fetch','WebAssembly'])Object.defineProperty(globalThis,n,{configurable:true,get(){accesses.push(n);throw Error('SSR accessed '+n);}});await import('@edit-ac/core');const web=await import('@edit-ac/web');assert.deepEqual(accesses,[]);let diagnostic;try{web.createEditor(null,{identity:{schema:'editac.registry.editor.v5'},extensions:[]})}catch(e){diagnostic=e.message;}assert.ok(diagnostic);console.log(JSON.stringify({importAccesses:[],mountAccesses:accesses,diagnostic,documentsOpened:0}));`);
 const result=JSON.parse(execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'}));observe('ssr',result);assert.deepEqual(result.importAccesses,[]);assert.equal(result.documentsOpened,0);assert.equal(result.diagnostic,'Invalid value used in weak set');assert.deepEqual(result.mountAccesses,[]);observe('ssr',result);
});
// case:ssr:end
// case:quota:start
test('quota error retains edited bytes and report backup restores into a separate database',async()=>{
 const page=await freshLifecycle();await page.evaluate(()=>{const f=window.lifecycleExample;f.fault.save=true;f.editFriday();});
 await assert.rejects(()=>page.evaluate(()=>window.lifecycleExample.save()),/Prepared local quota failure/);
 const failed=await page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(failed.state.error.name,'QuotaExceededError');assert.equal(failed.state.localCommitted,null);assert.deepEqual(failed.texts,edited);assert.doesNotMatch(failed.indicator,/^Saved locally/);
 const result=await page.evaluate(async()=>{const f=window.lifecycleExample,old=f.record.databaseName,report=await f.close('report');const backup={checkpoint:report.recovery.checkpoint,updates:report.recovery.unsavedUpdates};f.fault.save=false;await f.seed(backup.checkpoint);await f.open();const recovered=f.snapshot();return {unsaved:report.unsaved,backupBytes:backup.checkpoint.bytes.length,updates:backup.updates.length,differentDatabase:old!==f.record.databaseName,recovered};});
 assert.equal(result.unsaved,true);assert(result.backupBytes>0);assert(result.updates>0);assert.equal(result.differentDatabase,true);assert.deepEqual(result.recovered.texts,edited);assert.equal(result.recovered.state.error,null);assert.equal(result.recovered.remote,'not-configured');await page.evaluate(()=>window.lifecycleExample.close());observe('quota',{failed,result});
});
// case:quota:end
// case:permission:start
test('revoked host write permission denies captured intent without mutation; explicit reauthorization and recapture recover',async()=>{
 const page=commands.page;await page.evaluate(()=>window.commandsExample.mount());
 const result=await page.evaluate(()=>{const f=window.commandsExample,e=f.editor,target=e.captureCommand('replace'),before=f.snapshot();e.setReadOnly(true);let commitError;try{e.commit({kind:'editor',origin:'denied',commands:[{type:'replaceAt',owner:f.blocks()[1].id,from:0,to:5,text:'lost'}]});}catch(e){commitError=e.message;}try{const rejected=target.execute('Monday'),denied=f.snapshot(),captureAbsent=e.captureCommand('replace')===undefined;e.setReadOnly(false);f.select(2,4,10);const admitted=f.command('replace','Thursday');return {before,rejected,commitError,denied,captureAbsent,admitted,recovered:f.snapshot()};}finally{target.dispose();}});
 assert.deepEqual(result.rejected,{disposition:'rejected',reason:'stale-or-unavailable-command-target'});assert.equal(result.commitError,'Editor is read-only');assert.equal(result.captureAbsent,true);assert.deepEqual(result.before.blocks,result.denied.blocks);assert.equal(result.admitted.disposition,'committed');assert.equal(result.recovered.blocks[2].text,'Due Thursday');await page.evaluate(()=>window.commandsExample.close());observe('permission',result);
});
// case:permission:end
// case:stale:start
test('stale command target cannot overwrite newer content; reselect and recapture deliberately apply once',async()=>{
 const page=commands.page;await page.evaluate(()=>window.commandsExample.mount());
 const result=await page.evaluate(()=>{const f=window.commandsExample,t=f.editor.captureCommand('replace');try{f.command('bold');const before=f.snapshot(),rejected=t.execute('Monday'),after=f.snapshot();f.select(2,4,10);const recovered=f.command('replace','Thursday');return {before,rejected,after,recovered,final:f.snapshot()};}finally{t.dispose();}});
 assert.deepEqual(result.rejected,{disposition:'rejected',reason:'stale-or-unavailable-command-target'});assert.deepEqual(result.after,result.before);assert.equal(result.after.blocks[2].text,'Due Friday');assert.equal(result.recovered.disposition,'committed');assert.equal(result.final.blocks[2].text,'Due Thursday');await page.evaluate(()=>window.commandsExample.close());observe('stale',result);
});
// case:stale:end
test('troubleshooting source/profile/fixture/download ranges and visible navigation are exact',()=>{
 execFileSync('python3',['scripts/prepare-troubleshooting.py','--check']);const manifest=JSON.parse(readFileSync('examples/troubleshooting/manifest.json'));assert.equal(manifest.parent,'DWF-1.38');assert.equal(manifest.entries.length,7);const fixture=JSON.parse(readFileSync('examples/troubleshooting/fixtures.json'));assert.deepEqual(fixture.initial,initial);assert.deepEqual(fixture.edited,edited);assert.equal(fixture.incompatibleWasmHex,'0061736d01000000');assert.equal(fixture.unsupportedSchema,'future.schema.v99');for(const e of manifest.entries){assert.equal(hash(readFileSync(e.source)),e.sourceSha256);assert.equal(hash(readFileSync(e.profile)),e.profileSha256);const page=readFileSync(e.page,'utf8');for(const heading of ['Symptom and diagnostic','Reproduce','Preserve and recover','Limits and cleanup'])assert(page.includes('## '+heading));assert(page.includes('@/docs/examples/gallery.md'));}assert.equal(hash(readFileSync('static'+manifest.download)),manifest.downloadSha256);
});
test('all harnesses block external traffic and lifecycle teardown closes resources',async()=>{
 assert.deepEqual(lifecycle.metadata.requestsBlocked,[]);assert.deepEqual(commands.metadata.requestsBlocked,[]);assert.deepEqual(callout.metadata.external,[]);const state=await lifecycle.page.evaluate(()=>window.lifecycleExample.snapshot());assert.equal(state.resources.live,0);assert.equal(state.resources.subscriptions,0);assert.equal(state.resources.opened,state.resources.closed);assert.deepEqual(lifecycle.metadata.errors,[]);assert.deepEqual(commands.metadata.errors,[]);observe('cleanup',{resources:state.resources,externalRequests:0});
});
