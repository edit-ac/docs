import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, join, extname, sep, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
export const docsRoot = fileURLToPath(new URL('../../',import.meta.url));
export const digest = bytes=>createHash('sha256').update(bytes).digest('hex');
export const manifest = JSON.parse(readFileSync(join(docsRoot,'examples/commands/manifest.json')));
export async function openHarness() {
  const artifactRoot = resolve(process.env.DOCS_COMMANDS_ARCHITECTURE || join(docsRoot,'../architecture'));
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE,'Explicit installed Playwright module required; no install/download');
  const playwrightModule=resolve(process.env.DOCS_PLAYWRIGHT_MODULE);
  const playwrightVersion=JSON.parse(readFileSync(join(dirname(playwrightModule),'package.json'))).version;
  assert.equal(playwrightVersion,'1.64.0','Pinned installed Playwright version required');
  const {chromium} = await import(pathToFileURL(playwrightModule));
  const temporary = mkdtempSync(join(docsRoot,'.site-build-test-commands-'));
  let server,browser,context;
  const errors=[],external=[],observations=[];
  const metadata={playwright:playwrightVersion,packages:[],runtime:[],requestsBlocked:external,errors,observations,temporary};
  async function close() {
    try { await context?.close(); } finally {
      try { await browser?.close(); } finally {
        if(server?.listening) await new Promise(ok=>server.close(ok));
        rmSync(temporary,{recursive:true,force:true});
        metadata.cleaned=true;
        if(process.env.DOCS_COMMANDS_OUTPUT) { mkdirSync(process.env.DOCS_COMMANDS_OUTPUT,{recursive:true});writeFileSync(join(process.env.DOCS_COMMANDS_OUTPUT,'browser.json'),JSON.stringify(metadata,null,2)+'\n'); }
      }
    }
  }
  try {
    const packs=[];
    for(const pin of manifest.packages) {
      const path=resolve(artifactRoot,pin.path);const bytes=readFileSync(path);assert.equal(digest(bytes),pin.sha256,'Pack drift');
      metadata.packages.push({...pin,bytes:bytes.length});packs.push(path);
    }
    writeFileSync(join(temporary,'package.json'),'{"private":true,"type":"module"}');
    const installed=execFileSync('npm',['install','--prefix',temporary,'--offline','--ignore-scripts','--no-audit','--no-fund',...packs],{encoding:'utf8',timeout:60000});
    if(process.env.DOCS_COMMANDS_OUTPUT) {mkdirSync(process.env.DOCS_COMMANDS_OUTPUT,{recursive:true});writeFileSync(join(process.env.DOCS_COMMANDS_OUTPUT,'install.log'),installed);}
    for(const pin of manifest.runtime) {
      const pack=resolve(artifactRoot,pin.path);assert.equal(digest(readFileSync(pack)),pin.packSha256,'Runtime pack drift');
      const bytes=execFileSync('tar',['-xOf',pack,pin.member],{maxBuffer:16*1024*1024});assert.equal(digest(bytes),pin.sha256,'Runtime member drift');
      writeFileSync(join(temporary,'node_modules/@edit-ac/core',pin.member.replace('package/','')),bytes);metadata.runtime.push(pin);
    }
    const imports={'@edit-ac/core':'/core/index.js','@edit-ac/core/links':'/core/links/index.js','@edit-ac/core/extensions':'/core/extensions/index.js','@edit-ac/web':'/web/index.js'};
    server=createServer((request,response)=>{
      const pathname=new URL(request.url,'http://127.0.0.1').pathname;
      if(pathname==='/') {response.setHeader('content-type','text/html');response.end(`<!doctype html><html lang="en"><title>Project kickoff command consumer</title><div id="editor"></div><script type="importmap">${JSON.stringify({imports})}</script><script type="module" src="/consumer.mjs"></script></html>`);return;}
      let base,part;
      if(pathname==='/consumer.mjs'){base=join(docsRoot,'examples/commands');part='consumer.mjs';}
      else if(/^\/(core|web)\//.test(pathname)) { const [,name,rest]=pathname.match(/^\/(core|web)\/(.*)$/);base=join(temporary,`node_modules/@edit-ac/${name}/dist`);part=rest; }
      else {response.writeHead(404).end();return;}
      const path=resolve(base,part);if(!path.startsWith(base+sep)){response.writeHead(403).end();return;}
      try {response.setHeader('content-type',extname(path)==='.wasm'?'application/wasm':'text/javascript');response.end(readFileSync(path));}catch{response.writeHead(404).end();}
    });
    await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
    metadata.port=server.address().port;const url=`http://127.0.0.1:${metadata.port}/`;
    browser=await chromium.launch({headless:true});metadata.browser=browser.version();metadata.node=process.version;
    context=await browser.newContext();await context.route('**/*',route=>route.request().url().startsWith(url)?route.continue():(external.push(route.request().url()),route.abort()));
    const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(10000);
    await page.goto(url);await page.waitForFunction(()=>!!window.commandsExample);
    return {page,close,metadata,observe:(id,result)=>observations.push({id,result})};
  }catch(error){await close();throw error;}
}
