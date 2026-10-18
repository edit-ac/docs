// Serve exact owning consumer source and installed production tarball bytes.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function openSharedHarness(output){
 assert.equal(process.version,'v24.19.0');
 const pin=JSON.parse(readFileSync('examples/recipes/shared-profile.json'));
 const receipt=JSON.parse(readFileSync('examples/recipes/upstream/shared-receipt.json'));
 for(const [path,digest] of Object.entries(pin.files))assert.equal(hash(readFileSync(path)),digest,path);
 const root=resolve(pin.receiptRoot),tmp=mkdtempSync(resolve('.site-build-test-recipes-'));
 const metadata={commands:[],packages:[],requests:[],cases:[],external:[],cleanup:{},temporary:tmp};
 let server,browser;
 async function close(){try{await browser?.close();metadata.cleanup.browserClosed=true;}finally{if(server?.listening)await new Promise(r=>server.close(r));metadata.cleanup.serverClosed=true;rmSync(tmp,{recursive:true,force:true});metadata.cleanup.consumerRemoved=true;mkdirSync(output,{recursive:true});writeFileSync(join(output,'shared-browser.json'),JSON.stringify(metadata,null,2)+'\n');}}
 try{
  // Extract authenticated tarballs rather than rebuild or alias mutable dist.
  for(const name of ['core','web','markdown']){
   const pack=receipt.packages.find(p=>p.name==='@edit-ac/'+name),path=join(root,pack.file);assert.equal(hash(readFileSync(path)),pack.sha256);
   const dir=join(tmp,name);mkdirSync(dir);execFileSync('tar',['-xzf',path,'-C',dir]);metadata.packages.push(pack);
  }
  const sitePrefix='production/chromium/site/';
  for(const [path,digest] of Object.entries(receipt.artifacts))if(path.startsWith(sitePrefix)){
   const bytes=readFileSync(join(root,path));assert.equal(hash(bytes),digest,path);const to=join(tmp,'site',path.slice(sitePrefix.length));mkdirSync(resolve(to,'..'),{recursive:true});writeFileSync(to,bytes);
  }
  const imports={'@edit-ac/core':'/core/index.js','@edit-ac/core/extensions':'/core/extensions/index.js','@edit-ac/web':'/web/index.js','@edit-ac/markdown':'/markdown/index.js'};
  server=createServer((req,res)=>{try{
   const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);metadata.requests.push(pathname);
   let file;
   if(pathname==='/') {res.setHeader('content-type','text/html');res.end('<!doctype html><title>Shared recipe consumer</title><script type="importmap">'+JSON.stringify({imports})+'</script><main id="editors"></main><script type="module" src="/fixture/session.mjs"></script>');return;}
   if(pathname==='/fixture/session.mjs')file=resolve('examples/recipes/upstream/session.mjs');
   else if(/^\/(core|web|markdown)\//.test(pathname)){const [,name,part]=pathname.match(/^\/(core|web|markdown)\/(.*)$/);file=resolve(tmp,name,'package/dist',part);assert(file.startsWith(join(tmp,name,'package/dist')+sep));}
   else if(pathname.startsWith('/fixture/')){let part=pathname.slice('/fixture/'.length);if(part.endsWith('/'))part+='index.html';file=resolve(tmp,'site',part);assert(file.startsWith(join(tmp,'site')+sep));}
   else {res.writeHead(404).end();return;}
   res.setHeader('content-type',({'.wasm':'application/wasm','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.html':'text/html'})[extname(file)]||'application/octet-stream');res.setHeader('cache-control','public, max-age=31536000, immutable');res.end(readFileSync(file));
  }catch(error){res.writeHead(404).end(String(error.message));}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));metadata.port=server.address().port;
  const origin='http://127.0.0.1:'+metadata.port;
  const module=resolve(process.env.DOCS_PLAYWRIGHT_MODULE||'../core/node_modules/playwright/index.mjs');assert.equal(JSON.parse(readFileSync(resolve(module,'../package.json'))).version,'1.64.0');
  const {chromium}=await import(pathToFileURL(module));browser=await chromium.launch({headless:true});metadata.browser=browser.version();
  async function inspect(name,fn,site=false){const context=await browser.newContext();let page,passed=false;try{
   await context.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():(metadata.external.push(r.request().url()),r.abort()));page=await context.newPage();page.setDefaultTimeout(12000);
   await page.goto(origin+(site?'/fixture/task/':'/'));await page.waitForFunction(site?()=>!!window.site:()=>!!window.shared);await fn(page,origin);passed=true;
  }finally{try{if(page&&!page.isClosed())await page.evaluate(async()=>{await window.shared?.cleanup();await window.site?.cleanup();});}finally{await context.close();metadata.cases.push({name,passed,contextClosed:true});}}}
  return {inspect,metadata,close,receipt};
 }catch(error){await close();throw error;}
}
