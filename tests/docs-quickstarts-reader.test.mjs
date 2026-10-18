import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
let temporary,output,server,controller,browser,base;
const directory=resolve('evidence/quickstarts-20261018/reader');
const observations=[],external=[],errors=[],facts={};
before(async()=>{
 mkdirSync(directory,{recursive:true});
 temporary=mkdtempSync(join(siteRoot,'.site-build-test-quickstarts-'));output=join(temporary,'site');
 server=createServer((req,res)=>{
  let file=resolve(output,'.'+decodeURIComponent(new URL(req.url,base).pathname));
  if(!file.startsWith(output+sep)&&file!==output){res.writeHead(403).end();return;}
  if(!extname(file))file=join(file,'index.html');
  try{const type={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.png':'image/png'}[extname(file)]||'text/plain';res.setHeader('content-type',type);res.end(readFileSync(file));}catch{res.writeHead(404).end();}
 });
 await new Promise((ok,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',ok);});
 base=`http://127.0.0.1:${server.address().port}/`;
 facts.server={pid:process.pid,launcher:'node --test tests/docs-quickstarts-reader.test.mjs',workspace:siteRoot,port:server.address().port,purpose:'quickstart rendered reader checks',log:join(directory,'receipt.json')};
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
for(const viewport of [{width:1440,height:1000},{width:390,height:844}])for(const integration of ['web','react','astro'])test(`${integration} quickstart is readable at ${viewport.width}px with complete checked source`,async()=>{
 const context=await browser.newContext({viewport});
 try{
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(external.push(route.request().url()),route.abort()));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+`docs/getting-started/${integration}/`);
  assert.equal(await page.locator('h1').first().innerText(),{web:'Web',react:'React',astro:'Astro'}[integration]);
  assert.ok((await page.locator('pre code').allTextContents()).some(s=>s.includes('import ')));
  assert.ok((await page.locator('body').innerText()).includes('unpublished'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  const link=page.getByRole('link',{name:'Complete source and reproduction instructions',exact:true});
  const download=await context.request.get(new URL(await link.getAttribute('href'),base).href);assert.equal(download.status(),200);assert.match(await download.text(),/Project kickoff quickstarts/);
  await page.screenshot({path:join(directory,`${integration}-${viewport.width}.png`),fullPage:true});
  observations.push({integration,viewport,sourceDownload:download.status()});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 }finally{await context.close();}
});
