import {test,before,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {openHarness,docsRoot,digest,manifest} from '../examples/commands/harness.mjs';
import {declaration,renderReference} from '../scripts/generate-reference.mjs';
import {commandOutputs} from '../scripts/prepare-commands.mjs';
let harness,page;
const initial=['Project kickoff','Owner: Alex','Due Friday','Draft agenda','Confirm attendees','Reference'];
const selection={anchor:{block:2,offset:4},focus:{block:2,offset:10},text:'Friday'};
const state=()=>page.evaluate(()=>window.commandsExample.snapshot());
const texts=s=>s.blocks.map(b=>b.text);
const friday=s=>s.blocks[2].runs.filter(r=>r.text.includes('Friday'))[0];
const evaluate=fn=>page.evaluate(fn);
before(async()=>{harness=await openHarness();page=harness.page;});
after(async()=>{try{if(page) await page.evaluate(()=>window.commandsExample.close());}finally{await harness?.close();}});
beforeEach(async()=>{await page.evaluate(()=>window.commandsExample.mount());});
function record(id,result){harness.observe(id,result);}

test('Project kickoff fixture uses actual heading/checklist/link semantics and backward UTF16 selection',async()=>{
  const s=await state();assert.deepEqual(texts(s),initial);assert.deepEqual(s.selection,selection);
  assert.equal(friday(s).attributes.bold,true);assert.deepEqual(s.blocks[0].attributes,['heading',1]);
  assert.deepEqual(s.blocks[3].container,['checklist']);assert.equal(s.blocks[3].checked,false);
  assert.equal(await page.locator('#editor h1').textContent(),'Project kickoff');assert.equal(await page.locator('#editor li').count(),2);
  assert.equal(s.blocks[5].runs[0].attributes.link,'https://example.invalid/project-kickoff');
  await evaluate(()=>window.commandsExample.select(2,10,4));const reverse=(await state()).selection;
  assert.deepEqual(reverse,{anchor:{block:2,offset:10},focus:{block:2,offset:4},text:'Friday'});record('fixture-selection',s);
});
test('Friday bold toggles off and on without changing text, other blocks or backward selection',async()=>{
  await evaluate(()=>window.commandsExample.select(2,10,4));const before=await state();
  assert.deepEqual(await evaluate(()=>window.commandsExample.command('bold')),{disposition:'committed'});
  const off=await state();assert.deepEqual(texts(off),initial);assert.equal(!!friday(off).attributes.bold,false);assert.deepEqual(off.selection,before.selection);
  assert.deepEqual(off.blocks.filter((_,i)=>i!==2),before.blocks.filter((_,i)=>i!==2));
  assert.deepEqual(await evaluate(()=>window.commandsExample.command('toggleBold')),{disposition:'committed'});
  const on=await state();assert.deepEqual(on,before);record('friday-toggle',{before,off,on});
});
test('heading and list changes use admitted public prepared requests with independent attributes',async()=>{
  assert.equal(await evaluate(()=>window.commandsExample.heading(2)),true);
  const heading=await state();assert.deepEqual(heading.blocks[0].attributes,['heading',2]);assert.equal(await page.locator('#editor h2').textContent(),'Project kickoff');assert.deepEqual(texts(heading),initial);
  assert.equal(await evaluate(()=>window.commandsExample.list('unordered')),true);
  const list=await state();assert.deepEqual(list.blocks[3].container,['unordered']);assert.deepEqual(list.blocks[4].container,['unordered']);assert.deepEqual(texts(list),initial);record('heading-list',{heading,list});
});
test('Enter splits and Backspace joins the paragraph while preserving Friday marks and exact caret',async()=>{
  await evaluate(()=>window.commandsExample.select(2,4));
  assert.deepEqual(await evaluate(()=>window.commandsExample.command('enter')),{disposition:'committed'});
  const split=await state();assert.deepEqual(texts(split),['Project kickoff','Owner: Alex','Due ','Friday','Draft agenda','Confirm attendees','Reference']);
  assert.deepEqual(split.selection,{anchor:{block:3,offset:0},focus:{block:3,offset:0},text:''});assert.equal(split.blocks[3].runs[0].attributes.bold,true);
  assert.deepEqual(await evaluate(()=>window.commandsExample.command('backward')),{disposition:'committed'});
  const joined=await state();assert.deepEqual(texts(joined),initial);assert.deepEqual(joined.selection,{anchor:{block:2,offset:4},focus:{block:2,offset:4},text:''});assert.equal(friday(joined).attributes.bold,true);record('split-join',{split,joined});
});
test('ordinary undo/redo restores semantic and selection snapshots, with no extra seed history',async()=>{
  const before=await state();await evaluate(()=>window.commandsExample.command('bold'));const changed=await state();
  assert.deepEqual(await evaluate(()=>window.commandsExample.history('undo')),{disposition:'committed'});const undo=await state();assert.deepEqual(undo,before);
  assert.deepEqual(await evaluate(()=>window.commandsExample.history('redo')),{disposition:'committed'});const redo=await state();assert.deepEqual(redo,changed);
  await evaluate(()=>window.commandsExample.history('undo'));const empty=await evaluate(()=>window.commandsExample.history('undo'));assert.equal(empty.disposition,'handled');assert.deepEqual((await state()).blocks,before.blocks);record('ordinary-history',{before,changed,undo,redo,empty});
});
test('read-only invalidates captured intent, refuses new capture and throws on public commit without mutation',async()=>{
  const before=await state();const result=await evaluate(()=>{const f=window.commandsExample,e=f.editor,t=e.captureCommand('bold');e.setReadOnly(true);try {let error;try{e.commit({kind:'editor',origin:'readonly',commands:[{type:'replaceAt',owner:f.blocks()[1].id,from:0,to:5,text:'lost'}]});}catch(x){error=x.message;}return {result:t.execute(),capture:e.captureCommand('bold')===undefined,error};}finally{t.dispose();e.setReadOnly(false);}});
  assert.deepEqual(result,{result:{disposition:'rejected',reason:'stale-or-unavailable-command-target'},capture:true,error:'Editor is read-only'});assert.deepEqual((await state()).blocks,before.blocks);record('read-only',{before,result,after:await state()});
});
test('revision-stale captured target cannot edit the newer document',async()=>{
  const result=await evaluate(()=>{const f=window.commandsExample,t=f.editor.captureCommand('replace');try{f.command('bold');const before=f.snapshot();return {result:t.execute('Monday'),active:t.active,before,after:f.snapshot()};}finally{t.dispose();}});
  assert.deepEqual(result.result,{disposition:'rejected',reason:'stale-or-unavailable-command-target'});assert.equal(result.active,false);assert.deepEqual(result.before,result.after);assert.deepEqual(texts(result.after),initial);record('stale',result);
});
test('configuration-protected italic cannot mutate the target through toolbar or catalog',async()=>{
  const before=await state();const result=await evaluate(()=>{const f=window.commandsExample,t=f.editor.captureToolbar();try{return {state:t.state('italic'),result:t.apply({italic:true}),capture:f.editor.captureCommand('italic')===undefined};}finally{t.dispose();}});
  assert.deepEqual(result,{state:'disabled',result:{disposition:'rejected',reason:'command-permission-denied'},capture:true});assert.deepEqual(await state(),before);record('protected-configuration',result);
});
test('disposed captures and unknown helper commands never fall back to the current caret',async()=>{
  const before=await state();const result=await evaluate(()=>{const f=window.commandsExample,t=f.editor.captureCommand('replace');t.dispose();f.select(1,0);return {result:t.execute('oops'),unknown:f.command('toggleHeading')};});
  assert.deepEqual(result,{result:{disposition:'rejected',reason:'stale-or-unavailable-command-target'},unknown:{disposition:'unavailable'}});assert.deepEqual((await state()).blocks,before.blocks);record('disposed-unknown',result);
});
test('two public chain operations form one undo group; run is single-use',async()=>{
  const before=await state();const result=await evaluate(()=>{const f=window.commandsExample,chain=f.editor.chain('docs:atomic').command({type:'replaceAt',owner:f.blocks()[1].id,from:7,to:11,text:'Sam'}).command({type:'replaceAt',owner:f.blocks()[2].id,from:4,to:10,text:'Monday'});const can=chain.can();f.releaseResult(chain.run());let error;try{chain.run();}catch(x){error=x.message;}return {can,error};});
  assert.deepEqual(result,{can:true,error:'Command chain consumed'});const after=await state();assert.deepEqual(texts(after),['Project kickoff','Owner: Sam','Due Monday','Draft agenda','Confirm attendees','Reference']);
  assert.equal((await evaluate(()=>window.commandsExample.history('undo'))).disposition,'committed');assert.deepEqual((await state()).blocks,before.blocks);record('atomic-history',{result,before,after,undo:await state()});
});
test('invalid later chain command rejects the whole prepared transaction and preserves data',async()=>{
  const before=await state();const result=await evaluate(()=>{const f=window.commandsExample,c=f.editor.chain('docs:invalid').command({type:'replaceAt',owner:f.blocks()[1].id,from:0,to:5,text:'LOSS'}).command({type:'replaceAt',owner:'absent-node',from:0,to:1,text:'x'});const can=c.can();try{c.run();return {can,accepted:true};}catch(x){return {can,code:x.code,operation:x.operation};}});
  assert.equal(result.can,false);assert.equal(result.code,'EngineRejected');assert.deepEqual((await state()).blocks,before.blocks);record('atomic-rejection',result);
});
test('generated signatures and all snippet/source/download hashes match the exact packed declarations',()=>{
  renderReference(docsRoot);
  const inputs=JSON.parse(readFileSync(join(docsRoot,'releases/local-pin-1.3.json'))).inputs;
  const tracked=new Set(execFileSync('git',['-C',docsRoot,'ls-files','-z'],{encoding:'utf8'}).split('\0'));
  for(const pin of inputs) assert.ok(tracked.has(`static/reference-inputs/local-pin-1.3/${pin.path}`),`Uncommitted frozen input: ${pin.path}`);
  const modules=['commands/catalog.d.ts','input/keyboard.d.ts','commands/formatting.d.ts','editor.d.ts'];
  for(const file of modules) assert.equal(digest(readFileSync(join(docsRoot,'static/reference-inputs/local-pin-1.3/web/dist',file))),manifest.declarations[file]);
  assert.match(declaration(readFileSync(join(docsRoot,'static/reference-inputs/local-pin-1.3/web/dist/commands/catalog.d.ts'),'utf8'),'CapturedCommand'),/execute\(text\?: string\)/);
  for(const [file,hash] of Object.entries(manifest.files)) assert.equal(digest(readFileSync(join(docsRoot,'examples/commands',file))),hash,file);
  for(const [file,bytes] of commandOutputs()) assert.deepEqual(readFileSync(join(docsRoot,file)),bytes,file);
  assert.equal(digest(readFileSync(join(docsRoot,'examples/concepts/kickoff-v1.md'))),manifest.fixtureSha256);record('provenance',{sources:Object.keys(manifest.files).length,snippets:Object.keys(manifest.snippets).length});
});
test('real runtime completed with no browser errors or external requests',()=>{assert.deepEqual(harness.metadata.errors,[]);assert.deepEqual(harness.metadata.requestsBlocked,[]);});
