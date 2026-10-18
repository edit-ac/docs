import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSite, siteRoot } from '../scripts/site-build.mjs';
import { checkSiteAssets, artifactManifest } from '../scripts/check-site-assets.mjs';
import { loadHostManifest, digest } from '../scripts/prepare-host-services.mjs';
for (const [name,url] of [['root','https://edit.ac/'],['subpath','https://docs.invalid/local-host/']]) test(`host-source downloads and prepared labels render at ${name}`, t => {
  const work=mkdtempSync(resolve(siteRoot,`.host-services-${name}-`));
  const output=resolve(work,'site');
  t.after(()=>rmSync(work,{recursive:true,force:true}));
  buildSite({outputDir:output,baseUrl:url});
  const checks=checkSiteAssets(output,url);
  const owned=['docs/examples/host-services/','docs/guides/agents/','docs/guides/cloud-hosting/','docs/guides/host-operations/'];
  const scopedErrors=checks.errors.filter(e=>owned.some(p=>e.startsWith(p)));
  // Existing conceptual/API downloads elsewhere use root URLs. Preserve that
  // evidence without broadening this parent into unrelated URL migration.
  assert.deepEqual(scopedErrors,[]);
  const unrelatedErrors=checks.errors.filter(e=>!owned.some(p=>e.startsWith(p)));
  const html=readFileSync(resolve(output,'docs/examples/host-services/index.html'),'utf8');
  assert.match(html,/source prerequisite; no runnable service/);
  assert.match(html,/descriptive oracles/);assert.ok(!html.includes('{{ static('));
  const m=loadHostManifest();for (const row of m.records) {
    const path=`reference-inputs/host-services-v1/${row.file}`;
    assert.equal(digest(readFileSync(resolve(output,path))),row.sha256);
    assert.ok(html.includes(url+path),path);
  }
  const manifest=artifactManifest(output);
  if (process.env.EDITAC_HOST_DOCS_EVIDENCE) writeFileSync(resolve(process.env.EDITAC_HOST_DOCS_EVIDENCE,`production-${name}.json`),JSON.stringify({url,ownedPages:owned,scopedErrors,unrelatedErrors,checks,manifest},null,2));
  t.diagnostic(JSON.stringify({base:name,files:Object.keys(manifest).length,html:checks.html,references:checks.references,scopedErrors,unrelatedErrors:unrelatedErrors.length}));
});
