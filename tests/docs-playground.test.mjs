import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const load=path=>JSON.parse(readFileSync(path));
const q=load('playground/qualification.json');
test('complete qualification binds all ten actual browser scenarios to authenticated local packages',()=>{
 assert.equal(q.parent,'DWF-1.9');assert.equal(q.published,false);assert.equal(q.releaseQualified,false);
 assert.deepEqual(q.distinctCounts,{tests:11,pass:11,fail:0,skipped:0,cancelled:0});
 assert.deepEqual(q.cases.map(c=>c.name).sort(),['task-edit-history-reload','document-edit-history-reload','readonly','preset-isolation','reset-export','load-retry','save-recovery','missing-checkpoint','mobile-keyboard-dispose','disposed-recovery'].sort());
 for(const c of q.cases){const proof=load('evidence/playground-local-20261018/'+c.evidence);assert.ok(proof.cases.some(r=>r.name===c.name&&r.passed));assert.ok(proof.teardown.length>0&&proof.teardown.every(r=>r.closed));}
 for(const [name,digest] of Object.entries(q.profile.sources))assert.equal(sha(readFileSync('playground/'+name)),digest);
 for(const pin of q.profile.packages)assert.equal(sha(readFileSync('../architecture/evidence/local-consumer-return/20261018/'+pin.path)),pin.sha256);
});
test('targeted repair changes exactly the stale recovery-message statement, retaining valid earlier rows',()=>{
 const app=readFileSync('playground/app.mjs','utf8'),r=q.proofReconciliation;
 assert.equal(sha(app),r.currentSha256);assert.equal(sha(app.replace("await open();$('error').textContent='';for(const report","await open();for(const report")),r.priorSha256);
 const repair=load('evidence/playground-local-20261018/'+r.repair);assert.equal(repair.partial,true);assert.equal(repair.exit,0);assert.equal(repair.counts.tests,1);assert.equal(repair.counts.pass,1);assert.equal(repair.counts.fail,0);
 assert.equal(q.cases.filter(c=>c.evidence===r.repair.replace('summary.json','browser.json')).length,1);
});
test('download manifest authenticates complete source and qualification independently of generated assets',()=>{
 const m=load('playground/manifest.json');for(const [path,digest] of Object.entries(m.files)){assert.equal(sha(readFileSync(path)),digest);assert.equal(sha(readFileSync('static/reference-inputs/playground-v1/'+path.split('/').pop())),digest);}
 assert.equal(readFileSync('playground/kickoff.mjs','utf8'),readFileSync('examples/quickstarts/examples/task-editor/kickoff.mjs','utf8'));
});
for(const args of [[],['--suite','invented']])test('empty/unknown playground suite rejects '+JSON.stringify(args),()=>{
 const result=spawnSync(process.execPath,['scripts/check-playground.mjs',...args],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/unknown and empty suites fail closed/);
});
