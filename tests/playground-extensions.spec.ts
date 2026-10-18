import assert from 'node:assert/strict';
import {test,before,after} from 'node:test';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,join,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {buildPlayground} from '../scripts/build-playground.mjs';
import {buildFormatsPlayground} from '../scripts/build-playground-formats.mjs';
const {chromium}=await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE||'../core/node_modules/playwright/index.mjs')));
const output=resolve(process.env.DOCS_PLAYGROUND_OUTPUT),facts={cases:[],processes:[],teardown:[]};
let temp,server,url,profile;
before(async()=>{
 temp=await mkdtemp(resolve('.playground-test-'));await buildPlayground(temp);profile=await buildFormatsPlayground(join(temp,'scenarios/extensions-formats'));await writeFile(join(output,'profile.json'),JSON.stringify(profile,null,2));
 server=createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://local').pathname);if(p.endsWith('/'))p+='index.html';const path=resolve(temp,'.'+p);assert.ok(path.startsWith(temp+sep));res.setHeader('Content-Type',p.endsWith('.wasm')?'application/wasm':p.endsWith('.html')?'text/html':p.endsWith('.json')?'application/json':'text/javascript');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'");res.end(await readFile(path));}catch{res.writeHead(404).end();}});
 await new Promise(yes=>server.listen(0,'127.0.0.1',yes));url=`http://127.0.0.1:${server.address().port}`;facts.processes.push({pid:process.pid,port:server.address().port,purpose:'task-owned packaged static playground',workspace:temp});
});
after(async()=>{if(server){const port=server.address()?.port;server.closeAllConnections();await new Promise(yes=>server.close(yes));facts.teardown.push({port,closed:!server.listening});}if(temp)await rm(temp,{recursive:true,force:true});await writeFile(join(output,'browser.json'),JSON.stringify(facts,null,2)+'\n');});
async function browserCase(name,fn,viewport){
 const controller=await chromium.launchServer({headless:true});const process=controller.process();facts.processes.push({pid:process.pid,launcher:process.spawnfile,purpose:name,workspace:temp});let browser,page;
 try{
  browser=await chromium.connect(controller.wsEndpoint());page=await browser.newPage({viewport:viewport||{width:1280,height:850}});page.setDefaultTimeout(12000);
  await page.addInitScript(()=>{const counts=window.playgroundIDB={live:0,opened:0,closed:0};const open=IDBFactory.prototype.open;IDBFactory.prototype.open=function(...args){const r=open.apply(this,args);r.addEventListener('success',()=>{const db=r.result,close=db.close.bind(db);let closed=false;counts.live++;counts.opened++;db.close=()=>{if(!closed){closed=true;counts.live--;counts.closed++;}return close();};});return r;};});
  const external=[];await page.route('**/*',route=>{if(new URL(route.request().url()).origin===url)return route.continue();external.push(route.request().url());return route.abort();});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await fn(page);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  if(await page.evaluate(()=>!!window.playground?.editor)){await page.evaluate(()=>window.playground.close());await page.waitForFunction(()=>!window.playground.busy);}
  assert.equal(await page.evaluate(()=>window.playgroundIDB.live),0,'live IndexedDB connections after dispose');facts.cases.push({name,passed:true,browser:browser.version()});
 }catch(error){facts.cases.push({name,passed:false,error:String(error)});if(page){await writeFile(join(output,name+'-failure.json'),JSON.stringify(await page.evaluate(()=>({text:document.body.innerText,html:document.body.innerHTML,resources:window.playgroundIDB})),null,2));await page.screenshot({path:join(output,name+'-failure.png'),fullPage:true});}throw error;}
 finally{await browser?.close();await controller.close();facts.teardown.push({pid:process.pid,closed:process.exitCode!==null||process.signalCode!==null});}
}
async function ready(page){await page.waitForFunction(()=>window.playground?.editor?.state.ready&&!window.playground.busy);assert.equal(await page.locator('#error').innerText(),'');}
async function visit(page,preset='task'){await page.goto(url+'/scenarios/extensions-formats/');await ready(page);if(preset!=='task'){await page.selectOption('#preset',preset);await ready(page);}}
async function text(page){return page.evaluate(()=>window.playground.editor.read().visible.filter(n=>n.kind==='block').map(n=>n.runs?.map(r=>r.text).join('')||'').join('\n'));}
async function edit(page,suffix){await page.locator('[contenteditable="true"]').getByText('Owner: Alex',{exact:true}).click();await page.keyboard.press('End');await page.keyboard.type(suffix);}
async function click(page,id){await page.click('#'+id);await page.waitForFunction(()=>!window.playground.busy);}
test('immutable optional package family, fixture and public API provenance',async()=>{
 assert.equal(profile.candidate,'CNV-1.18-C2-EI-canonical2');assert.equal(profile.packages.length,3);assert.equal(profile.published,false);assert.equal(profile.fixture,'project-kickoff/1');assert.equal(Object.keys(profile.sources).length,10);
 const manifest=JSON.parse(await readFile(join(temp,'scenarios/extensions-formats/formats/capabilities.json')));
 assert.equal(manifest.directions.filter(d=>d.target==='browser-worker-wasm32').length,13);
 for(const p of profile.packages)assert.equal(p.version,'0.0.0');
 assert.equal(profile.members['formats/dist/index.js'].sha256.length,64);
});
const optional=url=>/\/formats\//.test(url);
async function enable(page){await page.click('#formats-toggle');await page.waitForFunction(()=>window.playgroundFormats.ready);}
async function projection(page){return page.evaluate(()=>JSON.stringify(window.playground.editor.read()));}
test('disabled baseline requests no optional entry, worker, converter or fonts',()=>browserCase('disabled-baseline',async page=>{
 const requests=[];page.on('request',r=>requests.push(r.url()));let workers=0;page.on('worker',()=>workers++);
 await visit(page);await edit(page,' lazy baseline');await click(page,'save');
 assert.equal(await page.locator('#formats-panel').isHidden(),true);assert.equal(requests.filter(optional).length,0);assert.equal(workers,0);assert.ok((await text(page)).includes('lazy baseline'));
}));
test('enabled public client labels exactly match installed browser manifest and PDF export-only',()=>browserCase('enabled-capabilities',async page=>{
 const requests=[];page.on('request',r=>requests.push(r.url()));let workers=0;page.on('worker',()=>workers++);await visit(page);const before=await projection(page);await enable(page);
 const expected=JSON.parse(await readFile(join(temp,'scenarios/extensions-formats/formats/capabilities.json'))).directions.filter(d=>d.target==='browser-worker-wasm32').map(d=>[d.format,d.direction,d.profile,d.fidelity]);
 assert.deepEqual(await page.locator('#formats-capabilities tr').evaluateAll(rows=>rows.map(row=>[...row.cells].map(c=>c.textContent))),expected);
 assert.match(await page.locator('#pdf-policy').innerText(),/export-only/);assert.equal(expected.filter(d=>d[0]==='pdf'&&d[1]==='import').length,0);
 assert.ok(requests.some(r=>r.includes('/formats/index.js?attempt=')));assert.ok(requests.some(r=>r.endsWith('/formats/capabilities.json')));assert.equal(requests.filter(r=>optional(r)&&/worker\.js|\.wasm|\.ttf/.test(r)).length,0);assert.equal(workers,0);assert.equal(await projection(page),before);
}));
test('disable, re-enable and editor close dispose optional ownership without changing the document',()=>browserCase('toggle-disposal',async page=>{
 await visit(page);await edit(page,' keep editor');const before=await projection(page);await enable(page);await page.click('#formats-toggle');assert.equal(await page.evaluate(()=>window.playgroundFormats.ready),false);assert.equal(await projection(page),before);
 await enable(page);await click(page,'close');assert.equal(await page.evaluate(()=>window.playgroundFormats.enabled),false);assert.equal(await page.locator('#formats-panel').isHidden(),true);await click(page,'retry');await ready(page);assert.ok((await text(page)).includes('keep editor'));
}));
test('unavailable manifest retains editor state and can retry the same installed package',()=>browserCase('manifest-retry',async page=>{
 await visit(page);const before=await projection(page);await page.route('**/formats/capabilities.json',r=>r.fulfill({status:503,body:'Unavailable'}));await page.click('#formats-toggle');await page.waitForFunction(()=>document.getElementById('formats-status').textContent.includes('unavailable:'));
 assert.equal(await page.evaluate(()=>window.playgroundFormats.ready),false);assert.equal(await projection(page),before);await page.unroute('**/formats/capabilities.json');await enable(page);assert.equal(await projection(page),before);
}));
test('disable during a delayed capability load fences its late completion',()=>browserCase('late-load-cancel',async page=>{
 await visit(page);let release;const held=new Promise(r=>release=r);let arrived;const started=new Promise(r=>arrived=r);await page.route('**/formats/capabilities.json',async r=>{arrived();await held;await r.continue();});
 const before=await projection(page);await page.click('#formats-toggle');await started;await page.click('#formats-toggle');const finished=page.waitForResponse('**/formats/capabilities.json');release();await finished;
 await page.waitForFunction(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/formats/capabilities.json')));assert.equal(await page.evaluate(()=>window.playgroundFormats.ready),false);assert.equal(await page.locator('#formats-panel').isHidden(),true);assert.equal(await projection(page),before);await page.unroute('**/formats/capabilities.json');await enable(page);
}));
test('optional module failure is visible and explicit retry recovers without resetting editor',()=>browserCase('module-retry',async page=>{
 await visit(page);const before=await projection(page);await page.route('**/formats/index.js?*',r=>r.abort());await page.click('#formats-toggle');await page.waitForFunction(()=>document.getElementById('formats-status').textContent.includes('unavailable:'));
 assert.equal(await projection(page),before);await page.unroute('**/formats/index.js?*');await enable(page);assert.equal(await projection(page),before);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
},{width:390,height:844}));

async function docxAction(page,id){await page.click('#docx-'+id);await page.waitForFunction(()=>!window.playgroundFormats.working);}
async function retainedDownload(page,id,path){const event=page.waitForEvent('download');await page.click('#docx-'+id);const download=await event;assert.equal(await download.failure(),null);await download.saveAs(join(output,path));}
test('DOCX fixture preview, atomic media import, history, exact originals, export and durable reopen',()=>browserCase('docx-atomic-roundtrip',async page=>{
 await visit(page,'document');await enable(page);const before=await projection(page);
 await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/Preview ready/);assert.equal(await projection(page),before);
 assert.match(await page.locator('#docx-report').innerText(),/EXTERNAL_RELATIONSHIP_INERT/);
 await retainedDownload(page,'original','docx-retained-before.docx');
 const priorHistory=await page.evaluate(()=>window.playground.editor.owner.engine.history({type:'state'}));
 await page.evaluate(()=>{window.docxUpdates=0;window.docxSubscription=window.playground.editor.owner.engine.subscribe({type:'updates'},()=>window.docxUpdates++);});
 await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/localCommitted/);
 const imported=await projection(page),observed=await page.evaluate(async()=>{
  const editor=window.playground.editor,assets=await editor.owner.enableAssets(),journal=await assets.inspect();
  const asset=editor.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.asset');
  const original=await assets.retainedSource(asset.id,{identity:asset.blockAttributes[2].identity,actions:['read']});
  const source=journal.prepared.find(p=>p.reference.endsWith('_source'));
  const retainedPackage=await assets.preparedSource(source.job,source.reference,{identity:{host:'local-recovery',key:'complete-docx-package'},actions:['read']});
  window.docxSubscription.dispose();return {visible:editor.read().visible,history:editor.owner.engine.history({type:'state'}),updates:window.docxUpdates,original:Array.from(original),retainedPackage:Array.from(retainedPackage)};
 });
 assert.equal(observed.updates,1);assert.equal(observed.history.undoGroups,priorHistory.undoGroups+1);
 await click(page,'undo');assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
 await click(page,'redo');assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(imported).visible);
 await click(page,'save');await click(page,'close');await click(page,'retry');await ready(page);await enable(page);
 await page.reload();await ready(page);await page.selectOption('#preset','document');await ready(page);await enable(page);await docxAction(page,'stored');await retainedDownload(page,'original','docx-retained-after-reload.docx');
 const reopened=await page.evaluate(async()=>{const e=window.playground.editor,a=await e.owner.enableAssets(),j=await a.inspect(),asset=e.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.asset'),s=j.prepared.find(p=>p.reference.endsWith('_source'));return {visible:e.read().visible,original:Array.from(await a.retainedSource(asset.id,{identity:asset.blockAttributes[2].identity,actions:['read']})),retainedPackage:Array.from(await a.preparedSource(s.job,s.reference,{identity:{host:'local-recovery',key:'complete-docx-package'},actions:['read']}))};});
 assert.deepEqual(reopened.visible,observed.visible);assert.deepEqual(reopened.original,observed.original);assert.deepEqual(reopened.retainedPackage,observed.retainedPackage);
 await page.check('#docx-loss');await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/output retained/);
 await retainedDownload(page,'download','docx-export.docx');await retainedDownload(page,'recovery','docx-recovery.json');
 assert.deepEqual(JSON.parse(await projection(page)).visible,observed.visible);
 await writeFile(join(output,'docx-observations.json'),JSON.stringify({before:JSON.parse(before),...observed,reopened,report:await page.evaluate(()=>window.playgroundFormats.report)},null,2));
}));
test('DOCX loss rejection, malformed input and canceled preview preserve document and recoverable bytes',()=>browserCase('docx-rejections',async page=>{
 await visit(page,'document');await enable(page);const before=await projection(page);
 await page.selectOption('#docx-fixture','media-loss');await docxAction(page,'prepare');assert.match(await page.locator('#docx-report').innerText(),/"lossy": true/);assert.equal(await projection(page),before);
 await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/LossApprovalRequired/);assert.equal(await projection(page),before);
 await retainedDownload(page,'original','docx-loss-retained.docx');await retainedDownload(page,'recovery','docx-loss-recovery.json');
 await page.check('#docx-loss');await docxAction(page,'prepare');await docxAction(page,'cancel');assert.equal(await page.locator('#docx-confirm').isDisabled(),true);assert.equal(await projection(page),before);
 await page.selectOption('#docx-fixture','corrupt');await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/rejected/);assert.equal(await projection(page),before);
 await retainedDownload(page,'original','docx-corrupt-retained.docx');
 await page.selectOption('#docx-fixture','media-loss');await docxAction(page,'prepare');await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/localCommitted/);
 assert.notDeepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
},{width:390,height:844}));

test('DOCX independent ZIP XML PNG and downloaded output match actual playground observations',()=>{
 const result=spawnSync('python3',['tests/inspect-playground-docx.py',output,resolve('../architecture/evidence/document-conversion/consumers-epub-import-20261018/canonical2/docx-import-fixtures')],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr||result.stdout);
});

for(const kind of ['odt','epub']){
 test(`${kind.toUpperCase()} fixture preview, atomic media history, retained originals, export and reopen`,()=>browserCase(kind+'-atomic-roundtrip',async page=>{
  await visit(page,'document');await enable(page);await page.selectOption('#package-format',kind);
  const manifest=JSON.parse(await readFile(join(temp,'scenarios/extensions-formats/formats/capabilities.json')));
  for(const direction of ['import','export']){const d=manifest.directions.find(d=>d.target==='browser-worker-wasm32'&&d.format===kind&&d.direction===direction);assert.ok(d);assert.ok((await page.locator('#direction-profile').innerText()).includes(`${direction}: ${d.profile} / ${d.fidelity}`));}
  const before=await projection(page),priorHistory=await page.evaluate(()=>window.playground.editor.owner.engine.history({type:'state'}));
  await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/Preview ready/);assert.equal(await projection(page),before);
  const preview=await page.evaluate(()=>window.playgroundFormats.report);assert.equal(preview.profile,`edit-ac-${kind}-v1`);
  await retainedDownload(page,'original',kind+'-retained-before.'+kind);
  await page.evaluate(()=>{window.formatUpdates=0;window.formatSubscription=window.playground.editor.owner.engine.subscribe({type:'updates'},()=>window.formatUpdates++);});
  await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/localCommitted/);
  const observed=await page.evaluate(async kind=>{
   const editor=window.playground.editor,assets=await editor.owner.enableAssets(),journal=await assets.inspect(),asset=editor.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.asset'),source=journal.prepared.find(p=>p.reference.endsWith('_source'));
   const original=Array.from(await assets.retainedSource(asset.id,{identity:asset.blockAttributes[2].identity,actions:['read']}));
   const retainedPackage=Array.from(await assets.preparedSource(source.job,source.reference,{identity:{host:'local-recovery',key:`complete-${kind}-package`},actions:['read']}));
   window.formatSubscription.dispose();return {visible:editor.read().visible,history:editor.owner.engine.history({type:'state'}),updates:window.formatUpdates,original,retainedPackage};
  },kind);
  assert.equal(observed.updates,1);assert.equal(observed.history.undoGroups,priorHistory.undoGroups+1);
  await click(page,'undo');assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
  await click(page,'redo');assert.deepEqual(JSON.parse(await projection(page)).visible,observed.visible);
  await click(page,'save');await page.reload();await ready(page);await page.selectOption('#preset','document');await ready(page);await enable(page);await page.selectOption('#package-format',kind);await docxAction(page,'stored');
  assert.match(await page.locator('#docx-status').innerText(),new RegExp('Stored original '+kind.toUpperCase()));await retainedDownload(page,'original',kind+'-retained-after-reload.'+kind);
  const reopened=await page.evaluate(async()=>{const e=window.playground.editor,a=await e.owner.enableAssets(),asset=e.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.asset');return {visible:e.read().visible,original:Array.from(await a.retainedSource(asset.id,{identity:asset.blockAttributes[2].identity,actions:['read']}))};});assert.deepEqual(reopened.visible,observed.visible);assert.deepEqual(reopened.original,observed.original);
  const beforeExport=await projection(page);await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/ConversionRejected/);assert.equal((await page.evaluate(()=>window.playgroundFormats.report)).reason,'loss-approval-required');assert.match(await page.locator('#docx-report').innerText(),/"lossy": true/);assert.equal(await projection(page),beforeExport);await retainedDownload(page,'recovery',kind+'-export-loss-recovery.json');
  await page.check('#docx-loss');await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/output retained/);
  const exportReport=await page.evaluate(()=>window.playgroundFormats.report);assert.equal(exportReport.profile,`edit-ac-${kind}-v1`);assert.equal(await page.locator('#docx-download').innerText(),'Download prepared '+kind.toUpperCase());
  // Output and original keep their captured extension even after selecting another format.
  await page.selectOption('#package-format','docx');
  const event=page.waitForEvent('download');await page.click('#docx-download');const download=await event;assert.equal(download.suggestedFilename(),'playground.'+kind);assert.equal(await download.failure(),null);await download.saveAs(join(output,kind+'-export.'+kind));
  await retainedDownload(page,'recovery',kind+'-recovery.json');assert.deepEqual(JSON.parse(await projection(page)).visible,observed.visible);
  await writeFile(join(output,kind+'-observations.json'),JSON.stringify({before:JSON.parse(before),...observed,reopened,preview,exportReport},null,2));
 },kind==='epub'?{width:390,height:844}:undefined));
 test(`${kind.toUpperCase()} loss, malformed input and canceled preparation preserve document and originals`,()=>browserCase(kind+'-rejections',async page=>{
  await visit(page,'document');await enable(page);await page.selectOption('#package-format',kind);const before=await projection(page);
  await page.selectOption('#docx-fixture','media-loss');await docxAction(page,'prepare');assert.match(await page.locator('#docx-report').innerText(),/"lossy": true/);assert.equal(await projection(page),before);
  await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/LossApprovalRequired/);assert.equal(await projection(page),before);
  await retainedDownload(page,'original',kind+'-loss-retained.'+kind);await retainedDownload(page,'recovery',kind+'-loss-recovery.json');
  await page.check('#docx-loss');await docxAction(page,'prepare');await docxAction(page,'cancel');assert.equal(await page.locator('#docx-confirm').isDisabled(),true);assert.equal(await projection(page),before);
  await page.selectOption('#docx-fixture','corrupt');await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/rejected/);assert.equal(await projection(page),before);await retainedDownload(page,'original',kind+'-corrupt-retained.'+kind);
  await page.selectOption('#docx-fixture','media-loss');await docxAction(page,'prepare');await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/localCommitted/);assert.notDeepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
 }));
}
test('ODT EPUB independent ZIP XML PNG output and original observations',()=>{
 const result=spawnSync('python3',['tests/inspect-playground-odt-epub.py',output,resolve('../architecture/evidence/document-conversion/consumers-epub-import-20261018/canonical2')],{encoding:'utf8'});assert.equal(result.status,0,result.stderr||result.stdout);
});

for(const kind of ['csv','tsv'])test(`${kind.toUpperCase()} playground explicit dialect selected table exact safe and recovery`,()=>browserCase(kind+'-table-roundtrip',async page=>{
 await visit(page,'document');await enable(page);await page.selectOption('#package-format',kind);await page.check('#table-header');
 const before=await projection(page),history=await page.evaluate(()=>window.playground.editor.owner.engine.history({type:'state'}));
 // No selected table must be rejected by the installed service, with recovery.
 await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/rejected/);assert.equal(await projection(page),before);
 await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/Preview ready/);assert.equal(await projection(page),before);
 await retainedDownload(page,'original',kind+'-retained.'+kind);
 await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/imported: committed/);
 const imported=JSON.parse(await projection(page));const table=imported.visible.find(n=>n.blockAttributes?.[0]==='module:editac.table');assert.ok(table);
 assert.equal((await page.evaluate(()=>window.playground.editor.owner.engine.history({type:'state'}))).undoGroups,history.undoGroups+1);
 await click(page,'undo');assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);await click(page,'redo');assert.deepEqual(JSON.parse(await projection(page)).visible,imported.visible);
 await page.selectOption('#table-selected',table.id);
 await docxAction(page,'export');assert.match(await page.locator('#docx-report').innerText(),/HEADER_FLAG_LOST_ROW_RETAINED/);assert.match(await page.locator('#docx-status').innerText(),/rejected/);
 await page.check('#docx-loss');
 for(const newline of ['lf','crlf']){
  await page.selectOption('#table-newline',newline);
  for(const safe of [false,true]){
   await page.locator('#table-safe').setChecked(safe);await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/output retained/);
   const report=await page.evaluate(()=>window.playgroundFormats.report);assert.equal(report.profile,`edit-ac-${kind}-${safe?'spreadsheet-safe-':''}v1`);
   if(safe)assert.ok(report.diagnostics.some(d=>d.code==='SPREADSHEET_SAFE_PREFIX'));
   await retainedDownload(page,'download',`${kind}-${newline}-${safe?'safe':'exact'}.${kind}`);
  }
 }
 await retainedDownload(page,'recovery',kind+'-table-recovery.json');assert.deepEqual(JSON.parse(await projection(page)).visible,imported.visible);
 await writeFile(join(output,kind+'-table-observations.json'),JSON.stringify({before:JSON.parse(before),imported,table},null,2));
 // Explicit wrong dialect is a visible rejection, preserving original bytes/state.
 await page.selectOption('#table-newline',kind==='csv'?'crlf':'lf');await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/rejected/);assert.deepEqual(JSON.parse(await projection(page)).visible,imported.visible);
 // The output stays captured after changing formats and after close/reopen.
 await page.selectOption('#package-format','pdf');await retainedDownload(page,'download',kind+'-captured.'+kind);
 await click(page,'save');await click(page,'close');await click(page,'retry');await ready(page);assert.deepEqual(JSON.parse(await projection(page)).visible,imported.visible);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
},kind==='tsv'?{width:390,height:844}:undefined));

test('PDF playground captured export recoverable download and visible export-only input rejection',()=>browserCase('pdf-export-only',async page=>{
 await visit(page,'document');await enable(page);await page.selectOption('#package-format','pdf');const before=await projection(page);
 await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/FORMAT_EXPORT_ONLY/);assert.equal(await projection(page),before);assert.equal(await page.locator('#docx-confirm').isDisabled(),true);
 await retainedDownload(page,'original','pdf-rejected-input.pdf');await retainedDownload(page,'recovery','pdf-input-recovery.json');
 await page.check('#docx-loss');await docxAction(page,'export');assert.match(await page.locator('#docx-report').innerText(),/SEMANTIC_RENDERING_UNIMPLEMENTED/);assert.equal(await projection(page),before);
 await page.selectOption('#preset','publication');await ready(page);const publication=await projection(page);await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/output retained/);assert.equal(await projection(page),publication);
 const report=await page.evaluate(()=>window.playgroundFormats.report);assert.equal(report.profile,'edit-ac-pdf-publication-v1');
 await page.selectOption('#package-format','csv');const event=page.waitForEvent('download');await page.click('#docx-download');const download=await event;assert.equal(download.suggestedFilename(),'playground.pdf');assert.equal(await download.failure(),null);await download.saveAs(join(output,'playground.pdf'));
 await retainedDownload(page,'recovery','pdf-export-recovery.json');await writeFile(join(output,'pdf-observations.json'),JSON.stringify({before:JSON.parse(before),publication:JSON.parse(publication),report},null,2));
}));
test('table text and PDF independent output readers',()=>{
 const result=spawnSync('python3',['tests/inspect-playground-table-pdf.py',output,resolve('../core/fixtures/formats/table-text')],{encoding:'utf8'});assert.equal(result.status,0,result.stderr||result.stdout);
});

for(const kind of ['csv','tsv'])test(`${kind.toUpperCase()} no-header import and selected stale table rejection`,()=>browserCase(kind+'-table-selection',async page=>{
 await visit(page,'document');await enable(page);await page.selectOption('#package-format',kind);assert.equal(await page.locator('#table-header').isChecked(),false);
 const before=await projection(page);await docxAction(page,'prepare');assert.match(await page.locator('#docx-status').innerText(),/Preview ready/);await docxAction(page,'confirm');assert.match(await page.locator('#docx-status').innerText(),/imported: committed/);
 const imported=JSON.parse(await projection(page)),table=imported.visible.find(n=>n.blockAttributes?.[0]==='module:editac.table');assert.ok(table);assert.ok(table.blockAttributes[2].rows.flat().every(cell=>cell.header===false));
 await page.selectOption('#table-selected',table.id);await page.check('#docx-loss');await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/output retained/);
 await click(page,'undo');assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
 // The explicit captured selection is now absent; do not guess another table.
 await docxAction(page,'export');assert.match(await page.locator('#docx-status').innerText(),/rejected/);assert.deepEqual(JSON.parse(await projection(page)).visible,JSON.parse(before).visible);
 await retainedDownload(page,'download',kind+'-stale-retained.'+kind);await retainedDownload(page,'recovery',kind+'-stale-recovery.json');
 await click(page,'redo');await page.click('#table-refresh');await page.selectOption('#table-selected',table.id);assert.deepEqual(JSON.parse(await projection(page)).visible,imported.visible);
 await writeFile(join(output,kind+'-selection-observations.json'),JSON.stringify({table,imported,report:await page.evaluate(()=>window.playgroundFormats.report)},null,2));
}));
