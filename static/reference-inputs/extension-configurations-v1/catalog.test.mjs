import {test,before,after,beforeEach,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {openHarness,docsRoot,digest,manifest} from '../examples/extension-configurations/harness.mjs';
import {catalogOutputs} from '../scripts/prepare-extension-catalog.mjs';
let harness,page;
before(async()=>{harness=await openHarness();page=harness.page;});
after(async()=>{await harness?.close();});
beforeEach(async()=>{await page.reload();await page.waitForFunction(()=>!!window.documentationFixture);});
afterEach(async()=>{await page.evaluate(()=>window.documentationFixture.close());});
const record=(id,result)=>{harness.observe(id,result);return result;};
const run=async(fn,arg)=>page.evaluate(fn,arg);
test('all immutable recipes, source blobs, receipts and generated reader downloads remain authenticated',()=>{
 assert.ok(catalogOutputs().size>40);assert.equal(manifest.published,false);
 for(const p of manifest.pins)assert.equal(digest(readFileSync(join(docsRoot,'examples/extension-configurations',p.file))),p.sha256);
 for(const r of manifest.receipts)assert.equal(digest(readFileSync(join(docsRoot,'examples/extension-configurations',r.file))),r.sha256);
 assert.equal(harness.metadata.compiledRecipes,9);assert.equal(harness.metadata.rejectedInvalidOptions,4);
});
test('installed descriptors agree with catalog IDs, options, profile versions and fixture limits',async()=>{
 const result=await run(async()=>{const {FIRST_PARTY_FEATURES}=await import('@edit-ac/core/extensions');const f=window.documentationFixture;return {features:FIRST_PARTY_FEATURES.map(x=>({id:x.id,version:x.version,schemas:x.schemas,requires:x.requires,conflicts:x.conflicts,qualification:x.qualification})),factories:['DocumentSearch','BlockReorder','Images','Tables','MathNotation','Markdown'].map(k=>({name:k,value:f[k].configure()}))};});
 assert.deepEqual(result.features.map(x=>x.id),['editac.slash','editac.references','editac.reorder','editac.images','editac.tables','editac.math','editac.search','editac.code','editac.pairs']);
 for(const x of result.features){assert.equal(x.version,1);assert.deepEqual(x.schemas,['editac.registry.editor.v5']);assert.deepEqual(x.requires,[]);assert.deepEqual(x.conflicts,[]);assert.equal(x.qualification,['editac.code','editac.pairs'].includes(x.id)?'contract-fixture':'qualified');}
 const catalog=JSON.parse(readFileSync(join(docsRoot,'examples/extension-configurations/catalog.json')));
 for(const spec of catalog.factories){const x=result.factories.find(x=>x.name===spec.name);assert.ok(x);assert.equal(x.value.apiVersion,1);assert.equal(x.value.feature.id,spec.id);assert.equal(x.value.feature.version,spec.version);assert.deepEqual(x.value.options,spec.options);assert.equal(x.value.loading,spec.loading);}
 record('descriptors',result);
});
test('one-import typed openLocal selects Search without a provider and preserves independent content',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=await f.local();return {text:f.content(e),features:e.extensionConfiguration.extensions.map(x=>x.feature.id),sync:!!e.syncAttachment,spell:e.root.getAttribute('spellcheck')};});
 assert.deepEqual(r,{text:'Alpha beta',features:['editac.search'],sync:false,spell:null});record('one-import',r);
});
test('individual composition and inspectable presets do not restrict application labels or enable a sibling',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,a=await f.open(f.documentPreset({remove:['editac.reorder']})),b=await f.open(f.defaultPreset()),c=await f.open({extensions:[f.DocumentSearch.configure(),f.BlockReorder.configure()]});return {lists:[f.defaultPreset().extensions.map(x=>x.feature.id),f.documentPreset().extensions.map(x=>x.feature.id)],enabled:[!!a.search,!!a.reorder,!!b.search,!!b.reorder,!!c.search,!!c.reorder],texts:[f.content(a),f.content(b),f.content(c)],sync:[!!a.syncAttachment,!!b.syncAttachment,!!c.syncAttachment]};});
 assert.deepEqual(r,{lists:[[],['editac.search','editac.reorder']],enabled:[true,false,false,false,true,true],texts:['Alpha beta','Alpha beta','Alpha beta'],sync:[false,false,false]});record('presets-composition',r);
});
test('duplicate, unknown option, changed adapter, legacy mix and missing override reject before host mutation',async()=>{
 const r=await run(()=>{const f=window.documentationFixture,host=f.root(),engine=f.engine();host.textContent='Preserved host';const original=host.outerHTML,codes=[];for(const options of [{extensions:[f.Tables.configure(),f.Tables.configure()]},{extensions:[{...f.Tables.configure(),options:{unexpected:true}}]},{extensions:[{...f.Markdown.configure(),loading:'command-lazy'}]},{extensions:[],search:false}]){try{f.mountEditorSurface(host,engine,options);}catch(e){codes.push(e.code);}}try{f.documentPreset({overrides:[f.Images.configure()]});}catch(e){codes.push(e.code);}return {codes,preserved:original===host.outerHTML};});
 assert.equal(r.codes.length,5);assert.ok(r.codes.includes('unknown-option'));assert.ok(r.codes.includes('missing-adapter'));assert.ok(r.codes.includes('legacy-conflict'));assert.ok(r.codes.includes('missing-override'));assert.equal(r.preserved,true);record('rejection',r);
});
test('table edit and undo have independent semantic outcomes while unavailable image source survives',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=f.engine('');f.fill(e,[{attributes:{type:'paragraph'},runs:[{text:'Due Friday',marks:[]}]},{attributes:{type:'content',tuple:['module:editac.image',1,{url:'https://assets.example.test/kickoff.png',alt:'Kickoff',title:'',source:'![Kickoff](https://assets.example.test/kickoff.png)'}]},runs:[{text:'Kickoff',marks:[]}]},{attributes:{type:'content',tuple:['module:editac.table',1,{alignments:['none'],rows:[[[['head',[]]]],[[['Friday',[]]]]],source:'| head |\n| --- |\n| Friday |'}]},runs:[{text:'head\nFriday',marks:[]}]}]);e.history({type:'clear'});const record=await f.seed(undefined,e.checkpoint()),a=f.createEditor(f.root(),{...record,extensions:[f.Images.configure(),f.Tables.configure()]});f.editors.push(a);await a.ready;const cell=a.root.querySelectorAll('[data-content-module="table"] textarea')[1];cell.value='Thursday';cell.dispatchEvent(new InputEvent('input',{bubbles:true}));const table=()=>a.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.table').blockAttributes[2].rows[1][0][0][0];const changed=table();f.select(a.root,0);const h=a.captureHistory();h.execute('undo');h.dispose();const image=a.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.image');return {changed,undone:table(),image:image.blockAttributes[2],imageState:a.root.querySelector('[data-content-module="image"]').dataset.imageState};});
 assert.deepEqual(r,{changed:'Thursday',undone:'Friday',image:{url:'https://assets.example.test/kickoff.png',alt:'Kickoff',title:'',source:'![Kickoff](https://assets.example.test/kickoff.png)'},imageState:'missing'});record('table-image',r);
});
test('configured slash menu captures callbacks once, applies one intent, undoes and isolates its sibling',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture;let calls=0;const command={id:'kickoff',label:'Insert kickoff',prepare:()=>{calls++;return {type:'fragment',blocks:[{attributes:{type:'paragraph'},runs:[{text:'Kickoff',marks:[{mark:'bold'}]}]}]};}};const configured=f.SlashCommands.configure({commands:[command]});command.prepare=()=>{throw Error('mutated');};const a=await f.open({extensions:[configured]}, {}, 'Due Friday'),b=await f.open({extensions:[]},{},'Sibling');f.select(a.root,0);a.slash.openExplicit();const label=a.slash.menu.textContent;await a.slash.activate('kickoff');const runs=a.read().visible.find(n=>n.kind==='block').runs;f.history(a,'undo');return {calls,label:label.includes('Insert kickoff'),runs,undone:f.content(a),sibling:f.content(b)};});
 assert.deepEqual(r,{calls:1,label:true,runs:[{text:'Kickoff',attributes:{bold:true}},{text:'Due Friday',attributes:{}}],undone:'Due Friday',sibling:'Sibling'});record('slash-history',r);
});
test('reference resolver is idle until interaction and inserts only the prepared reference target',async()=>{
 const first=await run(async()=>{const f=window.documentationFixture;window.catalogCalls=[];const a=await f.open({extensions:[f.References.configure({host:r=>{window.catalogCalls.push(r.query);return [{targetId:'doc-42',label:'Verified reference'}];}})]},{},'Due Friday');window.catalogEditor=a;const idle=window.catalogCalls.length;f.select(a.root,0,3);a.references.openExplicit();return idle;});assert.equal(first,0);
 await page.waitForFunction(()=>window.catalogEditor.references.menu.querySelectorAll('[role=menuitem]').length===1);
 const r=await run(()=>{const f=window.documentationFixture,a=window.catalogEditor;a.references.activate(0);const node=a.read().visible.find(n=>n.blockAttributes?.[0]==='module:editac.reference');f.history(a,'undo');return {tuple:node.blockAttributes,undone:f.content(a),calls:window.catalogCalls};});
 assert.deepEqual(r,{tuple:['module:editac.reference',1,{targetId:'doc-42',label:'Verified reference'}],undone:'Due Friday',calls:['']});record('reference',r);
});
test('disabled bold command preserves admitted bold text',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=f.engine('');f.fill(e,[{attributes:{type:'paragraph'},runs:[{text:'Friday',marks:[{mark:'bold'}]}]}]);const host=f.root(),surface=f.mountEditorSurface(host,e,{extensions:[],formatting:{marks:{bold:{commands:false,shortcuts:false,controls:false}}}});f.surfaces.push(surface);await surface.ready;f.select(host,0,6);const capture=surface.captureCommand('bold');return {denied:!capture,runs:e.read().visible.find(n=>n.kind==='block').runs};});
 assert.deepEqual(r,{denied:true,runs:[{text:'Friday',attributes:{bold:true}}]});record('format-preservation',r);
});
test('Markdown command-lazy mode keeps input literal and exports through installed optional codec',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,a=await f.open({extensions:[f.Markdown.configure({input:false})]},{},'**Friday**');const before={text:f.content(a),state:a.extensionStatus['editac.markdown'].state};const out=await a.exportMarkdown([{attributes:{type:'paragraph'},runs:[{text:'Friday',marks:[{mark:'bold'}]}]}]);return {before,out,after:f.content(a),state:a.extensionStatus['editac.markdown'].state};});
 assert.equal(r.before.text,'**Friday**');assert.equal(r.before.state,'idle');assert.equal(r.after,'**Friday**');assert.equal(r.state,'ready');assert.ok(JSON.stringify(r.out).includes('**Friday**'));record('markdown-export',r);
});
test('required parser failure preserves checkpoint content and reports failed readiness',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,record=await f.seed('Due Friday'),a=f.createEditor(f.root(),{...record,extensions:[f.Markdown.configure()],assets:{manifest:{markdownModule:new URL('/missing-parser.js',location.href).href}}});f.editors.push(a);let rejected=false;try{await a.ready;}catch{rejected=true;}const status=a.extensionStatus['editac.markdown'].state;await a.destroy({policy:'report'});const b=f.createEditor(f.root(),{...record,extensions:[]});f.editors.push(b);await b.ready;return {rejected,status,text:f.content(b)};});
 assert.deepEqual(r,{rejected:true,status:'failed',text:'Due Friday'});record('parser-preservation',r);
});
test('destroy cancels a late collaboration attachment and remount retains exact local document',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,record=await f.seed('Due Friday');let release,calls=0;const pending=new Promise(r=>release=r),a=f.createEditor(f.root(),{...record,extensions:[],collaboration:{connect:()=>pending}});f.editors.push(a);await a.ready;const connecting=a.connectCollaboration();while(a.collaborationStatus.state!=='loading')await new Promise(r=>setTimeout(r,0));await a.destroy({policy:'report'});release({peerIdentity:record.identity,authorized:true,transport:{send:()=>{calls++;return true;}}});try{await connecting;}catch{}const b=f.createEditor(f.root(),{...record,extensions:[]});f.editors.push(b);await b.ready;return {calls,text:f.content(b),state:a.collaborationStatus.state};});
 assert.equal(r.calls,0);assert.equal(r.text,'Due Friday');assert.equal(r.state,'cancelled');record('cancel-remount',r);
});
test('borrowed presenter disposal leaves the engine usable and creates no provider traffic',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=f.engine('Due Friday'),root=f.root(),s=f.mountEditorSurface(root,e,{extensions:[f.DocumentSearch.configure(),f.BlockReorder.configure()]});await s.ready;s.dispose();s.dispose();f.fill(e,[{attributes:{type:'paragraph'},runs:[{text:'Due Friday!',marks:[]}]}]);return {text:f.content(e),editable:root.getAttribute('contenteditable')};});
 assert.equal(r.text,'Due Friday!');assert.deepEqual(harness.metadata.errors,[]);record('borrowed-cleanup',r);
});
test('configured Search finds Friday through the production search session without changing content',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=await f.open({extensions:[f.DocumentSearch.configure()]},{},'Due Friday');f.select(e.root,0);e.search.show();e.search.query.value='Friday';await e.search.scan();return {status:e.search.status.textContent,matches:e.search.session.result.matches.length,text:f.content(e)};});
 assert.deepEqual(r,{status:'1 of 1 matches',matches:1,text:'Due Friday'});record('search',r);
});
test('reference disposal aborts a pending lookup and late results cannot change the retained engine',async()=>{
 await run(async()=>{const f=window.documentationFixture;window.pendingLookup={};const host={extensions:[f.References.configure({host:request=>{window.pendingLookup.request=request;return new Promise(resolve=>window.pendingLookup.resolve=resolve);}})]};window.lookupSurface=f.surface(host,{},'Due Friday');await window.lookupSurface.surface.ready;f.select(window.lookupSurface.host,0,3);window.lookupSurface.surface.references.openExplicit();});
 await page.waitForFunction(()=>!!window.pendingLookup.request);
 const r=await run(async()=>{const f=window.documentationFixture,{surface,engine}=window.lookupSurface;surface.dispose();const aborted=window.pendingLookup.request.signal.aborted;window.pendingLookup.resolve([{targetId:'late',label:'Wrong late target'}]);await new Promise(r=>setTimeout(r,0));return {aborted,text:f.content(engine)};});
 assert.deepEqual(r,{aborted:true,text:'Due Friday'});record('reference-cancel',r);
});
test('Math renderer failure keeps canonical LaTeX and the original semantic mark unchanged',async()=>{
 const r=await run(async()=>{const f=window.documentationFixture,e=f.engine('');f.fill(e,[{attributes:{type:'paragraph'},runs:[{text:'LaTeX source: x^2',marks:[],attributes:{'module:editac.math':[1,{latex:'x^2',display:false}]}}]}]);const host=f.root(),s=f.mountEditorSurface(host,e,{extensions:[f.MathNotation.configure()],assets:{manifest:{mathModule:new URL('/missing-math.js',location.href).href}}});f.surfaces.push(s);await s.ready;await new Promise(r=>setTimeout(r,50));return {text:f.content(e),runs:e.read().visible.find(n=>n.kind==='block').runs,visible:host.textContent};});
 assert.equal(r.text,'LaTeX source: x^2');assert.deepEqual(r.runs,[{text:'LaTeX source: x^2',attributes:{'module:editac.math':[1,{latex:'x^2',display:false}]}}]);assert.ok(r.visible.includes('x^2'));record('math-fallback',r);
});
