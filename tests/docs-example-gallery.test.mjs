import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
let temporary,output,server,controller,browser,base;
const directory=resolve(process.env.DOCS_GALLERY_OUTPUT||'evidence/example-gallery-20261018/reader');
const observations=[],external=[],errors=[],facts={};
before(async()=>{
 mkdirSync(directory,{recursive:true});
 temporary=mkdtempSync(join(siteRoot,'.site-build-test-gallery-'));output=join(temporary,'site');
 server=createServer((req,res)=>{
  let file=resolve(output,'.'+decodeURIComponent(new URL(req.url,base).pathname));
  if(!file.startsWith(output+sep)&&file!==output){res.writeHead(403).end();return;}
  if(!extname(file))file=join(file,'index.html');
  try{const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.png':'image/png'}[extname(file)]||'text/plain';res.setHeader('content-type',type);res.end(readFileSync(file));}catch{res.writeHead(404).end();}
 });
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});
 base=`http://127.0.0.1:${server.address().port}/`;
 facts.server={pid:process.pid,launcher:'node --test tests/docs-example-gallery.test.mjs',workspace:siteRoot,port:server.address().port,purpose:'gallery rendered reader checks',log:join(directory,'receipt.json')};
 buildSite({outputDir:output,baseUrl:base});
 const {chromium}=await import(pathToFileURL(resolve('../core/node_modules/playwright/index.mjs')));
 controller=await chromium.launchServer({headless:true});facts.browserPid=controller.process().pid;
 browser=await chromium.connect(controller.wsEndpoint());facts.browserVersion=browser.version();
});
after(async()=>{
 try{await browser?.close();}finally{
  try{await controller?.close();}finally{
   if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
   facts.cleaned={browserExited:!controller||controller.process().exitCode!==null,listenerClosed:!server?.listening,temporaryRemoved:!!temporary};
   if(temporary)rmSync(temporary,{recursive:true,force:true});
   writeFileSync(join(directory,'receipt.json'),JSON.stringify({...facts,observations,external,errors},null,2)+'\n');
  }
 }
});

async function inspect(viewport,body){const context=await browser.newContext({viewport});try{await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(external.push(route.request().url()),route.abort()));const page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));await body(page,context);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);}finally{await context.close();}}
const load=p=>JSON.parse(readFileSync(resolve(p)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=load('examples/gallery/manifest.json');
test('gallery derives byte-identical sources, manifests and deterministic complete downloads',()=>{
 execFileSync('python3',['scripts/prepare-gallery.py','--check']);
 assert.equal(manifest.parent,'DWF-1.36');assert.equal(manifest.entries.length,6);
 for(const e of manifest.entries.filter(e=>e.status==='local-runtime')){
  assert.equal(e.candidate,'sdk-framework-v1');assert.equal(e.sourceCommit,'aa5b7d21064bd6d694ba243ffe528f58288b8a92');assert.equal(e.profile,'v5');assert.equal(e.version,'0.0.0');assert.equal(e.published,false);
  for(const [path,digest] of [[e.manifest,e.manifestSha256],[e.qualification,e.qualificationSha256],[e.fixture,e.fixtureSha256]])assert.equal(hash(readFileSync(resolve(path))),digest,path);
  const snippet=readFileSync(resolve(e.snippet.file),'utf8').split(/\r?\n/).slice(e.snippet.start-1,e.snippet.end).join('\n')+'\n';assert.equal(snippet,e.snippet.text);assert.equal(hash(snippet),e.snippet.sha256);
  assert.equal(hash(readFileSync(resolve('static'+e.download))),e.downloadSha256);
  const base='static'+e.download.replace('/source.zip','/');for(const [path,digest] of Object.entries(e.files))assert.equal(hash(readFileSync(resolve(base+path))),digest,path);
 }
});
test('structured report remains explicitly unavailable with zero executable claims',()=>{const e=manifest.entries.find(e=>e.id==='structured-report');assert.equal(e.status,'unavailable');assert.equal(e.profile,null);assert.equal(e.candidate,null);assert.equal(e.download,undefined);assert.match(e.outcome,/Runtime cases: 0/);assert.deepEqual(e.features,['code','table','assets']);});
test('source outcomes retain owning SDK calls and independent qualification counts',()=>{
 const quick=load('examples/quickstarts/qualification.json');for(const [name,count] of [['web-react',11],['astro',8]]){assert.equal(quick.suites[name].summary.counts.tests,count);assert.equal(quick.suites[name].summary.counts.pass,count);assert.equal(quick.suites[name].summary.counts.skipped,0);}
 const local=load('playground/qualification.json');assert.equal(local.distinctCounts.tests,11);assert.equal(local.distinctCounts.pass,11);
 const collab=load('playground/scenarios/collaboration/qualification.json');assert.equal(collab.counts.tests,11);assert.equal(collab.counts.pass,11);
 const source=readFileSync('examples/quickstarts/examples/task-editor/controls.mjs','utf8');assert.match(source,/markAt/);assert.match(source,/setReadOnly/);
 assert.match(readFileSync('playground/app.mjs','utf8'),/recoveryExport|downloadRecovery/);
});
test('ZIP members exactly match the independently hashed source inventory',()=>{for(const e of manifest.entries.filter(e=>e.download)){const result=JSON.parse(execFileSync('python3',['-c','import json,zipfile,hashlib,sys; z=zipfile.ZipFile(sys.argv[1]); print(json.dumps({p:hashlib.sha256(z.read(p)).hexdigest() for p in z.namelist()}))','static'+e.download],{encoding:'utf8'}));assert.deepEqual(result,e.files);}});
for(const width of [1440,390])test(`gallery filters, downloads and copy at ${width}px`,()=>inspect({width,height:844},async(page,context)=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto(base+'docs/examples/gallery/');assert.equal(await page.locator('h1').innerText(),'Examples gallery');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.equal(await page.locator('[data-gallery-card]:visible').count(),6);
 for(const [key,value,id] of [['task','ticket','ticket'],['platform','react','react'],['feature','table','structured-report'],['status','unavailable','structured-report']]){
  await page.getByRole('button',{name:'Clear filters'}).click();await page.locator(`select[name="${key}"]`).selectOption(value);assert.equal(await page.locator('[data-gallery-card]:visible').count(),1);assert.equal(await page.locator('[data-gallery-card]:visible h2').getAttribute('id'),id);
 }
 await page.locator('select[name="task"]').selectOption('basic');assert.equal(await page.locator('[data-gallery-card]:visible').count(),0);assert.equal(await page.locator('[data-gallery-count]').innerText(),'0 examples');
 await page.getByRole('button',{name:'Clear filters'}).click();await page.waitForFunction(()=>[...document.querySelectorAll('[data-gallery-card]')].every(e=>!e.hidden));await page.getByRole('button',{name:'Copy Browser basic editor snippet'}).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-copy-status]').textContent.startsWith('Snippet copied'));assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),manifest.entries[0].snippet.text);
 for(const e of manifest.entries.filter(e=>e.download)){const response=await context.request.get(new URL(e.download,base).href);assert.equal(response.status(),200);assert.equal(hash(await response.body()),e.downloadSha256);for(const path of [e.manifest,e.qualification,e.snippet.file,e.fixture])assert.equal((await context.request.get(new URL(e.download.replace('/source.zip','/')+path,base).href)).status(),200);}
 await page.screenshot({path:join(directory,`gallery-${width}.png`),fullPage:true});observations.push({name:'gallery-'+width,passed:true});
}));
test('keyboard task filter and search reach the gallery',()=>inspect({width:1440,height:1000},async page=>{
 await page.goto(base+'docs/examples/gallery/');const select=page.locator('select[name="task"]');await select.focus();await page.keyboard.press('b');await page.keyboard.press('Tab');await page.waitForFunction(()=>document.querySelector('[data-gallery-count]').textContent==='2 examples');assert.equal(await page.locator('[data-gallery-card]:visible').count(),2);
 await page.goto(base+'docs/');const input=page.locator('[data-search-input]');await input.fill('Examples gallery');await page.locator('.site-search-result').filter({hasText:'Examples gallery'}).first().waitFor({state:'visible'});await input.press('ArrowDown');await input.press('Enter');await page.waitForURL(base+'docs/examples/gallery/');observations.push({name:'keyboard-filter-search',passed:true});
}));
test('mobile navigation reaches gallery and retains escape focus behavior',()=>inspect({width:390,height:844},async page=>{await page.goto(base+'docs/');const toggle=page.locator('[data-site-menu-toggle]');await toggle.focus();await toggle.press('Enter');await page.locator('[data-site-menu]').getByRole('link',{name:'Examples',exact:true}).click();await page.waitForURL(base+'docs/examples/');await page.locator('main').getByRole('link',{name:'examples gallery',exact:true}).click();await page.waitForURL(base+'docs/examples/gallery/');await page.locator('[data-site-menu-toggle]').focus();await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-site-menu]').getAttribute('aria-hidden'),'true');observations.push({name:'mobile-menu-gallery',passed:true});}));
test('homepage and guide reader remain reachable',()=>inspect({width:1440,height:1000},async page=>{await page.goto(base);await page.getByRole('link',{name:'Explore the docs',exact:true}).click();await page.waitForURL(base+'docs/');await page.goto(base+'docs/examples/gallery/');await page.getByRole('link',{name:'Complete guide and outcome: Ticket description',exact:true}).click();await page.waitForURL(base+'docs/examples/playground/');observations.push({name:'homepage-guide',passed:true});}));
