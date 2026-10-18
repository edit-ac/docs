import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,readFileSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
import {checkSiteAssets,artifactManifest} from '../scripts/check-site-assets.mjs';
import {digest} from '../scripts/prepare-custom-extensions.mjs';
let temporary,output,server,browser,context,page,base;
const errors=[],external=[],observations=[],artifacts=process.env.DOCS_CUSTOM_READER_OUTPUT;
const owned=['docs/extensions/custom/','docs/examples/custom-extensions/'];
before(async()=>{
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE);
  if(artifacts)mkdirSync(artifacts,{recursive:true});
  const {chromium}=await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE)));
  temporary=mkdtempSync(join(siteRoot,'.site-build-test-custom-reader-'));output=join(temporary,'site');
  server=createServer((req,res)=>{
    const url=new URL(req.url,base);if(!url.pathname.startsWith('/custom-docs/')){res.writeHead(404).end();return;}
    let path=resolve(output,url.pathname.slice('/custom-docs/'.length));
    if(path!==output&&!path.startsWith(output+sep)){res.writeHead(403).end();return;}
    if(!extname(path))path=join(path,'index.html');
    try{res.setHeader('content-type',extname(path)==='.html'?'text/html':extname(path)==='.js'?'text/javascript':extname(path)==='.css'?'text/css':'text/plain');res.end(readFileSync(path));}catch{res.writeHead(404).end();}
  });
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
  base=`http://127.0.0.1:${server.address().port}/custom-docs/`;buildSite({outputDir:output,baseUrl:base});
  browser=await chromium.launch({headless:true});context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(external.push(route.request().url()),route.abort()));
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
});
after(async()=>{
  const metadata={base,browser:browser?.version(),node:process.version,pid:process.pid,runtimeCases:0,staticReaderOnly:true,errors,external,observations};
  try {if(output){metadata.production=artifactManifest(output);metadata.assets=checkSiteAssets(output,base);}}
  catch(error){metadata.artifactError=error.message;}
  finally {try{await context?.close();}finally{try{await browser?.close();}finally{if(server?.listening)await new Promise(ok=>server.close(ok));if(temporary)rmSync(temporary,{recursive:true,force:true});metadata.cleaned=true;if(artifacts){mkdirSync(artifacts,{recursive:true});writeFileSync(join(artifacts,'reader.json'),JSON.stringify(metadata,null,2)+'\n');}}}}
});
test('homepage and custom tutorial expose conceptual status and a complete source study',async()=>{
 await page.goto(base);assert.ok((await page.locator('main').innerText()).length>100);
 await page.goto(base+'docs/extensions/custom/');const text=await page.locator('main').innerText();assert.match(text,/zero runtime cases/);assert.match(text,/structural callout remains pending/);assert.match(text,/128-unit highlight/);
 await page.getByRole('link',{name:'complete source study',exact:true}).click();assert.equal(await page.locator('h1').textContent(),'Custom-authoring source study');
 const href=await page.getByRole('link',{name:'independent reader transcript',exact:true}).getAttribute('href');assert.equal(href,base+'reference-inputs/custom-authoring-v1/transcript.json');const response=await page.request.get(href);assert.equal(response.status(),200);assert.equal(digest(await response.body()),digest(readFileSync(join(siteRoot,'examples/custom-extensions/transcript.json'))));
 if(artifacts)await page.screenshot({path:join(artifacts,'desktop.png'),fullPage:true});observations.push({id:'desktop',download:true,runtimeCases:0});
});
test('search discovers the source tutorial without changing its qualification status',async()=>{
 await page.goto(base+'docs/extensions/custom/');await page.locator('[data-search-input]').fill('callout');await page.locator('[data-search-list] a').first().waitFor();
 const links=await page.locator('[data-search-list] a').evaluateAll(items=>items.map(a=>({href:a.href,text:a.textContent})));
 assert.ok(links.some(x=>x.href===base+'docs/extensions/custom/'));observations.push({id:'search',links});
});
test('mobile source tutorial fits viewport and supports keyboard menu open and dismissal',async()=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base+'docs/extensions/custom/');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 const toggle=page.locator('[data-site-menu-toggle]');await toggle.focus();await toggle.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');await toggle.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
 if(artifacts)await page.screenshot({path:join(artifacts,'mobile.png'),fullPage:true});observations.push({id:'mobile',keyboard:true,overflow:false});
});
test('reader stays local with no page exceptions and no broken owned subpath links',()=>{
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(checkSiteAssets(output,base).errors.filter(e=>owned.some(p=>e.startsWith(p))),[]);
});
