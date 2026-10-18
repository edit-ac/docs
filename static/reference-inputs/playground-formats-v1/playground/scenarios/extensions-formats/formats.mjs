// No static dependency on the optional package: the baseline requests no codec payload.
const $=id=>document.getElementById(id);
let client,enabled=false,generation=0,directions=[];
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
  const rows=directions=manifest.directions.filter(d=>d.target==='browser-worker-wasm32');
  if(!rows.length||rows.some(d=>d.format==='pdf'&&d.direction==='import'))throw Error('Unsupported browser profile');
  for(const d of rows){const row=document.createElement('tr');for(const key of ['format','direction','profile','fidelity']){const cell=document.createElement('td');cell.textContent=d[key];row.append(cell);}$('formats-capabilities').append(row);}
  $('formats-unavailable').textContent='Unavailable: '+(manifest.unavailable||[]).join(', ');
  updateFormat();$('formats-panel').hidden=false;$('formats-status').textContent='Local public format client ready. No conversion has run; direction-specific fidelity applies.';
 }catch(error){if(ticket===generation)disable(`Format capabilities unavailable: ${error.message}. Editor preserved; enable to retry.`);}
}
$('formats-toggle').onclick=()=>{if(enabled)disable();else void enable();};
$('close').addEventListener('click',()=>disable());
window.addEventListener('pagehide',()=>disable());
// Read-only lifecycle observability for the local qualification harness.
window.playgroundFormats={get enabled(){return enabled;},get ready(){return !!client;}};

let idleWaiters=[];
function finishAction(){working=false;for(const resolve of idleWaiters.splice(0))resolve();}
async function cancelAndWait(){cancelDocx();if(working)await new Promise(resolve=>idleWaiters.push(resolve));}
let pending,working=false,actionGeneration=0,actionAbort,output,retainedInput,recovery,lastReport;
const format=()=>$('package-format').value;
const sourceGrant=kind=>({identity:{host:'local-recovery',key:`complete-${kind}-package`},actions:['ingest','read','cancel','release-reference']});
const tableKind=kind=>kind==='csv'||kind==='tsv';
const dialect=()=>({newline:$('table-newline').value,header:$('table-header').checked});
const mime={csv:'text/csv;charset=utf-8',tsv:'text/tab-separated-values;charset=utf-8',pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',odt:'application/vnd.oasis.opendocument.text',epub:'application/epub+zip'};
function updateFormat(){
 const kind=format(),label=kind.toUpperCase();
 for(const [id,prefix] of [['prepare','Preview'],['confirm','Confirm'],['cancel','Cancel'],['export','Prepare'],['stored','Retrieve stored']])$('docx-'+id).textContent=`${prefix} ${label} ${id==='export'?'export':id==='cancel'?'preparation':'import'}`;
 $('docx-heading').textContent=label+' fixture workflow';
 $('table-controls').hidden=!tableKind(kind);
 if(tableKind(kind))$('table-newline').value=kind==='tsv'?'crlf':'lf';
 for(const option of $('docx-fixture').options)option.disabled=(tableKind(kind)||kind==='pdf')&&option.value!=='media';
 if($('docx-fixture').selectedOptions[0].disabled)$('docx-fixture').value='media';
 $('docx-stored').disabled=tableKind(kind)||kind==='pdf';
 $('format-rule').textContent=kind==='pdf'?'PDF input is export-only: preview demonstrates the installed rejection and retains the input. Export captures the whole document.':tableKind(kind)?'Import replaces the first text block with one shared table as one history group. Original input remains downloadable in this tab. Select one table explicitly before export.':'Package import replaces the first text block; original package and admitted media remain in the local asset journal.';
 refreshTables();
 $('direction-profile').textContent=directions.filter(d=>d.format===kind).map(d=>`${d.direction}: ${d.profile} / ${d.fidelity}`).join('; ');
}

const message=text=>$('docx-status').textContent=text;
function refreshTables(){
 const select=$('table-selected'),prior=select.value;select.replaceChildren(new Option('Choose a table explicitly',''));
 for(const node of window.playground.editor?.read().visible||[])if(node.blockAttributes?.[0]==='module:editac.table')select.add(new Option('Table '+node.id,node.id));
 if([...select.options].some(o=>o.value===prior))select.value=prior;
}
$('table-refresh').onclick=refreshTables;
function report(result){
 lastReport={profile:result.profile,diagnostics:result.diagnostics||result.report?.diagnostics||[],code:result.code,reason:result.report?.reason||result.code,action:result.report?.action,bytes:result.bytes?.length,originalBytes:result.original?.length};
 $('docx-report').textContent=JSON.stringify(lastReport,null,2);
 if(result.recovery){recovery=structuredClone(result.recovery);$('docx-recovery').disabled=false;}
}
function clearPending(){const old=pending;pending=undefined;try{old?.release();}catch{/* A closed owner already released its anchors. */}}
function cancelDocx(){actionGeneration++;actionAbort?.abort();client?.cancel();clearPending();$('docx-confirm').disabled=true;message('Preparation canceled. Document preserved; retained input, output and recovery remain downloadable.');}
async function action(fn){
 if(working)return;working=true;const ticket=++actionGeneration;actionAbort=new AbortController();
 try{if(!client||!window.playground.editor?.state.ready||window.playground.busy)throw Error('Enable formats and open the editor first');await fn(ticket);}
 catch(error){report(error);message(`${format().toUpperCase()} action rejected: ${error.code||error.message}. ${error.report?.reason||'Retain input/recovery'}. ${error.report?.action||'Review diagnostics and prepare again.'}`);}
 finally{finishAction();}
}
function current(ticket,editor,revision,write=false){
 if(ticket!==actionGeneration||!enabled||editor!==window.playground.editor||!editor.state.ready||editor.read().revision!==revision||window.playground.busy)throw Error('Stale target; prepare again for the current sample');
 if(write&&editor.state.readOnly)throw Error('Editor is read-only');
}
async function prepareDocx(ticket){
 clearPending();$('docx-confirm').disabled=true;
 const editor=window.playground.editor,revision=editor.read().revision;
 current(ticket,editor,revision,true);report({recovery:editor.owner.engine.checkpoint()});
 const kind=format(),fixture=$('docx-fixture').value,approveLoss=$('docx-loss').checked;
 if(kind!=='pdf'&&!directions.some(d=>d.format===kind&&d.direction==='import'))throw Error('Import unavailable in installed profile');
 const [response,policyResponse]=await Promise.all([fetch(`./fixtures/${kind==='docx'?'':kind+'/'}${fixture}.${kind}`,{signal:actionAbort.signal}),fetch(`./fixtures/${kind}.json`,{signal:actionAbort.signal})]);
 if(!response.ok||!policyResponse.ok)throw Error('Approved fixture unavailable');
 const source=new Uint8Array(await response.arrayBuffer()),policy=await policyResponse.json();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',source))).map(x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!==policy.fixtures[fixture]?.sha256)throw Error('Approved fixture integrity mismatch');
 retainedInput={bytes:source.slice(),kind};$('docx-original').disabled=false;
 current(ticket,editor,revision,true);
 const engine=editor.owner.engine,node=engine.read().visible.find(n=>n.kind==='block'&&n.runs?.length);
 if(!node)throw Error('No text block target');
 const anchor=engine.anchor(node.id,0,'right'),focus=engine.anchor(node.id,node.runs.reduce((n,r)=>n+Array.from(r.text).length,0),'left');
 message(`Preparing approved ${kind.toUpperCase()} in the local worker; live content is unchanged…`);
 try{
  const prepared=await client.prepareImport(engine,{format:kind,source,filename:fixture+'.'+kind,range:{anchor,focus},...(tableKind(kind)?dialect():{}),importGrants:policy.grant?[policy.grant]:[],approveLoss,signal:actionAbort.signal});
  report(prepared);current(ticket,editor,revision,true);
  pending={prepared,editor,revision,ticket,approveLoss,kind,release:()=>{engine.releaseAnchor(anchor);engine.releaseAnchor(focus);}};$('docx-confirm').disabled=false;
  message('Preview ready. Review diagnostics and confirm one atomic replacement. No live content has changed.');
 }finally{if(!pending){engine.releaseAnchor(anchor);engine.releaseAnchor(focus);}}
}
// Fixture-only local host: exact bytes are durable in AssetSession before this
// deterministic transport acknowledges ingest. No external service or upload.
const fixtureHost={authorize:async r=>({identity:r.identity,actions:['ingest','read','cancel','release-reference']}),execute:async()=>null};
async function confirmDocx(){
 const p=pending;if(!p)throw Error('Prepare an import first');pending=undefined;$('docx-confirm').disabled=true;
 try{current(p.ticket,p.editor,p.revision,true);
 const result=tableKind(p.kind)?p.prepared.commit():await p.prepared.commitAssets(p.editor.owner,p.kind+'_'+crypto.randomUUID(),fixtureHost,sourceGrant(p.kind));
 await p.editor.flush({target:'local'});refreshTables();message(`${p.kind.toUpperCase()} imported: ${tableKind(p.kind)?'committed':result.localCommit.state}. One history group; ${tableKind(p.kind)?'original input remains downloadable in this tab':'package and PNG retained locally'}.`);
 }finally{p.release();}
}
async function exportDocx(ticket){
 clearPending();$('docx-confirm').disabled=true;
 const kind=format(),editor=window.playground.editor,revision=editor.read().revision;
 if(!directions.some(d=>d.format===kind&&d.direction==='export'))throw Error('Export unavailable in installed profile');
 current(ticket,editor,revision);report({recovery:editor.owner.engine.checkpoint()});const originalAssets=[];
 if(!tableKind(kind)){const assets=await editor.owner.enableAssets();
 for(const node of editor.read().visible){if(node.blockAttributes?.[0]!=='module:editac.asset')continue;
  const identity=node.blockAttributes[2].identity,grant={identity,actions:['read']};
  const bytes=await assets.retainedSource(node.id,grant);if(!bytes)throw Error('Missing approved original media');originalAssets.push({...grant,bytes});
 }}
 current(ticket,editor,revision);message(`Preparing ${kind.toUpperCase()} export from a captured checkpoint…`);
 const result=await client.export(editor.owner.engine,{format:kind,originalAssets,...(tableKind(kind)?{...dialect(),selected:$('table-selected').value||undefined,safe:$('table-safe').checked}:{}),approveLoss:$('docx-loss').checked,signal:actionAbort.signal});
 // Retain a completed captured export even if a newer revision now exists.
 output={bytes:result.bytes.slice(),kind,recovery:structuredClone(result.recovery)};report(result);for(const id of ['docx-download','docx-save-output','docx-share-output'])$(id).disabled=false;$('docx-download').textContent='Download prepared '+kind.toUpperCase();
 current(ticket,editor,revision);message(`${kind.toUpperCase()} output retained in this tab. Download explicitly; captured recovery remains available if delivery fails.`);
}
function download(bytes,name,type){const url=URL.createObjectURL(new Blob([bytes],{type})),link=document.createElement('a');link.href=url;link.download=name;try{link.click();}finally{setTimeout(()=>URL.revokeObjectURL(url),1000);}}
$('docx-prepare').onclick=()=>void action(prepareDocx);
// Confirm uses the preparation ticket; starting a new action must not invalidate it.
$('docx-confirm').onclick=()=>{if(working)return;working=true;void confirmDocx().catch(error=>{report(error);message(`${format().toUpperCase()} import rejected: ${error.code||error.message}. Prepare again; document preserved on rejected commit.`);}).finally(finishAction);};
$('docx-export').onclick=()=>void action(exportDocx);
$('docx-cancel').onclick=cancelDocx;
$('docx-stored').onclick=()=>void action(async ticket=>{
 const kind=format(),editor=window.playground.editor,revision=editor.read().revision,assets=await editor.owner.enableAssets();
 const journal=await assets.inspect(),source=journal.prepared.findLast(p=>p.job.startsWith(kind+'_')&&p.reference.endsWith('_source'));
 if(!source)throw Error(`No ${kind.toUpperCase()} input retained in this sample`);
 const bytes=await assets.preparedSource(source.job,source.reference,sourceGrant(kind));current(ticket,editor,revision);
 retainedInput={bytes:bytes.slice(),kind};recovery=editor.owner.engine.checkpoint();$('docx-original').disabled=false;$('docx-recovery').disabled=false;
 message(`Stored original ${kind.toUpperCase()} recovered from the selected sample. Download input or checkpoint explicitly.`);
});
$('package-format').addEventListener('change',()=>{cancelDocx();updateFormat();});
for(const id of ['docx-fixture','docx-loss','table-newline','table-header','table-selected','table-safe'])$(id).addEventListener('change',cancelDocx);
async function deliverOutput(mode){
 const captured=output;if(!captured)return;
 recovery=structuredClone(captured.recovery);$('docx-recovery').disabled=false;
 const name='playground.'+captured.kind,type=mime[captured.kind];let writable;
 try{
  if(mode==='save'){
   if(!window.showSaveFilePicker)throw Error('Local file saving unavailable in this browser; use Download');
   const handle=await window.showSaveFilePicker({suggestedName:name});writable=await handle.createWritable();await writable.write(captured.bytes);await writable.close();writable=undefined;
  }else if(mode==='share'){
   const files=[new File([captured.bytes],name,{type})];
   if(!navigator.share||!navigator.canShare?.({files}))throw Error('File sharing unavailable in this browser; use Download');
   await navigator.share({files});
  }else download(captured.bytes,name,type);
  message('Captured '+captured.kind.toUpperCase()+' delivery requested. Output and recovery remain available for retry.');
 }catch(error){
  try{await writable?.abort();}catch{/* Keep the retained output even if closing the destination fails. */}
  message('Delivery failed: '+(error.name||error.message)+'. '+error.message+'. Captured '+captured.kind.toUpperCase()+' output and recovery retained; retry or Download explicitly.');
 }
}
$('docx-download').onclick=()=>void deliverOutput('download');
$('docx-save-output').onclick=()=>void deliverOutput('save');
$('docx-share-output').onclick=()=>void deliverOutput('share');
$('docx-original').onclick=()=>download(retainedInput.bytes,'retained-input.'+retainedInput.kind,mime[retainedInput.kind]);
$('docx-recovery').onclick=()=>download(JSON.stringify(recovery,(_k,v)=>v instanceof Uint8Array?Array.from(v):v,2),'docx-recovery.json','application/json');
$('formats-toggle').addEventListener('click',()=>{if(!enabled)cancelDocx();});
$('readonly').addEventListener('click',cancelDocx);$('editor').addEventListener('compositionstart',cancelDocx);
$('close').addEventListener('click',cancelDocx);$('preset').addEventListener('change',cancelDocx);window.addEventListener('pagehide',cancelDocx);
// Read-only observations of real actions for the local harness; no fixture path bypass.
Object.defineProperties(window.playgroundFormats,{working:{get:()=>working},report:{get:()=>structuredClone(lastReport)}});

Object.defineProperty(window.playgroundFormats,'cancelAndWait',{value:cancelAndWait});
window.addEventListener('playground-close',()=>{cancelDocx();disable();});
