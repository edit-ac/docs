import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { root, loadHostManifest, validateHostManifest, hostOutputs, digest } from '../scripts/prepare-host-services.mjs';
import { selectSuite, requireHostServicesConsumer } from '../scripts/check-examples.mjs';
import { checkDocs } from '../scripts/check-docs.mjs';
const m = loadHostManifest();
const read = name => readFileSync(resolve(root,name),'utf8');
const local = name => read(`examples/host-services/${name}`);
const receipt = JSON.parse(local(m.agent.receiptFile));
const transcript = JSON.parse(local('transcripts.json'));
const scenarios = Object.fromEntries(transcript.scenarios.map(s => [s.id,s.steps]));
const cloud = Object.fromEntries(scenarios['two-client-save-reconnect'].map(s => [s.id,s]));
const agent = Object.fromEntries(scenarios['fixed-host-mcp-proposal'].map(s => [s.id,s]));
const pages = ['cloud-hosting','agents','host-operations'].map(x => `content/docs/guides/${x}.md`).concat('content/docs/examples/host-services.md');

test('18 download inputs authenticate as exact owning Git blobs, not mutable checkout aliases', () => {
  for (const r of m.records) {
    const original = execFileSync('git',['-C',resolve(root,'..',r.repository),'show',`${r.commit}:${r.path}`]);
    assert.equal(digest(original),r.sha256,r.path);
    assert.deepEqual(original,readFileSync(resolve(root,'examples/host-services',r.file)));
  }
});
test('all 43 retained source pins and four canonical logs authenticate the original owner evidence', () => {
  assert.equal(Object.keys(receipt.sourceHashes).length,43);
  for (const [path,hash] of Object.entries(receipt.sourceHashes)) assert.equal(digest(execFileSync('git',['-C',resolve(root,'../core'),'show',`${m.agent.coreCommit}:${path}`])),hash,path);
  const origin = resolve(root,'../architecture/evidence/agent-integration/agt-1.7-20261017');
  for (const c of receipt.checks) {
    const bytes = readFileSync(resolve(origin,c.log));assert.equal(digest(bytes),receipt.artifactHashes[c.log],c.log);
    const text = bytes.toString();
    // The owner records Node TAP totals, including the browser transport runner.
    const counts = key => [...text.matchAll(new RegExp(`^(?:#|ℹ) ${key} (\\d+)$`,'gm'))].map(x=>Number(x[1]));
    assert.equal(counts('pass').reduce((a,b)=>a+b,0),c.passed,c.log);
    assert.ok(counts('fail').length > 0);assert.ok(counts('skipped').length > 0);
    assert.ok(counts('fail').every(x=>x===0));assert.ok(counts('skipped').every(x=>x===0));
  }
});
test('retained runtime counts stay historical, overlapping and local-durable only', () => {
  assert.deepEqual(m.agent.checks.map(c => [c.executed,c.passed,c.failed,c.skipped]),[[10,10,0,0],[27,27,0,0],[71,71,0,0],[29,29,0,0]]);
  assert.match(receipt.qualification.transport,/Session\/SQLite and WASM/);
  assert.match(receipt.qualification.remote,/pending/);
  assert.equal(receipt.sideEffects.providerCalls,0);
  assert.equal(m.runtimeQualified,false);assert.equal(m.testedSdkVersion,null);
  assert.match(read(pages[3]),/overlap and must not be summed/);
});
test('source tampering, altered receipt counts, zero cases and label-only service promotion reject', () => {
  for (const mutate of [x=>x.records[0].sha256='0'.repeat(64),x=>x.records[1].file=x.records[0].file,
    x=>x.agent.checks[0].passed=0,x=>x.agent.checks[0].skipped=1,x=>x.agent.checks[0].failed=1,
    x=>x.runtimeQualified=true,x=>x.testedSdkVersion='future',x=>x.service.status='qualified',x=>x.records[0].file='../escape']) {
    const changed=structuredClone(m);mutate(changed);assert.throws(()=>validateHostManifest(changed));
  }
});
test('generated source page and exactly 20 downloads equal the frozen inputs', () => {
  for (const [path,bytes] of Object.entries(hostOutputs(m))) assert.deepEqual(readFileSync(resolve(root,path)),bytes,path);
  assert.equal(readdirSync(resolve(root,'static/reference-inputs/host-services-v1'),{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).length,20);
});
test('prepared transcript has 15 unique steps with explicit non-runtime/non-API scope', () => {
  assert.equal(transcript.maturity,'prepared-conceptual');assert.equal(transcript.runtimeQualified,false);
  assert.match(transcript.fieldNames,/not an SDK or wire schema/);
  assert.equal(Object.keys(cloud).length,7);assert.equal(Object.keys(agent).length,8);
  const ids=transcript.scenarios.flatMap(s=>s.steps.map(x=>x.id));assert.equal(new Set(ids).size,15);
});
test('two-client oracles distinguish local content, socket send, unknown response and remote receipt', () => {
  assert.deepEqual(cloud.C01.expect,{aText:'Deadline Monday',bText:'Deadline Friday',localCommitted:true,remoteCommitted:false});
  assert.equal(cloud.C02.expect.remoteCommitted,false);assert.equal(cloud.C02.expect.receipt,null);
  assert.equal(cloud.C03.expect.clientOutcome,'unknown');assert.equal(cloud.C03.expect.retryIdentity,'same operation and digest');
  assert.equal(cloud.C04.expect.remoteCommitted,true);assert.equal(cloud.C04.expect.receipt,'service-receipt-1');
  assert.equal(cloud.C04.expect.assetAvailable,false);assert.equal(cloud.C04.expect.durability,'declared backend class only');
  assert.equal(cloud.C05.expect.aText,'Deadline Monday');assert.equal(cloud.C05.expect.bText,'Deadline Monday');assert.equal(cloud.C05.expect.duplicateEffects,0);
});
test('revoked reconnect preserves local backup and isolated restore preserves acknowledged content', () => {
  assert.deepEqual(cloud.C06.expect,{writeDenied:true,localBackupRetained:true,newRemoteEffects:0});
  assert.deepEqual(cloud.C07.expect,{sourceStoreOverwritten:false,hashesAndCoverageVerified:true,acknowledgedText:'Deadline Monday',assetBytesRequireSeparateVerification:true});
});
test('fixed MCP proposal has independent source, candidate, acceptance, replay and stale-target outcomes', () => {
  assert.equal(agent.M01.expect.source,'base\n\nother\n');assert.equal(agent.M02.input.candidateMarkdown,'uploaded 😀\n\nother\n');
  assert.equal(agent.M02.expect.sourceUnchanged,true);assert.equal(agent.M02.expect.sourceAndSemanticDiff,true);
  assert.deepEqual(agent.M03.expect,{paragraphs:['uploaded 😀','other'],localDurability:'durable',remoteDurability:'pending',effects:1});
  assert.deepEqual(agent.M04.expect,{originalReceiptReturned:true,newEffects:0});
  assert.deepEqual(agent.M05.expect,{outcome:'conflict',newEffects:0,newerHumanContentPreserved:true});
  assert.deepEqual(agent.M06.expect,{automaticReplacement:false,requiresReview:true,newRequestId:true});
});
test('post-commit failure freezes shared mutation/sync until same-request ordered recovery', () => {
  assert.deepEqual(agent.M07.expect,{outcome:'pending-or-unknown',mutationAdmissionFrozen:true,outboundSyncFrozen:true,readAndRecoveryExportAvailable:true});
  assert.deepEqual(agent.M08.expect,{sameRequestIdentity:true,duplicateEffects:0,remoteDurability:'pending'});
  const source=local('source/core/tests/agent-integration.test.mjs');
  for (const id of ['AGT-APP-01','AGT-APP-04','AGT-APP-05','AGT-APP-06','AGT-APP-08']) assert.ok(source.includes(id));
  const adapter=local('source/core/examples/host-mcp/register.mjs');
  assert.match(adapter,/hostAgent.call\(operation/);assert.match(adapter,/capabilities\(context/);
});
test('operational checklist and discoverable pages cover the original host acceptance boundaries', () => {
  const nav=JSON.parse(read('navigation.json')).pages;
  for (const path of pages) {
    assert.ok(nav.includes(path),path);const p=read(path);
    for (const heading of ['Before you start','Tested version','Example and expected outcome','Failure and recovery','Migration and compatibility']) assert.ok(p.includes(heading),`${path}: ${heading}`);
  }
  const operations=read(pages[2]);for (const term of ['Authentication and tenancy','Commit and replay','Assets','Reconnect','Backup and restore','Migration','Resource failure','Readiness and shutdown','Topology and trust']) assert.ok(operations.includes(term),term);
  assert.deepEqual(checkDocs(root).errors,[]);
  const entry=JSON.parse(read('examples/manifest.json')).examples.find(e=>e.id==='host-services/1');assert.equal(entry.runtimeQualified,false);assert.equal(entry.parent,'DWF-1.8');
});
test('canonical host-services rejects absent service and unintegrated runner without promoting prepared tests', () => {
  assert.equal(selectSuite(['--suite','host-services']),'host-services');
  assert.throws(()=>requireHostServicesConsumer(m),/real durable reference host/);
  const changed=structuredClone(m);changed.service.status='present';changed.service.consumerReceipt='pinned';
  assert.throws(()=>requireHostServicesConsumer(changed),/actual service runner and independent/);
  for (const args of [[],['--suite',''],['--suite','unknown'],['--suite','host-services','extra']]) assert.throws(()=>selectSuite(args));
});
