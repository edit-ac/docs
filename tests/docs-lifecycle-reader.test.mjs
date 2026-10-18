import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,readFileSync,rmSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,resolve,sep,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSite,siteRoot} from '../scripts/site-build.mjs';
import {checkSiteAssets,artifactManifest} from '../scripts/check-site-assets.mjs';
import {digest,manifest} from '../examples/lifecycle/harness.mjs';
let temporary,output,server,browser,context,page,base;
const errors=[],external=[],observations=[],artifacts=process.env.DOCS_LIFECYCLE_READER_OUTPUT;
const owned=['docs/reference/lifecycle/','docs/reference/events/','docs/examples/lifecycle/'];
before(async()=>{
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE);
  const {chromium}=await import(pathToFileURL(resolve(process.env.DOCS_PLAYWRIGHT_MODULE)));
  temporary=mkdtempSync(join(siteRoot,'.site-build-test-lifecycle-reader-'));output=join(temporary,'site');
  server=createServer((req,res)=>{
    const url=new URL(req.url,base);if(!url.pathname.startsWith('/lifecycle-docs/')){res.writeHead(404).end();return;}
    let path=resolve(output,url.pathname.slice('/lifecycle-docs/'.length));
    if(path!==output&&!path.startsWith(output+sep)){res.writeHead(403).end();return;}
    if(!extname(path))path=join(path,'index.html');
    try{res.setHeader('content-type',extname(path)==='.html'?'text/html':extname(path)==='.js'?'text/javascript':extname(path)==='.css'?'text/css':'text/plain');res.end(readFileSync(path));}catch{res.writeHead(404).end();}
  });
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
  base=`http://127.0.0.1:${server.address().port}/lifecycle-docs/`;buildSite({outputDir:output,baseUrl:base});
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
test('rendered lifecycle and event pages have scoped valid subpath links and immutable downloads',()=>{
  const checks=checkSiteAssets(output,base),scoped=checks.errors.filter(e=>owned.some(p=>e.startsWith(p)));
  assert.deepEqual(scoped,[]);
  for(const [file,hash] of Object.entries(manifest.files))assert.equal(digest(readFileSync(join(output,'reference-inputs/lifecycle-v1',file))),hash);
  const html=readFileSync(join(output,'docs/reference/lifecycle/index.html'),'utf8');assert.ok(!html.includes('{{ static('));
  assert.ok(html.includes(base+'reference-inputs/lifecycle-v1/consumer.mjs')||html.includes(base+'reference-inputs/lifecycle-v1/README.md'));
  observations.push({id:'rendered-assets',scopedErrors:scoped,unrelatedErrors:checks.errors.filter(e=>!owned.some(p=>e.startsWith(p))),files:Object.keys(artifactManifest(output)).length});
});
test('desktop walkthrough renders checked snippets, ready/save distinctions and the complete example',async()=>{
  await page.goto(base+'docs/reference/');await page.getByRole('link',{name:'Open, save and close',exact:true}).click();
  const text=await page.locator('main').innerText();assert.match(text,/unpublished 0.0.0/);assert.match(text,/same editor generation and revision/);assert.match(text,/not configured/);
  assert.equal(await page.locator('main pre').count(),3);assert.match(await page.locator('main pre').nth(1).innerText(),/owner.flush\(\{target:'local'\}\)/);
  await page.locator('main a').filter({hasText:'complete saving example'}).click();assert.equal(await page.locator('h1').textContent(),'Project kickoff saving consumer');
  const href=await page.locator('main a').filter({hasText:'Browser consumer, seed/open'}).getAttribute('href');assert.equal(href,base+'reference-inputs/lifecycle-v1/consumer.mjs');
  const response=await page.request.get(href);assert.equal(response.status(),200);assert.equal(digest(await response.body()),manifest.files['consumer.mjs']);
  await shot('desktop');observations.push({id:'desktop',sourceHash:manifest.files['consumer.mjs']});
});
test('events and recovery remain readable at mobile width with keyboard navigation',async()=>{
  await page.setViewportSize({width:390,height:844});await page.goto(base+'docs/reference/events/');
  const text=await page.locator('main').innerText();assert.match(text,/does not replay current state/);assert.match(text,/same teardown promise/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  const toggle=page.locator('[data-site-menu-toggle]');await toggle.focus();await toggle.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');await toggle.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.locator('main a').filter({hasText:'failure and cancellation cases'}).click();assert.match(page.url(),/lifecycle\/#failure-cancellation-and-recovery$/);
  assert.match(await page.locator('main').innerText(),/original database is never cleared/);await shot('mobile');observations.push({id:'mobile',width:390,keyboard:true,overflow:false});
});
test('gallery and React entry discover the saving source without asserting new SSR or remote qualification',async()=>{
  await page.goto(base+'docs/examples/');await page.locator('main a').filter({hasText:/^Project kickoff saving consumer$/}).last().click();assert.match(page.url(),/examples\/lifecycle\/$/);
  await page.goto(base+'docs/getting-started/react/');await page.locator('main a').filter({hasText:'lifecycle effect cleanup and SSR boundaries'}).click();
  assert.match(page.url(),/lifecycle\/#react-effects-and-ssr-boundaries$/);assert.match(await page.locator('main').innerText(),/not a new React artifact qualification/);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);observations.push({id:'entry-links',react:'source explanation only',remote:'not configured'});
});
