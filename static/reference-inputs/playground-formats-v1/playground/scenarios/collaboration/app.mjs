import {init} from '@edit-ac/core';
import {CheckpointStorage,createEditor} from '@edit-ac/web';
import {createKickoff} from '../../kickoff.mjs';
import {createLocalChannel} from './channel.mjs';
const $=id=>document.getElementById(id),key='editac-local-collaboration-v1';
const assetUrl=new URL('../../core/wasm/editac_wasm_bg.wasm',import.meta.url).href;
let editors=[],attachments=[],channel,unsubscribers=[],busy=false,timer,record,disposed=true;
const reports=[];let lastChannel,saveFailure=false;
function semantic(editor){return editor.read().visible.map(n=>({id:n.id,parent:n.parent,kind:n.kind,attributes:n.blockAttributes,runs:n.runs,spans:n.spans}));}
function update(){
 const ready=editors.length===2&&editors.every(e=>e.state.ready),connected=attachments.length===2;
 for(const id of ['connect','save','disconnect','exchange','close'])$(id).disabled=busy||!ready||(id==='connect'?connected:['disconnect','exchange'].includes(id)?!connected:false);
 $('reopen').disabled=busy||ready;$('export').disabled=busy||(!ready&&!reports.length);
 for(const [i,name] of ['a','b'].entries())for(const action of ['readonly','undo','redo']){$(action+'-'+name).disabled=busy||!ready||(action!=='readonly'&&editors[i]?.state.readOnly);if(action==='readonly')$(action+'-'+name).setAttribute('aria-pressed',String(editors[i]?.state.readOnly||false));}
 const equal=ready&&JSON.stringify(semantic(editors[0]))===JSON.stringify(semantic(editors[1]));
 $('peer').textContent=connected?(equal?'Local views currently match. Remote durability: not configured.':'Local views differ; updates pending. Remote durability: not configured.'):'Local channel disconnected. Local edits remain in each view.';
 $('diagnostics').textContent=JSON.stringify({connected,equal,channel:channel?.state||lastChannel,attachments:attachments.map(a=>a.state),retainedRecoveryReports:reports.length},null,2);
}
function report(error){$('error').textContent=`Local operation failed: ${error.message}. Keep the page open and export both recovery copies. Existing stores are preserved.`;}
async function action(fn){if(busy)return;busy=true;update();try{$('error').textContent='';await fn();}catch(error){report(error);}finally{busy=false;update();}}
function disconnect(){clearTimeout(timer);timer=undefined;lastChannel=channel?.state;channel?.close();if(channel)lastChannel=channel.state;channel=undefined;for(const a of attachments)a.detach();attachments=[];update();}
async function identityFor(){return navigator.locks.request(key+'-creation',async()=>{
 const prior=localStorage.getItem(key);if(prior)return JSON.parse(prior);
 const runtime=await init(assetUrl),engine=createKickoff(runtime,{documentId:crypto.randomUUID(),epoch:crypto.randomUUID()});
 try{const next={identity:engine.read().identity,names:[key+'-a',key+'-b']};
  // Intent survives failed publication. Retry never silently reseeds a missing store.
  localStorage.setItem(key,JSON.stringify(next));
  for(const name of next.names){let store;try{store=await CheckpointStorage.open(indexedDB,name);await store.publish(engine.checkpoint(),[]);}finally{store?.close();}}
  return next;
 }finally{engine.dispose();}
});}
function schedule(){if(busy||!channel||timer)return;timer=setTimeout(()=>{timer=undefined;void action(exchange);},30);}
async function open(){
 if(editors.length)throw Error('Close existing editors before reopening');disposed=false;record=await identityFor();
 try{
  for(const [i,name] of ['a','b'].entries()){
   const e=createEditor($('editor-'+name),{identity:record.identity,databaseName:record.names[i],assetUrl,indexedDB,locks:navigator.locks,preset:'task',label:'Project kickoff view '+name.toUpperCase()});editors.push(e);await e.ready;
   unsubscribers.push(e.subscribe({type:'updates'},()=>{ $('save-state').textContent='Local edits or peer updates pending. Save both locally before reload.';schedule(); }));
  }
  $('status').textContent='Both isolated local views ready. Connect explicitly to exchange updates.';
 }catch(error){for(const [i,e] of editors.entries())if(e.state.ready)reports.push({view:i===0?'A':'B',recovery:e.recoveryExport()});await close();throw error;}
}
async function connect(){
 if(attachments.length)return;
 const candidate=createLocalChannel(),owned=[];
 try{
  for(const [i,e] of editors.entries())owned.push(await e.attachSync({transport:candidate.transport(i),peerIdentity:record.identity,authorized:true,maxQueuedFrames:32,maxWorkPerPump:32}));
  channel=candidate;attachments=owned;await exchange();$('status').textContent='Local channel connected. Frames stay within this page.';
 }catch(error){candidate.close();for(const a of owned)a.detach();channel=undefined;attachments=[];throw error;}
}
async function exchange(){
 if(!channel)throw Error('Connect the local views first');
 try{
  // Flush before pumping; production attachment subscribes to committed journal updates.
  await Promise.all(editors.map(e=>e.flush({target:'local'})));
  for(let round=0;round<32;round++){
   for(const a of attachments)await a.pump(Math.floor(performance.now()));
   const delivered=channel.deliver(attachments);
   await Promise.all(editors.map(e=>e.flush({target:'local'})));
   if(!delivered&&attachments.every(a=>!a.state.replayPending&&!a.state.incomingFrames&&!a.state.outgoingFrames))return;
  }
  throw Error('Bounded exchange incomplete; reconnect to resume from retained local stores');
 }catch(error){saveFailure=true;disconnect();throw error;}
}
async function save(){await Promise.all(editors.map(e=>e.flush({target:'local'})));saveFailure=false;$('save-state').textContent='Both saved in this browser. Remote durability: not configured.';}
function recovery(){return [...reports,...editors.filter(e=>e.state.ready).map((e,i)=>({view:i===0?'A':'B',recovery:e.recoveryExport()}))];}
function exportRecovery(){const data=recovery();if(!data.length)throw Error('No retained recovery copies');const blob=new Blob([JSON.stringify(data,(_k,v)=>v instanceof Uint8Array?{encoding:'bytes',data:Array.from(v)}:v,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='project-kickoff-local-views-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}
async function close(){
 disconnect();for(const off of unsubscribers)off();unsubscribers=[];
 const owned=editors;editors=[];
 for(const [i,e] of owned.entries()){
  if(e.state.ready)e.setReadOnly(true);
  try{await e.destroy({policy:'flush'});}catch(error){const result=await e.destroy({policy:'report'});reports.push({view:i===0?'A':'B',...result});saveFailure=true;report(error);}
 }
 disposed=true;$('status').textContent='Both editors closed. Local stores preserved; retained recovery reports remain exportable.';
}
async function history(i,command){const e=editors[i];e.root.focus();const target=e.captureHistory();if(!target)throw Error('History unavailable');try{const r=target.execute(command);if(r?.disposition==='rejected')throw Error(r.reason||'History target rejected');if(r?.caret)e.releaseAnchor(r.caret);if(r?.selection){e.releaseAnchor(r.selection.anchor);e.releaseAnchor(r.selection.focus);}}finally{target.dispose();}if(channel)await exchange();}
for(const [id,fn] of Object.entries({connect,disconnect,exchange,save,export:exportRecovery,close,reopen:open}))$(id).onclick=()=>void action(fn);
for(const [i,name] of ['a','b'].entries()){
 $('readonly-'+name).onclick=()=>void action(()=>editors[i].setReadOnly(!editors[i].state.readOnly));
 for(const command of ['undo','redo'])$(command+'-'+name).onclick=()=>void action(()=>history(i,command));
}
window.addEventListener('beforeunload',event=>{if(!disposed){event.preventDefault();event.returnValue='';}});
window.localCollaboration={get editors(){return editors;},get busy(){return busy;},get connected(){return attachments.length===2;},get disposed(){return disposed;},get channel(){return channel?.state||lastChannel;},get reports(){return reports;},get saveFailure(){return saveFailure;},semantic,recovery,close:()=>action(close)};
void action(open);
