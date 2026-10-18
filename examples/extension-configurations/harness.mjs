import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, join, extname, sep, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
export const docsRoot = fileURLToPath(new URL('../../',import.meta.url));
export const digest = bytes=>createHash('sha256').update(bytes).digest('hex');
export const manifest = JSON.parse(readFileSync(join(docsRoot,'examples/extension-configurations/admission.json')));
export async function openHarness() {
  const artifactRoot = '/';
  assert.ok(process.env.DOCS_PLAYWRIGHT_MODULE,'Explicit installed Playwright module required; no install/download');
  const playwrightModule=resolve(process.env.DOCS_PLAYWRIGHT_MODULE);
  const playwrightVersion=JSON.parse(readFileSync(join(dirname(playwrightModule),'package.json'))).version;
  assert.equal(playwrightVersion,'1.64.0','Pinned installed Playwright version required');
  const {chromium} = await import(pathToFileURL(playwrightModule));
  const temporary = mkdtempSync(join(docsRoot,'.site-build-test-catalog-'));
  let server,browser,context;
  const errors=[],external=[],observations=[];
  const metadata={playwright:playwrightVersion,packages:[],runtime:[],requestsBlocked:external,errors,observations,temporary};
  async function close() {
    try { for(const page of context?.pages()??[]) { try{await page.evaluate(()=>window.documentationFixture?.close());}catch(error){metadata.cleanupError=error.message;} } await context?.close(); } finally {
      try { await browser?.close(); } finally {
        if(server?.listening) await new Promise(ok=>server.close(ok));
        rmSync(temporary,{recursive:true,force:true});
        metadata.cleaned=true;
        if(process.env.DOCS_CATALOG_OUTPUT) { mkdirSync(process.env.DOCS_CATALOG_OUTPUT,{recursive:true});writeFileSync(join(process.env.DOCS_CATALOG_OUTPUT,'browser.json'),JSON.stringify(metadata,null,2)+'\n'); }
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
    if(process.env.DOCS_CATALOG_OUTPUT) {mkdirSync(process.env.DOCS_CATALOG_OUTPUT,{recursive:true});writeFileSync(join(process.env.DOCS_CATALOG_OUTPUT,'install.log'),installed);}
    for(const pin of manifest.runtime) {
      const bytes=readFileSync(join(temporary,'node_modules/@edit-ac/core',pin.member.replace('package/','')));
      assert.equal(digest(bytes),pin.sha256,'Installed runtime member drift');metadata.runtime.push(pin);
    }
    const recipeManifest=JSON.parse(readFileSync(join(docsRoot,'examples/extension-configurations/owner-recipes.json')));
    for(const recipe of recipeManifest.recipes) writeFileSync(join(temporary,recipe.output),readFileSync(join(docsRoot,'examples/extension-configurations',recipe.output)));
    const compilation=execFileSync(process.execPath,[join(docsRoot,'node_modules/typescript/bin/tsc'),'--strict','--skipLibCheck','--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext','--outDir',join(temporary,'compiled'),...recipeManifest.recipes.map(r=>join(temporary,r.output))],{encoding:'utf8'});
    metadata.compiledRecipes=recipeManifest.recipes.length;
    if(process.env.DOCS_CATALOG_OUTPUT)writeFileSync(join(process.env.DOCS_CATALOG_OUTPUT,'compile.log'),compilation);
    const invalidOptions = `import { Spelling, Markdown, Tables, createEditor } from '@edit-ac/web';
// @ts-expect-error Invalid spelling mode must be rejected.
Spelling.configure({mode:'automatic'});
// @ts-expect-error Invalid parser loading option must be rejected.
Markdown.configure({input:'lazy'});
// @ts-expect-error Unknown built-in options must be rejected.
Tables.configure({unexpected:true});
// @ts-expect-error Platform settings must use the public union.
createEditor(document.body,{platform:{spellcheck:'forced'}});
`;
    writeFileSync(join(temporary,'invalid-options.ts'),invalidOptions);
    const rejectionCompilation=execFileSync(process.execPath,[join(docsRoot,'node_modules/typescript/bin/tsc'),'--strict','--skipLibCheck','--noEmit','--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext',join(temporary,'invalid-options.ts')],{encoding:'utf8'});
    metadata.rejectedInvalidOptions=4;
    if(process.env.DOCS_CATALOG_OUTPUT)writeFileSync(join(process.env.DOCS_CATALOG_OUTPUT,'invalid-options.log'),rejectionCompilation);
    const imports={'@edit-ac/core':'/core/index.js','@edit-ac/core/links':'/core/links/index.js','@edit-ac/core/extensions':'/core/extensions/index.js','@edit-ac/web':'/web/index.js','@edit-ac/markdown/web':'/markdown/web.js'};
    server=createServer((request,response)=>{
      const pathname=new URL(request.url,'http://127.0.0.1').pathname;
      if(pathname==='/') {response.setHeader('content-type','text/html');response.end(`<!doctype html><html lang="en"><title>Project kickoff saving consumer</title><main><h1>Installed extension configuration consumer</h1></main><script type="importmap">${JSON.stringify({imports})}</script><script type="module" src="/session.mjs"></script></html>`);return;}
      let base,part;
      if(pathname==='/session.mjs'){base=join(docsRoot,'examples/extension-configurations/upstream/tests/extension-dx/documentation-consumer');part='session.mjs.txt';}
      else if(recipeManifest.recipes.some(r=>pathname==='/'+r.output.replace('.ts','.js'))){base=join(temporary,'compiled');part=pathname.slice(1);}
      else if(/^\/(core|web|markdown)\//.test(pathname)) { const [,name,rest]=pathname.match(/^\/(core|web|markdown)\/(.*)$/);base=join(temporary,`node_modules/@edit-ac/${name}/dist`);part=rest; }
      else {response.writeHead(404).end();return;}
      const path=resolve(base,part);if(!path.startsWith(base+sep)){response.writeHead(403).end();return;}
      try {response.setHeader('content-type',extname(path)==='.wasm'?'application/wasm':'text/javascript');response.end(readFileSync(path));}catch{response.writeHead(404).end();}
    });
    await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
    metadata.port=server.address().port;const url=`http://127.0.0.1:${metadata.port}/`;
    browser=await chromium.launch({headless:true});metadata.browser=browser.version();metadata.node=process.version;
    context=await browser.newContext();await context.route('**/*',route=>route.request().url().startsWith(url)?route.continue():(external.push(route.request().url()),route.abort()));
    const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(10000);
    await page.goto(url);await page.waitForFunction(()=>!!window.documentationFixture);
    return {page,close,metadata,observe:(id,result)=>observations.push({id,result})};
  }catch(error){await close();throw error;}
}
