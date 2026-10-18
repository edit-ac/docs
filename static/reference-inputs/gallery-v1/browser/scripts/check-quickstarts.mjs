import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
export function assertQuickstartProof(suite,counts,proof) {
 const suffixes={'web-react':['plain-save-failure','react-save-failure','plain-load-failure','react-load-failure','plain','react','plain-asset-failure','react-asset-failure'],astro:['astro-save-failure','astro-load-failure','astro-static','astro-ssr','astro-asset-failure']}[suite];
 assert.ok(suffixes,'Unknown quickstart suite');
 assert.equal(counts.tests,suffixes.length+3,'Empty or incomplete suite');
 assert.ok(counts.pass===counts.tests&&counts.fail===0&&counts.skipped===0&&counts.cancelled===0&&counts.todo===0,'Failed, skipped or incomplete suite');
 assert.deepEqual(proof.cases.map(c=>c.name).sort(),suffixes.map(n=>'chromium-docs-'+n).sort(),'Missing actual required runtime cases');
 assert.ok(proof.cases.every(c=>c.passed),'Failed runtime case');
 assert.ok(proof.teardown.length>0&&proof.teardown.every(p=>p.closed||p.exited),'Incomplete teardown');
 assert.ok(proof.commands.length>0&&proof.commands.every(c=>c.exit===0&&!c.error),'Failed setup/build/SSR command');
}
export function runQuickstarts(suite) {
  assert.ok(['web-react','astro'].includes(suite),'Unknown or empty quickstart suite');
  assert.equal(process.version,'v24.19.0','Use the configured Node 24.19.0 toolchain');
  const output=resolve(process.env.DOCS_QUICKSTART_OUTPUT || `evidence/quickstarts-20261018/${suite}`);
  assert.ok(!existsSync(join(output,'tests.log')),'Use fresh output; preserve prior failed evidence');
  mkdirSync(output,{recursive:true});
  const result=spawnSync(process.execPath,['--test','--test-reporter=tap','examples/quickstarts/harness.test.mjs'],{
    env:{...process.env,DOCS_QUICKSTART_SUITE:suite,DOCS_QUICKSTART_OUTPUT:output},encoding:'utf8',timeout:360000,maxBuffer:8*1024*1024});
  const log=(result.stdout||'')+'\n'+(result.stderr||'');writeFileSync(join(output,'tests.log'),log);
  const counts=Object.fromEntries(['tests','pass','fail','skipped','cancelled','todo'].map(key=>[key,Number(log.match(new RegExp(`# ${key} (\\d+)`))?.[1]??0)]));
  const summary={suite,exit:result.status,error:result.error?.message,counts};
  writeFileSync(join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');
  console.log(JSON.stringify({...summary,log:join(output,'tests.log')}));
  assert.equal(result.status,0,'Quickstart consumer failed; see retained tests.log');
  const proof=JSON.parse(readFileSync(join(output,'harness.json')));
  assertQuickstartProof(suite,counts,proof);
  return summary;
}
