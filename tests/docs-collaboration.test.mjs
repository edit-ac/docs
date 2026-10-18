import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const sha=b=>createHash('sha256').update(b).digest('hex'),load=p=>JSON.parse(readFileSync(p));
test('canonical collaboration proof binds nine actual browser cases to exact candidate and sources',()=>{
 const q=load('playground/scenarios/collaboration/qualification.json'),m=load('playground/scenarios/collaboration/manifest.json');
 assert.equal(q.parent,'DWF-1.11');assert.equal(q.published,false);assert.equal(q.remoteDurability,'not-configured');assert.equal(q.releaseQualified,false);
 assert.deepEqual(q.counts,{tests:11,pass:11,fail:0,skipped:0,cancelled:0,todo:0});assert.equal(q.cases.length,9);
 const evidence=load(q.browserEvidence);assert.equal(evidence.cases.length,9);assert.ok(evidence.cases.every(c=>c.passed&&c.externalRequests===0&&c.liveConnectionsAfterClose===0));assert.ok(evidence.teardown.length>=10&&evidence.teardown.every(c=>c.closed));
 for(const [path,digest] of Object.entries(m.files))assert.equal(sha(readFileSync(path)),digest);
 assert.deepEqual(q.profile.scenario,m);for(const p of q.profile.packages)assert.equal(sha(readFileSync('../architecture/evidence/local-consumer-return/20261018/'+p.path)),p.sha256);
});
test('complete source download mirrors and fixture preserve checked bytes',()=>{
 const m=load('playground/scenarios/collaboration/manifest.json');for(const [path,digest] of Object.entries(m.files)){assert.equal(sha(readFileSync(path)),digest);assert.equal(sha(readFileSync('static/reference-inputs/collaboration-v1/'+path.split('/').pop())),digest);}
 assert.equal(readFileSync('static/reference-inputs/collaboration-v1/manifest.json','utf8'),readFileSync('playground/scenarios/collaboration/manifest.json','utf8'));
 assert.equal(m.sourceCommit,'aa5b7d21064bd6d694ba243ffe528f58288b8a92');assert.equal(m.fixture,'project-kickoff/1');
});
for(const [args,env] of [[[],{}],[['--suite','invented'],{}],[['--suite','collaboration'],{DOCS_PLAYGROUND_CASE:'invented'}]])test('dispatcher rejects incomplete selection '+JSON.stringify(args)+' '+JSON.stringify(env),()=>{
 const r=spawnSync(process.execPath,['scripts/check-playground.mjs',...args],{env:{...process.env,...env},encoding:'utf8'});assert.notEqual(r.status,0);assert.match(r.stderr,/unknown and empty suites fail closed|complete canonical suite/);
});
