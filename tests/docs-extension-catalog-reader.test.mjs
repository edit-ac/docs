import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,readFileSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
import {checkSiteAssets,artifactManifest} from '../scripts/check-site-assets.mjs';
import {digest,manifest} from '../examples/extension-configurations/harness.mjs';
let temporary,output,server,browser,context,page,base;
const errors=[],external=[],observations=[],artifacts=process.env.DOCS_CATALOG_READER_OUTPUT;
const owned=['docs/extensions/','docs/examples/extension-configurations/'];
before(async()=>{
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE);
  const {chromium}=await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE)));
  temporary=mkdtempSync(join(siteRoot,'.site-build-test-catalog-reader-'));output=join(temporary,'site');
  server=createServer((req,res)=>{
    const url=new URL(req.url,base);if(!url.pathname.startsWith('/catalog-docs/')){res.writeHead(404).end();return;}
    let path=resolve(output,url.pathname.slice('/catalog-docs/'.length));
    if(path!==output&&!path.startsWith(output+sep)){res.writeHead(403).end();return;}
    if(!extname(path))path=join(path,'index.html');
    try{res.setHeader('content-type',extname(path)==='.html'?'text/html':extname(path)==='.js'?'text/javascript':extname(path)==='.css'?'text/css':'text/plain');res.end(readFileSync(path));}catch{res.writeHead(404).end();}
  });
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
  base=`http://127.0.0.1:${server.address().port}/catalog-docs/`;buildSite({outputDir:output,baseUrl:base});
  browser=await chromium.launch({headless:true});context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():(external.push(route.request().url()),route.abort()));
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);
});
after(async()=>{
  const metadata={base,browser:browser?.version(),errors,external,observations};
  try {if(output){metadata.production=artifactManifest(output);metadata.assets=checkSiteAssets(output,base);}}
  catch(error){metadata.artifactError=error.message;}
  finally {try{await context?.close();}finally{try{await browser?.close();}finally{if(server?.listening)await new Promise(ok=>server.close(ok));if(temporary)rmSync(temporary,{recursive:true,force:true});metadata.cleaned=true;if(artifacts){mkdirSync(artifacts,{recursive:true});writeFileSync(join(artifacts,'reader.json'),JSON.stringify(metadata,null,2)+'\n');}}}}
});
const shot=async name=>{if(artifacts){mkdirSync(artifacts,{recursive:true});await page.screenshot({path:join(artifacts,name+'.png'),fullPage:true});}};
test('rendered catalog pages and complete source downloads have scoped valid subpath URLs',()=>{
  const checks=checkSiteAssets(output,base),errors=checks.errors.filter(e=>owned.some(p=>e.startsWith(p)));assert.deepEqual(errors,[]);
  const files=['admission.json','catalog.json','harness.mjs','owner-recipes.json','getting-started.ts','catalog.test.mjs'];
  for(const file of files){const path=join(output,'reference-inputs/extension-configurations-v1',file);assert.ok(readFileSync(path).length>50);}
  observations.push({id:'scoped-links',errors,unrelatedErrors:checks.errors.filter(e=>!owned.some(p=>e.startsWith(p))),files:Object.keys(artifactManifest(output)).length});
});
test('desktop catalog exposes individual composition, limits and the complete downloaded consumer',async()=>{
  await page.goto(base+'docs/extensions/');await page.getByRole('link',{name:'Compose features and inspect presets',exact:true}).last().click();
  const text=await page.locator('main').innerText();assert.match(text,/defaultPreset/);assert.match(text,/Task can select any qualified factory/);assert.match(text,/unpublished/);
  await page.locator('main a').filter({hasText:'complete checked example'}).click();assert.equal(await page.locator('h1').textContent(),'Installed extension configurations');
  const href=await page.locator('main a').filter({hasText:'Independent expected-outcome tests'}).getAttribute('href');assert.equal(href,base+'reference-inputs/extension-configurations-v1/catalog.test.mjs');
  const response=await page.request.get(href);assert.equal(response.status(),200);assert.equal(digest(await response.body()),digest(readFileSync(join(siteRoot,'tests/docs-extension-catalog.test.mjs'))));await shot('desktop');observations.push({id:'desktop',download:true});
});
test('mobile navigation and loading limits remain readable and keyboard operable',async()=>{
  await page.setViewportSize({width:390,height:844});await page.goto(base+'docs/extensions/loading/');
  const text=await page.locator('main').innerText();assert.match(text,/Code\/Pairs/);assert.match(text,/command-lazy/);assert.match(text,/three attempts/);assert.match(text,/source/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  const toggle=page.locator('[data-site-menu-toggle]');await toggle.focus();await toggle.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');await toggle.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');await shot('mobile');observations.push({id:'mobile',keyboard:true,overflow:false});
});
test('local reader requests no external service and raises no page exceptions',()=>{assert.deepEqual(errors,[]);assert.deepEqual(external,[]);});
