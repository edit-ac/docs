import assert from 'node:assert/strict';
import {test,before,after} from 'node:test';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,join,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
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
 assert.equal(profile.candidate,'CNV-1.18-C2-EI-canonical2');assert.equal(profile.packages.length,3);assert.equal(profile.published,false);assert.equal(profile.fixture,'project-kickoff/1');assert.equal(Object.keys(profile.sources).length,6);
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
