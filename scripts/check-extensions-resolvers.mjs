import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
export const requiredCases=['inert-open','public-preview','disabled-paste','local-paste','internal-denial','custom-reference','upload-cancel-recovery','upload-deny','upload-readOnly','upload-edit','stale-preview','upload-limit','reference-history'];
export function assertExtensionsProof(counts,proof){
 assert.equal(counts.tests,requiredCases.length);assert.equal(counts.pass,requiredCases.length);
 for(const k of ['fail','skipped','cancelled','todo'])assert.equal(counts[k],0,k);
 assert.deepEqual(proof.cases.map(c=>c.name).sort(),[...requiredCases].sort());assert.ok(proof.cases.every(c=>c.passed&&c.cleanup?.listeners===0&&c.cleanup.service.disposed));
 assert.ok(proof.commands.length>=3&&proof.commands.every(c=>c.exit===0&&!c.error));assert.equal(proof.teardown.serverClosed,true);assert.equal(proof.teardown.browserClosed,true);
}
export function runExtensionsResolvers(){
 const output=resolve(process.env.DOCS_EXTENSIONS_OUTPUT||'evidence/extensions-resolvers-20261018/run');assert.ok(!existsSync(join(output,'tests.log')),'Fresh output required; retain failures');mkdirSync(output,{recursive:true});
 const r=spawnSync(process.execPath,['--test','--test-reporter=tap','examples/extensions/harness.test.mjs'],{encoding:'utf8',env:{...process.env,DOCS_EXTENSIONS_OUTPUT:output},timeout:240000,maxBuffer:4*1024*1024});
 const log=(r.stdout??'')+(r.stderr??'');writeFileSync(join(output,'tests.log'),log);const counts=Object.fromEntries(['tests','pass','fail','skipped','cancelled','todo'].map(k=>[k,Number(log.match(new RegExp(`# ${k} (\\d+)`))?.[1]??0)]));
 const summary={command:'npm run check:examples -- --suite extensions-resolvers',exit:r.status,error:r.error?.message,counts};writeFileSync(join(output,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary));assert.equal(r.status,0,'See retained extensions-resolvers tests.log');assertExtensionsProof(counts,JSON.parse(readFileSync(join(output,'harness.json'))));return summary;
}
