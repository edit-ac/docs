import {readFileSync} from 'node:fs';
import {assertQuickstartProof} from '../scripts/check-quickstarts.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectSuite} from '../scripts/check-examples.mjs';
import {quickstartOutputs} from '../scripts/prepare-quickstarts.mjs';
test('quickstart dispatcher rejects unknown, absent and empty suites',()=>{
 for(const args of [[],['--suite'],['--suite',''],['--suite','unknown'],['--suite','astro','extra']])assert.throws(()=>selectSuite(args));
 for(const suite of ['web-react','astro','formats-native','host-services'])assert.equal(selectSuite(['--suite',suite]),suite);
});
test('complete pinned sources, snippets and downloadable assets stay in sync',()=>{
 const outputs=quickstartOutputs();assert.ok(outputs.size>15);
});

const proof=JSON.parse(readFileSync(new URL('../examples/quickstarts/qualification.json',import.meta.url)));
for(const [suite,entry] of Object.entries(proof.suites)) {
 test(`${suite} required case matrix admits the real completed proof`,()=>{
  const runtime={...entry,commands:entry.commands};assertQuickstartProof(suite,entry.summary.counts,runtime);
 });
 for(const fault of ['empty','skipped','missing-case','failed-case','missing-teardown','failed-build'])test(`${suite} rejects ${fault} qualification`,()=>{
  const runtime=structuredClone(entry),counts={...entry.summary.counts};
  if(fault==='empty')counts.tests=0;
  if(fault==='skipped')counts.skipped=1;
  if(fault==='missing-case')runtime.cases.pop();
  if(fault==='failed-case')runtime.cases[0].passed=false;
  if(fault==='missing-teardown')runtime.teardown=[];
  if(fault==='failed-build')runtime.commands[0].exit=1;
  assert.throws(()=>assertQuickstartProof(suite,counts,runtime));
 });
}
