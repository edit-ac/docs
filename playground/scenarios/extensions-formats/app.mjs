import {init} from '@edit-ac/core';
import {CheckpointStorage} from '@edit-ac/web';
import {createEditor} from './document.mjs';
import {createKickoff} from './kickoff.mjs';
import {downloadRecovery,recoveryReports,retainRecovery} from './recovery.mjs';
const $=id=>document.getElementById(id), assetUrl=new URL('./core/wasm/editac_wasm_bg.wasm',import.meta.url).href;
const prefix='editac-playground-docx-v1-', presets=new Set(['task','document','publication']);
let editor,unsubscribe,busy=false,selected='task';
const buttons=['save','undo','redo','readonly','close'];
function controls(){for(const id of buttons)$(id).disabled=busy||!editor?.state.ready;for(const id of ['undo','redo'])$(id).disabled||=!!editor?.state.readOnly;$('preset').disabled=busy;$('retry').disabled=busy;$('confirm-reset').disabled=busy;$('reset').disabled=busy;$('export').disabled=busy;$('recover').disabled=busy||(!editor?.state.ready&&!recoveryReports.some(r=>r.preset===selected&&!r.recovered));}
function report(error){$('error').textContent=`Unable to open or save: ${error.message}. Export recovery before closing; retry preserves the existing identity.`;}
function status(text){$('status').textContent=text;}
async function action(fn){if(busy)return;busy=true;controls();try{$('error').textContent='';await fn();}catch(error){report(error);}finally{busy=false;controls();}}
async function identityFor(preset){
 const key=prefix+preset, databaseName=key;
 return navigator.locks.request(key+'-creation',async()=>{
  const saved=localStorage.getItem(key);if(saved)return JSON.parse(saved);
  const runtime=await init(assetUrl),identity={documentId:crypto.randomUUID(),epoch:crypto.randomUUID()};
  // A separately named approved authoring sample, never a flattening fallback.
  const engine=preset==='publication'?runtime.createEngine({profile:'v5',...identity,nodes:['Project kickoff','Owner: Alex','Due Friday','Draft agenda','Confirm attendees','Reference'].map(text=>({text}))}):createKickoff(runtime,identity);let storage;
  try{
   const identity=engine.read().identity;
   // Save creation intent before publication. Failed/missing checkpoints are never silently replaced.
   localStorage.setItem(key,JSON.stringify({identity,databaseName,backups:[]}));
   storage=await CheckpointStorage.open(indexedDB,databaseName);await storage.publish(engine.checkpoint(),[]);
   return {identity,databaseName};
  }finally{storage?.close();engine.dispose();}
 });
}
async function dispose(){
 unsubscribe?.();unsubscribe=undefined;if(!editor)return;
 const old=editor;if(old.state.ready)old.setReadOnly(true);
 try{await old.destroy({policy:'flush'});}catch(error){const result=await old.destroy({policy:'report'});retainRecovery({...result,preset:selected});$('reports').textContent=JSON.stringify(recoveryReports,(_k,v)=>v instanceof Uint8Array?Array.from(v):v,2);throw error;}finally{editor=undefined;$('readonly').setAttribute('aria-pressed','false');}
}
async function open(preset=selected){
 if(!presets.has(preset))throw Error('Unknown preset');
 await dispose();selected=preset;$('preset').value=preset;status('Loading local editor…');
 const options=await identityFor(preset);
 editor=createEditor($('editor'),{...options,assetUrl,indexedDB,locks:navigator.locks,preset:preset==='publication'?'document':preset,label:'Project kickoff document'});
 const offState=editor.subscribe(state=>{if(state.error)report(state.error);});
 unsubscribe=offState;await editor.ready;
 const offUpdates=editor.subscribe({type:'updates'},()=>status('Local edits pending. Save locally before reload.'));
 unsubscribe=()=>{offState();offUpdates();};
 status(`${preset==='task'?'PM ticket':preset==='publication'?'PDF publication sample':'Document'} ready. Saved in this browser only.`);
}
function exportRecovery(){const reports=[...recoveryReports];if(editor?.state.ready)reports.push(editor.recoveryExport());if(reports.length)downloadRecovery(reports);else throw Error('No open document or retained recovery report to export');}
async function reset(){
 // Explicit backup first; destroy/report never silently drops pending edits.
 exportRecovery();await dispose();
 const key=prefix+selected,record=JSON.parse(localStorage.getItem(key));
 for(const name of new Set([record?.databaseName||key,...(record?.backups||[])]))await new Promise((yes,no)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=yes;r.onerror=()=>no(r.error);r.onblocked=()=>no(Error('Close other tabs using this sample before resetting'));});
 localStorage.removeItem(key);$('confirmation').hidden=true;await open();
}
$('preset').onchange=()=>void action(async()=>{const next=$('preset').value;try{await open(next);}catch(e){$('preset').value=selected;throw e;}});
async function restoreRecovery(){
 const wasReadOnly=editor?.state.readOnly;
 if(editor?.state.ready)editor.setReadOnly(true);
 const recovery=editor?.state.ready?editor.recoveryExport():recoveryReports.findLast(r=>r.preset===selected&&!r.recovered)?.recovery;
 if(!recovery)throw Error('No retained recovery checkpoint');
 exportRecovery();
 const key=prefix+selected,prior=JSON.parse(localStorage.getItem(key)),databaseName=key+'-recovery-'+crypto.randomUUID();
 const runtime=await init(assetUrl),verified=runtime.restoreEngine(recovery.checkpoint.identity,recovery.checkpoint);
 let store;
 try{
  // Validate and publish a new isolated copy. Never overwrite the original database.
  store=await CheckpointStorage.open(indexedDB,databaseName);await store.publish(verified.checkpoint(),[]);
 }catch(error){if(editor?.state.ready)editor.setReadOnly(wasReadOnly);throw error;}finally{store?.close();verified.dispose();}
 try{await dispose();}catch{/* dispose retained the failed-save report before closing */}
 localStorage.setItem(key,JSON.stringify({identity:recovery.checkpoint.identity,databaseName,backups:[...(prior?.backups||[]),prior.databaseName]}));
 await open();$('error').textContent='';for(const report of recoveryReports)if(report.preset===selected)report.recovered=true;status('Recovered into a separate local copy. Original database preserved until explicit reset.');
}
$('recover').onclick=()=>void action(restoreRecovery);
$('save').onclick=()=>void action(async()=>{const owner=editor,revision=owner.read().revision;await owner.flush({target:'local'});status(owner===editor&&owner.read().revision===revision?'Saved locally. Remote durability is not configured.':'Newer local edits pending. Save again before reload.');});
for(const id of ['undo','redo'])$(id).onclick=()=>void action(()=>{editor.root.focus();const target=editor.captureHistory();if(!target)throw Error('History unavailable');try{const result=target.execute(id);if(result?.caret)editor.releaseAnchor(result.caret);if(result?.selection){editor.releaseAnchor(result.selection.anchor);editor.releaseAnchor(result.selection.focus);}}finally{target.dispose();}});
$('readonly').onclick=()=>void action(()=>{editor.setReadOnly(!editor.state.readOnly);$('readonly').setAttribute('aria-pressed',String(editor.state.readOnly));status(editor.state.readOnly?'Read-only. Local content preserved.':'Editing enabled.');});
$('export').onclick=()=>void action(exportRecovery);
$('close').onclick=()=>void action(async()=>{await dispose();status('Editor closed. Local content preserved.');});
$('retry').onclick=()=>void action(()=>open());
$('reset').onclick=()=>{$('confirmation').hidden=false;$('confirm-reset').focus();};
$('cancel-reset').onclick=()=>{$('confirmation').hidden=true;$('reset').focus();};
$('confirm-reset').onclick=()=>void action(reset);
window.addEventListener('beforeunload',event=>{if(editor?.state.error||recoveryReports.some(r=>!r.recovered)){event.preventDefault();event.returnValue='';}});
// The host must await close before client navigation; abrupt tab shutdown cannot promise a flush.
window.playground={open:()=>action(()=>open()),close:()=>action(dispose),get editor(){return editor;},get reports(){return recoveryReports;},get busy(){return busy;}};
void action(()=>open());
