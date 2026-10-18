import {test,before,after,beforeEach,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {openHarness,docsRoot,digest,manifest} from '../examples/lifecycle/harness.mjs';
import {lifecycleOutputs} from '../scripts/prepare-lifecycle.mjs';
let harness,page;
const initial=['Project kickoff','Owner: Alex','Due Friday','Draft agenda','Confirm attendees','Reference'];
const edited=['Project kickoff','Owner: Alex','Due Thursday','Draft agenda','Confirm attendees','Reference'];
const read=()=>page.evaluate(()=>window.lifecycleExample.snapshot());
const observe=(id,result)=>harness.observe(id,result);
before(async()=>{harness=await openHarness();page=harness.page;});
after(async()=>{await harness?.close();});
beforeEach(async()=>{await page.evaluate(async()=>{const f=window.lifecycleExample;f.fault.save=false;f.releaseRecovery();f.releaseFlush();await f.close('report');f.resetTrace();await f.seed();await f.open();});});
afterEach(async()=>{await page.evaluate(async()=>{const f=window.lifecycleExample;f.fault.save=false;f.releaseRecovery();f.releaseFlush();await f.close('report');});});

test('ready follows real recovery, subscribe does not replay initial state, and no receipt is invented',async()=>{
  const s=await read();assert.deepEqual(s.texts,initial);assert.equal(s.state.phase,'ready');assert.equal(s.state.localCommitted,null);
  assert.deepEqual(s.timeline.map(e=>e.type),['created','lifecycle']);
  assert.equal(s.timeline[0].state.phase,'visible');assert.equal(s.timeline[0].state.ready,false);
  assert.equal(s.timeline[1].state.ready,true);assert.equal(s.resources.live,1);assert.equal(s.resources.subscriptions,3);
  assert.equal(s.remote,'not-configured');assert.match(s.indicator,/Ready locally/);observe('ready',s);
});
test('selection is scoped separately from document updates and establishes no save receipt',async()=>{
  await page.evaluate(()=>window.lifecycleExample.selectFriday());
  const s=await read();assert.equal(await page.evaluate(()=>document.getSelection().toString()),'Friday');
  assert.ok(s.timeline.some(e=>e.type==='selection'));assert.equal(s.timeline.filter(e=>e.type==='document').length,0);
  assert.equal(s.state.localCommitted,null);assert.deepEqual(s.texts,initial);observe('selection',s);
});
test('Friday replacement, captured flush barrier and genuine receipt have independent before/after semantics',async()=>{
  const result=await page.evaluate(()=>window.lifecycleExample.editFriday());assert.deepEqual(result,{disposition:'committed'});
  const receipt=await page.evaluate(()=>window.lifecycleExample.save());const s=await read();
  assert.deepEqual(s.texts,edited);assert.equal(receipt.state,'localCommitted');assert.equal(typeof receipt.updateId,'string');assert.ok(receipt.updateId.length>10);
  assert.ok(['strict','relaxed','default','unknown'].includes(receipt.durability));assert.deepEqual(receipt,s.state.localCommitted);
  const doc=s.timeline.findIndex(e=>e.type==='document'),commit=s.timeline.findIndex(e=>e.state?.localCommitted);
  assert.ok(doc>=0 && commit>doc);assert.equal(s.timeline.at(-1).type,'flush-complete');
  assert.equal(s.indicator,'Saved locally; remote save not configured');assert.equal(s.remote,'not-configured');observe('local-commit',s);
});
test('a previous receipt cannot label a newer pending edit as saved',async()=>{
  await page.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();f.fault.save=true;f.editor.root.focus();});
  await page.keyboard.type('!');
  await assert.rejects(()=>page.evaluate(()=>window.lifecycleExample.save()),/Prepared local quota failure/);
  const s=await read();assert.ok(s.state.localCommitted);assert.equal(s.state.error.name,'QuotaExceededError');
  assert.doesNotMatch(s.indicator,/^Saved locally/);assert.equal(s.texts[2],'Due Thursday!');observe('retained-old-receipt',s);
});
test('late save completion cannot overwrite the replacement view indicator or generation',async()=>{
  await page.evaluate(()=>{const f=window.lifecycleExample;f.editFriday();f.fault.holdFlush=true;window.saving=f.save();});
  await page.waitForFunction(()=>window.lifecycleExample.fault.flushHeld);
  await page.evaluate(async()=>{const f=window.lifecycleExample;await f.close('report');await f.open();});
  const before=await read();assert.match(before.indicator,/Ready locally/);assert.deepEqual(before.texts,edited);
  await page.evaluate(async()=>{window.lifecycleExample.releaseFlush();await window.saving;});
  const after=await read();assert.equal(after.indicator,before.indicator);assert.deepEqual(after.texts,edited);
  const completion=after.timeline.at(-1);assert.equal(completion.type,'flush-complete');assert.ok(completion.generation<before.timeline.at(-1).generation);
  observe('late-save-generation',{before,after});
});
test('read-only rejects input without document patches or extra receipts',async()=>{
  const before=await read();await page.evaluate(()=>{const f=window.lifecycleExample;f.editor.setReadOnly(true);f.selectFriday();});
  assert.equal(await page.locator('#editor').getAttribute('aria-readonly'),'true');
  await page.keyboard.type('X');const result=await page.evaluate(()=>window.lifecycleExample.editFriday());const s=await read();
  assert.notEqual(result.disposition,'committed');assert.equal(s.state.readOnly,true);assert.deepEqual(s.texts,before.texts);
  assert.equal(s.timeline.filter(e=>e.type==='document').length,0);assert.equal(s.state.localCommitted,null);
  await page.evaluate(()=>window.lifecycleExample.editor.setReadOnly(false));assert.equal((await read()).state.readOnly,false);observe('read-only',s);
});
test('prepared quota failure retains edited bytes and report export recovers into a separate local database',async()=>{
  await page.evaluate(()=>{const f=window.lifecycleExample;f.fault.save=true;f.editFriday();});
  await assert.rejects(()=>page.evaluate(()=>window.lifecycleExample.save()),/Prepared local quota failure/);
  const failed=await read();assert.deepEqual(failed.texts,edited);assert.equal(failed.state.error.name,'QuotaExceededError');assert.equal(failed.state.localCommitted,null);
  assert.match(failed.indicator,/Save failed/);
  await assert.rejects(()=>page.evaluate(()=>window.lifecycleExample.editor.destroy({policy:'flush'})),/Prepared local quota failure/);
  const result=await page.evaluate(async()=>{
    const f=window.lifecycleExample,report=await f.close('report');window.retainedRecovery=report.recovery;
    const original=f.record.databaseName;f.fault.save=false;await f.seed(report.recovery.checkpoint);await f.open();
    return {unsaved:report.unsaved,updates:report.recovery.unsavedUpdates.map(u=>u.bytes.length),differentDatabase:original!==f.record.databaseName,snapshot:f.snapshot()};
  });
  assert.equal(result.unsaved,true);assert.equal(result.updates.length,1);assert.ok(result.updates[0]>0);assert.equal(result.differentDatabase,true);
  assert.deepEqual(result.snapshot.texts,edited);assert.equal(result.snapshot.state.error,null);assert.equal(result.snapshot.resources.live,1);observe('quota-recovery',{failed,result});
});
test('unsubscribe is idempotent and prevents subsequent document, selection and lifecycle delivery',async()=>{
  const result=await page.evaluate(async()=>{const f=window.lifecycleExample;f.unsubscribe();f.unsubscribe();const n=f.timeline.length;f.editFriday();await f.save();return {n,snapshot:f.snapshot()};});
  assert.equal(result.snapshot.resources.subscriptions,0);assert.equal(result.snapshot.timeline.slice(result.n).filter(e=>['document','selection','lifecycle'].includes(e.type)).length,0);
  assert.deepEqual(result.snapshot.texts,edited);observe('unsubscribe',result);
});
test('flush/dispose/remount preserves the document and releases real DB connections and writer locks',async()=>{
  const result=await page.evaluate(async()=>{const f=window.lifecycleExample;f.editFriday();await f.save();const report=await f.close();const closed=f.snapshot();const locks=await navigator.locks.query();await f.open();return {unsaved:report.unsaved,closed,locks,remount:f.snapshot()};});
  assert.equal(result.unsaved,false);assert.equal(result.closed.state.phase,'destroyed');assert.equal(result.closed.resources.live,0);assert.equal(result.closed.resources.subscriptions,0);
  assert.equal(result.closed.resources.opened,result.closed.resources.closed);assert.equal(result.locks.held.length,0);assert.equal(result.locks.pending.length,0);
  assert.equal(result.remount.resources.live,1);assert.equal(result.remount.resources.subscriptions,3);assert.deepEqual(result.remount.texts,edited);observe('remount',result);
});
test('lifecycle observer errors are isolated and reentrant destroy shares one teardown promise',async()=>{
  const result=await page.evaluate(async()=>{const f=window.lifecycleExample;let n=0,reentrant;
    const stop=f.editor.subscribe(s=>{n++;if(s.phase==='closing')reentrant=f.editor.destroy({policy:'flush'});throw Error('Prepared observer failure');});
    const outer=f.editor.destroy({policy:'flush'});const report=await outer;stop();f.unsubscribe();return {same:outer===reentrant,n,unsaved:report.unsaved,errors:f.editor.lifecycle.observerErrors.map(e=>e.message),snapshot:f.snapshot()};
  });
  assert.equal(result.same,true);assert.equal(result.n,2);assert.deepEqual(result.errors,['Prepared observer failure','Prepared observer failure']);assert.equal(result.snapshot.resources.live,0);observe('reentrancy',result);
});
test('cancelled opening rejects ready, releases late real recovery and safely remounts',async()=>{
  await page.evaluate(async()=>{const f=window.lifecycleExample;await f.close();f.fault.holdRecovery=true;window.opening=f.open().then(()=>({ready:true}),e=>({error:e.message}));});
  const before=await read();assert.equal(before.state.ready,false);
  await page.evaluate(()=>window.lifecycleExample.close('report'));
  const canceled=await page.evaluate(()=>window.opening);assert.match(canceled.error,/initialization canceled/);
  await page.evaluate(()=>window.lifecycleExample.releaseRecovery());
  await page.waitForFunction(()=>{const f=window.lifecycleExample;return f.resources.disposed===f.resources.recoveries;});
  const closed=await read();assert.equal(closed.resources.live,0);assert.equal(closed.resources.subscriptions,0);assert.equal(closed.state.phase,'destroyed');
  await page.evaluate(()=>window.lifecycleExample.open());const remount=await read();assert.deepEqual(remount.texts,initial);assert.equal(remount.resources.live,1);observe('cancel-remount',{closed,remount});
});
test('missing WASM fails a fresh realm without overwriting the existing checkpoint and correct assets recover',async()=>{
  const record=await page.evaluate(()=>window.lifecycleExample.record);await page.evaluate(()=>window.lifecycleExample.close());
  const fresh=await page.context().newPage();
  try {
    await fresh.goto(page.url());await fresh.waitForFunction(()=>!!window.lifecycleExample);
    const failed=await fresh.evaluate(async record=>{const f=window.lifecycleExample;try{await f.open({record,assetUrl:new URL('/missing.wasm',location.href).href});}catch{}return f.snapshot();},record);
    assert.equal(failed.state.phase,'failed');assert.equal(failed.state.ready,false);assert.ok(failed.state.error);assert.equal(failed.state.localCommitted,null);
    await fresh.evaluate(async()=>{await window.lifecycleExample.close('report');await window.lifecycleExample.open();});
    const recovered=await fresh.evaluate(()=>window.lifecycleExample.snapshot());assert.deepEqual(recovered.texts,initial);assert.equal(recovered.state.error,null);
    await fresh.evaluate(()=>window.lifecycleExample.close());observe('asset-recovery',{failed,recovered});
  } finally {await fresh.close();}
});
test('source, declarations, snippets and complete downloads authenticate the exact local packed consumer',()=>{
  assert.equal(manifest.parent,'DWF-1.33');assert.equal(manifest.published,false);
  for(const [file,hash] of Object.entries(manifest.files))assert.equal(digest(readFileSync(join(docsRoot,'examples/lifecycle',file))),hash,file);
  for(const [file,hash] of Object.entries(manifest.declarations)){
    assert.equal(digest(readFileSync(join(docsRoot,'static/reference-inputs/local-pin-1.3',file))),hash,file);
    const [name,...member]=file.split('/'),pack=manifest.packages.find(p=>p.name===`@edit-ac/${name}`);
    const bytes=execFileSync('tar',['-xOf',join(process.env.DOCS_LIFECYCLE_ARCHITECTURE||join(docsRoot,'../architecture'),pack.path),'package/'+member.join('/')]);
    assert.equal(digest(bytes),hash,`Installed tarball declaration ${file}`);
  }
  for(const [file,bytes] of lifecycleOutputs())assert.deepEqual(readFileSync(join(docsRoot,file)),bytes,file);
  assert.equal(digest(readFileSync(join(docsRoot,'examples/concepts/kickoff-v1.md'))),manifest.fixtureSha256);
  observe('provenance',{sources:Object.keys(manifest.files).length,declarations:Object.keys(manifest.declarations).length,snippets:Object.keys(manifest.snippets).length});
});
test('no unexpected browser errors or external requests occurred',()=>{assert.deepEqual(harness.metadata.errors,[]);assert.deepEqual(harness.metadata.requestsBlocked,[]);});
