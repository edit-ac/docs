import assert from 'node:assert/strict';
import { test as nodeTest, before, after } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, readdir, realpath, rm, cp, access } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
const {chromium}=await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE || '../core/node_modules/playwright/index.mjs')));
const suite=process.env.DOCS_QUICKSTART_SUITE;
assert.ok(['web-react','astro'].includes(suite));
function test(name,...args){if(name.includes('shipped') && (name.toLowerCase().includes('astro') !== (suite==='astro')))return;nodeTest(name,...args);}
const requireTestNode=async()=>assert.equal(process.version,'v24.19.0');

const root=fileURLToPath(new URL('./',import.meta.url));
const candidateRoot=resolve('../architecture/evidence/local-consumer-return/20261018');
const candidateBytes=await readFile(join(candidateRoot,'local-candidates-v5.json'));
assert.equal(createHash('sha256').update(candidateBytes).digest('hex'),'27fb6a35786c50d2faa9a3a4d7c90340da6d7c667caf48060c54ae270c055729');
const candidate=JSON.parse(candidateBytes).candidates.find(c=>c.id==='sdk-framework-v1');
const docs=true;
const output=resolve(process.env.DOCS_QUICKSTART_OUTPUT || 'evidence/quickstarts-20261018/'+suite);
const names=['core','web','react','astro','markdown'];
let temp, common, astro;
const facts={commands:[],packs:[],cases:[],processes:[],teardown:[]};
async function put(path,text){await mkdir(resolve(path,'..'),{recursive:true});await writeFile(path,text);}
async function run(command,args,cwd,label,env={}){
  const result=spawnSync(command,args,{cwd,env:{...process.env,...env},encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024});
  const log=join(output,label+'.log');await writeFile(log,(result.stdout??'')+'\n'+(result.stderr??''));
  facts.commands.push({command,args,cwd,label,exit:result.status,error:result.error?.message,log});
  assert.equal(result.error,undefined,`${label}: ${result.error}; ${log}`);
  assert.equal(result.status,0,`${label}: see ${log}`);return result.stdout;
}
async function install(dir,framework){
 await mkdir(dir,{recursive:true});
 const dependencies=Object.fromEntries((framework==='astro'?['core','web','astro','markdown']:['core','web','react','markdown']).map(n=>['@edit-ac/'+n,'file:'+join(temp,`edit-ac-${n}-0.0.0.tgz`)]));
 Object.assign(dependencies,framework==='astro'?{'astro':'7.3.8','@astrojs/node':'11.1.7'}:{react:'19.3.0','react-dom':'19.3.0','@types/react':'19.3.0','@types/react-dom':'19.3.0',esbuild:'0.25.12'});
 dependencies.typescript='7.0.2';
 await put(join(dir,'package.json'),JSON.stringify({private:true,type:'module',dependencies}));
 await run('npm',['install','--offline','--ignore-scripts','--no-audit','--no-fund'],dir,'install-'+framework);
}
before(async()=>{
 await requireTestNode();await mkdir(output,{recursive:true});temp=await realpath(await mkdtemp(join(resolve('.'),' .quickstart-'.trim())));common=join(temp,'common');astro=join(temp,'astro');
 for(const name of names){const pin=candidate.packages.find(p=>p.name==='@edit-ac/'+name);const bytes=await readFile(join(candidateRoot,pin.path));assert.equal(createHash('sha256').update(bytes).digest('hex'),pin.sha256);await writeFile(join(temp,`edit-ac-${name}-0.0.0.tgz`),bytes);facts.packs.push({...pin,shortName:name});}
 await install(common,'react');await install(astro,'astro');

 for(const dir of [common,astro]){await mkdir(join(dir,'public'),{recursive:true});await copyFile(join(dir,'node_modules/@edit-ac/core/dist/wasm/editac_wasm_bg.wasm'),join(dir,'public/engine.wasm'));}
 await copyFile(join(astro,'node_modules/@edit-ac/markdown/dist/wasm/editac_markdown_wasm_bg.wasm'),join(astro,'public/markdown.wasm'));
 if(docs) {
  for(const file of ['editor.mjs','document.mjs','kickoff.mjs','controls.mjs','recovery.mjs','markdown.mjs','react.mjs','index.html','react.html']) {
   const source=join(root,'examples/task-editor',file);const content=await readFile(source);facts.sources??=[];facts.sources.push({path:source,sha256:createHash('sha256').update(content).digest('hex')});
   await copyFile(source,join(common,'public',file));
  }
  await cp(join(common,'node_modules/@edit-ac/core/dist'),join(common,'public/core'),{recursive:true});
  await cp(join(common,'node_modules/@edit-ac/core/dist/wasm'),join(common,'public/wasm'),{recursive:true});
  await cp(join(common,'node_modules/@edit-ac/markdown/dist'),join(common,'public/markdown'),{recursive:true});
  await cp(join(common,'node_modules/@edit-ac/web/dist'),join(common,'public/web'),{recursive:true});
  await mkdir(join(common,'public/fixture'),{recursive:true});
  for(const file of ['editor.mjs','recovery.mjs','markdown.mjs','document.mjs','kickoff.mjs','controls.mjs']) await copyFile(join(common,'public',file),join(common,'public/fixture',file));
  // Bundle the actual React entry; retain native ESM for the plain entry.
  await run(join(common,'node_modules/.bin/esbuild'),['public/react.mjs','--bundle','--format=esm','--outfile=public/react-built.mjs'],common,'docs-react-build');
  // The served HTML entry points at the built version of the same source.
  const html=await readFile(join(common,'public/react.html'),'utf8');await copyFile(join(common,'public/react-built.mjs'),join(common,'public/fixture/react-built.mjs'));
  await cp(join(common,'public/wasm'),join(common,'public/fixture/wasm'),{recursive:true});
  await put(join(common,'public/react.html'),html);
  await cp(join(root,'examples/astro/src'),join(astro,'src'),{recursive:true});
  await copyFile(join(root,'examples/astro/astro.config.mjs'),join(astro,'astro.config.mjs'));
  await mkdir(join(temp,'task-editor'),{recursive:true});await copyFile(join(root,'examples/task-editor/recovery.mjs'),join(temp,'task-editor/recovery.mjs'));await copyFile(join(root,'examples/task-editor/markdown.mjs'),join(temp,'task-editor/markdown.mjs'));await copyFile(join(root,'examples/task-editor/kickoff.mjs'),join(temp,'task-editor/kickoff.mjs'));await copyFile(join(root,'examples/task-editor/controls.mjs'),join(temp,'task-editor/controls.mjs'));
  for(const mode of ['static','ssr']) await run(process.execPath,['node_modules/astro/bin/astro.mjs','build'],astro,'docs-astro-'+mode,{EDITAC_ASTRO_MODE:mode,PUBLIC_EDITAC_ASTRO_FIXTURE:'0'});
 }

},{timeout:240000});
after(async()=>{
 try {if(temp) {
  const paths=['common/public','common/package.json','common/package-lock.json','astro/dist-static','astro/dist-ssr','astro/package.json','astro/package-lock.json'];
  facts.archive={included:[],missing:[]};
  for(const path of paths) {
   try {await access(join(temp,path));facts.archive.included.push(path);}
   catch(error) {if(error.code!=='ENOENT')throw error;facts.archive.missing.push(path);}
  }
  // Retain partial setup evidence without replacing its primary failure with
  // an archive error for build outputs that were never produced.
  if(facts.archive.included.length)await run('tar',['-czf',join(output,'compiled-consumers.tgz'),'-C',temp,...facts.archive.included],root,'archive-consumers');
 }}
 finally {try {await mkdir(output,{recursive:true});await writeFile(join(output,'harness.json'),JSON.stringify(facts,null,2)+'\n');} finally {if(temp)await rm(temp,{recursive:true,force:true});}}
});

test('tarballs contain exports, declarations, Apache license/notices and no workspace links; one core owner',async()=>{
 for(const [dir,selected] of [[common,['core','web','react']],[astro,['core','web','astro']]]){
  const core=await realpath(join(dir,'node_modules/@edit-ac/core'));
  for(const name of selected){const location=join(dir,'node_modules/@edit-ac',name);assert.equal(await realpath(location),location);assert.ok(location.startsWith(temp+sep));
   const pkg=JSON.parse(await readFile(join(location,'package.json')));assert.equal(pkg.private,true);assert.equal(pkg.license,'Apache-2.0');
   assert.match(await readFile(join(location,'LICENSE'),'utf8'),/Apache License/);
   assert.ok((await readFile(join(location,name==='core'?'THIRD-PARTY-NOTICES.txt':'NOTICE'))).length>0);
   for(const value of Object.values(pkg.exports)){for(const path of typeof value==='string'?[value]:Object.values(value))assert.ok((await readFile(join(location,path))).length>0);}
   assert.equal(await realpath(join(dir,'node_modules/@edit-ac/core')),core);
   await assert.rejects(realpath(join(location,'node_modules/@edit-ac/core')),/ENOENT/);
   if(name==='core')assert.match(await readFile(join(location,'THIRD-PARTY-NOTICES.txt'),'utf8'),/Bartosz Sypytkowski/);
  }
 }
 const dirs=await readdir(join(astro,'node_modules'));assert.ok(!dirs.includes('react'));assert.ok(!dirs.includes('react-dom'));
 const webpack=facts.packs.find(p=>p.shortName==='web');assert.ok(Object.hasOwn(webpack.members,'package/dist/modules/vendor/LICENSE.katex'));
});

test('isolated declarations resolve all public SDK exports',async()=>{
 for(const [dir,framework] of [[common,'react'],[astro,'astro']]){
 await put(join(dir,'types.ts'),`import {init,type EngineRuntime} from '@edit-ac/core';import {createEditor,type EditorOptions} from '@edit-ac/web';import {mathRenderer} from '@edit-ac/web/math';import {initMarkdown} from '@edit-ac/markdown';import {markdownExtension} from '@edit-ac/markdown/web';void initMarkdown;void markdownExtension;${framework==='react'?"import {EditorHost,useEditorState} from '@edit-ac/react';void EditorHost;void useEditorState;":"import {mountEditorHost,installEditorHosts} from '@edit-ac/astro';void mountEditorHost;void installEditorHosts;"}void init;void createEditor;void mathRenderer;let runtime:EngineRuntime;let options:EditorOptions;`);
 await run(process.execPath,['node_modules/typescript/bin/tsc','--noEmit','--strict','--module','NodeNext','--target','ES2022','--lib','ES2022,DOM','types.ts'],dir,'types-'+framework);
 }
});

test('tarball SSR imports and React render never touch browser globals or initialize WASM',async()=>{
 for(const [dir,framework] of [[common,'react'],[astro,'astro']]){
 await put(join(dir,'ssr.mjs'),`import assert from 'node:assert/strict';${framework==='react'?"import {createElement} from 'react';import {renderToString} from 'react-dom/server';":''}for(const name of ['window','document','indexedDB','navigator','fetch','WebAssembly'])Object.defineProperty(globalThis,name,{configurable:true,get(){throw Error('SSR accessed '+name);}});const core=await import('@edit-ac/core');await import('@edit-ac/web');await import('@edit-ac/web/math');await import('@edit-ac/markdown');await import('@edit-ac/markdown/web');const framework=await import('@edit-ac/${framework}');${framework==='react'?"assert.equal(renderToString(createElement(framework.EditorHost,{options:{identity:{documentId:'ssr'},databaseName:'ssr',assetUrl:'/never.wasm'},attributes:{id:'host'}})),'<div id=\"host\"></div>');":''}assert.ok(import.meta.resolve('@edit-ac/core/wasm').includes('/node_modules/@edit-ac/core/'));`);
 await run(process.execPath,['ssr.mjs'],dir,'ssr-import-'+framework);
 }
});

async function serve(dir,csp=true){
 const requests=[];const server=createServer(async(req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);requests.push(pathname);
 try{let p=pathname;if(!p.includes('.'))p=p.replace(/\/$/,'')+'/index.html';const file=resolve(dir,'.'+p);if(!file.startsWith(dir+sep))throw Error('outside fixture');
 res.setHeader('Access-Control-Allow-Origin','*');if(csp)res.setHeader('Content-Security-Policy',typeof csp==='string'?csp:"default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self'; style-src 'self' 'unsafe-inline'");res.setHeader('Content-Type',p.endsWith('.wasm')?'application/wasm':p.endsWith('.html')?'text/html':'text/javascript');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(yes=>server.listen(0,'127.0.0.1',yes));const port=server.address().port;facts.processes.push({pid:process.pid,launcher:'node --test tests/packed-consumers.test.mjs',workspace:dir,port,purpose:'packed consumer',log:join(output,'harness.json')});
 return {url:`http://127.0.0.1:${port}`,requests,close:async()=>{server.closeAllConnections();await new Promise(yes=>server.close(yes));facts.teardown.push({port,closed:!server.listening});}};
}
async function ssrServer(){
 const reservation=await serve(join(astro,'public'));const port=Number(new URL(reservation.url).port);await reservation.close();
 const child=spawn(process.execPath,['dist-ssr/server/entry.mjs'],{cwd:astro,env:{...process.env,PORT:String(port),HOST:'127.0.0.1'},stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
 facts.processes.push({pid:child.pid,launcher:process.execPath,workspace:astro,port,purpose:'packed Astro SSR',log:join(output,'ssr-server.log')});
 const close=async()=>{if(child.exitCode===null&&child.signalCode===null){child.kill('SIGTERM');await new Promise(yes=>child.once('exit',yes));}await writeFile(join(output,'ssr-server.log'),log);facts.teardown.push({pid:child.pid,exited:child.exitCode!==null||child.signalCode!==null});};
 try{for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error(log);try{if((await fetch(`http://127.0.0.1:${port}`)).ok)return{url:`http://127.0.0.1:${port}`,close};}catch{}await new Promise(yes=>setTimeout(yes,50));}throw Error('SSR startup timeout');}catch(e){await close();throw e;}
}
async function browserCase(engine,name,fn){const controller=await engine.launchServer({headless:true});const process=controller.process();facts.processes.push({pid:process.pid,launcher:process.spawnfile,workspace:temp,purpose:name,log:join(output,'harness.json')});let browser;
 try{browser=await engine.connect(controller.wsEndpoint());const page=await browser.newPage();await page.addInitScript(()=>{
  const counters=window.quickstartIDB={live:0,opened:0,closed:0};
  const open=IDBFactory.prototype.open;
  IDBFactory.prototype.open=function(...args){const request=open.apply(this,args);request.addEventListener('success',()=>{
    const db=request.result,close=db.close.bind(db);let closed=false;counters.live++;counters.opened++;
    db.close=()=>{if(!closed){closed=true;counters.live--;counters.closed++;}return close();};
  });return request;};
 });page.setDefaultTimeout(15000);const errors=[];const consoleLog=[];const external=[];let allowed;page.on('request',r=>{if(!allowed)allowed=new URL(r.url()).origin;});await page.route('**/*',r=>{if(new URL(r.request().url()).origin===allowed)return r.continue();external.push(r.request().url());return r.abort();});page.on('console',message=>consoleLog.push(message.type()+': '+message.text()));page.on('requestfailed',request=>consoleLog.push(request.url()+': '+request.failure()?.errorText));page.on('pageerror',e=>{errors.push(e.message);void writeFile(join(output,name+'-browser-error.log'),errors.join('\n'));});try{await fn(page);}catch(error){await writeFile(join(output,name+'-failure-state.json'),JSON.stringify(await page.evaluate(()=>({text:document.body.innerText,html:document.body.innerHTML,selection:String(getSelection()),resources:window.quickstartIDB})),null,2));throw error;}finally{await writeFile(join(output,name+'-console.log'),consoleLog.join('\n'));}assert.deepEqual(errors,[]);assert.deepEqual(external,[]);facts.cases.push({name,browser:browser.version(),passed:true});}
 catch(error){facts.cases.push({name,passed:false,error:String(error)});throw error;}finally{await browser?.close();await controller.close();facts.teardown.push({pid:process.pid,exited:process.exitCode!==null});}}
registerDocsCases('chromium',chromium);

function registerDocsCases(name,engine) {
 for(const framework of ['plain','react','astro']) test(`${name}: shipped ${framework} recovery controls expose a prepared journal failure`,{timeout:60000},async()=>{
  const server=await serve(framework==='astro'?join(astro,'dist-static'):join(common,'public'),false);
  try {await browserCase(engine,`${name}-docs-${framework}-save-failure`,async page=>{
   await page.goto(server.url+(framework==='react'?'/react.html':'/'));await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   await page.evaluate(()=>{const add=IDBObjectStore.prototype.add;IDBObjectStore.prototype.add=function(...args){if(this.name==='updates')throw new DOMException('prepared journal failure','QuotaExceededError');return add.apply(this,args);};});
   const surface=page.locator('[contenteditable="true"]').first();await surface.getByText('Owner: Alex',{exact:true}).click();await page.keyboard.press('End');await page.keyboard.type(' retained');
   await page.getByRole('button',{name:'Save locally',exact:true}).click();
   try {await page.waitForFunction(()=>document.body.innerText.includes('Local save failed'));}catch(error){await writeFile(join(output,`${name}-${framework}-fault-state.json`),JSON.stringify(await page.evaluate(()=>({text:document.body.innerText,resources:window.quickstartIDB})),null,2));throw error;}
   const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery',exact:true}).click();const download=await downloaded;const file=join(output,`${name}-${framework}-live-recovery.json`);await download.saveAs(file);const report=JSON.parse(await readFile(file,'utf8'));assert.ok(JSON.stringify(report).includes('bytes'));assert.ok(JSON.stringify(report).includes('data'));assert.ok(report.length>0);
   if(framework==='astro') {
    await page.getByText('Navigate away',{exact:true}).click();await page.waitForURL('**/away');await page.waitForFunction(()=>window.quickstartIDB.live===0);await page.getByRole('link').click();await page.waitForURL(server.url+'/');await page.waitForFunction(()=>document.querySelector('#save-status')?.textContent.includes('Unsaved content retained'));
    const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery'}).click();const retained=await recoveryDownload(await event,`${name}-${framework}-disposed-recovery.json`);assert.ok(retained.some(r=>r.unsaved&&r.recovery));
   } else {
    await page.evaluate(async framework=>{const app=await import(framework==='plain'?'/fixture/editor.mjs':'/fixture/react-built.mjs');await app.close();},framework);
    await page.waitForFunction(()=>!document.querySelector('[contenteditable="true"]'));await page.waitForFunction(()=>window.quickstartIDB.live===0);
    if(framework==='react')await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Unsaved content retained'));
    const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery'}).click();const retained=await recoveryDownload(await event,`${name}-${framework}-disposed-recovery.json`);assert.ok(retained.some(r=>r.unsaved&&r.recovery));
   }
  });}finally{await server.close();}
 });
 for(const framework of ['plain','react','astro'])test(`${name}: shipped ${framework} opening failure preserves stored identity`,{timeout:60000},async()=>{
  const server=await serve(framework==='astro'?join(astro,'dist-static'):join(common,'public'),false);
  try{await browserCase(engine,`${name}-docs-${framework}-load-failure`,async page=>{
   await page.goto(server.url+(framework==='react'?'/react.html':'/'));await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   const identity=await page.evaluate(()=>JSON.stringify({...localStorage}));
   await page.evaluate(()=>sessionStorage.setItem('prepared-open-once','1'));await page.addInitScript(()=>{if(sessionStorage.getItem('prepared-open-once')==='1'){sessionStorage.removeItem('prepared-open-once');IDBFactory.prototype.open=function(){throw new DOMException('prepared opening failure','UnknownError');};}});
   await page.reload();await page.waitForFunction(()=>document.body.innerText.includes('Unable to open')||document.body.innerText.includes('loading/saving failed'));
   assert.equal(await page.locator('[contenteditable="true"]').count(),0);assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),identity);await page.reload();await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),identity);
  });}finally{await server.close();}
 });

 for(const framework of ['plain','react','astro'])test(`${name}: shipped ${framework} missing WASM reports loading failure and retries without replacing content`,{timeout:60000},async()=>{
  const server=await serve(framework==='astro'?join(astro,'dist-static'):join(common,'public'),false);
  try{await browserCase(engine,`${name}-docs-${framework}-asset-failure`,async page=>{
   const url=server.url+(framework==='react'?'/react.html':'/');
   await page.goto(url);await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   const identity=await page.evaluate(()=>JSON.stringify({...localStorage}));
   const missing=[];await page.route('**/*.wasm',route=>{missing.push(route.request().url());return route.abort();});
   await page.reload();await page.waitForFunction(()=>document.body.innerText.includes('Unable to open')||document.body.innerText.includes('loading/saving failed'));
   assert.ok(missing.length>0,'Actual WASM request must fail');
   assert.equal(await page.locator('[contenteditable="true"]').count(),0);
   assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),identity);
   await page.unroute('**/*.wasm');await page.reload();await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   assert.equal(await page.locator('[contenteditable="true"]').first().locator('h1').innerText(),'Project kickoff');
   assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),identity);
  });}finally{await server.close();}
 });
 for(const framework of ['plain','react']) test(`${name}: shipped ${framework} example edits, saves, exports recovery and reopens offline`,{timeout:60000},async()=>{
  const server=await serve(join(common,'public'),false);
  try {await browserCase(engine,`${name}-docs-${framework}`,async page=>{
   await page.goto(server.url+(framework==='react'?'/react.html':'/'));
   await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   const surface=page.locator('[contenteditable="true"]');await surface.getByText('Owner: Alex',{exact:true}).click();await page.keyboard.press('End');await page.keyboard.type(' docs');
   await page.getByRole('button',{name:'Save locally',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Saved locally'));
   await checkKickoff(page);const readback=await page.evaluate(async framework=>{const app=await import(framework==='plain'?'/fixture/editor.mjs':'/fixture/react-built.mjs');return app.editor.read().visible.flatMap(b=>b.runs||[]).map(r=>r.text).join('');},framework);assert.ok(readback.includes('Owner: Alex'));assert.ok(readback.includes('Confirm attendees'));const text=await surface.innerText();assert.ok(text.includes(' docs'));await page.getByRole('button',{name:'Save locally',exact:true}).click();
   const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery',exact:true}).click();const download=await downloaded;assert.equal(download.suggestedFilename(),'editac-recovery.json');
   if(framework==='plain') {await page.getByRole('button',{name:'Reopen offline'}).click();await page.waitForFunction(()=>document.querySelector('#message').textContent==='Task ready offline');assert.equal(await page.locator('[contenteditable="true"]').innerText(),text);assert.equal(await page.locator('strong').filter({hasText:'Owner: Alex'}).count(),1);}
   await page.reload();await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));assert.equal(await page.locator('[contenteditable="true"]').innerText(),text);assert.equal(await page.locator('strong').filter({hasText:'Owner: Alex'}).count(),1);
   await page.locator('[contenteditable="true"]').getByText('Owner: Alex docs',{exact:true}).click();await page.keyboard.press('End');
   const result=await page.evaluate(async framework=>{const app=await import(framework==='plain'?'/fixture/editor.mjs':'/fixture/react-built.mjs');
    const editor=app.editor;const outcome=editor.paste({getData:type=>type==='text/plain'?'**literal**':''},{literal:true});
    const literal=editor.read().visible.some(b=>b.runs?.some(r=>r.text.includes('**literal**')));await editor.flush({target:'local'});
    if(framework==='plain') {const report=await app.close();return {literal,outcome,unsaved:report.unsaved};}
    app.close();return {literal,outcome};
   },framework);assert.equal(result.literal,true,JSON.stringify(result));if(framework==='plain')assert.equal(result.unsaved,false);
   await page.waitForFunction(()=>!document.querySelector('[contenteditable="true"]'));await page.waitForFunction(()=>window.quickstartIDB.live===0);assert.equal(await page.getByRole('button',{name:'Bold owner',exact:true}).isDisabled(),true);
  });}finally{await server.close();}
 });
 for(const mode of ['static','ssr'])test(`${name}: shipped Astro ${mode} example preserves identity/content through navigation and exposes local save`,{timeout:60000},async()=>{
  const server=mode==='static'?await serve(join(astro,'dist-static'),false):await ssrServer();
  try {await browserCase(engine,`${name}-docs-astro-${mode}`,async page=>{
   await page.goto(server.url);await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   assert.equal(await page.locator('edit-ac-editor').count(),2);
   const surface=page.locator('edit-ac-editor[data-editor-name="task"] [contenteditable="true"]');await surface.getByText('Owner: Alex',{exact:true}).click();await page.keyboard.press('End');await page.keyboard.type(' docs');
   await page.getByRole('button',{name:'Save locally',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#save-status').textContent.includes('Saved locally'));
   await checkKickoff(page);await page.getByRole('button',{name:'Save locally',exact:true}).click();const text=await surface.innerText();const identity=await page.evaluate(()=>localStorage.getItem('editac-astro-identity-task'));
   const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export recovery'}).click();assert.equal((await download).suggestedFilename(),'editac-recovery.json');
   await page.getByText('Navigate away',{exact:true}).click();await page.waitForURL('**/away');await page.waitForFunction(()=>window.quickstartIDB.live===0);await page.getByRole('link').click();await page.waitForURL(server.url+'/');await page.waitForFunction(()=>document.querySelector('[contenteditable="true"]'));
   assert.equal(await surface.innerText(),text);assert.equal(await page.evaluate(()=>localStorage.getItem('editac-astro-identity-task')),identity);
   assert.equal(await page.locator('edit-ac-editor[data-editor-name="notes"] [contenteditable="true"]').count(),0);
  });}finally{await server.close();}
 });
}

async function recoveryDownload(download,name) {const path=join(output,name);await download.saveAs(path);return JSON.parse(await readFile(path,'utf8'));}


async function checkKickoff(page) {
 const surface=page.locator('[contenteditable="true"]').first();
 assert.equal(await surface.locator('h1').innerText(),'Project kickoff');
 assert.equal(await surface.locator('strong').filter({hasText:'Friday'}).count(),1);
 assert.match(await surface.locator('a[href="https://example.invalid/project-kickoff"]').innerText(),/^Reference(?: docs)?$/);
 assert.equal(await surface.locator('[data-check-marker][aria-label="Unchecked"]').count(),2);
 await page.getByRole('button',{name:'Bold owner',exact:true}).click();
 assert.equal(await surface.locator('strong').filter({hasText:'Owner: Alex'}).count(),1);
 const content=await surface.elementHandle();const before=await surface.innerText();
 await page.getByRole('button',{name:'Read-only',exact:true}).click();
 assert.equal(await page.locator('[contenteditable="true"]').count(),0);
 assert.equal(await page.getByRole('button',{name:'Bold owner',exact:true}).isDisabled(),true);
 assert.equal(await content.innerText(),before);
 await page.getByRole('button',{name:'Read-only',exact:true}).click();
 assert.equal(await page.locator('[contenteditable="true"]').count(),1);
}
