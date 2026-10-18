import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,rmSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {customOutputs,prepareCustom,digest} from '../scripts/prepare-custom-extensions.mjs';
import {checkSiteAssets,artifactManifest} from '../scripts/check-site-assets.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=join(root,'examples/custom-extensions');
const json=p=>JSON.parse(readFileSync(join(base,p)));
const m=json('manifest.json'),t=json('transcript.json'),c=id=>t.cases.find(c=>c.id===id);
const page=readFileSync(join(root,'content/docs/extensions/custom.md'),'utf8');
const example=readFileSync(join(root,'content/docs/examples/custom-extensions.md'),'utf8');
test('source/download inventory authenticates both frozen historical blobs and all nine owner recipe ranges',()=>{
 assert.equal(customOutputs().size,5);assert.equal(prepareCustom(true),5);
 assert.equal(m.pins.length,2);assert.equal(m.recipeRefs.length,9);
 for(const pin of m.pins){assert.match(pin.commit,/^[a-f0-9]{40}$/);assert.equal(digest(readFileSync(join(base,pin.file))),pin.sha256);}
});
test('conceptual scope cannot be silently promoted into candidate or runtime qualification',()=>{
 assert.equal(m.runtimeQualified,false);assert.equal(m.runtimeCases,0);assert.equal(m.testedSdkVersion,null);assert.deepEqual(m.eqlCandidateIdentities,[]);
 assert.equal(t.runtimeQualified,false);assert.match(t.notation,/not an engine document schema/);
 const entry=JSON.parse(readFileSync(join(root,'examples/manifest.json'))).examples.find(x=>x.id==='custom-authoring/1');
 assert.equal(entry.runtimeQualified,false);assert.equal(entry.testedSdkVersion,null);assert.equal(entry.profile,null);
 assert.match(page,/zero runtime cases/);assert.match(example,/runtime cases: 0/);
 assert.match(page,/EQL-1\.9/);assert.match(page,/not recorded runtime observations/);
});
test('independent complete reader cases retain the shared Project kickoff corpus',()=>{
 assert.deepEqual(t.fixture,{title:'Project kickoff',owner:'Alex',due:'Friday',checklist:['Draft brief','Review plan'],safeLink:'https://example.test/kickoff'});
 assert.deepEqual(t.cases.map(c=>c.id),['callout','highlight','command','validation','preservation','task-found','task-missing','task-stale','spelling','parsing','unsafe-url','dispose']);
 for(const x of t.cases){assert.ok(x.before);assert.ok(x.action);assert.ok(x.expected);}
});
test('callout design distinguishes pending structure from admitted note presentation',()=>{
 assert.deepEqual(c('callout').expected.body,['Owner: Alex','Due Friday']);assert.equal(c('callout').expected.structuralCallout,'pending');
 assert.match(c('callout').expected.fallback,/heading\/bold/);assert.match(page,/Rust\/schema\/ABI owner/);
 const source=readFileSync(join(base,'upstream/tutorial.mjs.txt'),'utf8');assert.match(source,/type: 'heading', level: 2/);assert.match(source,/does not invent a command/);
});
test('Friday highlight matches versioned mark limits without treating an atom as a mark',()=>{
 const e=c('highlight').expected;assert.equal(e.text.slice(...e.rangeUtf16),'Friday');assert.equal(e.type,'demo.highlight');assert.equal(e.kind,'mark');assert.equal(e.version,1);assert.equal(e.runtime,'pending');
 const definitions=JSON.parse(readFileSync(join(base,'upstream/definitions.json.txt')));
 assert.equal(definitions.find(d=>d.type===e.type).kind,'mark');assert.equal(definitions.find(d=>d.type==='demo.badge').kind,'inline-atom');
 assert.equal(definitions[0].attributes.label.maxUtf16,128);assert.match(page,/64 UTF-16/);assert.match(page,/128-unit highlight/);
});
test('one local emphasis intent preserves Friday text through undo and redo expectations',()=>{
 assert.deepEqual(c('command').expected,{text:'Due Friday',bold:true,undo:{text:'Due Friday',bold:false},redo:{text:'Due Friday',bold:true},historyIntents:1});
 assert.match(page,/native button labeled/);assert.match(page,/return focus/);assert.match(page,/Keyboard and screen-reader behavior must be verified/);
});
test('validation and unknown-version recovery retain original payload rather than a lossy backup',()=>{
 assert.equal(c('validation').expected.text,c('validation').before);assert.equal(c('validation').expected.historyIntents,0);
 assert.deepEqual(c('preservation').expected.preserved,{type:'future.team-callout',version:9,payload:{title:'Project kickoff',unknown:{severity:'review'}},fallback:'Project kickoff'});
 assert.deepEqual(c('preservation').before,c('preservation').expected.preserved);assert.match(c('preservation').expected.plainMarkdown,/lossy/);
 assert.match(page,/module-markdown-unrepresentable/);assert.match(page,/original recovery checkpoint/);
});
test('found, missing and stale task expectations preserve literal data and forbid late overwrite',()=>{
 assert.deepEqual(c('task-found').expected,{text:'ASD-123 ',href:'https://tasks.example.test/ASD-123',historyIntents:1});
 assert.deepEqual(c('task-missing').expected,{text:'ASD-999 ',href:null,historyIntents:0});
 assert.deepEqual(c('task-stale').expected,{text:'ASD-124 ',href:null,lateResultApplied:false});
 assert.match(page,/no.*automatic lookup on reopen\/remote updates/i);assert.match(page,/principal-scoped/);
});
test('spelling explicitly separates platform inheritance, custom activation and autocorrection',()=>{
 assert.deepEqual(c('spelling').expected,{text:'the',undoText:'teh',historyIntents:1,bundledDictionary:false,osObservation:false});
 for(const pattern of [/inherited user settings/,/unknown.*capability/,/Autocorrection is a separate/,/custom mode deliberately/,/overlap: 'allow'/,/not a bundled production dictionary/,/not install a duplicate checker/])assert.match(page,pattern);
});
test('parsing, unsafe URL and teardown expectations preserve text and invalidate late work',()=>{
 assert.equal(c('parsing').expected.text,'Project kickoff');assert.match(c('parsing').expected.malformed,/Preserve literal/);
 assert.deepEqual(c('unsafe-url').expected,{text:'Project kickoff',historyIntents:0,result:'reject unsafe scheme'});
 assert.deepEqual(c('dispose').expected,{pendingLookup:false,menuListener:false,lateResultApplied:false,disposal:'idempotent; exact runtime resource counts pending'});
 assert.match(page,/context.cleanup/);assert.match(page,/context.manage/);assert.match(page,/host owns removal/i);
});
test('reader navigation, all nine recipe downloads and all page links name real sources',()=>{
 const nav=JSON.parse(readFileSync(join(root,'navigation.json'))).pages;
 for(const p of ['content/docs/extensions/custom.md','content/docs/examples/custom-extensions.md'])assert.ok(nav.includes(p));
 for(const ref of m.recipeRefs)assert.ok(page.includes(ref.download.slice(1)),ref.id);
 for(const text of [page,example]){
  for(const [,path]of text.matchAll(/get_url\(path="([^"]+)"\)/g))assert.ok(existsSync(join(root,'static',path)),path);
  for(const [,path]of text.matchAll(/\]\(@\/([^#)]+)/g))assert.ok(existsSync(join(root,'content',path)),path);
 }
 assert.match(example,/runtime count|runtime cases: 0/);assert.match(page,/Tiptap runtime\/plugin compatibility/);
});
for(const [id,url]of [['root','https://docs.example.test/'],['subpath','https://docs.example.test/custom-docs/']])test(`rendered ${id} custom pages retain status labels, exact downloads and valid scoped URLs`,()=>{
 const temp=mkdtempSync(join(root,'.site-build-test-custom-'));
 const output=join(temp,'site'),evidence=process.env.DOCS_CUSTOM_OUTPUT;
 try{
  const log=execFileSync('zola',['build','--base-url',url,'--output-dir',output],{cwd:root,encoding:'utf8',timeout:120000});
  if(evidence){mkdirSync(evidence,{recursive:true});writeFileSync(join(evidence,`render-${id}.log`),log);}
  const checks=checkSiteAssets(output,url),owned=['docs/extensions/custom/','docs/examples/custom-extensions/'];
  assert.deepEqual(checks.errors.filter(e=>owned.some(p=>e.startsWith(p))),[]);
  for(const p of owned){const html=readFileSync(join(output,p,'index.html'),'utf8');assert.match(html,/conceptual source prerequisite/i);assert.match(html,/pending/);assert.match(html,/Project kickoff/);assert.ok(html.includes(new URL('reference-inputs/custom-authoring-v1/manifest.json',url).href));}
  for(const [name,bytes]of customOutputs())assert.equal(digest(readFileSync(join(output,'reference-inputs/custom-authoring-v1',name))),digest(bytes));
  if(evidence)writeFileSync(join(evidence,`render-${id}.json`),JSON.stringify({baseUrl:url,files:Object.keys(artifactManifest(output)).length,htmlFiles:Object.keys(artifactManifest(output)).filter(x=>x.endsWith('.html')).length,ownedErrors:[],unrelatedErrors:checks.errors.filter(e=>!owned.some(p=>e.startsWith(p))),artifacts:artifactManifest(output),runtimeCases:0,staticOnly:true},null,2)+'\n');
 }finally{rmSync(temp,{recursive:true,force:true});}
});
