// Exact immutable owning fixture and installed public production tarballs.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,rmSync,cpSync} from 'node:fs';
import {resolve,join,extname,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
export const hash=b=>createHash('sha256').update(b).digest('hex');
export async function openCalloutHarness(output){
 assert.equal(process.version,'v24.19.0');
 const profile=JSON.parse(readFileSync('examples/troubleshooting/profile.json'));
 assert.equal(hash(readFileSync(profile.manifest)),profile.manifestSha256);
 for(const [p,pin] of Object.entries(profile.files)){assert.equal(hash(readFileSync(p)),pin.sha256,p);assert.equal(hash(execFileSync('git',['-C','../core','show',profile.sourceCommit+':'+pin.source])),pin.sha256,p);}
 const temp=mkdtempSync(resolve('.site-build-test-troubleshooting-')),metadata={temporary:temp,packages:[],cases:[],external:[],cleanup:{}};
 let server,browser;
 async function close(){try{await browser?.close();metadata.cleanup.browserClosed=true;}finally{if(server?.listening)await new Promise(r=>server.close(r));metadata.cleanup.serverClosed=true;rmSync(temp,{recursive:true,force:true});metadata.cleanup.consumerRemoved=true;writeFileSync(join(output,'callout-browser.json'),JSON.stringify(metadata,null,2)+'\n');}}
 try{
  for(const p of profile.packages){const archive=resolve('../architecture/evidence/local-consumer-return/20261018',p.path);assert.equal(hash(readFileSync(archive)),p.sha256);const dir=join(temp,'node_modules',p.name);mkdirSync(dir,{recursive:true});execFileSync('tar',['-xzf',archive,'--strip-components=1','-C',dir]);metadata.packages.push(p);}
  mkdirSync(join(temp,'fixture'));for(const name of ['session.mjs','recipe.mjs'])cpSync('examples/troubleshooting/upstream/'+name,join(temp,'fixture',name));
  const {build}=await import(pathToFileURL(resolve('../core/node_modules/esbuild/lib/main.js')));
  const publicDir=join(temp,'public');mkdirSync(publicDir);
  const graph=await build({entryPoints:[join(temp,'fixture/session.mjs')],outfile:join(publicDir,'session.js'),bundle:true,format:'esm',platform:'browser',metafile:true,logLevel:'silent'});
  assert(!Object.keys(graph.metafile.inputs).some(p=>p.includes('core/packages/')));writeFileSync(join(output,'callout-graph.json'),JSON.stringify(graph.metafile,null,2)+'\n');
  mkdirSync(join(publicDir,'wasm'));for(const name of ['core','markdown']){const from=join(temp,'node_modules/@edit-ac',name,'dist/wasm');cpSync(from,join(publicDir,'wasm'),{recursive:true});cpSync(join(from,name==='core'?'editac_wasm_bg.wasm':'editac_markdown_wasm_bg.wasm'),join(publicDir,name==='core'?'engine.wasm':'markdown.wasm'));}
  server=createServer((req,res)=>{try{const p=new URL(req.url,'http://local').pathname;if(p==='/'){res.setHeader('content-type','text/html');res.end('<!doctype html><title>Troubleshooting fixture</title><script type="module" src="/session.js"></script>');return;}const file=resolve(publicDir,'.'+p);assert(file.startsWith(publicDir+sep));res.setHeader('content-type',extname(file)==='.wasm'?'application/wasm':'text/javascript');res.end(readFileSync(file));}catch{res.writeHead(404).end();}});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));metadata.port=server.address().port;const origin='http://127.0.0.1:'+metadata.port;
  const module=resolve(process.env.DOCS_PLAYWRIGHT_MODULE);assert.equal(JSON.parse(readFileSync(resolve(module,'../package.json'))).version,'1.64.0');const {chromium}=await import(pathToFileURL(module));browser=await chromium.launch({headless:true});metadata.browser=browser.version();
  async function inspect(name,fn){const context=await browser.newContext();let page,passed=false;try{await context.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():(metadata.external.push(r.request().url()),r.abort()));page=await context.newPage();page.setDefaultTimeout(12000);await page.goto(origin);await page.waitForFunction(()=>!!window.callout);await fn(page);passed=true;}finally{try{if(page)await page.evaluate(()=>window.callout?.close());}finally{await context.close();metadata.cases.push({name,passed,contextClosed:true});}}}
  return {inspect,close,metadata,temporary:temp};
 }catch(e){await close();throw e;}
}
