import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
let temporary,output,server,controller,browser,base;
const directory=resolve(process.env.DOCS_COLLAB_READER_OUTPUT||'evidence/playground-collaboration-20261018/reader');
const observations=[],external=[],errors=[],facts={};
before(async()=>{
 mkdirSync(directory,{recursive:true});
 temporary=mkdtempSync(join(siteRoot,'.site-build-test-collaboration-'));output=join(temporary,'site');
 server=createServer((req,res)=>{
  let file=resolve(output,'.'+decodeURIComponent(new URL(req.url,base).pathname));
  if(!file.startsWith(output+sep)&&file!==output){res.writeHead(403).end();return;}
  if(!extname(file))file=join(file,'index.html');
  try{const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.png':'image/png'}[extname(file)]||'text/plain';res.setHeader('content-type',type);res.end(readFileSync(file));}catch{res.writeHead(404).end();}
 });
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});
 base=`http://127.0.0.1:${server.address().port}/`;
 facts.server={pid:process.pid,launcher:'node --test tests/docs-collaboration-reader.test.mjs',workspace:siteRoot,port:server.address().port,purpose:'collaboration rendered reader checks',log:join(directory,'receipt.json')};
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
test('homepage reaches the local documentation reader',()=>inspect({width:1440,height:1000},async page=>{await page.goto(base);await page.getByRole('link',{name:'Explore the docs',exact:true}).click();await page.waitForURL(base+'docs/');assert.equal(await page.locator('h1').innerText(),'Build with edit.ac');observations.push({name:'homepage',passed:true});}));
for(const width of [1440,390])test(`collaboration guide and complete downloads at ${width}px`,()=>inspect({width,height:844},async(page,context)=>{
 await page.goto(base+'docs/examples/collaboration/');assert.equal(await page.locator('h1').first().innerText(),'Two local collaborative views');assert.match(await page.locator('main').innerText(),/unpublished/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 const manifest=JSON.parse(readFileSync(resolve('playground/scenarios/collaboration/manifest.json')));for(const [file,digest] of Object.entries(manifest.files)){const url=new URL('reference-inputs/collaboration-v1/'+file.split('/').pop(),base).href;const response=await context.request.get(url);assert.equal(response.status(),200);const bytes=await response.body();assert.equal((await import('node:crypto')).createHash('sha256').update(bytes).digest('hex'),digest);}
 await page.screenshot({path:join(directory,`guide-${width}.png`),fullPage:true});observations.push({name:'guide-'+width,passed:true,downloads:Object.keys(manifest.files).length});
}));
test('keyboard search discovers the collaboration guide',()=>inspect({width:1440,height:1000},async page=>{await page.goto(base+'docs/');const input=page.locator('[data-search-input]');await input.fill('Two local collaborative views');const result=page.locator('.site-search-result').filter({hasText:'Two local collaborative views'}).first();await result.waitFor({state:'visible'});await input.press('ArrowDown');assert.ok(await input.getAttribute('aria-activedescendant'));await input.press('Enter');await page.waitForURL(base+'docs/examples/collaboration/');observations.push({name:'search-keyboard',passed:true});}));
test('mobile menu and example index reach collaboration',()=>inspect({width:390,height:844},async page=>{await page.goto(base+'docs/');const toggle=page.locator('[data-site-menu-toggle]');await toggle.focus();await toggle.press('Enter');const menu=page.locator('[data-site-menu]');await menu.waitFor({state:'visible'});await menu.locator(`a[href="${base}docs/examples/"]`).click();await page.waitForURL(base+'docs/examples/');await page.locator('.docs-overview-card').filter({hasText:'Two local collaborative views'}).click();await page.waitForURL(base+'docs/examples/collaboration/');await page.locator('[data-site-menu-toggle]').focus();await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-site-menu]').getAttribute('aria-hidden'),'true');observations.push({name:'mobile-menu',passed:true});}));
