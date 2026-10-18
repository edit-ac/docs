// No static dependency on the optional package: the baseline requests no codec payload.
const $=id=>document.getElementById(id);
let client,enabled=false,generation=0;
function disable(message='Formats disabled. Prepared jobs canceled; editor content preserved.'){
 generation++;enabled=false;client?.dispose();client=undefined;
 $('formats-panel').hidden=true;$('formats-capabilities').replaceChildren();
 $('formats-toggle').setAttribute('aria-pressed','false');$('formats-toggle').textContent='Enable format capabilities';
 $('formats-status').textContent=message;
}
async function enable(){
 const ticket=++generation;enabled=true;
 $('formats-toggle').setAttribute('aria-pressed','true');$('formats-toggle').textContent='Disable format capabilities';
 $('formats-status').textContent='Loading local format capabilities…';
 try{
  const [api,response]=await Promise.all([import('./formats/index.js?attempt='+ticket),fetch('./formats/capabilities.json')]);
  if(!response.ok)throw Error('Capability manifest unavailable');
  const manifest=await response.json();
  if(ticket!==generation)return;
  if(manifest.schemaVersion!==1||!Array.isArray(manifest.directions))throw Error('Unsupported capability manifest');
  client=api.createFormatClient();
  const rows=manifest.directions.filter(d=>d.target==='browser-worker-wasm32');
  if(!rows.length||rows.some(d=>d.format==='pdf'&&d.direction==='import'))throw Error('Unsupported browser profile');
  for(const d of rows){const row=document.createElement('tr');for(const key of ['format','direction','profile','fidelity']){const cell=document.createElement('td');cell.textContent=d[key];row.append(cell);}$('formats-capabilities').append(row);}
  $('formats-unavailable').textContent='Unavailable: '+(manifest.unavailable||[]).join(', ');
  $('formats-panel').hidden=false;$('formats-status').textContent='Local public format client ready. No conversion has run; direction-specific fidelity applies.';
 }catch(error){if(ticket===generation)disable(`Format capabilities unavailable: ${error.message}. Editor preserved; enable to retry.`);}
}
$('formats-toggle').onclick=()=>{if(enabled)disable();else void enable();};
$('close').addEventListener('click',()=>disable());
window.addEventListener('pagehide',()=>disable());
// Read-only lifecycle observability for the local qualification harness.
window.playgroundFormats={get enabled(){return enabled;},get ready(){return !!client;}};

let pending,working=false,actionGeneration=0,output,retainedInput,recovery,lastReport;
const message=text=>$('docx-status').textContent=text;
function report(result){
 lastReport={profile:result.profile,diagnostics:result.diagnostics||result.report?.diagnostics||[],reason:result.code||result.report?.reason,bytes:result.bytes?.length,originalBytes:result.original?.length};
 $('docx-report').textContent=JSON.stringify(lastReport,null,2);
 if(result.recovery){recovery=structuredClone(result.recovery);$('docx-recovery').disabled=false;}
}
function clearPending(){const old=pending;pending=undefined;try{old?.release();}catch{/* A closed owner already released its anchors. */}}
function cancelDocx(){actionGeneration++;client?.cancel();clearPending();$('docx-confirm').disabled=true;message('Preparation canceled. Document preserved; retained input, output and recovery remain downloadable.');}
async function action(fn){
 if(working)return;working=true;const ticket=++actionGeneration;
 try{if(!client||!window.playground.editor?.state.ready||window.playground.busy)throw Error('Enable formats and open the editor first');await fn(ticket);}
 catch(error){report(error);message(`DOCX action rejected: ${error.code||error.message}. Retain input/recovery; approve losses and prepare again if required.`);}
 finally{working=false;}
}
function current(ticket,editor,revision,write=false){
 if(ticket!==actionGeneration||!enabled||editor!==window.playground.editor||!editor.state.ready||editor.read().revision!==revision||window.playground.busy)throw Error('Stale target; prepare again for the current sample');
 if(write&&editor.state.readOnly)throw Error('Editor is read-only');
}
async function prepareDocx(ticket){
 clearPending();$('docx-confirm').disabled=true;
 const editor=window.playground.editor,revision=editor.read().revision;
 current(ticket,editor,revision,true);
 const fixture=$('docx-fixture').value,approveLoss=$('docx-loss').checked;
 const [response,policyResponse]=await Promise.all([fetch('./fixtures/'+fixture+'.docx'),fetch('./fixtures/docx.json')]);
 if(!response.ok||!policyResponse.ok)throw Error('Approved fixture unavailable');
 const source=new Uint8Array(await response.arrayBuffer()),policy=await policyResponse.json();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',source))).map(x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!==policy.fixtures[fixture]?.sha256)throw Error('Approved fixture integrity mismatch');
 retainedInput=source.slice();$('docx-original').disabled=false;
 current(ticket,editor,revision,true);
 const engine=editor.owner.engine,node=engine.read().visible.find(n=>n.kind==='block'&&n.runs?.length);
 if(!node)throw Error('No text block target');
 const anchor=engine.anchor(node.id,0,'right'),focus=engine.anchor(node.id,node.runs.reduce((n,r)=>n+Array.from(r.text).length,0),'left');
 message('Preparing approved DOCX in the local worker; live content is unchanged…');
 try{
  const prepared=await client.prepareImport(engine,{format:'docx',source,filename:fixture+'.docx',range:{anchor,focus},importGrants:[policy.grant],approveLoss});
  current(ticket,editor,revision,true);report(prepared);
  pending={prepared,editor,revision,ticket,approveLoss,release:()=>{engine.releaseAnchor(anchor);engine.releaseAnchor(focus);}};$('docx-confirm').disabled=false;
  message('Preview ready. Review diagnostics and confirm one atomic replacement. No live content has changed.');
 }finally{if(!pending){engine.releaseAnchor(anchor);engine.releaseAnchor(focus);}}
}
const grant={identity:{host:'local-recovery',key:'complete-docx-package'},actions:['ingest','read','cancel','release-reference']};
// Fixture-only local host: exact bytes are durable in AssetSession before this
// deterministic transport acknowledges ingest. No external service or upload.
const fixtureHost={authorize:async r=>({identity:r.identity,actions:['ingest','read','cancel','release-reference']}),execute:async()=>null};
async function confirmDocx(){
 const p=pending;if(!p)throw Error('Prepare an import first');pending=undefined;$('docx-confirm').disabled=true;
 try{current(p.ticket,p.editor,p.revision,true);
 const result=await p.prepared.commitAssets(p.editor.owner,'docx_'+crypto.randomUUID(),fixtureHost,grant);
 await p.editor.flush({target:'local'});message(`DOCX imported: ${result.localCommit.state}. One history group; package and PNG retained locally.`);
 }finally{p.release();}
}
async function exportDocx(ticket){
 clearPending();$('docx-confirm').disabled=true;
 const editor=window.playground.editor,revision=editor.read().revision;
 current(ticket,editor,revision);const assets=await editor.owner.enableAssets(),originalAssets=[];
 for(const node of editor.read().visible){if(node.blockAttributes?.[0]!=='module:editac.asset')continue;
  const identity=node.blockAttributes[2].identity,grant={identity,actions:['read']};
  const bytes=await assets.retainedSource(node.id,grant);if(!bytes)throw Error('Missing approved original media');originalAssets.push({...grant,bytes});
 }
 current(ticket,editor,revision);message('Preparing DOCX export from a captured checkpoint…');
 const result=await client.export(editor.owner.engine,{format:'docx',originalAssets,approveLoss:$('docx-loss').checked});
 current(ticket,editor,revision);output=result.bytes.slice();report(result);$('docx-download').disabled=false;
 message('DOCX output retained in this tab. Download explicitly; captured recovery remains available if delivery fails.');
}
function download(bytes,name,type){const url=URL.createObjectURL(new Blob([bytes],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('docx-prepare').onclick=()=>void action(prepareDocx);
// Confirm uses the preparation ticket; starting a new action must not invalidate it.
$('docx-confirm').onclick=()=>{if(working)return;working=true;void confirmDocx().catch(error=>{report(error);message(`DOCX import rejected: ${error.code||error.message}. Prepare again; document preserved on rejected commit.`);}).finally(()=>working=false);};
$('docx-export').onclick=()=>void action(exportDocx);
$('docx-cancel').onclick=cancelDocx;
$('docx-stored').onclick=()=>void action(async ticket=>{
 const editor=window.playground.editor,revision=editor.read().revision,assets=await editor.owner.enableAssets();
 const journal=await assets.inspect(),source=journal.prepared.findLast(p=>p.reference.endsWith('_source'));
 if(!source)throw Error('No DOCX input retained in this sample');
 const bytes=await assets.preparedSource(source.job,source.reference,grant);current(ticket,editor,revision);
 retainedInput=bytes.slice();recovery=editor.owner.engine.checkpoint();$('docx-original').disabled=false;$('docx-recovery').disabled=false;
 message('Stored original DOCX recovered from the selected sample. Download input or checkpoint explicitly.');
});
for(const id of ['docx-fixture','docx-loss'])$(id).addEventListener('change',cancelDocx);
$('docx-download').onclick=()=>download(output,'playground.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
$('docx-original').onclick=()=>download(retainedInput,'retained-input.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
$('docx-recovery').onclick=()=>download(JSON.stringify(recovery,(_k,v)=>v instanceof Uint8Array?Array.from(v):v,2),'docx-recovery.json','application/json');
$('formats-toggle').addEventListener('click',()=>{if(!enabled)cancelDocx();});
$('readonly').addEventListener('click',cancelDocx);$('editor').addEventListener('compositionstart',cancelDocx);
$('close').addEventListener('click',cancelDocx);$('preset').addEventListener('change',cancelDocx);window.addEventListener('pagehide',cancelDocx);
// Read-only observations of real actions for the local harness; no fixture path bypass.
Object.defineProperties(window.playgroundFormats,{working:{get:()=>working},report:{get:()=>structuredClone(lastReport)}});
